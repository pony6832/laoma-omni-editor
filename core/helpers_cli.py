"""給技能流程用的三個小工具（讓同事端的 Claude 不必手算或手改檔案）。
  python -X utf8 helpers_cli.py transcript <專案>                 印出完整逐字稿「句號｜成片時間｜文字」
  python -X utf8 helpers_cli.py times      <專案>                 印出每個場景的成片起訖時間，並給一串可直接用在 hyperframes snapshot --at 的時間點
  python -X utf8 helpers_cli.py fixtext    <專案> <句號> <新文字>   改某一句的字幕文字（寫進 edit.text_fix 並重算剪輯表）
  python -X utf8 helpers_cli.py drop       <專案> <句號> …         刪掉不要的句子（如記者提問），刪完句號重新編號
  python -X utf8 helpers_cli.py brand     <專案> 欄位=值 …         改系列名／開場標題等（series、opener、opener_sub、end2、end3）"""
import os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import project as P
import edit


def transcript(pdir):
    p = P.load(pdir)
    tl, _, dur = P.timeline(p)
    print(f"共 {len(tl)} 句，成片 {dur:.0f} 秒")
    for l in tl:
        print(f"{l['n']:>3}｜{l['t0']:6.1f}–{l['t1']:6.1f}｜{l['text']}")


def times(pdir):
    p = P.load(pdir)
    tl, _, dur = P.timeline(p)
    by = {l["n"]: l for l in tl}
    ats = []
    print("場景｜句號｜成片起訖（秒）｜中間點")
    for s in p.get("scenes", []):
        if not s.get("template") or s.get("from") is None:
            continue
        a, b = s["from"], s.get("to", s["from"])
        t0, t1 = by[a]["t0"], by[b]["t1"]
        mid = round((t0 + t1) / 2 + 0.5, 1)  # 取比正中間稍晚一點，確保內容都已出現
        ats.append(mid)
        print(f"{s['template']}｜{a}–{b}｜{t0:.1f}–{t1:.1f}｜{mid}")
    ats = sorted(set(ats + [round(min(2.0, dur / 2), 1)]))
    print("\nsnapshot 用的時間點（含開場標題 2 秒）：" + ",".join(str(x) for x in ats))


def fixtext(pdir, n, text):
    p = P.load(pdir)
    n = int(n)
    if not 1 <= n <= len(p["lines"]):
        sys.exit(f"沒有第 {n} 句（共 {len(p['lines'])} 句）")
    old = p["lines"][n - 1]["text"]
    p["edit"].setdefault("text_fix", {})[str(p["lines"][n - 1].get("orig", n))] = text  # text_fix 以原始句號為鍵
    P.save(pdir, p)
    edit.run(pdir, report=False)
    print(f"第 {n} 句：「{old}」→「{text}」（已重算剪輯表；若已做過圖解選用，請重跑 pick_effects check）")


def drop(pdir, ns):
    """刪掉不要的句子（例如記者提問）；句號用目前逐字稿上看到的號碼，刪完會重新編號。"""
    p = P.load(pdir)
    ns = [int(x) for x in ns]
    bad = [n for n in ns if not 1 <= n <= len(p["lines"])]
    if bad:
        sys.exit(f"沒有第 {bad} 句（共 {len(p['lines'])} 句）")
    d = p["edit"].setdefault("drop", [])
    d.extend(p["lines"][n - 1].get("orig", n) for n in ns)
    p["edit"]["drop"] = sorted(set(d))
    P.save(pdir, p)
    edit.run(pdir, report=False)
    print(f"已刪除 {len(ns)} 句，句號已重新編號；請重新印逐字稿確認，並重跑 pick_effects prepare。")


def brand(pdir, pairs):
    p = P.load(pdir)
    ok = ("series", "opener", "opener_sub", "end2", "end3")
    for kv in pairs:
        k, _, v = kv.partition("=")
        if k not in ok:
            sys.exit(f"不認得的欄位「{k}」，可用：{', '.join(ok)}")
        p["branding"][k] = v
    P.save(pdir, p)
    print("已更新：", {k: p["branding"][k] for k in ok})


if __name__ == "__main__":
    cmd = sys.argv[1]
    pd = os.path.abspath(sys.argv[2])
    {"transcript": lambda: transcript(pd), "times": lambda: times(pd), "fixtext": lambda: fixtext(pd, sys.argv[3], sys.argv[4]), "brand": lambda: brand(pd, sys.argv[3:]), "drop": lambda: drop(pd, sys.argv[3:])}[cmd]()
