"""旁白稿對齊 → 剪輯表。讀 project.json 的 edit 參數與對齊檔，寫回 pieces 與 lines（原片秒數）。
用法：python -X utf8 edit.py <專案資料夾>"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import project as P


def run(pdir, report=True):
    p = P.load(pdir)
    ed = p["edit"]
    A = json.load(open(P.resolve(pdir, ed["alignment"]), encoding="utf-8"))["lines"]
    OV = {int(k): v for k, v in ed.get("overrides", {}).items()}
    TXT = {int(k): v for k, v in ed.get("text_fix", {}).items()}
    PRE, POST, GAP = ed["pre"], ed["post"], ed["gap"]
    verified = set(ed.get("verified", []))

    lines = []
    for r in A:
        n = r["n"]
        s, e = OV.get(n, (r["s"], r["e"]))
        lines.append(dict(n=n, text=TXT.get(n, r["text"]), s=s, e=e))

    # 刪句（例如記者提問）：drop 用原始句號；刪完重新編號，後面流程只看到連續的新句號，orig 留原始句號
    DROP = set(ed.get("drop", []))
    lines = [dict(l, orig=l["n"], n=i + 1) for i, l in enumerate(l for l in lines if l["n"] not in DROP)]

    for i in range(1, len(lines)):  # 保證單調且不重疊
        if lines[i]["s"] < lines[i - 1]["e"] - 0.02:
            mid = (lines[i]["s"] + lines[i - 1]["e"]) / 2
            lines[i - 1]["e"], lines[i]["s"] = mid, mid

    pieces = []  # 相鄰句原片間隔 ≤ GAP 就接在同一段
    for ln in lines:
        a, b = ln["s"] - PRE, ln["e"] + POST
        if pieces and ln["s"] - lines[ln["n"] - 2]["e"] <= GAP and ln["s"] >= pieces[-1][1] - POST - 0.05:
            pieces[-1][1] = max(pieces[-1][1], b)
        else:
            pieces.append([max(0, a), b])
    for i in range(1, len(pieces)):
        if pieces[i][0] < pieces[i - 1][1]:
            pieces[i][0] = pieces[i - 1][1]

    p["pieces"] = [dict(id=f"P{i+1:02d}", src_start=a, src_end=b) for i, (a, b) in enumerate(pieces)]
    p["lines"] = [dict(n=l["n"], text=l["text"], src_start=l["s"], src_end=l["e"], verified=l["orig"] in verified, orig=l["orig"]) for l in lines]
    P.save(pdir, p)
    tl, _, dur = P.timeline(p)
    if report:
        print("pieces", len(pieces), "dur", dur)
        for ln in tl:
            n = len(re.sub(r"[^一-鿿A-Za-z0-9]", "", ln["text"]))
            d = ln["e"] - ln["s"]
            flag = "  <-- 檢查" if d / max(n, 1) > 0.5 or d / max(n, 1) < 0.08 else ""
            print(f"{ln['n']:3d} src {ln['s']:6.1f}-{ln['e']:6.1f} t {ln['t0']:6.1f}-{ln['t1']:6.1f} {ln['text'][:14]}{flag}")
    return p


if __name__ == "__main__":
    run(sys.argv[1])
