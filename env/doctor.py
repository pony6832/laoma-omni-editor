"""環境檢查：這台電腦能不能跑口播影片技能？缺什麼、怎麼補，用白話列出來。
目標環境：Windows 10/11＋NVIDIA RTX 4070 或 5070（12 GB）。其他顯卡會標「未驗證」。
用法：python -X utf8 doctor.py [--quick] [--json]
  --quick  略過實際載入轉錄模型的 GPU 測試（約省 20 秒）
結束碼：0＝可以開工（可能有提醒）；1＝有必須先解決的項目。"""
import argparse, glob, importlib.metadata as md, json, os, platform, re, shutil, subprocess, sys

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
sys.path.insert(0, os.path.join(KOUBO, "core"))
import cuda_paths

ap = argparse.ArgumentParser()
ap.add_argument("--quick", action="store_true")
ap.add_argument("--json", action="store_true")
a = ap.parse_args()
R = []  # (等級 ok/warn/fail, 項目, 說明, 怎麼補)


def add(level, name, detail, fix=""):
    R.append((level, name, detail, fix))


def run(cmd, timeout=20):
    try:
        r = subprocess.run(cmd, capture_output=True, timeout=timeout, text=True, encoding="utf-8", errors="ignore")
        return (r.stdout + r.stderr).strip()
    except Exception:
        return None


def ver(pkg):
    try:
        return md.version(pkg)
    except md.PackageNotFoundError:
        return None


# --- 系統 ---
add("ok" if platform.system() == "Windows" else "warn", "作業系統", f"{platform.system()} {platform.release()}", "" if platform.system() == "Windows" else "技能只在 Windows 驗證過")
pv = sys.version_info
add("ok" if (3, 10) <= pv[:2] <= (3, 12) else "warn", "Python", f"{pv[0]}.{pv[1]}.{pv[2]}（{sys.executable}）", "" if (3, 10) <= pv[:2] <= (3, 12) else "建議用 Python 3.11")
try:
    import ctypes
    class MS(ctypes.Structure):
        _fields_ = [("l", ctypes.c_ulong), ("m", ctypes.c_ulong), ("tp", ctypes.c_ulonglong), ("ap", ctypes.c_ulonglong), ("tv", ctypes.c_ulonglong), ("av", ctypes.c_ulonglong), ("tx", ctypes.c_ulonglong), ("ax", ctypes.c_ulonglong), ("e", ctypes.c_ulonglong)]
    ms = MS(); ms.l = ctypes.sizeof(MS); ctypes.windll.kernel32.GlobalMemoryStatusEx(ctypes.byref(ms))
    gb = ms.tp / 2**30
    add("ok" if gb >= 31 else "warn", "記憶體", f"{gb:.0f} GB", "" if gb >= 31 else "建議 32 GB 以上（長影片渲染較吃記憶體）")
except Exception:
    pass
free = shutil.disk_usage(KOUBO).free / 2**30
add("ok" if free >= 30 else "warn" if free >= 10 else "fail", "硬碟剩餘空間", f"{free:.0f} GB（技能所在磁碟）", "" if free >= 30 else "每支長影片需要約 5～20 GB，請清出空間")

# --- 顯卡 ---
smi = run(["nvidia-smi", "--query-gpu=name,driver_version,memory.total", "--format=csv,noheader"])
gpu_ok = False
if not smi or "NVIDIA" not in smi.upper():
    add("fail", "NVIDIA 顯卡", "找不到 nvidia-smi 或沒有 NVIDIA 顯卡", "安裝 NVIDIA 驅動；沒有 NVIDIA 顯卡的電腦轉錄會非常慢，不建議使用")
else:
    name, drv, mem = [x.strip() for x in smi.splitlines()[0].split(",")]
    mib = int(re.sub(r"\D", "", mem) or 0)
    tested = re.search(r"\b(4070|5070)\b", name) is not None
    add("ok" if tested else "warn", "顯卡型號", name, "" if tested else "只在 RTX 4070／5070 驗證過，其他型號未驗證")
    add("ok" if mib >= 11500 else "fail", "顯示記憶體", f"{mib} MiB", "" if mib >= 11500 else "轉錄模型需要約 6 GB，建議 12 GB")
    try:
        dm = float(drv.split(".")[0])
        add("ok" if dm >= 570 else "fail", "NVIDIA 驅動", drv, "" if dm >= 570 else "5070 需要驅動 570 以上，請到 NVIDIA App 更新")
    except Exception:
        add("warn", "NVIDIA 驅動", drv)
    gpu_ok = True

