"""口播影音 AGENT 資料庫同步（本機 koubo ⇄ NAS）。只增不刪；主題以 theme.json 的 version 判斷新舊。
用法：python -X utf8 library.py status|list|push|pull [--theme 代號] [--skill] [--force] [--root 路徑]
NAS 位置寫在 koubo/config.json 的 nas_root；--root 可臨時指定（測試用）。
NAS 結構：skill/（技能包）、themes/<代號>/（theme.json、assets、raw、prompts.json、preview）、themes/_series/、library/（單張可重用素材）"""
import argparse, json, os, shutil, sys, threading

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
LOCAL_THEMES = os.path.join(KOUBO, "themes")
SKIP = {"__pycache__"}

ap = argparse.ArgumentParser()
ap.add_argument("cmd", choices=["status", "list", "push", "pull"])
ap.add_argument("--theme", default=None)
ap.add_argument("--skill", action="store_true", help="push 時一併同步技能包本體（core、packs、tools、catalog、README）")
ap.add_argument("--force", action="store_true", help="版本較低也覆蓋")
ap.add_argument("--root", default=None)
a = ap.parse_args()

cfg = json.load(open(os.path.join(KOUBO, "config.json"), encoding="utf-8"))
ROOT = a.root or cfg["nas_root"]


def reachable(path, timeout=8):
    """UNC 路徑連不上時 isdir 可能卡很久，所以放到執行緒裡限時。"""
    box = []
    t = threading.Thread(target=lambda: box.append(os.path.isdir(path)), daemon=True)
    t.start()
    t.join(timeout)
    return bool(box and box[0])


def ver(d):
    f = os.path.join(d, "theme.json")
    return json.load(open(f, encoding="utf-8")).get("version", 0) if os.path.exists(f) else -1


def copy_tree(src, dst):
    n = 0
    for dp, dn, fn in os.walk(src):
        dn[:] = [d for d in dn if d not in SKIP]
        rel = os.path.relpath(dp, src)
        os.makedirs(os.path.join(dst, rel), exist_ok=True)
        for f in fn:
            s, t = os.path.join(dp, f), os.path.join(dst, rel, f)
            if not os.path.exists(t) or os.path.getsize(t) != os.path.getsize(s) or os.path.getmtime(s) > os.path.getmtime(t) + 1:
                shutil.copy2(s, t)
                n += 1
    return n


def themes(base):
    return sorted(d for d in os.listdir(base) if os.path.isdir(os.path.join(base, d))) if os.path.isdir(base) else []


if not reachable(ROOT):
    print(f"連不上資料庫：{ROOT}\n（可能不在公司內網、需要先登入網路磁碟，或路徑有誤。主題與技能先留在本機 koubo/，連上後再 push。）")
    sys.exit(2)
RT = os.path.join(ROOT, "themes")
if a.cmd in ("status", "list"):
    print("資料庫：", ROOT)
    for t in sorted(set(themes(LOCAL_THEMES)) | set(themes(RT))):
        print(f"  {t:10s} 本機 v{ver(os.path.join(LOCAL_THEMES, t))}  NAS v{ver(os.path.join(RT, t))}")
    sys.exit(0)

todo = [a.theme] if a.theme else themes(LOCAL_THEMES if a.cmd == "push" else RT)
for t in todo:
    s, d = (os.path.join(LOCAL_THEMES, t), os.path.join(RT, t)) if a.cmd == "push" else (os.path.join(RT, t), os.path.join(LOCAL_THEMES, t))
    if not os.path.isdir(s):
        print(f"  {t}：來源沒有，略過")
        continue
    if ver(d) > ver(s) and not a.force:
        print(f"  {t}：目的地版本較新（v{ver(d)} > v{ver(s)}），略過（要覆蓋請加 --force）")
        continue
    print(f"  {t}：{a.cmd} {copy_tree(s, d)} 個檔案")
if a.cmd == "push" and a.skill:
    n = 0
    for part in ("core", "packs", "tools", "catalog"):
        n += copy_tree(os.path.join(KOUBO, part), os.path.join(ROOT, "skill", part))
    for f in ("README.md", "config.json"):
        shutil.copy2(os.path.join(KOUBO, f), os.path.join(ROOT, "skill", f)); n += 1
    print(f"  skill：push {n} 個檔案")
