// （舊版手寫實作，保留給需要沿用舊外觀的專案；新專案請用 g_bars，已改由圖鑑移植版 counter／chart 繪製）
// 財經範本：橫向長條比較（最多 5 條，長度依數值比例）
// params.v：topic、title、unit 單位、bars [{label, value, line, key}]、lines 本場景句數
defScene("g_bars_legacy", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, N = V.bars.length, mx = Math.max(...V.bars.map((b) => b.value));
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const ti = mk("div", "", g, V.title, "position:absolute;left:50px;top:40px;font-size:58px;font-weight:900;opacity:0;text-shadow:0 4px 18px rgba(0,0,0,.6)");
  tl.fromTo(ti, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T0(1));
  const h = N <= 3 ? 120 : 92, gap = N <= 3 ? 56 : 34, cols = [COR, CYA, GLD, IND, GRN];
  V.bars.forEach((b, i) => {
    const top = 170 + i * (h + gap), t = b.key ? tw(b.line, b.key) : T0(b.line), w = Math.round(640 * b.value / mx);
    const lb = mk("div", "", g, b.label, "position:absolute;left:50px;top:" + top + "px;width:230px;height:" + h + "px;display:flex;align-items:center;font-size:46px;font-weight:800;opacity:0");
    const bar = mk("div", "", g, "", "position:absolute;left:290px;top:" + top + "px;width:" + w + "px;height:" + h + "px;border-radius:0 16px 16px 0;background:linear-gradient(90deg," + cols[i % 5] + "cc," + cols[i % 5] + ");transform-origin:left;opacity:0;box-shadow:0 8px 24px rgba(0,0,0,.4)");
    const val = mk("div", "", g, b.value.toLocaleString("en-US") + (V.unit || ""), "position:absolute;left:" + (300 + w) + "px;top:" + top + "px;height:" + h + "px;display:flex;align-items:center;font-size:50px;font-weight:900;opacity:0");
    tl.fromTo(lb, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.35, immediateRender: false }, t - 0.1);
    tl.fromTo(bar, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.7, ease: "power3.out", immediateRender: false }, t);
    tl.fromTo(val, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.4, immediateRender: false }, t + 0.5);
  });
});