# --- Python 套件 ---
need = {"faster-whisper": "1.2.1", "ctranslate2": "4.8.1", "numpy": None, "Pillow": None, "opencc-python-reimplemented": "0.1.7"}
for p, v in need.items():
    cur = ver(p)
    if cur is None:
        add("fail", f"套件 {p}", "未安裝", f"python -m pip install -r \"{os.path.join(KOUBO, 'env', 'requirements.txt')}\"")
    elif v and cur != v:
        add("warn", f"套件 {p}", f"{cur}（驗證過的是 {v}）", "版本不同不一定有問題，但出錯時請先改回驗證過的版本")
    else:
        add("ok", f"套件 {p}", cur)
dirs = cuda_paths.add_cuda_dll_dirs()
cu = [ver("nvidia-cublas-cu12"), ver("nvidia-cudnn-cu12")]
if all(cu):
    add("ok", "CUDA 函式庫（pip）", f"cublas {cu[0]}、cudnn {cu[1]}")
else:
    add("warn", "CUDA 函式庫（pip）", "沒有裝在這個 Python 環境", "建議 pip install nvidia-cublas-cu12==12.8.4.1 nvidia-cudnn-cu12==9.10.2.21；若轉錄能跑代表系統 PATH 另有來源，但換電腦或重裝容易壞")

# --- GPU 實測（載入轉錄模型） ---
if gpu_ok and ver("ctranslate2"):
    try:
        import ctranslate2
        n = ctranslate2.get_cuda_device_count()
        add("ok" if n > 0 else "fail", "ctranslate2 認得 GPU", f"{n} 張", "" if n > 0 else "驅動或 CUDA 函式庫有問題")
        if n > 0 and "float16" not in ctranslate2.get_supported_compute_types("cuda"):
            add("fail", "GPU 運算精度", "不支援 float16")
        if n > 0 and not a.quick:
            cache = glob.glob(os.path.join(os.path.expanduser("~"), ".cache", "huggingface", "hub", "models--Systran--faster-whisper-large-v3*"))
            if not cache:
                add("warn", "轉錄模型", "本機還沒有 large-v3 模型", "第一次轉錄會下載約 3 GB（會先問你是否同意）；下載完請再跑一次檢查")
            else:
                import numpy as np
                from faster_whisper import WhisperModel
                m = WhisperModel(os.path.basename(cache[0]).replace("models--Systran--faster-whisper-", ""), device="cuda", compute_type="float16")
                list(m.transcribe(np.zeros(16000, dtype=np.float32), language="zh")[0])
                add("ok", "GPU 轉錄實測", "已用 GPU 載入模型並跑完 1 秒測試音")
    except Exception as e:
        add("fail", "GPU 轉錄實測", f"{type(e).__name__}: {str(e)[:120]}", "常見原因：缺 cublas／cudnn（見上一項）、驅動太舊")

# --- 外部工具 ---
for tool, minv in (("ffmpeg", None), ("ffprobe", None)):
    p = shutil.which(tool)
    add("ok" if p else "fail", tool, run([tool, "-version"]).splitlines()[0][:60] if p else "找不到", "" if p else "安裝 FFmpeg（完整版）並把 bin 加進 PATH")
