// 通用範本：引言卡
// params.v：topic、text 引言內文、by 出處（可空）、lines 本場景句數
defScene("g_quote", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines;
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const q = mk("div", "", g, "“", "position:absolute;left:60px;top:40px;font-size:300px;font-weight:900;color:" + GLD + ";line-height:1;opacity:0");
  tl.fromTo(q, { opacity: 0, scale: 0.4, rotation: -20 }, { opacity: 0.9, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, T0(1));
  const fs = V.text.length > 18 ? 56 : 68;
  const tx = mk("div", "", g, V.text, "position:absolute;left:110px;right:110px;top:250px;text-align:center;font-size:" + fs + "px;font-weight:900;line-height:1.4;opacity:0;text-shadow:0 4px 18px rgba(0,0,0,.6)");
  tl.fromTo(tx, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, T0(1) + 0.3);
  if (V.by) {
    const by = mk("div", "", g, "—— " + V.by, "position:absolute;left:110px;right:110px;top:560px;text-align:center;font-size:44px;font-weight:800;color:" + CYA + ";opacity:0");
    tl.fromTo(by, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, immediateRender: false }, T0(1) + 1.3);
  }
});
