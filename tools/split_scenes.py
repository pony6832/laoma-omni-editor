"""一次性：把氣象包舊的 scenes1/_keep_FG/scenes2b/scenes3 拆成一場景一檔（packs/weather/scenes/<id>.js）。
場景內的字幕行號由絕對改成「相對場景起點」（T0(12)→T0(1)），起點改由 project.json 的 scenes[].from 決定。
用法：python -X utf8 split_scenes.py"""
import json, os, re

PACK = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "packs", "weather")
SRC = ["scenes1.js", "_keep_FG.js", "scenes2b.js", "scenes3.js"]  # 原建置順序（weather.js/_keep_helpers.js 是函式庫）
HDR = re.compile(r"^// =+ (.+?) =+$", re.M)
REF = re.compile(r"\b(T0|T1|tw|te)\((\d+)")
os.makedirs(os.path.join(PACK, "scenes"), exist_ok=True)
catalog = []
for f in SRC:
    txt = open(os.path.join(PACK, f), encoding="utf-8").read()
    marks = list(HDR.finditer(txt))
    for i, m in enumerate(marks):
        body = txt[m.end():(marks[i + 1].start() if i + 1 < len(marks) else len(txt))].strip("\n")
        h = m.group(1)
        r = re.match(r"場景 (.+?)：(.*?)\s*第 (\d+)～(\d+) 句", h)
        if r:
            sid, title, a, b = r.group(1).replace("＋", ""), r.group(2), int(r.group(3)), int(r.group(4))
        else:
            assert h == "片尾", h
            sid, title, a, b = "OUT", "片尾", None, None
        base = (a or 1) - 1
        n_all = len(re.findall(r"\b(?:T0|T1|tw|te)\(", body))
        n_lit = len(REF.findall(body))
        assert n_all == n_lit, f"{sid}: 有非字面量的行號引用"
        body = REF.sub(lambda x: f"{x.group(1)}({int(x.group(2)) - base}", body)
        out = f"// {h}\n// 行號為相對場景起點（1＝scenes[].from 那一行）\ndefScene(\"{sid}\", function (T0, T1, tw, te, P) {{\n{body}\n}});\n"
        open(os.path.join(PACK, "scenes", f"{sid}.js"), "w", encoding="utf-8").write(out)
        catalog.append(dict(id=sid, title=title, file=f"scenes/{sid}.js", **({"from": a, "to": b} if a else {})))
        print(sid, title, a, b, "refs", n_lit)

pk = json.load(open(os.path.join(PACK, "pack.json"), encoding="utf-8"))
pk.pop("scene_js", None)
pk["lib_js"] = ["weather.js", "_keep_helpers.js"]
pk["scenes"] = catalog
json.dump(pk, open(os.path.join(PACK, "pack.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
