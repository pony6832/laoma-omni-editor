import json, os
from shapely.geometry import Polygon, box
src = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "01_素材", "地理資料", "land-10m.json")
t = json.load(open(src, encoding="utf-8"))
sc, tr = t["transform"]["scale"], t["transform"]["translate"]
arcs = []
for a in t["arcs"]:
    x = y = 0; pts = []
    for dx, dy in a:
        x += dx; y += dy; pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)
def ring(idx):
    pts = []
    for i in idx:
        p = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts += p if not pts else p[1:]
    return pts
geoms = t["objects"]["land"]["geometries"]
polys = []
for g in geoms:
    mp = g["arcs"] if g["type"] == "MultiPolygon" else [g["arcs"]]
    for pl in mp:
        outer = ring(pl[0]); holes = [ring(h) for h in pl[1:]]
        p = Polygon(outer, holes)
        if not p.is_valid: p = p.buffer(0)
        polys.append(p)
print("polys", len(polys))
def build(bb, tol, minarea):
    cl = box(*bb); out = []
    for p in polys:
        if not p.intersects(cl): continue
        q = p.intersection(cl)
        for g in (q.geoms if hasattr(q, "geoms") else [q]):
            if g.geom_type != "Polygon" or g.area < minarea: continue
            rp = g.representative_point()
            if 119.95 < rp.x < 122.2 and 21.7 < rp.y < 25.5: continue  # 台灣本島另有縣市界
            s = g.simplify(tol, preserve_topology=True)
            if s.is_empty: continue
            out.append([[round(x, 3), round(y, 3)] for x, y in s.exterior.coords])
    return out
ea = build((104, 14, 147, 47), 0.012, 0.004)
tw = build((113.5, 18.5, 128.5, 29.5), 0.004, 0.0003)
js = "const LANDEA = " + json.dumps(ea, separators=(",", ":")) + ";\nconst LANDTW = " + json.dumps(tw, separators=(",", ":")) + ";\n"
open("land_data.js", "w", encoding="utf-8").write(js)
print(len(js), len(ea), sum(len(r) for r in ea), len(tw), sum(len(r) for r in tw))
