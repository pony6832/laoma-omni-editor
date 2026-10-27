"""效果選用機制：讀逐字稿 → Agent 判斷每段在講什麼 → 從菜單挑範本／圖鑑效果 → 把逐字稿裡的數字與文字填進去。
判斷這一步由「模型（Agent）」做；本檔負責前後的確定性工作：組提示詞、驗證答案（尤其擋住憑空編造的數字與文字）、
換算參數（Agent 只給原始數字，占比、高度由程式算）、失敗時退回備援，最後輸出 plan.json（再由 plan.py apply 寫進 project.json）。
  python -X utf8 pick_effects.py prepare <專案>                  產生 analysis/select_prompt.md 與 select_input.json
  python -X utf8 pick_effects.py check   <專案> [--answer 檔]     驗證答案（預設 analysis/select_answer.json）→ plan.json ＋ select_report.md
  python -X utf8 pick_effects.py run     <專案> --llm-cmd "指令"  全自動：指令從 stdin 收提示詞、把答案 JSON 印到 stdout；驗證失敗會把錯誤回饋重試一次，仍失敗的段落退回備援
沒有 --llm-cmd 時（例如這台沒有 API 金鑰或 claude 命令列），由對話中的 Agent 讀 select_prompt.md 後寫 select_answer.json，再跑 check。"""
import argparse, json, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import project as P
import plan as PL

CAT = os.path.join(os.path.dirname(HERE), "catalog")
SCHEMA = json.load(open(os.path.join(CAT, "fx_schema.json"), encoding="utf-8"))
CN = {"零": 0, "〇": 0, "一": 1, "二": 2, "兩": 2, "三": 3, "四": 4, "五": 5, "六": 6, "七": 7, "八": 8, "九": 9}


# ---------- 文字與數字工具 ----------
def norm(s):
    return "".join(c for c in s if re.match(r"[一-鿿A-Za-z0-9]", c))


def parse_cn(s):
    total = sec = num = 0
    for ch in s:
        if ch in CN:
            num = CN[ch]
        elif ch in "十百千":
            sec += (num or 1) * {"十": 10, "百": 100, "千": 1000}[ch]; num = 0
        elif ch == "萬":
            total += (sec + num) * 10000; sec = num = 0
        elif ch == "億":
            total += (sec + num) * 100000000; sec = num = 0
    return total + sec + num


def numbers_in(text):
    """逐字稿裡出現過的數字集合（阿拉伯數字、中文數字、百分之 X）。"""
    out = set()
    for m in re.finditer(r"\d[\d,]*(?:\.\d+)?", text):
        out.add(float(m.group(0).replace(",", "")))
    for m in re.finditer(r"[零〇一二兩三四五六七八九十百千萬億]+", text):
        out.add(float(parse_cn(m.group(0))))
    return out


def num_ok(v, nums):
    return any(abs(v - n) < 1e-6 or abs(v * 100 - n) < 1e-6 for n in nums)


def cov(s, ntext):
    cs = norm(s)
    return 1.0 if not cs else sum(1 for c in cs if c in ntext) / len(cs)


# ---------- 菜單 ----------
def menu_for(theme):
    out = {}
    for k, v in SCHEMA["choices"].items():
        if v.get("theme") and v["theme"] != theme:
            continue
        if v["kind"] == "fx" and not os.path.exists(os.path.join(CAT, "fx", k.split(":")[1] + ".js")):
            continue
        out[k] = v
    return out


