"""半自動移植圖鑑效果：把圖鑑 HTML 裡 DRAW[id] 的繪圖指令「逐字」搬進 catalog/fx/<id>.js，只做三件機械式改動——
  1) 共用輔助函式（clear、scene、TR、顏色、緩動…）改由 K（fxHelpers）提供，底色與主題色可換、可透明；
  2) 示範用文字（含中文或連續大寫字母的單引號字串）抽成參數 P.T[i]，預設值＝原版；
  3) 字型 Unbounded／Noto Sans TC／JetBrains Mono 抽成 P.numFont／P.font／P.mono，預設值＝原版。
其餘（包含原版的 t%T 循環與所有數字）完全照抄，所以預設參數下一定與原版逐像素相同；仍以 _compare.html 逐像素驗證。
不純的效果（Math.random、累積狀態、離屏快取、疊層 LY／GRV）不處理，會列在輸出裡。
用法：python -X utf8 port_effects.py <id> [<id>…]      或      --cats "數據圖表,轉場 UI,文字標題"（自動挑出該類尚未移植、且純函式的）"""
import json, os, re, sys

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
CAT = os.path.join(KOUBO, "catalog")
HTML = os.path.join(os.path.expanduser("~"), ".claude", "skills", "short-video-motion-matcher", "reference", "動態效果圖鑑.html")
cat = {e["id"]: e for e in json.load(open(os.path.join(CAT, "catalog.json"), encoding="utf-8"))["effects"]}
mp = json.load(open(os.path.join(CAT, "effect_map.json"), encoding="utf-8"))

h = open(HTML, encoding="utf-8").read()
S = h[h.find("/* ---------- drawing ---------- */"):h.find("/* ---------- runtime ---------- */")]
D = S[S.find("const DRAW={") + 12:]
starts = [(m.start(), m.group(1), m.group(2)) for m in re.finditer(r"(?m)^([a-zA-Z0-9_]+)\(([^)]*)\)\{", D)]
BODY = {}
for i, (s, k, sig) in enumerate(starts):
    e = starts[i + 1][0] if i + 1 < len(starts) else len(D)
    BODY[k] = (sig, D[s:e])

HELP = ["rgb", "mix", "cl", "eOC", "eOB", "eIO", "rr", "rnd", "heart", "uiBg", "uiCard", "uiText", "uiCursor", "UI_LT", "UI_INK", "UI_B", "UI_G"]  # 解構取用的輔助函式（用到才宣告）
SKIP_PAT = {"random": r"Math\.random", "state": r"\bst\b[.\[]|\bS\.st", "off": r"\boff\(", "LY": r"\bLY\(", "GRV": r"\bGRV\(", "clock": r"\bDate\b|performance\.now"}
CSS_LIKE = re.compile(r"\d+px|rgba?\(|#[0-9A-Fa-f]{3,8}|^[a-z\-]+$")


def impure(b):
    return [k for k, p in SKIP_PAT.items() if re.search(p, b)]


def scan(inner):
    """逐段掃描：回傳 (新程式碼, 文字參數清單)。單引號／雙引號字串中含中文或連續大寫字母者換成 P.T[i]；反引號字串內換字型。"""
    out, T, i, n = [], [], 0, len(inner)
    while i < n:
        c = inner[i]
        if inner.startswith("//", i):
            j = inner.find("\n", i); j = n if j < 0 else j; out.append(inner[i:j]); i = j
        elif inner.startswith("/*", i):
            j = inner.find("*/", i) + 2; out.append(inner[i:j]); i = j
        elif c == "`":
            j = i + 1
            while inner[j] != "`":
                j += 2 if inner[j] == "\\" else 1
            s = inner[i:j + 1]
            s = s.replace("Unbounded,sans-serif", "${P.numFont}").replace('"Noto Sans TC"', "${P.font}").replace('"JetBrains Mono",monospace', "${P.mono}")
            out.append(s); i = j + 1
        elif c in "'\"":
            j = i + 1
            while inner[j] != c:
                j += 2 if inner[j] == "\\" else 1
            body = inner[i + 1:j]
            if ("\\" not in body and (re.search(r"[一-鿿]", body) or re.search(r"[A-Z]{2,}", body)) and not CSS_LIKE.search(body)):
                if body not in T:
                    T.append(body)
                out.append(f"P.T[{T.index(body)}]")
            else:
                out.append(inner[i:j + 1])
            i = j + 1
        else:
            out.append(c); i += 1
    return "".join(out), T


