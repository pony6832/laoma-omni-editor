"""安裝「老馬的全能剪輯助手」（Laoma Omni Editor）成 Claude 技能：
複製到 %USERPROFILE%\\.claude\\skills\\laoma-omni-editor（不複製 raw 原圖、暫存與測試案），並可選擇把預先核准規則寫進 Claude 設定。
用法：python -X utf8 install.py [--permissions] [--dry-run] [--target 資料夾] [--settings 設定檔]
  --permissions  同時把「這個技能流程會用到的指令」預先核准（原有設定保留、舊檔備份、重跑不重複）
  --dry-run      只看會做什麼，不寫入
裝好後：①自動跑環境檢查（缺 Chrome、主題素材等必備項目會標 ✗；Codex 同事電腦不需要）②在 Claude 新開對話說「老馬的全能剪輯助手」或「做口播影片」即可觸發。
更新技能就再跑一次（只覆蓋同名檔，不刪使用者專案）。"""
import argparse, json, os, shutil, subprocess, sys

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SKILL_NAME = "laoma-omni-editor"
ap = argparse.ArgumentParser()
ap.add_argument("--dry-run", action="store_true")
ap.add_argument("--no-selftest", action="store_true", help="略過安裝後的自我檢測")
ap.add_argument("--target", default=os.path.join(os.path.expanduser("~"), ".claude", "skills", SKILL_NAME))
ap.add_argument("--permissions", action="store_true", help="同時把技能流程的預先核准規則合併進 Claude 設定檔")
ap.add_argument("--settings", default="", help="設定檔位置（預設 ~/.claude/settings.json）")
a = ap.parse_args()
SKIP_DIRS = {"__pycache__", "raw", ".hyperframes", ".git", "_舊版148種備份"}
n = size = 0
for dp, dn, fn in os.walk(KOUBO):
    dn[:] = [d for d in dn if d not in SKIP_DIRS]
    for f in fn:
        s = os.path.join(dp, f); t = os.path.join(a.target, os.path.relpath(s, KOUBO))
        n += 1; size += os.path.getsize(s)
        if not a.dry_run:
            os.makedirs(os.path.dirname(t), exist_ok=True); shutil.copy2(s, t)
print(f"{'（試跑，沒有複製）' if a.dry_run else '已複製'} {n} 個檔案、{size / 2**20:.0f} MB → {a.target}")

old = os.path.join(os.path.expanduser("~"), ".claude", "skills", "koubo-video")
if os.path.isdir(old) and os.path.abspath(old) != os.path.abspath(a.target):
    print(f"\n【提醒】這台電腦還有舊名稱的技能資料夾：{old}\n  新舊同時存在會讓 Claude 不知道用哪個，確認新的能用之後，請把舊資料夾刪掉。")

# 預先核准：只放行技能流程會用到的指令與讀寫範圍；pip 安裝、下載、刪除、其他程式一律仍會詢問
ALLOW = [
    f"Bash(python -X utf8 *{SKILL_NAME}*)", f"PowerShell(python -X utf8 *{SKILL_NAME}*)",
    "Bash(hyperframes check*)", "Bash(hyperframes snapshot*)", "Bash(hyperframes render*)", "Bash(hyperframes preview*)",
    "PowerShell(hyperframes check*)", "PowerShell(hyperframes snapshot*)", "PowerShell(hyperframes render*)", "PowerShell(hyperframes preview*)",
    'PowerShell(Start-Process "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"*)',   # 在 Chrome 開啟 HyperFrames 預覽
    "Bash(ffprobe *)", "Bash(ffmpeg -version*)",
    f"Read(~/.claude/skills/{SKILL_NAME}/**)",
    "Write(**/口播專案_*/**)", "Edit(**/口播專案_*/**)",
]
if a.permissions:
    sp = a.settings or os.path.join(os.path.expanduser("~"), ".claude", "settings.json")
    cfg = {}
    if os.path.exists(sp):
        shutil.copy2(sp, sp + ".bak_laoma")
        with open(sp, encoding="utf-8") as f:
            cfg = json.load(f)
    allow = cfg.setdefault("permissions", {}).setdefault("allow", [])
    new = [r for r in ALLOW if r not in allow]
    if not a.dry_run:
        allow.extend(new)
        os.makedirs(os.path.dirname(os.path.abspath(sp)), exist_ok=True)
        with open(sp, "w", encoding="utf-8") as f:
            json.dump(cfg, f, ensure_ascii=False, indent=2)
    print(f"{'（試跑）' if a.dry_run else '已寫入'}預先核准 {len(new)} 條（原有 {len(allow) - (0 if a.dry_run else len(new))} 條保留）→ {sp}")

if not a.dry_run:
    doctor = os.path.join(a.target, "env", "doctor.py")
    print("\n===== 環境檢查（缺少 ✗ 的必備項目要先補）=====")
    ok = subprocess.run([sys.executable, "-X", "utf8", doctor, "--quick"]).returncode == 0
    if ok and not a.no_selftest:
        print("\n===== 自我檢測（用合成測試片跑一遍：建置＋品檢，橫式與直式三種版型，約 1～2 分鐘，不連外部服務）=====")
        subprocess.run([sys.executable, "-X", "utf8", os.path.join(a.target, "env", "selftest.py")])
    print('\n下一步：在 Claude 新開對話，說「老馬的全能剪輯助手，幫我把這支口播做成影片」並附上影片路徑。')
    print("使用手冊：" + os.path.join(a.target, "使用手冊.md"))
