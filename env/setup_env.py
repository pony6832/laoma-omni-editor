"""環境安裝程式：逐項偵測這台電腦缺什麼，缺的會說明「裝什麼、來源、大概多大」，**問你同意後才安裝**。
用法：python -X utf8 setup_env.py [--yes] [--check-only] [--dry-run]
  --check-only  只偵測，不安裝（結束碼：0＝都齊、1＝有缺）
  --dry-run     不真的安裝，只印出「會問你什麼、會執行什麼指令」
  --yes         全部都同意（給管理者批次用；一般同事不要加，讓它逐項問你）
會處理：Node.js、FFmpeg、Google Chrome、HyperFrames、Python 套件（含顯示卡運算函式庫）、Noto Sans TC 字型、Whisper 語音模型（選用）。
不會處理（只告訴你怎麼做）：Python 本身、NVIDIA 顯示卡與驅動、Claude、Gemini 金鑰（向管理者索取）。
下載的東西都來自官方來源：winget（微軟套件管理員）、npm、PyPI、Hugging Face；不會下載來路不明的檔案。"""
import argparse, glob, importlib.metadata as md, os, re, shutil, subprocess, sys

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
ap = argparse.ArgumentParser()
ap.add_argument("--yes", action="store_true"); ap.add_argument("--check-only", action="store_true"); ap.add_argument("--dry-run", action="store_true")
a = ap.parse_args()
FAKE = {x for x in os.environ.get("LAOMA_FAKE_MISSING", "").split(",") if x}   # 測試用：假裝某些項目缺少（node,ffmpeg,chrome,hyperframes,pip,font,model）
HOME = os.path.expanduser("~")
HF_VERSION = "0.8.181"   # 驗證過的版本
steps = []   # (代號, 名稱, 狀態文字, 缺了嗎, 安裝說明, 安裝動作)


def run(cmd, **kw):
    return subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", **kw)


def ver_of(cmd):
    exe = shutil.which(cmd[0])
    if not exe:
        return None
    r = run([exe] + cmd[1:])
    return (r.stdout + r.stderr).strip().splitlines()[0] if r.returncode == 0 and (r.stdout + r.stderr).strip() else None


def winget_install(pid):
    def go():
        w = shutil.which("winget")
        if not w:
            print("  這台電腦沒有 winget，請改用手動安裝（見安裝說明）。")
            return False
        r = subprocess.run([w, "install", "-e", "--id", pid, "--accept-package-agreements", "--accept-source-agreements"])
        return r.returncode == 0
    return go


def add(code, name, status, missing, how, action):
    steps.append((code, name, status, missing or code in FAKE, how, action))