def build_prompt(p, lines, menu, extra=""):
    tl, _, dur = P.timeline(p)
    tt = {l["n"]: l for l in tl}
    tr = "\n".join(f"{l['n']:>3}｜{tt[l['n']]['t0']:6.1f}–{tt[l['n']]['t1']:6.1f}s｜{l['text']}" for l in lines)
    mn = json.dumps({k: {"用在": v["use"], "參數": v.get("params", {})} for k, v in menu.items()}, ensure_ascii=False, indent=1)
    return f"""你是口播影片的「圖解編導」。下面是一支口播影片的逐字稿（句號｜成片秒數｜句子）。請把它切成若干段，替每一段決定要放哪一種圖解（或不放），並把逐字稿裡的數字與文字填進去。

## 規則（違反會被程式退回）
1. 切段：用句號範圍 lines:[起,迄]；段與段不重疊、依序排列；沒涵蓋到的句子＝口播全屏。每段圖解通常 1～6 句；開場寒暄、結尾呼籲、沒有可視覺化內容的句子用 "talk" 或直接不涵蓋，但連續超過 8 秒沒有任何圖解的口播要補一段（結尾呼籲可用 fx:kinetic 或 g_point），畫面才不會空。
2. 判斷「這一段在講什麼」再挑 choice（見菜單的「用在」）。拿不準就用 g_point 或 talk，不要硬湊圖表。同一種效果連用不要超過兩次，要有變化。
3. **數字只能用逐字稿裡真的出現的**（阿拉伯或中文數字都算）。不得推算、估計或編造；需要換算（占比、高度、滿分比例）請只給原始數字，系統會換算。
4. **文字（標籤、名稱、短語）要取自逐字稿**，可以縮短，不可新增逐字稿沒有的資訊。
5. 凡是填了數字的段落，必須在 evidence 放 1～3 句「逐字稿原句或原句片段」（逐字、不改字）當證據。
6. params 只能用菜單列出的欄位；每個 params 的限制（字數、項數）見菜單。line／key（讓內容在該詞被說出時出現）沒把握就省略。
7. 每段附 reason（一句話：為什麼選這個）。
8. 只輸出一個 JSON 物件，不要任何說明文字、不要 markdown 圍欄。

## 輸出格式
{{"scenes":[{{"lines":[起,迄],"choice":"fx:donut","topic":"頁首標籤","reason":"…","evidence":["…"],"params":{{…}},"line":1,"key":"…"}}]}}
choice 可填：{", ".join(menu)}

## 菜單
{mn}

## 逐字稿（主題：{p['meta'].get('theme')}，共 {len(lines)} 句，成片 {dur:.0f} 秒）
{tr}
{extra}"""


