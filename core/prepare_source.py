"""丟入影片後先檢查格式：iPhone 等 HDR 影片會讓渲染慢十幾倍、成片變 HDR，所以先轉成一般格式（H.264／SDR）再往下做。
用法：python -X utf8 prepare_source.py <專案資料夾> [--check]
  --check  只偵測、不轉檔（印出是否需要轉，以及預估時間）
轉好的檔案放 01_素材/原片_SDR.mp4，project.json 的 source.video 改指向它（原檔路徑留在 source.original）；不動原始檔。"""
import argparse, os, subprocess, sys, time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import project as P

ap = argparse.ArgumentParser()
ap.add_argument("pdir")
ap.add_argument("--check", action="store_true")
a = ap.parse_args()
pdir = os.path.abspath(a.pdir)
p = P.load(pdir)
src = P.resolve(pdir, p["source"]["video"])

if not P.is_hdr(src):
    print("這支影片是一般格式，不需要轉檔。")
    sys.exit(0)

dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", src],
                           capture_output=True, text=True).stdout.strip().strip(",") or 0)
est = max(10, int(dur * 0.5))  # 5070 實測：55 秒的片轉檔 19 秒（約 0.35 倍），留些餘裕
print(f"這是 HDR 影片（iPhone 常見），直接做會讓渲染慢十幾倍、色彩也可能跑掉。"
      f"{'需要先轉成一般格式，' if a.check else '正在轉成一般格式，'}{dur:.0f} 秒的片預估約 {est} 秒。")
if a.check:
    sys.exit(0)

out = os.path.join(pdir, "01_素材", "原片_SDR.mp4")
os.makedirs(os.path.dirname(out), exist_ok=True)
t0 = time.time()
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", src, "-vf", P.SDR_CHAIN,
                "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-pix_fmt", "yuv420p", "-g", "30", "-keyint_min", "30",
                "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
                "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", out], check=True)
p["source"].setdefault("original", p["source"]["video"])
p["source"]["video"] = os.path.relpath(out, pdir).replace("\\", "/")
P.save(pdir, p)
print(f"已轉好（{time.time() - t0:.0f} 秒）：{p['source']['video']}；後面的轉錄與製作都用這個檔，原始檔沒動。")