def port(id_):
    sig, raw = BODY[id_]
    why = impure(raw)
    if why:
        return None, why
    raw = re.sub(r",?\s*\}\s*;\s*$", "", raw.rstrip())  # 最後一個效果尾端連著 DRAW 物件的結束 };
    raw = re.sub(r"(?:\s*/\*(?:(?!\*/).)*\*/)+\s*$", "", raw.rstrip(), flags=re.S).rstrip()  # 新版圖鑑在每個效果前有 /* 說明 */，會被切進前一個效果的尾端
    if raw.endswith(","):
        raw = raw[:-1].rstrip()
    assert raw.endswith("}")
    inner = raw[raw.index("{") + 1:-1]
    code, T = scan(inner)
    uses = [n for n in HELP if re.search(rf"\b{n}\b", code)]
    pre = []
    if uses:
        pre.append(f"const {{ {', '.join(uses)} }} = K;")
    col = [n for n in ("A", "B", "Y", "FG", "M") if re.search(rf"\b{n}\b", code)]
    if col:
        pre.append(f"const {{ {', '.join(col)} }} = K;")
    if re.search(r"\bBG\b", code):
        pre.append('const BG = K.BG === null ? "#12151D" : K.BG;')
    extra = [n for n in re.split(r"\s*,\s*", sig)[5:] if n and re.search(rf"\b{n}\b", code)]  # 原版簽名裡多出的 c（畫布）、d／dpr（像素比）
    for n in extra:
        pre.append(f"const {n} = {'K.canvas' if n == 'c' else 'K.dpr'};")
    if re.search(r"\bclear\(", code):
        pre.append("const clear = (x, w, h) => K.clear(x, w, h);")
    if re.search(r"\bscene\(", code):
        pre.append("const scene = (x, w, h, bg, fg, txt) => K.scene(x, w, h, bg, fg, txt, P.numFont);")
    if re.search(r"\bTR\(", code):
        pre.append("const TR = (x, w, h, t, path) => K.TR(x, w, h, t, path, P.numFont);")
    e = cat[id_]
    js = f"""// 移植自圖鑑 {id_}（{e['zh']}，{e['cat']}）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：{json.dumps(T, ensure_ascii=False)}。原版的 t%T 循環與數字未改動。
fxDefine("{id_}", {{
  dur: {max(float(e.get('dur') or 4), 3)},
  defaults: {{ T: {json.dumps(T, ensure_ascii=False)}, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' }},
  draw(x, w, h, t, P, K) {{
    {chr(10).join('    ' + p for p in pre).lstrip()}
    {{
{inner.strip(chr(10))}
    }}
  }},
}});
"""
    return js, T


if __name__ == "__main__":
    args = sys.argv[1:]
    ids = []
    if args and args[0] == "--cats":
        want = args[1].split(",")
        ported = set(mp["ported"])
        ids = [i for i, e in cat.items() if e["cat"] in want and i not in ported and not i.startswith("cmb_")]
        args = []
    ids += args
    ok, bad = [], {}
    for i in ids:
        js, info = port(i)
        if js is None:
            bad[i] = info
            continue
        open(os.path.join(CAT, "fx", i + ".js"), "w", encoding="utf-8").write(js)
        ok.append(i)
    print("已產生", len(ok), "個：", " ".join(ok))
    if bad:
        print("未處理（不純）：", bad)
    json.dump(ok, open(os.path.join(CAT, "fx", "_last_ported.json"), "w", encoding="utf-8"), ensure_ascii=False)