# ---------- 驗證 ----------
def vparams(spec, params, path, errs, warns, ntext, nums, ev_needed):
    """依規格驗證 params（就地丟掉未知欄位、檢查型別與限制、檢查數字與文字是否出自逐字稿）。回傳乾淨的 dict。"""
    out = {}
    for k in params:
        if k not in spec:
            warns.append(f"{path}.{k}：不在規格內，已忽略")
    for k, sp in spec.items():
        v = params.get(k)
        if v is None or v == "":
            if sp.get("required"):
                errs.append(f"{path}.{k}：必填")
            continue
        t = sp["type"]
        if t == "str":
            if not isinstance(v, str):
                errs.append(f"{path}.{k}：要是文字"); continue
            if len(v) > sp.get("max_len", 99):
                errs.append(f"{path}.{k}：「{v}」超過 {sp['max_len']} 字"); continue
            if "enum" in sp and v not in sp["enum"]:
                errs.append(f"{path}.{k}：只能是 {sp['enum']}"); continue
            g = sp.get("grounded")
            if g == "text":
                c = cov(v, ntext)
                if c < 0.5: errs.append(f"{path}.{k}：「{v}」與逐字稿幾乎無關（覆蓋 {c:.0%}），疑似憑空新增")
                elif c < 0.8: warns.append(f"{path}.{k}：「{v}」與逐字稿覆蓋 {c:.0%}")
            elif g == "number":
                ev_needed[0] = True
                for m in re.finditer(r"\d[\d,]*(?:\.\d+)?", v):
                    x = float(m.group(0).replace(",", ""))
                    if not num_ok(x, nums): errs.append(f"{path}.{k}：數字 {x:g} 沒有出現在逐字稿")
            out[k] = v
        elif t in ("num", "int"):
            if isinstance(v, bool) or not isinstance(v, (int, float)):
                errs.append(f"{path}.{k}：要是數字"); continue
            if t == "int" and int(v) != v:
                errs.append(f"{path}.{k}：要是整數"); continue
            if "min_v" in sp and v < sp["min_v"] or "max_v" in sp and v > sp["max_v"]:
                errs.append(f"{path}.{k}：{v} 超出範圍 {sp.get('min_v')}～{sp.get('max_v')}"); continue
            if sp.get("grounded") == "number":
                ev_needed[0] = True
                if not num_ok(v, nums): errs.append(f"{path}.{k}：數字 {v:g} 沒有出現在逐字稿")
            out[k] = v
        elif t == "arr":
            if not isinstance(v, list):
                errs.append(f"{path}.{k}：要是清單"); continue
            if not sp.get("min", 0) <= len(v) <= sp.get("max", 99):
                errs.append(f"{path}.{k}：項數 {len(v)} 不在 {sp.get('min')}～{sp.get('max')}"); continue
            if "item_type" in sp:
                sub = {"v": {"type": sp["item_type"], "max_len": sp.get("max_len", 99), "grounded": sp.get("grounded"), "required": True}}
                out[k] = [vparams(sub, {"v": it}, f"{path}.{k}[{i}]", errs, warns, ntext, nums, ev_needed).get("v") for i, it in enumerate(v)]
            else:
                items = []
                for i, it in enumerate(v):
                    if not isinstance(it, dict):
                        errs.append(f"{path}.{k}[{i}]：要是物件"); continue
                    items.append(vparams(sp["item"], it, f"{path}.{k}[{i}]", errs, warns, ntext, nums, ev_needed))
                out[k] = items
        elif t == "obj":
            if not isinstance(v, dict):
                errs.append(f"{path}.{k}：要是物件"); continue
            sub = {"title": {"type": "str", "required": True, "max_len": 8, "grounded": "text"}, "items": {"type": "arr", "required": True, "min": 1, "max": 3, "item_type": "str", "max_len": 14, "grounded": "text"}, "line": {"type": "int"}, "key": {"type": "str", "max_len": 8}}
            out[k] = vparams(sub, v, f"{path}.{k}", errs, warns, ntext, nums, ev_needed)
    return out


def fmt(x):
    return f"{x:,.0f}" if abs(x - round(x)) < 1e-9 else f"{x:,.2f}".rstrip("0").rstrip(".")


