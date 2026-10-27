"""內容分析 → 通用範本配對（無領域包時使用）。
  python -X utf8 plan.py propose <專案資料夾>   讀 project.json 的 lines，寫出 plan.json（分段＋建議範本＋參數草稿）
  python -X utf8 plan.py apply   <專案資料夾>   把（可能已由 Agent 精修過的）plan.json 寫成 project.json 的 scenes 與音效 cues
propose 只用規則做粗分：清單（第一／第二…）、數字（小時、％…）、前後對照（以前／現在）、引言（常說／表示）、其餘當重點字卡。
關鍵詞、數字說明這類需要理解語意的欄位會標 needs_llm=true，由 Agent 讀逐字稿後直接改 plan.json 再 apply。
行號一律是 project.json lines 的 n（絕對），apply 時換成相對場景起點。"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import project as P

ORD = re.compile(r"^(第[一二三四五六七八九十\d]+|首先|其次|接著|再來|最後)[，,、\s]*")
CN = {"零": 0, "一": 1, "二": 2, "兩": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9}
UNITS = "小時|分鐘|秒|天|週|年|歲|公里|公尺|公斤|度|倍|元|萬|億|人|次|個月|%|％"
NUMRE = re.compile(rf"(百分之)?((?:\d+(?:\.\d+)?)|(?:[一二兩三四五六七八九十百]+))(?:\s*(?:到|至|~|～|-|－|–|—)\s*((?:\d+(?:\.\d+)?)|(?:[一二兩三四五六七八九十百]+)))?\s*個?\s*({UNITS})?")


def cn2int(s):
    if s.isdigit():
        return int(s)
    if s == "十":
        return 10
    if "十" in s:
        a, b = s.split("十")
        return (CN.get(a, 1) if a else 1) * 10 + (CN.get(b, 0) if b else 0)
    if s == "百":
        return 100
    return CN.get(s, 0) if len(s) == 1 else int("".join(str(CN[c]) for c in s))


def find_number(text):
    """回傳 dict(value|text, unit, span) 或 None。要求有單位或百分之，避免把「第一」「一個」當數字。"""
    for m in NUMRE.finditer(text):
        pct, a, b, unit = m.group(1), m.group(2), m.group(3), m.group(4)
        if not (pct or unit):
            continue
        va = float(a) if re.fullmatch(r"\d+\.\d+", a) else cn2int(a)
        unit = "%" if pct or unit in ("%", "％") else unit
        if b:
            vb = float(b) if re.fullmatch(r"\d+\.\d+", b) else cn2int(b)
            return dict(text=f"{va:g}～{vb:g}", unit=unit, span=m.span())
        return dict(value=va, unit=unit, span=m.span())
    return None


def classify(i, ln, total):
    t = ln["text"]
    if i == 0:
        return "open"
    if i >= total - 2 and re.search(r"追蹤|訂閱|再見|謝謝|下次|關注", t):
        return "close"
    if ORD.match(t):
        return "ord"
    if re.search(r"[「“].+[」”]|常說|表示|指出", t):
        return "quote"
    if re.search(r"^(以前|過去|之前|原本)", t) or re.search(r"[，,](以前|過去|之前|原本)", t):
        return "cmp_a"
    if re.search(r"^(現在|目前|如今|後來)", t):
        return "cmp_b"
    if find_number(t):
        return "num"
    return "plain"


def keyword(text):
    """粗略關鍵詞：去掉開頭語助詞，取第一個子句前 8 字；需 Agent 精修。"""
    c = re.split(r"[，,。？?！!]", text)
    first = next((x for x in c if x.strip()), text)
    first = re.sub(r"^(其實|但是|所以|那麼|那|而且|而|我們來|我們|大家好)", "", first.strip())
    return first[:8]


def detect_theme(text, themes_dir):
    """依各主題 match_keywords 計分：不同關鍵字命中數 ×10＋總出現次數。分數太低或前兩名太接近就退回 general。"""
    scores = {}
    for d in sorted(os.listdir(themes_dir)):
        f = os.path.join(themes_dir, d, "theme.json")
        if d.startswith("_") or not os.path.exists(f):
            continue
        kws = json.load(open(f, encoding="utf-8")).get("match_keywords", [])
        hit = [k for k in kws if k in text]
        scores[d] = len(hit) * 10 + sum(text.count(k) for k in hit)
    rank = sorted(scores.items(), key=lambda x: -x[1])
    best, second = rank[0], (rank[1] if len(rank) > 1 else ("", 0))
    if best[1] < 30 or best[1] < second[1] * 1.5:
        return "general", scores
    return best[0], scores


def propose(pdir):
    p = P.load(pdir)
    if not p["meta"].get("theme") or p["meta"]["theme"] == "auto":
        th, sc = detect_theme(" ".join(l["text"] for l in p["lines"]), os.path.join(HERE, "..", "themes"))
        p["meta"]["theme"] = th
        P.save(pdir, p)
        print("主題自動判斷：", th, sc, "（可在 project.json 的 meta.theme 手動改）")
    TH = json.load(open(os.path.join(HERE, "..", "themes", p["meta"]["theme"], "theme.json"), encoding="utf-8"))
    if TH.get("risk_note"):
        print("【風險提醒】" + TH["risk_note"])   # 高風險領域：要請對方找主管或專家把關
    lines = [dict(n=l["n"], text=l["text"], s=l["src_start"], e=l["src_end"]) for l in p["lines"]]
    N = len(lines)
    kinds = [classify(i, l, N) for i, l in enumerate(lines)]
    groups, i = [], 0
    while i < N:
        k = kinds[i]
        if k in ("open", "close", "quote"):
            groups.append(dict(kind=k, a=i, b=i)); i += 1
        elif k == "ord" or (re.search(r"[一二三四五六七八九十\d]個.{0,6}(方法|習慣|步驟|重點|原因|技巧|建議)", lines[i]["text"]) and i + 1 < N and kinds[i + 1] == "ord"):
            a = i
            if k != "ord":
                i += 1
            while i < N and kinds[i] == "ord":
                i += 1
                if i < N and kinds[i] in ("plain", "num"):  # 每個序號後最多收 1 句說明
                    i += 1
            groups.append(dict(kind="list", a=a, b=i - 1))
        elif k == "cmp_a" and any(kinds[j] == "cmp_b" for j in range(i + 1, min(i + 3, N))):  # 「以前…」後 2 句內出現「現在…」
            b = next(j for j in range(i + 1, min(i + 3, N)) if kinds[j] == "cmp_b")
            groups.append(dict(kind="cmp", a=i, b=b)); i = b + 1
        elif k == "num":
            b = i + 1 if i + 1 < N and kinds[i + 1] == "plain" else i
            groups.append(dict(kind="num", a=i, b=b)); i = b + 1
        else:
            a = i
            i += 1  # 至少前進一句（落單的 cmp_a 之類也當一般敘述）
            while i < N and kinds[i] == "plain" and i - a < 3:
                i += 1
            groups.append(dict(kind="plain", a=a, b=i - 1))
    scenes = []
    for g in groups:
        a, b = g["a"], g["b"]
        seg = lines[a:b + 1]
        sc = dict(lines=[seg[0]["n"], seg[-1]["n"]], text=" ".join(x["text"] for x in seg), kind=g["kind"])
        k = g["kind"]
        if k in ("open", "close"):
            sc.update(template=None, reason="開場／結尾維持口播全屏")
        elif k == "list":
            hdr = [x for x in seg if not ORD.match(x["text"])][:1]
            ords = [x for x in seg if ORD.match(x["text"])]
            rel = lambda n: n - seg[0]["n"] + 1
            sc.update(template="g_list", needs_llm=True, reason="偵測到序號「第一／第二…」",
                      v=dict(topic="重點整理", title=(re.sub(r"^.*?(\d|[一二三四五六七八九十])個", r"\1個", hdr[0]["text"]).rstrip("。") if hdr else "重點整理")[:14],
                             items=[dict(text=ORD.sub("", x["text"]).rstrip("。")[:18], line=rel(x["n"])) for x in ords]))
        elif k == "num":
            f = find_number(seg[0]["text"])
            v = dict(topic="數字重點", label=seg[0]["text"][:f["span"][0]].strip("，, ") or seg[0]["text"][:12], unit=f["unit"], line=1)
            v.update({k2: f[k2] for k2 in ("value", "text") if k2 in f})
            sc.update(template="g_number", needs_llm=True, reason=f"偵測到數字「{seg[0]['text'][f['span'][0]:f['span'][1]]}」", v=v)
            pf = TH.get("prefer", {}).get("g_number")
            if pf and re.search(pf["when"], sc["text"]) and pf["template"] in [x["id"] for x in TH.get("scenes", [])]:
                # 主題偏好：財經的指數／股價數字改用看板（漲跌方向與幅度由文字粗抓，需 Agent 精修）
                txt = sc["text"]
                ch = re.search(r"(上漲|下跌|漲|跌)\D{0,6}?(\d+(?:\.\d+)?)\s*點", txt)
                pc = re.search(r"(\d+(?:\.\d+)?)\s*%", txt)
                nm = re.search(r"(\d+(?:\.\d+)?)", txt[f["span"][0]:f["span"][1]])
                sc.update(template=pf["template"], reason=f"{sc['reason']}；{TH['id']} 主題偏好看板",
                          v=dict(topic="盤勢重點", name="（標的名稱）", value=int(f.get("value", 0)) if "value" in f else None, unit="", line=1,
                                 key=nm.group(1) if nm else "", change=((("+" if ch.group(1) in ("上漲", "漲") else "-") + ch.group(2)) if ch else ""),
                                 pct=(pc.group(1) + "%") if pc else "", dir="down" if ch and ch.group(1) in ("下跌", "跌") else "up"))
        elif k == "cmp":
            sc.update(template="g_compare", needs_llm=True, reason="偵測到「以前／現在」對照",
                      v=dict(topic="前後對照", left=dict(title="以前", items=[re.sub(r"^.*?以前", "", seg[0]["text"])[:18]], line=1), right=dict(title="現在", items=[re.sub(r"^現在", "", seg[-1]["text"])[:18]], line=len(seg))))
        elif k == "quote":
            sc.update(template="g_quote", needs_llm=True, reason="偵測到引述",
                      v=dict(topic="一句話", text=re.sub(r"^.*?(常說|表示|指出)[，,]?", "", seg[0]["text"]).rstrip("。") or seg[0]["text"], by=""))
        else:
            sc.update(template="g_point", needs_llm=True, reason="一般敘述，取首句前段當關鍵詞（需精修）",
                      v=dict(topic="重點", keyword=keyword(seg[0]["text"]), sub=""))
        scenes.append(sc)
    out = dict(note="Agent：needs_llm=true 的場景請讀逐字稿後改寫 v 內的文字；template 可改成 g_point/g_number/g_list/g_compare/g_quote 或 null（口播全屏）。",
               scenes=scenes)
    os.makedirs(os.path.join(pdir, "analysis"), exist_ok=True)
    json.dump(out, open(os.path.join(pdir, "analysis", "plan.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(len(scenes), "場景：", [s["template"] or "talk" for s in scenes])


def apply(pdir):
    p = P.load(pdir)
    plan = json.load(open(os.path.join(pdir, "analysis", "plan.json"), encoding="utf-8"))["scenes"]
    nlines = max(l["n"] for l in p["lines"])
    scenes, cues, mode = [], [], "full"
    for sc in plan:
        a, b = sc["lines"]
        if not sc.get("template"):
            if mode == "split":
                scenes.append(dict(template=None, title="口播全屏", **{"from": a}, mode="full", params={}))
                mode = "full"
            continue
        v = json.loads(json.dumps(sc["v"]))  # v 內的 line 已是相對場景起點（1＝場景第一句）
        v["lines"] = b - a + 1
        entry = dict(template=sc["template"], title=sc.get("title") or sc["template"], **{"from": a}, to=b, params=dict(v=v))
        if mode == "full":
            entry["mode"], mode = "split", "split"
        scenes.append(entry)
        cues.append(dict(k="swish", line=a))
        if sc["template"] == "g_number":
            cues.append(dict(k="hit", line=a + v.get("line", 1) - 1, off=0.2))
        for it in v.get("items", []) + v.get("chips", []):
            cues.append(dict(k="pop", line=a + it["line"] - 1))
    scenes.append(dict(template="OUT", title="片尾", params=dict(t={"鎖定中時新聞網": "鎖定中時新聞網"})))
    p["scenes"] = scenes
    p["audio"]["bgm"]["cues"] = [dict(k="whoosh", t=0.1), dict(k="whoosh", end=-0.2)] + cues
    P.save(pdir, p)
    print("scenes", len(scenes), "cues", len(p["audio"]["bgm"]["cues"]))


if __name__ == "__main__":
    {"propose": propose, "apply": apply}[sys.argv[1]](os.path.abspath(sys.argv[2]))
