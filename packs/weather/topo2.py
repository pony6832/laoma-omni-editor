import json
from shapely.geometry import Polygon
from shapely.ops import unary_union
raw = json.load(open("tw_counties_raw.json", encoding="utf-8"))
skip = {"金門縣", "連江縣"}
short = {"台北市": "台北", "新北市": "新北", "基隆市": "基隆", "桃園市": "桃園", "新竹縣": "新竹", "苗栗縣": "苗栗", "台中市": "台中", "彰化縣": "彰化", "南投縣": "南投", "雲林縣": "雲林", "嘉義縣": "嘉義", "台南市": "台南", "高雄市": "高雄", "屏東縣": "屏東", "宜蘭縣": "宜蘭", "花蓮縣": "花蓮", "台東縣": "台東", "澎湖縣": "澎湖"}
over = {"基隆": (121.76, 25.17), "台北": (121.50, 25.07), "新北": (121.70, 24.88), "新竹": (121.14, 24.72), "嘉義": (120.52, 23.46), "屏東": (120.62, 22.55), "澎湖": (119.57, 23.57), "桃園": (121.15, 24.93)}
res, labels, polys = {}, {}, []
for name, rings in raw.items():
    if name in skip: continue
    keep = []
    for r in rings:
        p = Polygon(r)
        if not p.is_valid: p = p.buffer(0)
        if p.area < 0.0006 and name != "澎湖縣": continue
        s = p.simplify(0.0028, preserve_topology=True)
        if s.is_empty: continue
        ext = list(s.exterior.coords) if s.geom_type == "Polygon" else list(max(s.geoms, key=lambda g: g.area).exterior.coords)
        keep.append([[round(x, 3), round(y, 3)] for x, y in ext])
        polys.append(s)
    res[name] = keep
    if name in short:
        big = max((Polygon(r) for r in rings), key=lambda g: g.area)
        rp = big.representative_point()
        labels[short[name]] = list(over.get(short[name], (round(rp.x, 3), round(rp.y, 3))))
u = unary_union([p.buffer(0.0005) for p in polys])
nation = []
for g in (u.geoms if u.geom_type == "MultiPolygon" else [u]):
    s = g.simplify(0.003)
    nation.append([[round(x, 3), round(y, 3)] for x, y in s.exterior.coords])
js = "const TWC = " + json.dumps(res, ensure_ascii=False, separators=(",", ":")) + ";\nconst TWN = " + json.dumps(nation, separators=(",", ":")) + ";\nconst TWL = " + json.dumps(labels, ensure_ascii=False, separators=(",", ":")) + ";\nconst TWS = " + json.dumps(short, ensure_ascii=False) + ";\n"
open("tw_data.js", "w", encoding="utf-8").write(js)
print(len(js), {k: len(v) for k, v in res.items()}, len(nation))
