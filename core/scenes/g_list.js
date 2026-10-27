// 通用範本：清單逐條出現（最多 5 條）
// params.v：topic、title 清單標題、items [{text,line,key}]（line/key 決定出現時機）、lines 本場景句數
defScene("g_list", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, N = V.items.length;
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const ti = mk("div", "", g, V.title, "position:absolute;left:50px;top:40px;font-size:60px;font-weight:900;opacity:0;text-shadow:0 4px 18px rgba(0,0,0,.6)");
  tl.fromTo(ti, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T0(1));
  const h = N <= 3 ? 170 : 125, gap = N <= 3 ? 36 : 22, cols = [COR, CYA, GRN, GLD, IND];
  V.items.forEach((it, i) => {
    const top = 150 + i * (h + gap), t = it.key ? tw(it.line, it.key) : T0(it.line);
    const e = mk("div", "glass", g, "", "left:50px;top:" + top + "px;width:1030px;height:" + h + "px;border-left:14px solid " + cols[i % 5]);
    mk("div", "", e, String(i + 1), "position:absolute;left:30px;top:" + (h / 2 - 38) + "px;width:76px;height:76px;border-radius:50%;background:" + cols[i % 5] + ";color:#1d0c08;font-size:50px;font-weight:900;text-align:center;line-height:76px");
    mk("div", "", e, it.text, "position:absolute;left:130px;right:30px;top:0;height:" + h + "px;display:flex;align-items:center;font-size:" + (N <= 3 ? 52 : 44) + "px;font-weight:800;line-height:1.3");
    tl.fromTo(e, { opacity: 0, x: 120, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)", immediateRender: false }, t - 0.15);
  });
});
