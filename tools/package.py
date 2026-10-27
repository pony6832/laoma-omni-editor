"""打包發佈：把技能複製成乾淨的發佈資料夾（拿掉個人路徑、公司內網位址、一次性工具、測試案與暫存），做安全掃描，並輸出 zip。
用法：python -X utf8 package.py [--out 發佈資料夾] [--no-zip]
預設輸出：<技能>/../_發佈/laoma-omni-editor 與 laoma-omni-editor-v<版本>.zip
掃描有發現問題（金鑰樣式、內網位址、個人路徑）會停下來並列出，結束碼 1。"""
import argparse, json, os, re, shutil, sys, zipfile

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
ap = argparse.ArgumentParser()
ap.add_argument("--out", default=os.path.join(os.path.dirname(KOUBO), "_發佈", "laoma-omni-editor"))
ap.add_argument("--no-zip", action="store_true")
a = ap.parse_args()

SKIP_DIRS = {"__pycache__", "raw", ".hyperframes", ".git", "_舊版148種備份", "node_modules"}
SKIP_FILES = {"tools/migrate_typhoon_long.py", "packs/weather/topo.py", "catalog/配對技能說明_SKILL.md"}   # 作者個人路徑的一次性工具
SKIP_SUFFIX = (".pyc", ".bak_koubo", ".bak_laoma")
BAD = [(re.compile(r"AIza[0-9A-Za-z_-]{20,}"), "Google 金鑰樣式"), (re.compile(r"gh[po]_[A-Za-z0-9]{20,}"), "GitHub 權杖樣式"),
       (re.compile(r"sk-[A-Za-z0-9]{20,}"), "API 金鑰樣式"), (re.compile(r"10\.227\.\d+\.\d+"), "公司內網位址"),
       (re.compile(r"C:[/\\]Users[/\\][A-Za-z0-9_.-]+"), "個人使用者路徑"), (re.compile(r"D:[/\\]【AIGC"), "個人資料夾路徑")]
TEXT_EXT = (".py", ".js", ".json", ".md", ".html", ".cmd", ".txt", ".css", ".toml")

out = os.path.abspath(a.out)
if os.path.isdir(out):   # 只清空內容、保留資料夾本身（Windows 上資料夾若被別的程式當作工作目錄，整個刪掉會失敗）
    for name in os.listdir(out):
        p = os.path.join(out, name)
        shutil.rmtree(p) if os.path.isdir(p) else os.remove(p)
n = 0
for dp, dn, fn in os.walk(KOUBO):
    dn[:] = [d for d in dn if d not in SKIP_DIRS]
    for f in fn:
        s = os.path.join(dp, f); rel = os.path.relpath(s, KOUBO).replace("\\", "/")
        if rel in SKIP_FILES or f.endswith(SKIP_SUFFIX):
            continue
        t = os.path.join(out, rel); os.makedirs(os.path.dirname(t), exist_ok=True); shutil.copy2(s, t); n += 1
# 公司內網的共用資料庫位置不外流：設定檔清空
cfg = os.path.join(out, "config.json")
if os.path.exists(cfg):
    c = json.load(open(cfg, encoding="utf-8")); c["nas_root"] = ""
    json.dump(c, open(cfg, "w", encoding="utf-8"), ensure_ascii=False, indent=2)

problems = []
for dp, dn, fn in os.walk(out):
    for f in fn:
        p = os.path.join(dp, f); rel = os.path.relpath(p, out)
        if os.path.getsize(p) > 90 * 2**20:
            problems.append((rel, "檔案超過 90 MB（GitHub 上限 100 MB）"))
        if f.lower().endswith(TEXT_EXT) and not rel.replace("\\", "/").startswith("catalog/fx/_"):
            s = open(p, encoding="utf-8", errors="ignore").read()
            for rx, why in BAD:
                if rx.search(s):
                    problems.append((rel, why))
print(f"已複製 {n} 個檔案 → {out}")
if problems:
    print("\n【發現問題，請先處理】")
    for rel, why in problems:
        print(f"  {rel}：{why}")
    sys.exit(1)
size = sum(os.path.getsize(os.path.join(dp, f)) for dp, _, fn in os.walk(out) for f in fn)
print(f"安全掃描通過（金鑰樣式、內網位址、個人路徑）；總大小 {size / 2**20:.0f} MB")
if not a.no_zip:
    ver = open(os.path.join(out, "VERSION"), encoding="utf-8").read().strip()
    zp = os.path.join(os.path.dirname(out), f"laoma-omni-editor-v{ver}.zip")
    with zipfile.ZipFile(zp, "w", zipfile.ZIP_DEFLATED) as z:
        for dp, _, fn in os.walk(out):
            for f in fn:
                p = os.path.join(dp, f); z.write(p, os.path.join("laoma-omni-editor", os.path.relpath(p, out)))
    print(f"已輸出 zip：{zp}（{os.path.getsize(zp) / 2**20:.0f} MB）")
