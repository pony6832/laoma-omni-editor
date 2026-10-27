"""安裝後自我檢測：用一支程式合成的測試片，從頭跑「建專案 → 剪輯表 → 圖解規劃 → 建置 → HyperFrames 品檢」，16:9 與 9:16 各一次。
不需要真人影片、不轉錄、不呼叫任何外部服務（不送 Google、不下載）；約 1～2 分鐘。
用法：python -X utf8 selftest.py
全部通過會印「自我檢測通過」；任何一項失敗會停下並印出原因（結束碼 1）。"""
import json, os, shutil, subprocess, sys, tempfile

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
CORE = os.path.join(KOUBO, "core")
PY = [sys.executable, "-X", "utf8"]
LINES = ["各位好，今天來聊聊睡眠。", "成年人每天建議睡七到九小時。", "睡不好，白天專注力會下降。", "睡前一小時，先把手機放下來。", "固定起床的時間，身體會更穩定。", "好好睡，一天都好，謝謝大家。"]


def run(cmd, cwd=None, must=True):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    if must and r.returncode != 0:
        raise RuntimeError("指令失敗：" + " ".join(map(str, cmd))[:160] + "\n" + (r.stdout + r.stderr)[-600:])
    return r


def make_video(path, dur):
    run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", f"testsrc2=s=1280x720:r=30:d={dur}", "-f", "lavfi", "-i", f"sine=f=220:d={dur}",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "aac", "-shortest", path])


def one(aspect, tmp):
    name = "橫式" if aspect == "16:9" else "直式"
    pdir = os.path.join(tmp, f"口播專案_自檢_{name}")
    vid = os.path.join(tmp, "測試片.mp4")
    if not os.path.exists(vid):
        make_video(vid, 32)
    run(PY + [os.path.join(CORE, "init_project.py"), pdir, "--video", vid, "--title", "自我檢測", "--speaker", "測試", "--role", "自檢", "--aspect", aspect])
    t, lines = 1.0, []
    for i, s in enumerate(LINES):
        lines.append({"n": i + 1, "s": round(t, 2), "e": round(t + 4.2, 2), "text": s}); t += 5.0
    json.dump({"lines": lines}, open(os.path.join(pdir, "02_字幕", "逐字稿_初版.json"), "w", encoding="utf-8"), ensure_ascii=False)
    run(PY + [os.path.join(CORE, "edit.py"), pdir])
    run(PY + [os.path.join(CORE, "plan.py"), "propose", pdir]); run(PY + [os.path.join(CORE, "plan.py"), "apply", pdir])
    r = run(PY + [os.path.join(CORE, "build.py"), pdir, "--target", "main"])
    main = os.path.join(pdir, "03_HyperFrames", "main")
    hf = shutil.which("hyperframes") or "hyperframes"
    c = run([hf, "check"], cwd=main, must=False)
    out = c.stdout + c.stderr
    if "Check passed" not in out:
        raise RuntimeError("HyperFrames 品檢沒有通過：\n" + out[-800:])
    return f"{name}（{aspect}）：建置與品檢通過"


def main():
    tmp = tempfile.mkdtemp(prefix="laoma_selftest_")
    ok = True
    try:
        for asp in ("16:9", "9:16"):
            try:
                print("✓ " + one(asp, tmp), flush=True)
            except Exception as e:
                ok = False
                print(f"✗ {asp} 失敗：{e}", flush=True)
    finally:
        shutil.rmtree(tmp, ignore_errors=True)
    print("\n自我檢測通過" if ok else "\n自我檢測未通過，請把上面的訊息給管理者。")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
