"""建立新口播專案的 project.json 骨架（無領域包的通用模式）。
用法：python -X utf8 init_project.py <專案資料夾> --video <口播影片，相對專案資料夾或絕對> --title 片名 --speaker 姓名 --role 身分
      [--series 系列名] [--opener 開場標題] [--opener-sub 開場副標] [--end2 片尾一行] [--end3 片尾二行] [--pack weather]
流程：init_project → transcribe（逐字稿）→ edit（剪輯表）→ plan propose → Agent 精修 plan.json → plan apply → build"""
import argparse, datetime, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import project as P

ap = argparse.ArgumentParser()
ap.add_argument("pdir")
ap.add_argument("--video", required=True)
ap.add_argument("--title", required=True)
ap.add_argument("--speaker", required=True)
ap.add_argument("--role", required=True)
ap.add_argument("--series", default="")
ap.add_argument("--opener", default="")
ap.add_argument("--opener-sub", default="")
ap.add_argument("--end2", default="")
ap.add_argument("--end3", default="")
ap.add_argument("--pack", default=None)
ap.add_argument("--aspect", default="16:9", choices=["16:9", "9:16"], help="16:9 長影音（橫式）或 9:16 短影音（直式）")
ap.add_argument("--layout", default="twothird", choices=["twothird", "full", "half"], help="9:16 直式版型：twothird 上三分之二（預設）、full 滿版、half 上二分之一；16:9 不適用")
ap.add_argument("--theme", default="auto", help="weather／finance／society／general，auto＝plan.py propose 時依逐字稿判斷")
ap.add_argument("--glossary", default="")
ap.add_argument("--force", action="store_true", help="資料夾已有專案時仍覆寫 project.json（舊檔會混進新結果，通常該改用新資料夾）")
a = ap.parse_args()

pdir = os.path.abspath(a.pdir)
if os.path.exists(os.path.join(pdir, "project.json")) and not a.force:
    sys.exit(f"這個資料夾已經有一個口播專案：{pdir}\n請改用新的資料夾名稱（例如結尾改 _V02），以免舊檔混進新成品；確定要覆寫才加 --force。")
for d in ("01_素材", "02_字幕", "03_HyperFrames", "04_成品", "analysis"):
    os.makedirs(os.path.join(pdir, d), exist_ok=True)
p = dict(
    schema="koubo/1",
    meta=dict(id=os.path.basename(pdir), title=a.title, domain_pack=a.pack, theme=a.theme, aspect=a.aspect, **({"layout": a.layout} if a.aspect == "9:16" else {}), version="V01", outro=3.0, created=datetime.date.today().isoformat()),
    source=dict(video=a.video, script=None, edited="01_素材/口播素材_剪後.mp4"),
    speaker=dict(name=a.speaker, title=a.role),
    branding=dict(series=a.series or a.title, opener=a.opener or a.title, opener_sub=a.opener_sub, end2=a.end2, end3=a.end3),
    outputs_dir=dict(srt="02_字幕/字幕.srt"),
    edit=dict(alignment="02_字幕/逐字稿_初版.json", pre=0.10, post=0.22, gap=0.55, overrides={}, text_fix={}, verified=[]),
    glossary=[g for g in a.glossary.split(",") if g],
    pieces=[], lines=[],
    assets=[],
    scenes=[],
    audio=dict(voice_chain="standard_v2", target_lufs=-12, true_peak=-3, bgm=dict(bpm=92, cues=[])),
)
P.save(pdir, p)
print("project.json 已建立：", pdir)