def derive(kind, q, errs, path):
    """把 Agent 給的原始數字換算成效果真正的參數。"""
    if kind == "shares":
        raw = q["raw"]; s = sum(raw)
        if s <= 0 or any(r < 0 for r in raw) or len(q["labels"]) != len(raw):
            errs.append(f"{path}：raw 要全為正數、且 labels 數量要與 raw 相同"); return None
        data = [r / s for r in raw]; pct = abs(s - 100) <= 1.5
        return dict(data=data, labels=[f"{l} {fmt(r) + q.get('unit', '%') if pct else str(round(d * 100)) + '%'}" for l, r, d in zip(q["labels"], raw, data)], center=round(data[0] * 100), unit="%")
    if kind == "series":
        raw = q["raw"]; mx = max(raw)
        if mx <= 0 or min(raw) < 0: errs.append(f"{path}：raw 要為正數"); return None
        return dict(data=[round(r / mx * 0.92, 4) for r in raw])
    if kind == "scores":
        raw, mx = q["raw"], q["max"]
        if mx <= 0 or len(q["labels"]) != len(raw) or any(r < 0 or r > mx for r in raw): errs.append(f"{path}：分數要在 0～max，且 labels 數量相同"); return None
        return dict(values=[r / mx for r in raw], labels=q["labels"])
    if kind == "pct":
        if not 0 <= q["pct"] <= 100: errs.append(f"{path}：pct 要在 0～100"); return None
        return dict(value=q["pct"] / 100, label=q.get("label", ""))
    if kind == "stages":
        st = q["stages"]
        if any(s["value"] <= 0 for s in st) or any(st[i]["value"] < st[i + 1]["value"] for i in range(len(st) - 1)): errs.append(f"{path}：漏斗各層數值要為正且由大到小"); return None
        return dict(stages=[[s["name"], s["value"]] for s in st], stepW=min(0.17, 0.5 / len(st)))
    if kind == "blocks":
        it = q["items"]; s = sum(i["value"] for i in it)
        if s <= 0 or any(i["value"] <= 0 for i in it): errs.append(f"{path}：數值要為正"); return None
        return dict(items=[dict(label=f"{i['label']} {round(i['value'] / s * 100)}%", value=i["value"]) for i in it])
    if kind == "gauge":
        if not 0 <= q["pct"] <= 100: errs.append(f"{path}：pct 要在 0～100"); return None
        return dict(value=q["pct"] / 100, inner=round(q["pct"] / 100 * 0.7, 2))
    if kind == "countdown":
        return dict(**{"from": int(q["from"])})
    if kind in ("steps", "items", "years"):
        return {kind: q[kind]}
    if kind == "hl":
        return dict(lines=[[q["lead"], 0], [q["key_phrase"], 1]], circle=False)
    if kind == "text":
        return dict(text=q["text"])
    if kind == "title":
        t = q["text"]; s0 = q.get("hi_start", 2 if len(t) > 3 else 0); c = q.get("hi_count", 2)
        return dict(text=t, hi=[i for i in range(s0, min(len(t), s0 + c))])
    if kind == "lines":
        return dict(lines=q["lines"], hi=min(q.get("hi", 1), len(q["lines"]) - 1))
    errs.append(f"{path}：未知的 derive {kind}"); return None


def check_scene(sc, i, lines, menu, prev_end, errs, warns):
    path = f"scene[{i}]"
    ln = sc.get("lines")
    if not (isinstance(ln, list) and len(ln) == 2 and all(isinstance(x, int) for x in ln) and 1 <= ln[0] <= ln[1] <= len(lines)):
        errs.append(f"{path}.lines：要是 [起, 迄]（1～{len(lines)} 的整數）"); return None
    if ln[0] <= prev_end:
        errs.append(f"{path}.lines：{ln} 與前一段重疊或順序不對（前一段到 {prev_end}）"); return None
    ch = sc.get("choice")
    if ch not in menu:
        errs.append(f"{path}.choice：「{ch}」不在這個主題的菜單內"); return None
    seg = lines[ln[0] - 1:ln[1]]
    text = " ".join(x["text"] for x in seg); ntext = norm(text); nums = numbers_in(text)
    base = dict(lines=ln, text=text, reason=sc.get("reason", ""))
    if ch == "talk":
        return dict(base, template=None, v={})
    spec = menu[ch]["params"]; e0 = len(errs)
    need = [False]
    params = vparams(spec, sc.get("params") or {}, path + ".params", errs, warns, ntext, nums, need)
    topic = (sc.get("topic") or "重點")[:8]
    if need[0]:
        ev = sc.get("evidence") or []
        if not ev: errs.append(f"{path}.evidence：有數字的段落必須附逐字稿原句當證據")
        for j, e in enumerate(ev):
            if norm(e) not in ntext: errs.append(f"{path}.evidence[{j}]：「{e}」不是這一段逐字稿的原句或片段")
    if sc.get("choice") in ("g_number",) and "value" not in params and "text" not in params:
        errs.append(f"{path}.params：value 與 text 至少要有一個")
    if len(errs) > e0:
        return None
    v = dict(topic=topic)
    rel = lambda n: 1 if not isinstance(n, int) else n
    ln_rel = sc.get("line") if isinstance(sc.get("line"), int) and 1 <= sc.get("line") <= len(seg) else 1
    key = sc.get("key") if isinstance(sc.get("key"), str) and norm(sc["key"]) and norm(sc["key"]) in norm(seg[ln_rel - 1]["text"]) else None
    if sc.get("key") and not key: warns.append(f"{path}.key：「{sc.get('key')}」不在第 {ln_rel} 句，已省略")
    if menu[ch]["kind"] == "fx":
        d = derive(menu[ch]["derive"], params, errs, path + ".params")
        if d is None: return None
        v.update(fx=ch.split(":")[1], params=d)
        template = "g_fx"
        v["line"] = ln_rel
        if key: v["key"] = key
    else:
        template = ch
        v.update(params)
        if key: v["key"] = key
        if "line" in sc: v["line"] = ln_rel
        for lst in ("items", "bars", "events"):  # 清單內每項的 line 必須在本段範圍內
            for it in v.get(lst, []) or []:
                if isinstance(it, dict) and not (isinstance(it.get("line"), int) and 1 <= it["line"] <= len(seg)): it.pop("line", None); it.pop("key", None)
        if template == "g_number": v.setdefault("line", 1)
        for lst in ("items", "bars", "events"):
            for j, it in enumerate(v.get(lst, []) or []):
                if isinstance(it, dict): it.setdefault("line", min(j + 1, len(seg)))
        if template == "g_compare":
            v["left"].setdefault("line", 1); v["right"].setdefault("line", min(2, len(seg)))
    return dict(base, template=template, v=v, evidence=sc.get("evidence", []), choice=ch)


