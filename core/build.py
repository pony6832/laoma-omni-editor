"""讀 project.json 建置口播影片（HyperFrames 組版用 index.html、剪輯後口播素材、音訊、SRT）。
用法：python -X utf8 build.py <專案資料夾> [--target main|hook] [--nomedia] [--nomusic] [--nohookmedia] [--nosrt]
成片渲染另用 hyperframes render（建置只產生 index.html 與素材）。"""
import argparse, json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import music
import project as P
import edit

PACKS = os.path.join(os.path.dirname(HERE), "packs")

ap = argparse.ArgumentParser()
ap.add_argument("pdir")
ap.add_argument("--target", default="main", choices=["main", "hook"])
ap.add_argument("--nomedia", action="store_true")
ap.add_argument("--nomusic", action="store_true")
ap.add_argument("--nohookmedia", action="store_true")
ap.add_argument("--nosrt", action="store_true")
ap.add_argument("--reedit", action="store_true", help="先重跑 edit.py 對齊（預設直接用 project.json 內的 pieces/lines）")
args = ap.parse_args()

PROJ = os.path.abspath(args.pdir)
if args.reedit:
    edit.run(PROJ, report=False)
p = P.load(PROJ)
THEMES = os.path.join(os.path.dirname(HERE), "themes")
theme = p["meta"].get("theme")
if not theme:
    sys.exit("error: meta.theme 必填（weather／finance／society／general，或先跑 plan.py propose 自動判斷）")
TD = os.path.join(THEMES, theme)
TH = json.load(open(os.path.join(TD, "theme.json"), encoding="utf-8"))
issues = P.validate(p)
for i in issues:
    print(i)
if any(i.startswith("error") for i in issues):
    sys.exit(1)

HF = os.path.join(PROJ, "03_HyperFrames")
SRC = P.resolve(PROJ, p["source"]["video"])
OUTRO = p["meta"].get("outro", 3.0)
hook = args.target == "hook"
HK = p.get("hook", {})
H = HK.get("duration", 0.0) if hook else 0
lines, offs, dur = P.timeline(p)
pieces = [(x["src_start"], x["src_end"]) for x in p["pieces"]]
total_main = round(dur + OUTRO, 2)
total = round(total_main + H, 2)
d = os.path.join(HF, "main_hook" if hook else "main")
A = os.path.join(d, "assets")
os.makedirs(A, exist_ok=True)
VOICE = p["audio"]["voice_chain"]  # 人聲清晰化：高通、降噪、低頻去悶、提亮、動態壓縮、響度標準化
CHAINS = {"tts_v1": "loudnorm=I=-14:TP=-2:LRA=7,alimiter=limit=0.85:level=false",   # AI 旁白：合成語音只需響度標準化
          "standard_v2": ("highpass=f=90,afftdn=nr=14:nf=-32,dynaudnorm=f=200:g=21:p=0.92:m=22:s=7,"
                          "equalizer=f=250:t=q:w=1:g=-2,equalizer=f=3200:t=q:w=1:g=4,equalizer=f=6500:t=q:w=1:g=2,"
                          "acompressor=threshold=-22dB:ratio=3.5:attack=6:release=110:makeup=4,"
                          "loudnorm=I=-12:TP=-3:LRA=5,alimiter=limit=0.7:level=false:attack=3:release=40")}
CHAIN = CHAINS[VOICE]


def run(*a):
    subprocess.run(list(a), check=True)


