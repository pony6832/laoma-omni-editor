"""專案狀態檔（project.json）讀寫與時間換算。所有儲存的時間都是原片秒數，成片時間由這裡換算。"""
import json, os, subprocess

# shortcut: 用 hable 色調對應，色彩只求自然不求影視級調色；要更精準再改 3D LUT
SDR_CHAIN = ("zscale=t=linear:npl=1000,format=gbrpf32le,zscale=p=bt709,tonemap=tonemap=hable:desat=0,"
             "zscale=t=bt709:m=bt709:r=tv,format=yuv420p")


def is_hdr(path):
    """iPhone 等 HDR（HLG／PQ）影片：渲染器會走很慢的 HDR 模式，成片也變 HDR。"""
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=color_transfer", "-of", "csv=p=0", path],
                       capture_output=True, text=True)
    return r.stdout.strip().strip(",") in ("arib-std-b67", "smpte2084")  # ffprobe 輸出尾端帶逗號


def load(pdir):
    return json.load(open(os.path.join(pdir, "project.json"), encoding="utf-8"))


def save(pdir, p):
    """頂層鍵一行一個，陣列內物件一行一個，方便人讀與比對。"""
    out = []
    for k, v in p.items():
        if isinstance(v, list) and v and isinstance(v[0], (dict, list)):
            body = ",\n".join("  " + json.dumps(x, ensure_ascii=False) for x in v)
            out.append(f'"{k}": [\n{body}\n]')
        else:
            out.append(f'"{k}": {json.dumps(v, ensure_ascii=False)}')
    open(os.path.join(pdir, "project.json"), "w", encoding="utf-8").write("{\n" + ",\n".join(out) + "\n}\n")


def resolve(pdir, path):
    return path if os.path.isabs(path) else os.path.normpath(os.path.join(pdir, path))


def timeline(p):
    """回傳 (lines 含成片時間 t0/t1, 各段成片起點 offsets, 成片時長 dur)。"""
    pieces = [(x["src_start"], x["src_end"]) for x in p["pieces"]]
    off, acc = [], 0.0
    for a, b in pieces:
        off.append(acc)
        acc += b - a

    def T(s):
        for (a, b), o in zip(pieces, off):
            if a - 0.01 <= s <= b + 0.01:
                return o + (s - a)
        raise ValueError(f"原片 {s}s 不在任何片段內")

    lines = [dict(n=l["n"], text=l["text"], s=l["src_start"], e=l["src_end"],
                  t0=round(T(l["src_start"]), 3), t1=round(T(l["src_end"]), 3)) for l in p["lines"]]
    return lines, off, round(acc, 2)


def validate(p):
    """回傳問題清單；有 error 開頭的不得建置，warn 開頭的只提醒。"""
    errs = []
    if p.get("schema") != "koubo/1":
        errs.append("error: schema 必須是 koubo/1")
    for k in ("meta", "source", "pieces", "lines"):
        if k not in p:
            errs.append(f"error: 缺少 {k}")
    if errs:
        return errs
    prev = 0.0
    for x in p["pieces"]:
        if x["src_end"] <= x["src_start"] or x["src_start"] < prev - 1e-9:
            errs.append(f"error: 片段 {x.get('id')} 時間不連續或重疊")
        prev = x["src_end"]
    unv = [l["n"] for l in p["lines"] if not l.get("verified")]
    if unv:
        errs.append(f"warn: {len(unv)} 行字幕尚未校對（verified=false），交付前須確認：{unv[:10]}…")
    return errs
