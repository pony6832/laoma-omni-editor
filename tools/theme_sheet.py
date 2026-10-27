"""主題對照總覽：同一支成品畫面套上每個主題，抽一幀並排成一張圖（主題名稱、主色色塊、關鍵字數、風險提醒）。
用法：python -X utf8 theme_sheet.py <來源專案資料夾> [--out 輸出圖] [--at 8] [--themes a,b,c]
來源專案需有 02_字幕、01_素材、analysis、project.json；會複製到暫存資料夾逐一換主題建置（--nomedia），不動原專案。"""
import argparse, json, os, shutil, subprocess, sys, tempfile

from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
KOUBO = os.path.abspath(os.path.join(HERE, ".."))
CORE = os.path.join(KOUBO, "core")
THEMES = os.path.join(KOUBO, "themes")
sys.path.insert(0, CORE)
import project as P

ap = argparse.ArgumentParser()
ap.add_argument("src"); ap.add_argument("--out", default=os.path.join(THEMES, "_series", "主題對照.jpg"))
ap.add_argument("--at", type=float, default=8); ap.add_argument("--themes", default="")
a = ap.parse_args()
ids = [x for x in a.themes.split(",") if x] or [d for d in sorted(os.listdir(THEMES)) if not d.startswith("_") and os.path.exists(os.path.join(THEMES, d, "theme.json"))]
order = ["weather", "finance", "society", "general", "politics", "health", "education", "tech", "entertainment", "sports", "international", "lifestyle"]
ids = sorted(ids, key=lambda i: order.index(i) if i in order else 99)
hf = shutil.which("hyperframes") or "hyperframes"
tmp = tempfile.mkdtemp(prefix="theme_sheet_")
frames = {}
try:
    for t in ids:
        d = os.path.join(tmp, t)
        os.makedirs(d)
        for sub in ("01_素材", "02_字幕", "analysis"):
            shutil.copytree(os.path.join(a.src, sub), os.path.join(d, sub))
        shutil.copy(os.path.join(a.src, "project.json"), d)
        p = P.load(d); p["meta"]["theme"] = t; p["meta"]["aspect"] = "16:9"; P.save(d, p)
        r = subprocess.run([sys.executable, "-X", "utf8", os.path.join(CORE, "build.py"), d, "--target", "main", "--nomedia", "--nomusic", "--nosrt"], capture_output=True, text=True, encoding="utf-8", errors="replace")
        if r.returncode:
            print("建置失敗", t, (r.stdout + r.stderr)[-300:]); continue
        out = os.path.join(d, "snap")
        subprocess.run([hf, "snapshot", "--describe", "false", "--at", str(a.at), "-o", out, "--no-end"], cwd=os.path.join(d, "03_HyperFrames", "main"), capture_output=True)
        fs = [f for f in os.listdir(out) if f.startswith("frame-")]
        if fs:
            frames[t] = Image.open(os.path.join(out, fs[0])).convert("RGB")
        print("完成", t, flush=True)
finally:
    shutil.rmtree(tmp, ignore_errors=True)

FONT = os.path.join(THEMES, "general", "assets", "NotoSansTC-VF.ttf")
FONT = FONT if os.path.exists(FONT) else r"C:\Windows\Fonts\NotoSansTC-VF.ttf"
def F(s, w=700):
    f = ImageFont.truetype(FONT, s)
    try: f.set_variation_by_axes([w])
    except Exception: pass
    return f
cols = 3; tw = 900; th = 506; gap = 30; lab = 120
rows = (len(frames) + cols - 1) // cols
W = cols * tw + (cols + 1) * gap; H = 120 + rows * (th + lab + gap) + gap
cv = Image.new("RGB", (W, H), (10, 13, 24)); d = ImageDraw.Draw(cv)
d.text((gap, 28), "領域主題對照（同一支訪談畫面套上各主題；色塊為主色）", font=F(46, 800), fill=(240, 244, 252))
for i, t in enumerate(ids):
    if t not in frames:
        continue
    cfg = json.load(open(os.path.join(THEMES, t, "theme.json"), encoding="utf-8"))
    x = gap + (i % cols) * (tw + gap); y = 120 + (i // cols) * (th + lab + gap)
    cv.paste(frames[t].resize((tw, th), Image.LANCZOS), (x, y))
    d.rectangle((x, y + th + 14, x + 46, y + th + 60), fill=cfg["palette"]["coral"])
    d.rectangle((x + 52, y + th + 14, x + 98, y + th + 60), fill=cfg["palette"]["indigo"])
    d.text((x + 116, y + th + 8), f"{cfg['name']}（{t}）", font=F(36, 800), fill=(240, 244, 252))
    sub = f"關鍵字 {len(cfg.get('match_keywords', []))} 個" + ("　專屬場景：" + "、".join(s["title"] for s in cfg.get("scenes", [])) if cfg.get("scenes") else "")
    d.text((x + 116, y + th + 54), sub, font=F(24, 500), fill=(150, 160, 185))
    if cfg.get("risk_note"):
        d.text((x, y + th + 92), "！" + cfg["risk_note"][:38], font=F(22, 600), fill=(255, 200, 87))
os.makedirs(os.path.dirname(a.out), exist_ok=True)
cv.save(a.out, quality=88); print("輸出", a.out, cv.size)
