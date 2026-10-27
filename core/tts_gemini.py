"""AI 語音旁白：旁白稿 → 逐句 Gemini TTS（雲端）→ 本機 Whisper 回聽核對、念錯就重生 → 合成完整音軌與逐句時間 → 接進專案。
做法沿用「時報資訊企業簡介」專案驗證過的流程：逐句生成（不整篇一次丟）、台灣華語語氣指令、回聽核對、念錯重生。

用法：
  python -X utf8 tts_gemini.py <專案資料夾> --script 旁白稿.txt --yes-send-to-google [--voice Aoede] [--tone 新聞|企業|活潑（選用）] [--pronounce 讀音對照.json]
重要：
  * 旁白稿會送到 Google（雲端）產生語音。必須先取得使用者同意，才可加 --yes-send-to-google；未公開稿件要特別提醒。
  * 需要 GEMINI_API_KEY（向管理者索取，用 gemini_key.py save 存進這台電腦）；沒有就印出設定方法並結束（結束碼 3）。
  * 結果：01_素材/旁白素材.mp4（聲波畫面＋旁白）、02_字幕/逐字稿_初版.json（逐句時間，免轉錄）、project.json 已改成旁白模式。
讀音對照.json：{"原文": "實際要念的字"}，例如 {"上億次": "數以億計", "1,800 萬": "一千八百萬"}；只換念法，不換字幕。"""
import argparse, base64, difflib, json, os, re, struct, subprocess, sys, time, urllib.error, urllib.request, wave

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gemini_key
import project as P

MODELS = ["gemini-3.8-flash-tts", "gemini-2.5-flash-preview-tts"]   # 前者是公司簡介專案用的；不可用時退到後者
TONES = {"新聞": "沉穩、清晰、可信的新聞主播", "企業": "沉穩、自信、溫暖的企業形象片旁白", "活潑": "明亮、有活力的短影音旁白"}
# 2026-10-27 實測：把「請用台灣華語…朗讀下面這段話」放進文字，模型會整段念出來；系統指令此模型不支援（HTTP 400）。
# 所以預設只送旁白稿本身（公司簡介專案的做法）；--tone 只加一句括號口吻描述（實測不會被念出來，但對語氣的影響沒人耳驗證）。
STYLE = "（以{tone}口吻）"
GAP = 0.28   # 句與句之間的停頓（秒）
SR = 24000


def split_sentences(text):
    """依句號、驚嘆、問號、分號、換行切句；太短的併回前一句，太長的在逗號處再切。"""
    raw = [s.strip() for s in re.split(r"(?<=[。！？!?；;])|\n+", text) if s and s.strip()]
    out = []
    for s in raw:
        if out and len(re.sub(r"[^一-鿿A-Za-z0-9]", "", s)) < 5:
            out[-1] += s
        else:
            out.append(s)
    res = []
    for s in out:
        while len(s) > 70:
            k = max(s.rfind("，", 0, 70), s.rfind(",", 0, 70))
            if k < 20:
                k = 69
            res.append(s[:k + 1]); s = s[k + 1:]
        if s:
            res.append(s)
    return res