def fallback(a, b, lines):
    seg = lines[a - 1:b]; text = " ".join(x["text"] for x in seg)
    return dict(lines=[a, b], text=text, reason="備援：模型答案沒通過驗證，改用規則挑出的重點字卡", template="g_point", v=dict(topic="重點", keyword=PL.keyword(text), sub=""), fallback=True, choice="g_point")


def check_answer(p, ans, lines, menu):
    errs_all, warns_all, scenes, bad = [], [], [], []
    prev = 0
    for i, sc in enumerate(ans.get("scenes", [])):
        errs, warns = [], []
        r = check_scene(sc, i, lines, menu, prev, errs, warns)
        warns_all += warns
        if r is None:
            errs_all += errs
            ln = sc.get("lines")
            if isinstance(ln, list) and len(ln) == 2 and all(isinstance(x, int) for x in ln) and prev < ln[0] <= ln[1] <= len(lines):
                scenes.append(fallback(ln[0], ln[1], lines)); prev = ln[1]; bad.append(i)
            continue
        scenes.append(r); prev = r["lines"][1]
    return scenes, errs_all, warns_all


def extract_json(s):
    s = s.strip()
    try:
        return json.loads(s)
    except Exception:
        pass
    m = re.search(r"\{.*\}", s, re.S)
    if not m:
        raise ValueError("輸出中找不到 JSON")
    return json.loads(m.group(0))


