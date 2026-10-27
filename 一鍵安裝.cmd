@echo off
chcp 65001 >nul
echo ===== 老馬的全能剪輯助手：安裝 =====
echo.
echo [1/2] 安裝 Python 套件（含顯示卡需要的函式庫）…
python -m pip install -r "%~dp0env\requirements.txt"
if errorlevel 1 (
  echo.
  echo 套件安裝失敗。請確認已安裝 Python 3.11 並加入 PATH，或把這個畫面的訊息給管理者。
  pause
  exit /b 1
)
echo.
echo [2/2] 安裝技能、設定預先核准、環境檢查與自我檢測…
python -X utf8 "%~dp0env\install.py" --permissions
echo.
echo 完成。請把 Claude 完全關掉再重開，然後說「老馬的全能剪輯助手」。
echo （缺少 ✗ 的必備項目請先補齊，需要權限的請洽管理者。）
pause