node = run(["node", "--version"])
add("ok" if node and int(node.lstrip("v").split(".")[0]) >= 18 else "fail", "Node.js", node or "找不到", "" if node else "安裝 Node.js 18 以上")
hf_path = shutil.which("hyperframes") or shutil.which("hyperframes.cmd")  # Windows 上是 .cmd 捷徑，要用完整路徑才叫得動
hf = run([hf_path, "--version"], 30) if hf_path else None
add("ok" if hf and re.search(r"\d+\.\d+", hf) else "fail", "HyperFrames", (hf or "找不到").splitlines()[0][:40], "" if hf else "npm install -g hyperframes")
chrome = [p for p in (r"C:\Program Files\Google\Chrome\Application\chrome.exe", r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", os.path.expanduser(r"~\AppData\Local\Google\Chrome\Application\chrome.exe")) if os.path.exists(p)]
add("ok" if chrome else "fail", "Chrome（渲染與開啟 HyperFrames 預覽用）", chrome[0] if chrome else "找不到", "" if chrome else "安裝 Google Chrome")
# Codex：只有「管理者新增主題素材」才需要。所有主題（12 個）的設計素材已預先生成並內建在技能裡，同事電腦不需要 Codex。
codex = glob.glob(os.path.join(os.path.expanduser("~"), "AppData", "Local", "OpenAI", "Codex", "bin", "*", "codex.exe"))
if codex:
    logged = os.path.exists(os.path.join(os.path.expanduser("~"), ".codex", "auth.json"))
    add("ok" if logged else "warn", "Codex（只有管理者新增主題素材才用）", "已安裝" + ("且已登入" if logged else "，但尚未登入"), "" if logged else "只有要新增主題素材時才需要登入；一般剪片不需要")
else:
    add("ok", "Codex（只有管理者新增主題素材才用）", "未安裝（一般同事電腦不需要，內建的 12 個主題直接可用）")
import gemini_key
gk = gemini_key.status()  # AI 配音才需要；缺了只是提醒，不擋住真人口播的流程
add("ok" if gk == "ok" else "warn", "Gemini API 金鑰（AI 配音用）",
    {"ok": "已設定", "restart": "已設定，但要把 Claude 完全關掉重開才會生效", "missing": "尚未設定"}[gk],
    "" if gk == "ok" else (gemini_key.HOWTO if gk == "missing" else "把 Claude 完全關掉再重開"))
fonts = glob.glob(r"C:\Windows\Fonts\NotoSansTC*") + glob.glob(os.path.expanduser(r"~\AppData\Local\Microsoft\Windows\Fonts\NotoSansTC*"))
add("ok" if fonts else "fail", "字型 Noto Sans TC", os.path.basename(fonts[0]) if fonts else "找不到", "" if fonts else "安裝 Noto Sans TC（成片字型）")

# --- 技能本身 ---
NEED = ("SKILL.md", "使用手冊.md", "core/build.py", "core/core_head.js", "core/core_head_v.js", "core/core_tools.js", "core/template.html", "core/template_v.html",
        "core/pick_effects.py", "core/tts_gemini.py", "core/prepare_source.py", "core/gemini_key.py", "env/setup_env.py", "catalog/catalog.json", "catalog/fx_runtime.js",
        "themes/general/theme.json", "themes/weather/assets/panel.png")
miss = [f for f in NEED if not os.path.exists(os.path.join(KOUBO, f))]
add("ok" if not miss else "fail", "技能檔案", "完整" if not miss else "缺少：" + "、".join(miss), "" if not miss else "重新下載或複製整個技能資料夾，再跑一次 install.py")
# 每個主題都要有完整的設計素材（內建預先生成，不靠同事電腦生圖）
TH_DIR = os.path.join(KOUBO, "themes")
th_ids = [d for d in sorted(os.listdir(TH_DIR)) if not d.startswith("_") and os.path.exists(os.path.join(TH_DIR, d, "theme.json"))]
REQ_AS = ("assets.json", "badge.png", "logo.png", "nameplate.png", "night.png", "panel.png", "plate.png")
th_bad = ["%s（缺 %s）" % (t, "、".join(f for f in REQ_AS if not os.path.exists(os.path.join(TH_DIR, t, "assets", f)))) for t in th_ids
          if any(not os.path.exists(os.path.join(TH_DIR, t, "assets", f)) for f in REQ_AS)]
add("ok" if not th_bad else "fail", "主題素材", f"{len(th_ids)} 個主題都完整" if not th_bad else "不完整：" + "；".join(th_bad),
    "" if not th_bad else "重新下載整個技能資料夾（主題素材是內建的，不需要用 Codex 重生）")

if a.json:
    print(json.dumps([dict(level=l, name=n, detail=d, fix=f) for l, n, d, f in R], ensure_ascii=False, indent=1))
else:
    icon = {"ok": "✓", "warn": "！", "fail": "✗"}
    for l, n, d, f in R:
        print(f"{icon[l]} {n}：{d}" + (f"\n    → {f}" if f else ""))
    nf, nw = sum(1 for r in R if r[0] == "fail"), sum(1 for r in R if r[0] == "warn")
    print(f"\n結果：{'可以開工' if nf == 0 else '還有 %d 項必須先解決' % nf}（提醒 {nw} 項）")
sys.exit(1 if any(r[0] == "fail" for r in R) else 0)
