"""用本機 Codex 為主題生成設計素材（panel 面板底圖、plate 系列緞帶、nameplate 人名標底板、badge 徽章），
自動去綠幕、裁切、寫成 themes/<主題>/assets/ 並更新 assets.json 與 prompts.json。night 底圖與 LOGO、字型沿用氣象版（系列骨架）。
用法：python -X utf8 make_theme_assets.py <主題代號> [--only panel,plate,nameplate,badge] [--jobs 3] [--tries 2]
提示詞骨架：themes/_series/series_prompt.json（只替換色名與圖示）；主題的圖樣設定：theme.json 的 art。
Codex 成功與否看 generated_images 有沒有檔，不看 exit code；沒檔自動重跑，仍失敗就回報（不改用其他服務）。"""
import argparse, concurrent.futures as cf, glob, json, os, re, shutil, subprocess, sys, time

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
THEMES = os.path.abspath(os.path.join(HERE, "..", "themes"))
GEN = os.path.join(os.path.expanduser("~"), ".codex", "generated_images")
CODEX = sorted(glob.glob(os.path.join(os.path.expanduser("~"), "AppData", "Local", "OpenAI", "Codex", "bin", "*", "codex.exe")))[-1:]

ap = argparse.ArgumentParser()
ap.add_argument("theme")
ap.add_argument("--only", default="panel,plate,nameplate,badge")
ap.add_argument("--jobs", type=int, default=3)
ap.add_argument("--tries", type=int, default=2)
a = ap.parse_args()
if not CODEX:
    sys.exit("找不到 codex.exe，停止（不改用其他生圖服務）")
TD = os.path.join(THEMES, a.theme)
TH = json.load(open(os.path.join(TD, "theme.json"), encoding="utf-8"))
SP = json.load(open(os.path.join(THEMES, "_series", "series_prompt.json"), encoding="utf-8"))
art = TH["art"]
RAW = os.path.join(TD, "raw")
AS = os.path.join(TD, "assets")
os.makedirs(RAW, exist_ok=True)
os.makedirs(AS, exist_ok=True)


def prompt_for(name):
    t = SP[name].format(**art)
    if art.get("key") == "magenta":   # 主色本身是綠色的主題（薄荷綠、萊姆綠）：改用洋紅底，否則緞帶會被當成綠幕一起抠掉
        t = t.replace("flat pure green (#00FF00)", "flat pure magenta (#FF00FF)")
    return "請用內建 image generation 生成圖片，不要執行任何 shell 指令。" + SP["common"] + " " + t


def run_codex(name):
    ref = os.path.join(THEMES, SP["refs"][name])
    wd = os.path.join(RAW, name)
    os.makedirs(wd, exist_ok=True)
    pr = prompt_for(name)
    for k in range(a.tries):
        log = os.path.join(wd, f"codex_{k+1}.log")
        with open(log, "wb") as fh:
            subprocess.run([CODEX[0], "exec", "-C", wd, "-s", "workspace-write", "--skip-git-repo-check", "-i", ref, "-"],
                           input=pr.encode("utf-8"), stdout=fh, stderr=subprocess.STDOUT, timeout=900)
        txt = open(log, encoding="utf-8", errors="ignore").read()
        m = re.search(r"session id: ([0-9a-f-]{36})", txt)
        imgs = sorted(glob.glob(os.path.join(GEN, m.group(1), "exec-*.png"))) if m else []
        if imgs:
            dst = os.path.join(wd, f"{name}_raw.png")
            shutil.copy(imgs[-1], dst)
            return name, dst, pr
        print(f"[{name}] 第 {k+1} 次沒有出圖，{'重跑' if k + 1 < a.tries else '放棄'}", flush=True)
    return name, None, pr


