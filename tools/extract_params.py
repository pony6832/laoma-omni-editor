"""一次性：把氣象包場景範本裡的「內容」抽成 params，寫進 project.json 的 scenes[].params。
範本改成讀 P（t 文字、g 地圖座標、r 縣市清單、n 數字）；錨點關鍵字（tw/te 的第二個參數）存在 params.anchors，由建置時的包裝處理。
抽出的值就是原本寫在程式裡的值，所以重新建置後動畫完全相同。
用法：python -X utf8 extract_params.py <專案資料夾>      （跑第二次會因為已無字面量而什麼都不改）"""
import json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, "..", "core"))
import project as P

PACK = os.path.join(HERE, "..", "packs", "weather")
pdir = os.path.abspath(sys.argv[1])
CJK = r"[一-鿿]"
NUM = r"-?\d+(?:\.\d+)?"


def in_geo(lon, lat):
    return 100 <= lon <= 150 and 10 <= lat <= 45


def balanced(s, i):
    """s[i]=='[' 起算的配對中括號結尾 index（不處理字串內括號；場景範本內不會出現）。"""
    d = 0
    for j in range(i, len(s)):
        d += (s[j] == "[") - (s[j] == "]")
        if d == 0:
            return j
    return -1


def extract(code, prm):
    """回傳改寫後程式碼；prm 為 {t,g,r,n,anchors,_ctx}。"""
    ctx = lambda k, pos: prm["_ctx"].__setitem__(k, code[max(0, code.rfind("\n", 0, pos) + 1):code.find("\n", pos)].strip()[:70])
    cnt = {"r": 0, "path": 0, "pt": 0, "bignum": 0, "d": 0}

    def put(kind, group, val, pos):
        for k, v in prm[group].items():  # 同值共用同一個鍵
            if v == val and k.startswith(kind):
                return k
        cnt[kind] += 1
        k = f"{kind}{cnt[kind]}"
        prm[group][k] = val
        ctx(k, pos)
        return k

    # 1) 縣市清單
    pat = re.compile(r'\[\s*"[^"\n]*[縣市]"(?:\s*,\s*"[^"\n]*[縣市]")*\s*\]')
    out, last = [], 0
    for m in pat.finditer(code):
        k = put("r", "r", json.loads(m.group(0)), m.start())
        out += [code[last:m.start()], f'P.r["{k}"]']
        last = m.end()
    code = "".join(out) + code[last:]

    # 2) 純數字經緯度路徑 [[lon,lat],...]
    out, last, i = [], 0, 0
    while True:
        i = code.find("[[", i)
        if i < 0:
            break
        j = balanced(code, i)
        try:
            v = json.loads(code[i:j + 1])
            ok = isinstance(v, list) and len(v) >= 2 and all(isinstance(p, list) and len(p) == 2 and all(isinstance(x, (int, float)) for x in p) and in_geo(*p) for p in v)
        except Exception:
            ok = False
        if ok:
            k = put("path", "g", v, i)
            out += [code[last:i], f'P.g["{k}"]']
            last, i = j + 1, j + 1
        else:
            i += 2
    code = "".join(out) + code[last:]

    # 3) 單點座標：X.P(lon, lat)、putAt(M, T, lon, lat)、「"標籤", lon, lat」列
    def pt(m, fmt):
        lon, lat = float(m.group(2)), float(m.group(3))
        if not in_geo(lon, lat):
            return m.group(0)
        raw = [json.loads(m.group(2)), json.loads(m.group(3))]
        k = put("pt", "g", raw, m.start())
        return {"P": f'{m.group(1)}.P(...P.g["{k}"])', "put": f'{m.group(1)}...P.g["{k}"])', "row": f'{m.group(1)}, ...P.g["{k}"]'}[fmt]

    code = re.sub(rf"(\b\w+)\.P\(\s*({NUM})\s*,\s*({NUM})\s*\)", lambda m: pt(m, "P"), code)
    code = re.sub(rf"(\bputAt\(\s*\w+\s*,\s*\w+\s*,\s*)({NUM})\s*,\s*({NUM})\s*\)", lambda m: pt(m, "put"), code)
    code = re.sub(rf'("[^"\n]*{CJK}[^"\n]*"),\s*({NUM}),\s*({NUM})(?=\s*,\s*"[^"\n]*{CJK})', lambda m: pt(m, "row"), code)

    # 4) 數字：bignum 的起訖值、「"標籤", 溫度, 版面數字, "#色」資料列
    def bn(m):
        k = put("bignum", "n", [int(m.group(2)), int(m.group(3))], m.start())
        return f'{m.group(1)}...P.n["{k}"],'
    code = re.sub(r'(\bbignum\([^,\n]+,[^,\n]+,[^,\n]+,[^,\n]+,)\s*(\d+),\s*(\d+),', bn, code)

    def dr(m):
        k = put("d", "n", int(m.group(2)), m.start())
        return f'{m.group(1)}, P.n["{k}"], {m.group(3)}, "#'
    code = re.sub(rf'("[^"\n]*{CJK}[^"\n]*"),\s*(\d{{2}}),\s*(\d+),\s*"#', dr, code)

    # 5) 錨點關鍵字（tw/te 第二個參數）：只登記，不改程式
    for m in re.finditer(r'\b(?:tw|te)\(\s*\d+\s*,\s*"([^"\n]*)"', code):
        prm["anchors"][m.group(1)] = m.group(1)

    # 6) 其餘含中文的字串＝顯示文字
    out, i, n = [], 0, len(code)
    while i < n:
        c = code[i]
        if code.startswith("//", i):
            j = code.find("\n", i)
            j = n if j < 0 else j
            out.append(code[i:j]); i = j
        elif code.startswith("/*", i):
            j = code.find("*/", i) + 2
            out.append(code[i:j]); i = j
        elif c in "\"'`":
            j = i + 1
            while code[j] != c:
                j += 2 if code[j] == "\\" else 1
            s = code[i:j + 1]
            body = s[1:-1]
            before = code[:i].rstrip()
            after = code[j + 1:].lstrip()
            anchor = re.search(r"\b(tw|te)\(\s*\d+\s*,\s*$", code[:i]) is not None
            is_key = after.startswith(":") and before[-1:] in "{,"
            if re.search(CJK, body) and c == '"' and "\\" not in body and not anchor and not is_key:
                prm["t"][body] = body
                s = f"P.t[{json.dumps(body, ensure_ascii=False)}]"
            out.append(s); i = j + 1
        else:
            out.append(c); i += 1
    return "".join(out)


proj = P.load(pdir)
pk = json.load(open(os.path.join(PACK, "pack.json"), encoding="utf-8"))
files = {s["id"]: s["file"] for s in pk["scenes"]}
for sc in proj["scenes"]:
    f = os.path.join(PACK, files[sc["template"]])
    txt = open(f, encoding="utf-8").read()
    NL = chr(10)
    l0, l1, l2, rest = txt.split(NL, 3)  # 兩行註解＋defScene(...) 開頭不處理
    prm = dict(t={}, g={}, r={}, n={}, anchors={}, _ctx={})
    open(f, "w", encoding="utf-8").write(NL.join([l0, l1, l2, extract(rest, prm)]))
    sc["params"] = {k: v for k, v in prm.items() if v}
    print(sc["id"], {k: len(v) for k, v in prm.items()})
P.save(pdir, proj)
