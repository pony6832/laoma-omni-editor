"""核對 koubo 的效果對照表與動態效果圖鑑，並統計各場景範本用到哪些圖鑑 id。
用法：python -X utf8 check_effects.py
輸出：catalog/effect_usage.json（範本 → 用到的輔助函式 → 圖鑑 id）；有錯（id 不在圖鑑、圖鑑筆數不是 180）時結束碼為 1。"""
import glob, json, os, re, sys

KOUBO = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
CAT = os.path.join(KOUBO, "catalog")
cat = json.load(open(os.path.join(CAT, "catalog.json"), encoding="utf-8"))["effects"]
ids = {e["id"]: e for e in cat}
mp = json.load(open(os.path.join(CAT, "effect_map.json"), encoding="utf-8"))
errs = []
if len(cat) != 180:
    errs.append(f"圖鑑筆數是 {len(cat)}，不是 180")
if len(ids) != len(cat):
    errs.append("圖鑑內有重複 id")


def check(kind, name, v):
    for i in v.get("ids", []) + ([v["nearest"]] if v.get("nearest") else []):
        if i not in ids:
            errs.append(f"{kind}/{name}：id「{i}」不在圖鑑")


for kind in ("core", "helpers", "templates"):
    for name, v in mp[kind].items():
        check(kind, name, v)

# 各場景範本實際呼叫了哪些輔助函式 → 圖鑑 id
files = glob.glob(os.path.join(KOUBO, "core", "scenes", "*.js")) + glob.glob(os.path.join(KOUBO, "themes", "*", "scenes", "*.js")) + glob.glob(os.path.join(KOUBO, "packs", "*", "scenes", "*.js"))
usage = {}
for f in sorted(files):
    src = open(f, encoding="utf-8").read()
    name = os.path.splitext(os.path.basename(f))[0]
    hs = sorted(h for h in mp["helpers"] if re.search(rf"\b{h}\(", src))
    ex = set(mp["templates"].get(name, {}).get("ids", []))
    for h in hs:
        ex |= set(mp["helpers"][h]["ids"])
    usage[name] = dict(file=os.path.relpath(f, KOUBO).replace("\\", "/"), helpers=hs, effect_ids=sorted(ex))
json.dump(usage, open(os.path.join(CAT, "effect_usage.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

used = set()
for v in list(mp["core"].values()) + list(mp["helpers"].values()) + list(mp["templates"].values()):
    used |= set(v["ids"])
rel = {"對應": 0, "相似": 0, "無": 0}
for kind in ("core", "helpers", "templates"):
    for v in mp[kind].values():
        rel[v["rel"]] += 1
print(f"圖鑑 {len(cat)} 種；koubo 對照到的不同 id：{len(used)} 種（{len(used) * 100 // len(cat)}%）")
ported = mp.get("ported", [])
for i in ported:
    if i not in ids or not os.path.exists(os.path.join(CAT, "fx", i + ".js")):
        errs.append(f"已移植清單的 {i} 缺檔或不在圖鑑")
cmp_html = open(os.path.join(CAT, "fx", "_plan.js"), encoding="utf-8").read()
for i in ported:  # 每個已移植效果都必須在逐像素比對頁的清單裡
    if not re.search(rf"{i}:\s*\[", cmp_html):
        errs.append(f"{i} 沒有列入 fx/_plan.js 的逐像素比對清單")
print(f"已移植（可直接用 g_fx 範本呼叫）：{len(ported)} 種 {ported}")
print("對照項目：", rel, "（對應＝同概念自己重寫、相似＝只類似、無＝圖鑑沒有）")
print(f"場景範本 {len(usage)} 個，其中有對照到圖鑑 id 的 {sum(1 for u in usage.values() if u['effect_ids'])} 個；沒有的：", [k for k, u in usage.items() if not u["effect_ids"]])
if errs:
    print("錯誤：", *errs, sep="\n  ")
    sys.exit(1)
print("對照表檢查通過")