def write_outputs(pdir, p, scenes, errs, warns, menu):
    os.makedirs(os.path.join(pdir, "analysis"), exist_ok=True)
    out = [dict(s, kind=s.get("choice", ""), title=s.get("choice", "")) for s in scenes]
    json.dump(dict(note="由 select.py 產生；plan.py apply 會讀這份。fallback=true 的段落是備援。", scenes=out), open(os.path.join(pdir, "analysis", "plan.json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    rep = ["# 效果選用報告", "", f"主題：{p['meta'].get('theme')}　場景 {len(scenes)} 段　備援 {sum(1 for s in scenes if s.get('fallback'))} 段", ""]
    rep += ["| 句 | 選擇 | 理由 |", "|---|---|---|"] + [f"| {s['lines'][0]}–{s['lines'][1]} | {s.get('choice') or 'talk'}{'（備援）' if s.get('fallback') else ''} | {s.get('reason', '')} |" for s in scenes]
    if errs: rep += ["", "## 驗證錯誤（已用備援或退回）"] + [f"- {e}" for e in errs]
    if warns: rep += ["", "## 警告"] + [f"- {w}" for w in warns]
    open(os.path.join(pdir, "analysis", "select_report.md"), "w", encoding="utf-8").write("\n".join(rep) + "\n")


def load(pdir):
    p = P.load(pdir)
    if not p["meta"].get("theme") or p["meta"]["theme"] == "auto":
        th, sc = PL.detect_theme(" ".join(l["text"] for l in p["lines"]), os.path.join(HERE, "..", "themes"))
        p["meta"]["theme"] = th; P.save(pdir, p); print("主題自動判斷：", th, sc)
    lines = [dict(n=i + 1, text=l["text"]) for i, l in enumerate(p["lines"])]
    return p, lines, menu_for(p["meta"]["theme"])


def prepare(pdir):
    p, lines, menu = load(pdir)
    pr = build_prompt(p, lines, menu)
    d = os.path.join(pdir, "analysis"); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, "select_prompt.md"), "w", encoding="utf-8").write(pr)
    print("已產生 analysis/select_prompt.md（菜單 %d 種，逐字稿 %d 句）" % (len(menu), len(lines)))
    return pr


def run(pdir, cmd):
    p, lines, menu = load(pdir)
    prompt = build_prompt(p, lines, menu)
    scenes, errs, warns, errs_prev = [], [], [], ""
    for attempt in range(2):
        NL = chr(10)
        pr = prompt + (NL * 2 + "## 上一次答案的驗證錯誤（請只修正這些並重新輸出完整 JSON）" + NL + errs_prev if errs_prev else "")
        res = subprocess.run(cmd, shell=True, input=pr.encode("utf-8"), capture_output=True, timeout=900)
        try:
            ans = extract_json(res.stdout.decode("utf-8", "ignore"))
        except Exception as e:
            errs_prev = f"- 輸出不是有效 JSON：{e}"; print("第", attempt + 1, "次：", errs_prev); continue
        scenes, errs, warns = check_answer(p, ans, lines, menu)
        print(f"第 {attempt + 1} 次：{len(scenes)} 段，驗證錯誤 {len(errs)}，警告 {len(warns)}")
        if not errs:
            break
        errs_prev = NL.join("- " + e for e in errs)
    if not scenes:  # 兩次都沒拿到可用答案：整支退回規則版
        print("模型沒有給出可用答案，整支退回 plan.py propose 的規則版")
        PL.propose(pdir); return
    write_outputs(pdir, p, scenes, errs, warns, menu)
    print(f"完成：{len(scenes)} 段，備援 {sum(1 for s in scenes if s.get('fallback'))} 段；報告見 analysis/select_report.md")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("cmd", choices=["prepare", "check", "run"]); ap.add_argument("pdir")
    ap.add_argument("--answer"); ap.add_argument("--llm-cmd")
    a = ap.parse_args(); pdir = os.path.abspath(a.pdir)
    if a.cmd == "prepare":
        prepare(pdir)
    elif a.cmd == "check":
        p, lines, menu = load(pdir)
        ans = extract_json(open(a.answer or os.path.join(pdir, "analysis", "select_answer.json"), encoding="utf-8").read())
        scenes, errs, warns = check_answer(p, ans, lines, menu)
        write_outputs(pdir, p, scenes, errs, warns, menu)
        print(f"{len(scenes)} 段；驗證錯誤 {len(errs)}；警告 {len(warns)}；備援 {sum(1 for s in scenes if s.get('fallback'))}")
        for e in errs: print("  ✗", e)
        for w in warns: print("  ⚠", w)
        sys.exit(1 if errs else 0)
    else:
        run(pdir, a.llm_cmd)
