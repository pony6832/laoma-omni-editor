"""Gemini API 金鑰（AI 配音用）：檢查有沒有設定、並讓使用者自己安全地存進這台電腦。只回報有沒有，不讀出內容。
用法：
  python -X utf8 gemini_key.py          印出狀態 ok／restart／missing
  python -X utf8 gemini_key.py save     在「使用者自己的終端機」執行：提示貼上金鑰（輸入時不顯示），存進這台電腦的使用者環境變數
金鑰設定一次後這台電腦就會記住（之後不用再輸入）；但設定完要把 Claude 完全關掉再重開，才會讀到。
金鑰怎麼來：向管理者索取（公司統一管理）；不要貼進對話、不要寫進任何檔案、不要傳給別人。"""
import os, subprocess, sys

VAR = "GEMINI_API_KEY"
HOWTO = ("第一次用 AI 配音，這台電腦需要 Gemini API 金鑰：①向管理者索取金鑰；②自己打開「命令提示字元」，輸入  "
         "python -X utf8 \"<技能資料夾>\\core\\gemini_key.py\" save  後貼上金鑰（輸入時看不到字，貼上按 Enter 即可），"
         "這台電腦就會記住，之後不用再輸入；③把 Claude 完全關掉再重開。金鑰請自己貼，不要貼給任何人或對話。")


def status():
    """回傳 'ok'（目前就能用）、'restart'（已設定但要重開 Claude）、'missing'（沒設定）。"""
    if os.environ.get(VAR):
        return "ok"
    try:
        import winreg
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, "Environment") as k:
            if winreg.QueryValueEx(k, VAR)[0]:
                return "restart"
    except (ImportError, OSError):
        pass
    return "missing"


def save():
    import getpass
    key = getpass.getpass("請貼上 Gemini API 金鑰（輸入時不會顯示），按 Enter：").strip()
    if len(key) < 20 or " " in key:
        sys.exit("這看起來不像金鑰（太短或含空白），沒有儲存。請向管理者確認後再試一次。")
    subprocess.run(["setx", VAR, key], check=True, capture_output=True)
    print("已存進這台電腦（使用者環境變數）。請把 Claude 完全關掉再重開，才會生效；之後這台電腦不用再輸入。")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "save":
        save()
    else:
        print(status())