def ts(x):
    h, m, s = int(x // 3600), int(x % 3600 // 60), x % 60
    return f"{h:02d}:{m:02d}:{int(s):02d},{int(round((s % 1) * 1000)):03d}"


# 通常 prepare_source.py 已先轉好；這裡是保險：直接用 HDR 原片建置時仍會轉色
SDR_CHAIN = P.SDR_CHAIN if P.is_hdr(SRC) else "null"
if SDR_CHAIN != "null":
    print("偵測到 HDR 素材，已轉成一般色彩（SDR）")


def concat_voice(ranges, out_mp4, fade_out=None):
    """依原片秒數區間剪接並做人聲處理。"""
    n = len(ranges)
    fc = ""
    for i, (a, b) in enumerate(ranges):
        fc += f"[0:v]trim={a:.3f}:{b:.3f},setpts=PTS-STARTPTS,fps=30[v{i}];"
        fc += f"[0:a]atrim={a:.3f}:{b:.3f},asetpts=PTS-STARTPTS,afade=t=in:d=0.03,afade=t=out:st={b-a-0.04:.3f}:d=0.04[a{i}];"
    fc += "".join(f"[v{i}][a{i}]" for i in range(n)) + f"concat=n={n}:v=1:a=1[vo0][ao];"
    fc += f"[vo0]{SDR_CHAIN}[vo];"  # iPhone 等 HDR（HLG／PQ）素材轉成一般色彩，否則渲染器走 HDR 慢速模式、成片也變 HDR
    fc += f"[ao]{CHAIN}" + (f",afade=t=out:st={fade_out[0]:.3f}:d={fade_out[1]}[aout]" if fade_out else "[aout]")
    run("ffmpeg", "-v", "error", "-y", "-i", SRC, "-filter_complex", fc, "-map", "[vo]", "-map", "[aout]",
        "-c:v", "libx264", "-crf", "18", "-preset", "medium", "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30",  # 每秒一個關鍵幀，避免渲染跳幀
        "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-c:a", "aac", "-b:a", "192k",
        "-ar", "48000", "-movflags", "+faststart", out_mp4)


mp4 = P.resolve(PROJ, p["source"]["edited"])
os.makedirs(os.path.dirname(mp4), exist_ok=True)  # 專案缺資料夾時自己補（例如從別處複製過來的專案）
if not args.nomedia:
    concat_voice(pieces, mp4, fade_out=(dur - 0.35, 0.35))
shutil.copy(mp4, os.path.join(A, "long.mp4"))

# ---- 素材：依 assets 清單處理（image 套 vf 濾鏡、sprite 裁透明邊縮寬、copy 直接複製、video_mute 去音軌）
from PIL import Image
ASSETS = list(p["assets"])
if TH.get("assets_file"):  # 主題素材組（夜空底圖、面板底圖、系列緞帶、人名標底板、徽章、LOGO、字型）
    own = {a["out"] for a in ASSETS}
    ASSETS += [dict(a, src=P.resolve(os.path.join(TD, "assets"), a["src"])) for a in json.load(open(os.path.join(TD, TH["assets_file"]), encoding="utf-8")) if a["out"] not in own]
for a in ASSETS:
    src, out = P.resolve(PROJ, a["src"]), os.path.join(A, a["out"])
    k = a["kind"]
    if k == "image":
        run("ffmpeg", "-v", "error", "-y", "-i", src, "-vf", a["vf"], out)
    elif k == "sprite":
        im = Image.open(src).convert("RGBA")
        im = im.crop(im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox())
        im = im.resize((a["width"], int(im.height * a["width"] / im.width)))
        im.save(out)
    elif k == "copy":
        shutil.copy(src, out)
    elif k == "video_mute":
        run("ffmpeg", "-v", "error", "-y", "-i", src, "-an", "-c:v", "copy", out)
    else:
        raise ValueError(f"未知素材類型 {k}")

L = {l["n"]: l for l in lines}


def cue_list(cues, end):
    """cues 的位置寫法：t（絕對秒）、line＋off（跟著該行字幕）、end＋off（相對結尾）。"""
    out = []
    for c in cues:
        if "line" in c:
            t = L[c["line"]]["t0"] + c.get("off", 0)
        elif "end" in c:
            t = end + c["end"]
        else:
            t = c["t"]
        out.append((c["k"], t))
    return out


bgm = p["audio"]["bgm"]
if not args.nomusic:
    music.make(mp4, total_main, dur, cue_list(bgm["cues"], dur), os.path.join(A, "bgm.m4a"), bpm=bgm.get("bpm", TH.get("bgm", {}).get("bpm", 92)))
elif hook and os.path.exists(os.path.join(HF, "main", "assets", "bgm.m4a")):
    shutil.copy(os.path.join(HF, "main", "assets", "bgm.m4a"), os.path.join(A, "bgm.m4a"))

# ---- HOOK：精華預告素材
HOOKP = [(c["src_start"], c["src_end"]) for c in HK.get("clips", [])]
hdur = round(sum(b - a for a, b in HOOKP), 2)
hmp4 = P.resolve(PROJ, HK["edited"]) if HK else None
if hook:
    if not args.nohookmedia:
        concat_voice(HOOKP, hmp4)
        hb = HK["bgm"]
        music.make(hmp4, H, hdur, cue_list(hb["cues"], H), os.path.join(HF, "_hook_bgm.m4a"), bpm=hb["bpm"], voff=hb["voff"], vdur=hdur)
    shutil.copy(hmp4, os.path.join(A, "hook.mp4"))
    shutil.copy(os.path.join(HF, "_hook_bgm.m4a"), os.path.join(A, "hook_bgm.m4a"))

starts = [0.0]
acc = 0.0
for a, b in pieces[:-1]:
    acc += b - a
    starts.append(round(acc, 3))
cfg = dict(lines=[dict(n=l["n"], text=l["text"], t0=l["t0"], t1=l["t1"]) for l in lines], dur=dur, total=total_main, cuts=starts)

# ---- 組版：核心範本 ＋ 領域包（無領域包時只用核心）
pack = p["meta"].get("domain_pack")
pk = json.load(open(os.path.join(PACKS, pack, "pack.json"), encoding="utf-8")) if pack else {}
rd = lambda base, f: open(os.path.join(base, f), encoding="utf-8").read()
PD = os.path.join(PACKS, pack) if pack else None
VERT = str(p["meta"].get("aspect", "16:9")).replace("x", ":") == "9:16"  # 9:16 直式短影音：另一套版面（template_v.html／core_head_v.js），其餘場景範本共用
if VERT and (hook or p.get("insert")):
    sys.exit("error: 9:16 直式版面不支援「開頭鉤子」與「插入畫面」，請拿掉 hook／insert 設定")
tpl = rd(HERE, "template_v.html" if VERT else "template.html")
core = "".join(rd(PD, f) for f in pk.get("core_js", [])) + rd(HERE, "core_head_v.js" if VERT else "core_head.js") + rd(HERE, "core_tools.js")
files = {s["id"]: os.path.join(HERE, "scenes", s["file"]) for s in json.load(open(os.path.join(HERE, "scenes.json"), encoding="utf-8"))}  # 核心通用範本
files.update({s["id"]: os.path.join(TD, "scenes", s["file"]) for s in TH.get("scenes", [])})  # 主題專屬範本
files.update({s["id"]: os.path.join(PD, s["file"]) for s in pk.get("scenes", [])})  # 領域包範本（同名時領域包優先）
missing = [s["template"] for s in p.get("scenes", []) if s.get("template") and s["template"] not in files]
if missing:
    sys.exit(f"error: 找不到場景範本 {missing}（領域包：{pack}）")
# 場景範本只定義一次；實際跑哪些、各自從第幾行字幕開始，全看 project.json 的 scenes（行號在範本內是相對場景起點）
RUN = ("const __SCN = {}; function defScene(id, fn) { __SCN[id] = fn; }\n" + "const __PAL = " + json.dumps(TH["palette"], ensure_ascii=False) + ";\n")
# 圖鑑效果移植層（catalog/fx_runtime.js ＋ catalog/fx/ 下已移植的效果；底線開頭的檔案是比對用，不進建置）
CAT = os.path.join(os.path.dirname(HERE), "catalog")
FXJS = rd(CAT, "fx_runtime.js") + "\n" + "".join(rd(os.path.join(CAT, "fx"), f) + "\n" for f in sorted(os.listdir(os.path.join(CAT, "fx"))) if f.endswith(".js") and not f.startswith("_"))
# params：t 顯示文字、g 地圖座標、r 縣市清單、n 數字（缺鍵直接報錯）；anchors 把範本內的關鍵字換成這支口播實際用語
runner = ("\nconst __strict = (o, n) => new Proxy(o || {}, { get: (a, k) => (k in a ? a[k] : (() => { throw new Error('場景參數缺少 ' + n + '.' + String(k)); })()) });\n"
          "for (const s of " + json.dumps([dict(template=s["template"], **{"from": s.get("from", 1)}, mode=s.get("mode"), mode_off=s.get("mode_off", -0.2), params=s.get("params", {})) for s in p.get("scenes", [])], ensure_ascii=False) + ") {\n"
          "  const b = s.from - 1, a = s.params.anchors || {}, K = (k) => (k in a ? a[k] : k);\n"
          "  const P = Object.fromEntries([\"t\", \"g\", \"r\", \"n\"].map((n) => [n, __strict(s.params[n], n)]));\n"
          "  P.v = s.params.v || {};  // 通用範本自己決定哪些欄位必填、哪些可省略\n"
          "  // 通用範本（g_ 開頭）的時間點不早於 2.6 秒：開場標題 0～2.5 秒蓋在畫面上，避免兩者疊字。領域包的專屬場景維持原樣\n"
          "  const OE = (s.template || '').indexOf('g_') === 0 ? 2.6 : 0, C = (v, lo) => (OE ? Math.max(v, lo) : v);\n"
          "  if (s.mode) setMode(C(T0(1 + b), OE) + s.mode_off, s.mode);\n"
          "  if (s.template) __SCN[s.template]((i) => C(T0(i + b), OE), (i) => C(T1(i + b), OE + 0.5), (i, k) => C(tw(i + b, K(k)), OE), (i, k) => C(te(i + b, K(k)), OE), P);\n}\n")
used = {s["template"] for s in p.get("scenes", [])}
# 只帶進這支片用得到的圖鑑效果（場景參數裡的 fx，加上被使用的範本內寫死呼叫的效果），避免每支片都背 80 多個效果
_src = json.dumps(p.get("scenes", []), ensure_ascii=False) + "".join(open(files[i], encoding="utf-8").read() for i in files if i in used)
_need = set(re.findall(r'"fx":\s*"(\w+)"', _src)) | set(re.findall(r'fxMount\([^,]+,\s*"(\w+)"', _src)) | set(re.findall(r"FX\.(\w+)", _src))
_fxdir = os.path.join(CAT, "fx")
FXJS = rd(CAT, "fx_runtime.js") + "\n" + "".join(rd(_fxdir, i + ".js") + "\n" for i in sorted(_need) if os.path.exists(os.path.join(_fxdir, i + ".js")))
scenes = RUN + FXJS +"".join(rd(PD, f) + "\n" for f in pk.get("lib_js", [])) + "".join(open(files[i], encoding="utf-8").read() + "\n" for i in files if i in used) + runner
core = core.replace("/*__SCENES__*/", scenes)
HOOKHTML = ""
FINAL = 'window.__timelines["main"] = tl; tl.seek(0);'
if hook:
    HOOKHTML = rd(PD, pk["hook_html"])
    FINAL = rd(PD, pk["hook_js"])
ins_t = L[p["insert"]["at_line"]]["t0"] + H if p.get("insert") else 0
if VERT:
    pass  # 直式樣板本來就沒有插入畫面區塊
elif p.get("insert"):  # 有插入畫面：保留區塊；沒有：整塊拿掉
    tpl = tpl.replace("<!--__INS_START__-->", "").replace("<!--__INS_END__-->", "")
else:
    i0, i1 = tpl.index("<!--__INS_START__-->"), tpl.index("<!--__INS_END__-->") + len("<!--__INS_END__-->")
    tpl = tpl[:i0] + tpl[i1:]
br = p["branding"]
core = core.replace("__OPENER__", json.dumps(br["opener"], ensure_ascii=False))
tpl = (tpl.replace("__SERIES__", br["series"]).replace("__ROLE__", p["speaker"]["title"]).replace("__SPEAKER__", p["speaker"]["name"])
       .replace("__OPENER_SUB__", br["opener_sub"]).replace("__END2__", br["end2"]).replace("__END3__", br["end3"]))
html = (tpl.replace("/*__CORE__*/", core).replace("/*__FINAL__*/", FINAL).replace("<!--__HOOKHTML__-->", HOOKHTML)
        .replace("__CFG__", json.dumps(cfg, ensure_ascii=False)).replace("__TOTAL__", str(total)).replace("__MT__", str(total_main))
        .replace("__H__", str(H)).replace("__HDUR__", str(hdur)).replace("__DUR__", str(dur)).replace("__INS_T__", str(round(ins_t, 3))))
html = html.replace("__CROPX__", str(p["meta"].get("crop_x", 50))).replace("__CROPY__", str(p["meta"].get("crop_y", 35)))  # 直式：原片取景中心（百分比）
for k, v in TH["palette"].items():
    html = html.replace(f"__PAL_{k}__", v)
open(os.path.join(d, "index.html"), "w", encoding="utf-8").write(html)
if not hook and not args.nosrt:
    NL = chr(10)
    srt = [f"{i+1}{NL}{ts(l['t0'])} --> {ts(l['t1'])}{NL}{l['text']}{NL}" for i, l in enumerate(lines)]
    open(P.resolve(PROJ, p["outputs_dir"]["srt"]), "w", encoding="utf-8").write(NL.join(srt))
print("built dur", dur, "total", total, "pieces", len(pieces), "target", args.target)