def key_magenta(im):
    """去洋紅幕：紅藍都明顯高於綠者視為背景，邊緣依洋紅度漸層透明並去洋紅溢色。"""
    im = im.convert("RGB")
    px = im.load()
    w, h = im.size
    out = Image.new("RGBA", (w, h))
    po = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            d = min(r, b) - g
            if d > 70:
                al = 0
            elif d > 20:
                al = int(255 * (70 - d) / 50)
            else:
                al = 255
            if al < 255 and d > 0:
                r, b = max(0, r - d // 4), max(0, b - d // 4)   # 去洋紅溢色
            po[x, y] = (r, g, b, al)
    return out


def key_green(im):
    """去綠幕：綠色明顯高於紅藍者視為背景，邊緣依綠度漸層透明並去綠溢色。"""
    im = im.convert("RGB")
    px = im.load()
    w, h = im.size
    out = Image.new("RGBA", (w, h))
    po = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            d = g - max(r, b)
            if d > 70:
                al = 0
            elif d > 20:
                al = int(255 * (70 - d) / 50)
            else:
                al = 255
            if al < 255 and d > 0:
                g = max(r, b) + max(0, d // 4)  # 去綠溢色
            po[x, y] = (r, g, b, al)
    return out


def trim(im, pad=0.0):
    bb = im.getchannel("A").point(lambda v: 255 if v > 24 else 0).getbbox()
    return im.crop(bb), bb


def process(name, raw):
    im = Image.open(raw)
    if name == "panel":
        out = im.convert("RGB")
        out.save(os.path.join(AS, "panel.png"))
        return out.size
    k, _ = trim((key_magenta if art.get("key") == "magenta" else key_green)(im))
    if name == "plate":
        k = k.resize((1530, 172))
        # 緞帶與氣象版同尺寸規格：寬 1530×高 172，之後 scale=1240:-2
    elif name == "nameplate":
        k = k.resize((1580, 170))
    elif name == "badge":
        s = max(k.size)
        cv = Image.new("RGBA", (round(s / 0.72), round(s / 0.72)), (0, 0, 0, 0))  # 徽章佔畫布約 72%，與氣象版比例一致
        cv.paste(k, ((cv.width - k.width) // 2, (cv.height - k.height) // 2), k)
        k = cv.resize((1254, 1254))
    k.save(os.path.join(AS, f"{name}.png"))
    return k.size


names = [n for n in a.only.split(",") if n]
t0 = time.time()
with cf.ThreadPoolExecutor(max_workers=a.jobs) as ex:
    res = list(ex.map(run_codex, names))
fails = [n for n, r, _ in res if not r]
prompts = {}
for n, raw, pr in res:
    if raw:
        print(n, "→", process(n, raw), flush=True)
        prompts[n] = dict(prompt=pr, ref=SP["refs"][n], date=time.strftime("%Y-%m-%d"), art=art)

# 與氣象版共用：夜空底圖、LOGO、字型（系列骨架）；assets.json 的處理參數所有主題相同
W = os.path.join(THEMES, "weather", "assets")
for f in ("night.png", "logo.png"):
    if not os.path.exists(os.path.join(AS, f)):
        shutil.copy(os.path.join(W, f), os.path.join(AS, f))
am = json.load(open(os.path.join(W, "assets.json"), encoding="utf-8"))
for e in am:  # plate／nameplate 已在後處理裁好，只需縮放
    if e["out"] == "plate.png":
        e["vf"] = "scale=1240:-2"
    if e["out"] == "nameplate.png":
        e["vf"] = "scale=1560:-2"
    if e["out"] == "badge.png":
        e["vf"] = "crop=900:900:177:177,scale=300:300"
json.dump(am, open(os.path.join(AS, "assets.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
pf = os.path.join(TD, "prompts.json")
old = json.load(open(pf, encoding="utf-8")) if os.path.exists(pf) else {}
old.update(prompts)
json.dump(old, open(pf, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print("完成", round(time.time() - t0), "秒；失敗：", fails or "無")
sys.exit(1 if fails else 0)
