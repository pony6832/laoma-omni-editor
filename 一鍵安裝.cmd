@echo off
chcp 65001 >nul
setlocal
echo ============================================================
echo   老馬的全能剪輯助手：一鍵安裝
echo ============================================================
echo.
echo 這個安裝程式會：
echo   1. 檢查這台電腦缺什麼，缺的會告訴你要裝什麼、從哪裡來、多大，問你同意才裝
echo   2. 把技能安裝到 Claude，並預先核准這個流程會用到的指令
echo   3. 做環境檢查與自我檢測（約 1～2 分鐘，不連外部服務）
echo.

where python >nul 2>nul
if errorlevel 1 (
  echo [找不到 Python]
  where winget >nul 2>nul
  if errorlevel 1 (
    echo 請先安裝 Python 3.11：https://www.python.org/downloads/
    echo 安裝時請勾選「Add python.exe to PATH」，裝完重新執行這個檔案。
    pause
    exit /b 1
  )
  echo 要用 winget 安裝 Python 3.11（來源：微軟 winget，約 30 MB）嗎？
  set /p ANS=輸入 y 安裝，其他鍵取消：
  if /i "%ANS%"=="y" (
    winget install -e --id Python.Python.3.11 --accept-package-agreements --accept-source-agreements
    echo.
    echo Python 裝好了。請「關掉這個視窗，重新雙擊一鍵安裝.cmd」讓設定生效。
  )
  pause
  exit /b 1
)

echo [步驟 1／2] 環境檢查與安裝
python -X utf8 "%~dp0env\setup_env.py"
if errorlevel 1 (
  echo.
  echo 環境還有必要項目沒處理好（見上方 ✗）。補好後請重新執行這個檔案。
  pause
  exit /b 1
)

echo.
echo [步驟 2／2] 安裝技能、設定預先核准、環境檢查與自我檢測
python -X utf8 "%~dp0env\install.py" --permissions
echo.
echo ============================================================
echo 完成。請把 Claude 完全關掉再重開，然後說：
echo     老馬的全能剪輯助手，幫我把這支口播做成影片
echo 完整說明請看「使用手冊.md」。
echo （環境檢查有 ✗ 的必備項目請先補齊，需要權限的請洽管理者。）
echo ============================================================
pause