def call_tts(text, voice, tone, key):
    """回傳 24 kHz 單聲道 16-bit PCM。429／5xx 重試；模型不可用時換備援模型。"""
    prompt = (STYLE.format(tone=TONES.get(tone, tone)) + text) if tone else text
    body = json.dumps({"contents": [{"parts": [{"text": prompt}]}],
                       "generationConfig": {"responseModalities": ["AUDIO"],
                                            "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}).encode()
    last = None
    for model in MODELS:
        for attempt in range(3):
            req = urllib.request.Request(f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                                         data=body, headers={"Content-Type": "application/json", "x-goog-api-key": key})
            try:
                r = json.load(urllib.request.urlopen(req, timeout=180))
                part = r["candidates"][0]["content"]["parts"][0]["inlineData"]
                pcm = base64.b64decode(part["data"])
                if pcm[:4] == b"RIFF":   # 有些回覆是完整 WAV（含檔頭與中繼資料），只取 data 段
                    i = 12
                    while i + 8 <= len(pcm):
                        cid, sz = pcm[i:i + 4], struct.unpack("<I", pcm[i + 4:i + 8])[0]
                        if cid == b"data":
                            pcm = pcm[i + 8:i + 8 + sz]; break
                        i += 8 + sz + (sz & 1)
                return pcm, model
            except urllib.error.HTTPError as e:
                last = f"HTTP {e.code}"
                if e.code in (429, 500, 502, 503, 504):
                    time.sleep(2 ** attempt * 2); continue
                break   # 404／400 等：換下一個模型
            except (KeyError, IndexError, urllib.error.URLError) as e:
                last = type(e).__name__
                time.sleep(2)
    raise RuntimeError(f"Gemini TTS 失敗（{last}）。請確認金鑰有效、網路可連到 Google；仍失敗請回報管理者。")


def write_wav(path, pcm):
    with wave.open(path, "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm)


DIG = str.maketrans("零〇一二三四五六七八九", "00123456789")


def norm(s):
    s = re.sub(r"[^一-鿿A-Za-z0-9]", "", s.translate(DIG)).lower()
    return s.replace("臺", "台")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("pdir"); ap.add_argument("--script", required=True)
    ap.add_argument("--voice", default="Aoede", help="Aoede（女聲）、Charon（男聲）等 Gemini 內建聲線")
    ap.add_argument("--tone", default=None, help="選用：新聞／企業／活潑，或自己寫一句語氣描述；預設不加（只送旁白稿本身，最乾淨）")
    ap.add_argument("--pronounce", default=None); ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--yes-send-to-google", action="store_true", help="已取得使用者同意把旁白稿送到 Google 產生語音")
    ap.add_argument("--no-asr", action="store_true", help="略過本機 Whisper 回聽核對（不建議）")
    a = ap.parse_args()

    st = gemini_key.status()
    if st != "ok":
        print("【需要 Gemini API 金鑰】" + ("這台電腦已設定金鑰，但要把 Claude 完全關掉重開才會生效。" if st == "restart" else gemini_key.HOWTO))
        sys.exit(3)
    if not a.yes_send_to_google:
        sys.exit("AI 配音會把旁白稿送到 Google（雲端）產生語音。請先告訴使用者並取得同意，再加 --yes-send-to-google 重跑。")
    key = os.environ["GEMINI_API_KEY"]

    pdir = os.path.abspath(a.pdir)
    p = P.load(pdir)
    text = open(a.script, encoding="utf-8").read()
    sents = split_sentences(text)
    if not sents:
        sys.exit("旁白稿是空的。")
    lex = json.load(open(a.pronounce, encoding="utf-8")) if a.pronounce else {}
    spoken = []
    for s in sents:
        for k, v in lex.items():
            s = s.replace(k, v)
        spoken.append(s)
    out = os.path.join(pdir, "01_素材"); sd = os.path.join(out, "旁白分句"); os.makedirs(sd, exist_ok=True)
    print(f"旁白稿 {len(sents)} 句，語氣「{a.tone or '不指定'}」、聲線 {a.voice}；逐句生成中…（每句約 2～6 秒）", flush=True)

    model_used = None
    for i, s in enumerate(spoken):
        pcm, model_used = call_tts(s, a.voice, a.tone, key)
        write_wav(os.path.join(sd, f"S{i + 1:03d}.wav"), pcm)
        print(f"  生成 {i + 1}/{len(spoken)}", flush=True)

    bad = []
    if not a.no_asr:
        import cuda_paths; cuda_paths.add_cuda_dll_dirs()
        from faster_whisper import WhisperModel
        import opencc
        m = WhisperModel("large-v3", device="cuda", compute_type="float16"); cc = opencc.OpenCC("s2twp")
        for i, s in enumerate(spoken):
            for attempt in range(a.retries + 1):
                f = os.path.join(sd, f"S{i + 1:03d}.wav")
                segs, _ = m.transcribe(f, language="zh", initial_prompt="以下是繁體中文的句子。")
                heard = cc.convert("".join(x.text for x in segs))
                ratio = difflib.SequenceMatcher(None, norm(s), norm(heard)).ratio()
                if ratio >= 0.8 or attempt == a.retries:
                    if ratio < 0.8:
                        bad.append((i + 1, round(ratio, 2), s, heard))
                    break
                pcm, model_used = call_tts(s, a.voice, a.tone, key)   # 念得不像就重生
                write_wav(f, pcm)
                print(f"  第 {i + 1} 句回聽相似度 {ratio:.2f}，已重生", flush=True)

    # 合成完整音軌（24k 單聲道 → 48k 立體聲），句間停頓 GAP 秒；逐句時間寫成轉錄檔格式
    import numpy as np
    parts, lines, t = [], [], 0.4
    parts.append(np.zeros(int(0.4 * SR), dtype=np.int16))
    for i, s in enumerate(sents):
        with wave.open(os.path.join(sd, f"S{i + 1:03d}.wav")) as w:
            pcm = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16)
        d = len(pcm) / SR
        lines.append({"n": i + 1, "s": round(t, 3), "e": round(t + d, 3), "text": s})
        parts.append(pcm); parts.append(np.zeros(int(GAP * SR), dtype=np.int16)); t += d + GAP
    raw = os.path.join(out, "旁白_原始.wav")
    write_wav(raw, np.concatenate(parts).tobytes())
    final = os.path.join(out, "旁白_完整.wav")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=9", "-ar", "48000", "-ac", "2", final], check=True)
    total = t + 0.3

    # 聲波畫面＋旁白 → 當作這個專案的「原片」（口播視窗位置顯示聲波，人名標寫 AI 旁白）
    vert = str(p["meta"].get("aspect", "16:9")).replace("x", ":") == "9:16"
    W, H = (1080, 1920) if vert else (1920, 1080)
    vid = os.path.join(out, "旁白素材.mp4")
    fc = (f"color=c=0x0b1020:s={W}x{H}:r=30:d={total:.2f}[bg];[0:a]showwaves=s={W}x{int(H * 0.3)}:mode=cline:rate=30:scale=sqrt:colors=0xb6a8ff|0x7fe0ff,format=rgba[w];"
          f"[bg][w]overlay=(W-w)/2:(H-h)/2:format=auto,format=yuv420p[v]")
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", final, "-filter_complex", fc, "-map", "[v]", "-map", "0:a", "-t", f"{total:.2f}",
                    "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", vid], check=True)
    json.dump({"lines": lines}, open(os.path.join(pdir, "02_字幕", "逐字稿_初版.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    p["source"]["video"] = os.path.relpath(vid, pdir).replace("\\", "/")
    p["source"]["script"] = os.path.abspath(a.script)
    p["meta"]["narration"] = {"engine": "gemini-tts", "model": model_used, "voice": a.voice, "tone": a.tone or ""}
    p["audio"]["voice_chain"] = "tts_v1"   # 合成語音不需要降噪與提亮，只做響度標準化
    p["edit"]["verified"] = list(range(1, len(lines) + 1))   # 字幕文字就是旁白稿本身
    P.save(pdir, p)
    print(f"完成：{len(lines)} 句、約 {total:.1f} 秒；模型 {model_used}。下一步：python -X utf8 edit.py 專案 → 圖解選用 → 建置。")
    if bad:
        print("\n以下句子重生後回聽仍不像，請使用者用耳朵確認，必要時改稿或加讀音對照（--pronounce）：")
        for n, r, s, h in bad:
            print(f"  第 {n} 句（相似度 {r}）原稿：{s}\n          回聽：{h}")


if __name__ == "__main__":
    main()
