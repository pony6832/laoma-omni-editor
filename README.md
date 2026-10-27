# 老馬的全能剪輯助手（Laoma Omni Editor）

一個給 **Claude** 用的影片製作技能：丟一支口播影片（或一篇文字稿）進去，自動做出有字幕、有圖解、有配樂的成片。支援 **16:9 長影音**與 **9:16 短影音**，內建 **12 種領域主題**。

> 給不熟 Claude 的同事用：Claude 全程代勞，只在幾個關卡問你「有沒有聽錯的字」「圖解可不可以」「草稿可不可以」。

## 目錄

1. [特色](#特色)
2. [快速開始](#快速開始)
3. [環境條件](#環境條件)
4. [安裝流程詳解](#安裝流程詳解)
5. [第一次使用](#第一次使用)
6. [更新與解除安裝](#更新與解除安裝)
7. [疑難排解](#疑難排解)
8. [文件與目錄](#文件與目錄)
9. [狀態與授權](#狀態與授權)

## 特色

- **真人口播 → 成片**：本機語音辨識（GPU）、剪輯表、逐字高亮字幕、人名標、依內容自動挑圖解與動態效果、配樂、品檢、草稿與最終渲染。
- **9:16 直式短影音**：預設「上三分之二」版型（受訪者最明顯），影片區、字幕區、圖解區位置固定、文字不出框；另有滿版、上二分之一兩種進階版型。
- **12 種領域主題**：氣象、財經、社會、通用生活、政治、健康醫療、教育校園、科技、娛樂演藝、體育、國際、生活旅遊；設計素材已內建，**同事電腦不需要 Codex**。
- **AI 旁白**：文字稿 → 雲端 Gemini 逐句配音 → 本機回聽核對、念錯自動重生。初次使用提醒向管理者索取金鑰，並可存進該台電腦、之後不用再輸入。
- **iPhone HDR 自動轉換**：避免渲染慢十幾倍、成片變 HDR。
- **剪輯時在 Chrome 開啟 HyperFrames 預覽**，邊看邊改。
- **環境自動檢查與安裝**：缺什麼會告訴你來源與大小，**問你同意才安裝**。

## 快速開始

1. **下載**：到本頁上方，點綠色的 **Code → Download ZIP**，或到 [Releases](../../releases/latest) 下載 `laoma-omni-editor-v*.zip`。解壓縮到一個**路徑短、不含空白**的位置（例如 `D:\laoma-omni-editor`）。
2. **雙擊 `一鍵安裝.cmd`**。它會先檢查這台電腦缺什麼（見下方「環境條件」），缺的會一項一項問你要不要安裝，**輸入 `y` 才會裝**。
3. 如果它說剛裝完的 Node.js、FFmpeg、HyperFrames 要「關掉視窗重開」，照做，再雙擊一次 `一鍵安裝.cmd`。
4. 看最後的**環境檢查**與**自我檢測**：沒有 ✗ 且出現「自我檢測通過」就完成了。
5. **把 Claude 完全關掉再重開**，新開對話，說：

   > 老馬的全能剪輯助手，幫我把這支口播做成影片：（貼上影片路徑）

## 環境條件

「**一鍵安裝**」那欄寫「會問你」的，是缺了就會問你要不要幫你裝；寫「手動」的，程式只能告訴你怎麼做。

| 項目 | 要求 | 怎麼檢查 | 一鍵安裝 | 手動安裝 |
|---|---|---|---|---|
| 作業系統 | Windows 10 或 11 | 設定 → 系統 → 關於 | 不處理（其他系統不支援） | — |
| **Claude** | 團隊版帳號、桌面版 | 能開啟並登入 | 手動 | 向管理者索取帳號 |
| **顯示卡** | NVIDIA **RTX 4070 或 5070（12 GB）**；5070 已實機驗證，**4070 尚未實機驗證** | 命令提示字元執行 `nvidia-smi` | 手動 | — |
| **顯示卡驅動** | **570 以上**（5070 必須） | `nvidia-smi` 看 Driver Version | 手動 | https://www.nvidia.com/drivers |
| Python | 3.10～3.12（建議 3.11） | `python --version` | 找不到時會問你用 winget 裝 | https://www.python.org/downloads/（勾選 Add to PATH） |
| Node.js | 18 以上 | `node --version` | 會問你（winget，約 30 MB） | https://nodejs.org/ |
| FFmpeg | 完整版，ffmpeg 與 ffprobe 都在 PATH | `ffmpeg -version` | 會問你（winget，約 100 MB） | https://www.gyan.dev/ffmpeg/builds/ |
| Google Chrome | 渲染與開 HyperFrames 預覽用 | 能開啟 | 會問你（winget，約 100 MB） | https://www.google.com/chrome/ |
| HyperFrames | 驗證過 **0.8.181** | `hyperframes --version` | 會問你（npm） | `npm install -g hyperframes@0.8.181` |
| Python 套件 | 語音辨識、顯示卡運算函式庫等 | 一鍵安裝會逐項檢查 | 會問你（PyPI，**約 1～1.5 GB，概估**） | `python -m pip install -r env\requirements.txt` |
| 字型 Noto Sans TC | 成片字型 | 一鍵安裝會檢查 | 會問你（用技能內建的字型，不用下載） | 雙擊技能內 `themes\general\assets\NotoSansTC-VF.ttf` 安裝 |
| Whisper 語音模型 | large-v3，約 3 GB（選用，可跳過） | 一鍵安裝會檢查 | 會問你（Hugging Face）；跳過的話第一次轉錄會自動下載 | — |
| Gemini API 金鑰 | **只有 AI 旁白需要**，向管理者索取 | 環境檢查會顯示 | 手動（見「第一次使用」） | — |
| 硬碟空間 | 建議預留 10 GB 以上 | — | — | — |
| 網路 | 安裝、第一次轉錄、AI 旁白需要 | — | — | — |
| **Codex** | **不需要**（12 個主題的素材已內建）；只有管理者新增全新主題時才用 | — | 不處理 | — |

## 安裝流程詳解

`一鍵安裝.cmd` 依序做三件事：

**① 環境檢查與安裝（`env\setup_env.py`）**
畫面會列出每一項是 ✓ 還是 ✗，例如：

```
✓ Node.js（18 以上）：v24.16.0
✗ Python 套件：缺：nvidia-cublas-cu12、nvidia-cudnn-cu12
✓ NVIDIA 顯示卡：NVIDIA GeForce RTX 5070，驅動 610.88
```

缺的項目會說明「要裝什麼、來源、大概多大」，然後問 `現在安裝嗎？(y/N)`。直接按 Enter＝不裝，輸入 `y`＝安裝。所有下載都來自官方來源（微軟 winget、npm、PyPI、Hugging Face）。**NVIDIA 顯示卡與驅動、Python 本身、Claude 帳號、Gemini 金鑰無法代勞**，只會告訴你怎麼做。

**② 安裝技能（`env\install.py --permissions`）**
把技能複製到 `%USERPROFILE%\.claude\skills\laoma-omni-editor`，並把這個流程會用到的指令「預先核准」寫進 Claude 設定（原有設定保留，舊檔備份成 `settings.json.bak_laoma`，重跑不會重複）。預先核准**只涵蓋**技能資料夾內的程式、`hyperframes check／snapshot／render／preview`、在 Chrome 開預覽、`ffprobe`、讀寫名稱含「口播專案_」的資料夾；**pip 安裝、下載、刪除檔案、其他指令仍會詢問**。

**③ 環境檢查與自我檢測**
用程式合成的測試片，把橫式、直式三種版型、兩個領域主題各建置並品檢一次（約 1～2 分鐘，不連外部服務）。看到「**自我檢測通過**」代表整條工具鏈在這台電腦上是通的。

## 第一次使用

在 Claude 新開對話：

| 你要做的事 | 這樣說 |
|---|---|
| 把口播影片做成長影音 | 老馬的全能剪輯助手，幫我把這支口播做成影片：`D:\影片\訪談.mp4` |
| 做短影音（Shorts／Reels／抖音） | 老馬的全能剪輯助手，把這支做成 9:16 短影音：`D:\影片\訪談.mp4` |
| 只有文字稿，要 AI 旁白 | 老馬的全能剪輯助手，用這篇稿做 AI 旁白影片：（貼上稿子） |
| 指定風格 | 用健康醫療的版型／改成滿版／圖解大一點 |

Claude 會先一次問你：版面、片名、主持人姓名與身分、專有名詞、內容是否還沒公開。之後自己跑，**只在三個關卡停下來問你**：

1. **逐字稿確認**：有沒有聽錯的字（人名、專有名詞最容易錯，請照影片確認）；訪談中記者的提問可以請它刪掉。
2. **版面確認**：每段要配什麼圖解與標題，用白話列給你。
3. **草稿確認**：約 1 分鐘出草稿給你看，說「可以」才出最終版。

**AI 旁白第一次使用**會提醒你設定 Gemini 金鑰：向管理者索取金鑰 → 自己在命令提示字元執行 `python -X utf8 "<技能資料夾>\core\gemini_key.py" save` 貼上（輸入時看不到字）→ 把 Claude 完全關掉再重開。這台電腦就會永久記住，以後不用再輸入。金鑰不要貼進對話。

成片**要由主管審核後才能上架**；Claude 不會發布或外寄任何東西。完整說明看 [使用手冊](使用手冊.md)。

## 更新與解除安裝

- **更新**：下載新版 ZIP，重跑 `一鍵安裝.cmd`（只覆蓋同名檔，不動你的專案）。若這台電腦還有舊名稱的 `koubo-video` 技能資料夾，確認新的能用後請刪掉舊的。
- **解除安裝**：刪除 `%USERPROFILE%\.claude\skills\laoma-omni-editor` 資料夾；若要還原 Claude 設定，把 `%USERPROFILE%\.claude\settings.json.bak_laoma` 改名覆蓋 `settings.json`。你的影片專案資料夾不受影響。

## 疑難排解

| 現象 | 怎麼辦 |
|---|---|
| 一鍵安裝說 Python 找不到 | 安裝 Python 3.11，**安裝時勾選 Add python.exe to PATH**，重開視窗再執行 |
| 剛裝完 Node／FFmpeg／HyperFrames 卻說找不到 | 關掉命令提示字元視窗重開，再執行一次 |
| 說「主題素材不完整」 | 下載的 ZIP 不完整，重新下載整包再安裝；**不需要也不要用 Codex 補** |
| 轉錄說找不到 GPU 或 CUDA | 顯示卡驅動需 570 以上；重跑一鍵安裝補齊 Python 套件 |
| Claude 一直問「是否允許」 | 安裝時沒做預先核准：重跑 `一鍵安裝.cmd`；仍跳出來就回覆「允許」並告訴管理者是哪條指令 |
| 說「找不到老馬的全能剪輯助手」 | 把 Claude 完全關掉再重開；仍不行，確認 `%USERPROFILE%\.claude\skills\laoma-omni-editor\SKILL.md` 存在 |
| 渲染很久 | 先看約 1 分鐘的草稿；iPhone HDR 影片會自動轉檔，長片本來就久 |
| 預覽網頁沒開 | 告訴 Claude，它會給網址（通常是 `http://localhost:3002`），貼進 Chrome |
| 其他問題 | 執行 `python -X utf8 env\doctor.py` 與 `python -X utf8 env\selftest.py`，把輸出給管理者 |

## 文件與目錄

- [使用手冊.md](使用手冊.md)：完整操作、關卡、時間參考、AI 旁白、領域主題、常見問題
- [限制與注意事項.md](限制與注意事項.md)：做不到什麼、哪些尚未驗證、隱私與授權
- [安裝說明.md](安裝說明.md)：給維護者的安裝、更新、發佈細節
- [效果選用機制說明.md](效果選用機制說明.md)、[catalog/移植評估.md](catalog/移植評估.md)：技術說明
- [CHANGELOG.md](CHANGELOG.md)、[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)

| 路徑 | 內容 |
|---|---|
| `SKILL.md` | 給 Claude 讀的技能本體（流程、規則、白話對照） |
| `一鍵安裝.cmd` | 雙擊即可：環境檢查與安裝 → 安裝技能 → 自我檢測 |
| `core/` | 建置核心：轉錄、剪輯表、圖解選用、建置（橫式 `template.html`／`core_head.js`；直式 `template_v.html`／`core_head_v.js`）、AI 旁白 `tts_gemini.py` |
| `catalog/` | 動態效果圖鑑與已移植效果（`fx/`）、驗證用比對頁 |
| `themes/`、`packs/` | 12 個領域主題的素材與設定、氣象領域包 |
| `env/` | `setup_env.py` 環境安裝、`install.py` 技能安裝、`doctor.py` 環境檢查、`selftest.py` 自我檢測、`requirements.txt` |
| `tools/` | 主題定義與素材生成（Codex，只有管理者用）、圖鑑移植與核對工具、打包工具 |

## 狀態與授權

最新版本見 `VERSION` 與 `CHANGELOG.md`。已用橫式、直式、HDR、AI 旁白、12 個領域主題實測。**尚未驗證**：不熟 Claude 的真人試用、RTX 4070 實機、環境安裝程式在「全新電腦」上的實際安裝動作（偵測與詢問流程已測，winget／npm／pip 的安裝動作未在乾淨電腦上跑過），詳見「限制與注意事項」。

本倉庫**未附授權條款（保留所有權利）**：歡迎下載並依手冊安裝使用，但未經許可請勿轉發、修改後散布或做為商業用途。第三方元件的授權見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。主題素材含「中時新聞網」標誌與設計元素，屬公司所有，不得用於公司以外的用途。