# ---- 偵測 ----
py_ok = sys.version_info >= (3, 10)
add("python", "Python", f"{sys.version.split()[0]}", not py_ok, "請到 https://www.python.org/downloads/ 安裝 3.11（安裝時勾選「Add python.exe to PATH」）", None)
nv = ver_of(["node", "--version"]); nmaj = int(re.match(r"v(\d+)", nv).group(1)) if nv and re.match(r"v(\d+)", nv) else 0
add("node", "Node.js（18 以上）", nv or "找不到", nmaj < 18, "Node.js LTS，來源 winget（OpenJS.NodeJS.LTS），約 30 MB", winget_install("OpenJS.NodeJS.LTS"))
ff = shutil.which("ffmpeg") and shutil.which("ffprobe")
add("ffmpeg", "FFmpeg（ffmpeg 與 ffprobe）", (ver_of(["ffmpeg", "-version"]) or "找不到")[:40], not ff, "FFmpeg 完整版，來源 winget（Gyan.FFmpeg），約 100 MB", winget_install("Gyan.FFmpeg"))
chrome = [p for p in (r"C:\Program Files\Google\Chrome\Application\chrome.exe", r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe", os.path.join(HOME, r"AppData\Local\Google\Chrome\Application\chrome.exe")) if os.path.exists(p)]
add("chrome", "Google Chrome", chrome[0] if chrome else "找不到", not chrome, "Google Chrome，來源 winget（Google.Chrome），約 100 MB", winget_install("Google.Chrome"))
hfv = ver_of(["hyperframes", "--version"]); hfv = (re.search(r"\d+\.\d+\.\d+", hfv).group(0) if hfv and re.search(r"\d+\.\d+\.\d+", hfv) else None)


def npm_hf():
    npm = shutil.which("npm")
    if not npm:
        print("  找不到 npm（要先裝好 Node.js，裝完請關掉這個視窗重開再跑一次）。")
        return False
    return subprocess.run([npm, "install", "-g", f"hyperframes@{HF_VERSION}"]).returncode == 0


add("hyperframes", f"HyperFrames（驗證過 {HF_VERSION}）", hfv or "找不到", not hfv, f"HyperFrames，來源 npm（hyperframes@{HF_VERSION}），約 100～200 MB（含它用的瀏覽器元件）", npm_hf)

REQ = os.path.join(KOUBO, "env", "requirements.txt")
need_pkgs = []
for line in open(REQ, encoding="utf-8"):
    line = line.split("#")[0].strip()
    if not line:
        continue
    name = re.split(r"[=<>!~]", line)[0]
    try:
        md.version(name)
    except md.PackageNotFoundError:
        need_pkgs.append(name)


def pip_req():
    return subprocess.run([sys.executable, "-m", "pip", "install", "-r", REQ]).returncode == 0


add("pip", "Python 套件（語音辨識、顯示卡運算函式庫等）", "都已安裝" if not need_pkgs else "缺：" + "、".join(need_pkgs), bool(need_pkgs),
    "來源 PyPI，依 env/requirements.txt 安裝，**約 1～1.5 GB（概估；含 NVIDIA 的 CUDA 函式庫）**", pip_req)

fonts = glob.glob(r"C:\Windows\Fonts\NotoSansTC*") + glob.glob(os.path.join(HOME, r"AppData\Local\Microsoft\Windows\Fonts\NotoSansTC*"))
bundled = glob.glob(os.path.join(KOUBO, "themes", "*", "assets", "NotoSansTC-VF.ttf"))


def install_font():
    if not bundled:
        print("  技能資料夾內找不到字型檔。"); return False
    d = os.path.join(HOME, r"AppData\Local\Microsoft\Windows\Fonts"); os.makedirs(d, exist_ok=True)
    dst = os.path.join(d, "NotoSansTC-VF.ttf"); shutil.copy2(bundled[0], dst)
    try:
        import winreg
        with winreg.CreateKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows NT\CurrentVersion\Fonts") as k:
            winreg.SetValueEx(k, "Noto Sans TC (TrueType)", 0, winreg.REG_SZ, dst)
    except Exception as e:
        print("  已複製字型，但登錄失敗（" + str(e) + "），請手動雙擊字型檔安裝。"); return False
    return True


add("font", "字型 Noto Sans TC", os.path.basename(fonts[0]) if fonts else "找不到", not fonts, "把技能內建的字型（約 11 MB）安裝到你的使用者字型資料夾，不需要系統管理員權限，不用下載", install_font)

hf_cache = glob.glob(os.path.join(HOME, ".cache", "huggingface", "hub", "models--Systran--faster-whisper-large-v3*"))


def dl_model():
    try:
        from faster_whisper.utils import download_model
        download_model("large-v3"); return True
    except Exception as e:
        print("  下載失敗：" + str(e)[:150]); return False


add("model", "Whisper large-v3 語音模型（選用，可跳過）", "已下載" if hf_cache else "尚未下載（第一次轉錄時也會自動下載）", not hf_cache,
    "來源 Hugging Face（Systran/faster-whisper-large-v3），**約 3 GB**，需要網路；現在先下載可以讓第一次剪片不用等", dl_model)

# ---- 顯示卡（只偵測與提醒，無法自動安裝）----
gpu = run(["nvidia-smi", "--query-gpu=name,driver_version", "--format=csv,noheader"]) if shutil.which("nvidia-smi") else None
gpu_msg, gpu_warn = "找不到 NVIDIA 顯示卡或驅動", True
if gpu and gpu.returncode == 0 and gpu.stdout.strip():
    nm, dv = [x.strip() for x in gpu.stdout.strip().splitlines()[0].split(",")[:2]]
    try:
        dmaj = int(dv.split(".")[0])
    except ValueError:
        dmaj = 0
    ok_card = bool(re.search(r"RTX\s*(4070|5070)", nm))
    gpu_warn = dmaj < 570 or not ok_card
    gpu_msg = f"{nm}，驅動 {dv}" + ("" if not gpu_warn else "（" + ("驅動需 570 以上；" if dmaj < 570 else "") + ("這張卡不是驗證過的 4070／5070，未驗證" if not ok_card else "") + "）")

print("=" * 60); print("環境偵測（老馬的全能剪輯助手）"); print("=" * 60)
for code, name, status, missing, how, action in steps:
    print(f"{'✗' if missing else '✓'} {name}：{status}")
print(f"{'！' if gpu_warn else '✓'} NVIDIA 顯示卡：{gpu_msg}")
if gpu_warn:
    print("    → 需要 NVIDIA RTX 4070 或 5070（12 GB）與驅動 570 以上；請到 https://www.nvidia.com/drivers 下載安裝（無法由這個程式代勞）")
miss = [s for s in steps if s[3] and s[0] != "model"]
if a.check_only:
    sys.exit(1 if miss else 0)
todo = [s for s in steps if s[3]]
if not todo:
    print("\n環境都齊了。"); sys.exit(0)

if not py_ok:
    print("\nPython 版本太舊，請先安裝 Python 3.11，再重新執行。"); sys.exit(1)
print("\n下面逐項問你要不要安裝（只會問缺的）。直接按 Enter 代表「不安裝」，輸入 y 才會安裝。")
changed = False
unresolved = []        # 必要項目被略過或失敗
need_restart = False   # winget／npm 剛裝好的工具，要重開視窗 PATH 才會生效
for code, name, status, missing, how, action in todo:
    print(f"\n── {name}\n   要裝的是：{how}")
    if action is None:
        continue
    ans = "y" if a.yes else ""
    if not a.yes:
        try:
            ans = input("   現在安裝嗎？(y/N) ").strip().lower()
        except EOFError:
            ans = ""
    if ans != "y":
        print("   已略過。" + ("（之後第一次轉錄時會自動下載）" if code == "model" else ""))
        if code != "model":
            unresolved.append(name)
        continue
    if a.dry_run:
        print("   （試跑：不真的安裝）"); continue
    ok = action()
    print("   ✓ 完成" if ok else "   ✗ 失敗，請把上面的訊息給管理者")
    changed = changed or ok
    if not ok and code != "model":
        unresolved.append(name)
    if ok and code in ("node", "ffmpeg", "chrome", "hyperframes"):
        need_restart = True
if need_restart:
    print("\n剛裝完的 Node.js、FFmpeg、Chrome、HyperFrames 要「關掉這個視窗再重新打開」才會生效；重開後再執行一次一鍵安裝即可。")
    sys.exit(1)
if unresolved and not a.dry_run:
    print("\n還有必要項目沒處理好：" + "、".join(unresolved) + "。補好後請重新執行。")
    sys.exit(1)
