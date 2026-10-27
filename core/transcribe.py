"""口播轉錄：影片 → 句級字幕（原片秒數）。輸出格式與 edit.py 的對齊檔相同：{"lines":[{n,s,e,text}]}。
用法：python -X utf8 transcribe.py <影片> <輸出json> [--model large-v3] [--glossary 詞1,詞2,...] [--lang zh]
注意：開頭很小聲時 VAD 會漏字，所以先把音量拉到統一再轉。"""
import argparse, json, os, subprocess, tempfile

ap = argparse.ArgumentParser()
ap.add_argument("video")
ap.add_argument("out")
ap.add_argument("--model", default="large-v3")
ap.add_argument("--glossary", default="")
ap.add_argument("--lang", default="zh")
ap.add_argument("--cpu", action="store_true")
a = ap.parse_args()

wav = os.path.join(tempfile.gettempdir(), "koubo_tr.wav")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", a.video, "-vn", "-ac", "1", "-ar", "16000",
                "-af", "highpass=f=80,dynaudnorm=f=150:g=15,volume=3dB", wav], check=True)
import cuda_paths; cuda_paths.add_cuda_dll_dirs()  # 找 pip 安裝的 CUDA 函式庫，不必改系統 PATH
from faster_whisper import WhisperModel

m = WhisperModel(a.model, device="cpu" if a.cpu else "cuda", compute_type="int8" if a.cpu else "float16")
prompt = "以下是繁體中文口播。" + (f"專有名詞：{a.glossary.replace(',', '、')}。" if a.glossary else "")
segs, _ = m.transcribe(wav, language=a.lang, vad_filter=True, vad_parameters=dict(threshold=0.3, min_silence_duration_ms=400),
                       word_timestamps=True, initial_prompt=prompt, condition_on_previous_text=False)
import opencc  # Whisper 有時輸出簡體，一律轉成台灣繁體用語
cc = opencc.OpenCC("s2twp")
FIX = {"熒幕": "螢幕", "荧幕": "螢幕", "臺": "台"}  # s2twp 會把「荧幕」轉成「熒幕」、「台」轉成「臺」；中時用「螢幕」「台」
def conv(x):
    x = cc.convert(x)
    for a, b in FIX.items():
        x = x.replace(a, b)
    return x
raw = [dict(s=s.start, e=s.end, text=conv(s.text.strip())) for s in segs]
merged = []  # 太碎的片段（如單獨一句「第一」）併到下一段：間隔 < 0.4 秒且合併後不超過 24 字
for r in raw:
    if merged and r["s"] - merged[-1]["e"] < 0.4 and len(merged[-1]["text"]) + len(r["text"]) <= 24:
        merged[-1]["e"] = r["e"]
        merged[-1]["text"] += "，" + r["text"]
    else:
        merged.append(dict(r))
lines = [dict(n=i + 1, s=round(m["s"], 3), e=round(m["e"], 3), text=m["text"]) for i, m in enumerate(merged)]
json.dump(dict(lines=lines), open(a.out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(lines), "lines", lines[0]["s"] if lines else None, lines[-1]["e"] if lines else None)
