// 社會範本：事件時間軸（垂直，最多 5 個節點）
// params.v：topic、title、events [{when 時間文字, text 事件說明, line, key}]、lines 本場景句數
defScene("g_timeline", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, N = V.events.length;
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const ti = mk("div", "", g, V.title, "position:absolute;left:50px;top:36px;font-size:58px;font-weight:900;opacity:0;text-shadow:0 4px 18px rgba(0,0,0,.6)");
  tl.fromTo(ti, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T0(1));
  const step = N <= 3 ? 190 : 140, y0 = 170;
  const line = mk("div", "", g, "", "position:absolute;left:236px;top:" + y0 + "px;width:8px;height:" + ((N - 1) * step + 70) + "px;border-radius:4px;background:linear-gradient(180deg," + COR + "," + CYA + ");transform-origin:top;opacity:0");
  tl.fromTo(line, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: Math.max(1, T1(n) - T0(1) - 0.5), ease: "none", immediateRender: false }, T0(1) + 0.3);
  V.events.forEach((e, i) => {
    const y = y0 + i * step, t = e.key ? tw(e.line, e.key) : T0(e.line);
    const dot = mk("div", "", g, "", "position:absolute;left:224px;top:" + (y + 12) + "px;width:32px;height:32px;border-radius:50%;background:" + COR + ";box-shadow:0 0 18px " + COR + ";opacity:0");
    const wh = mk("div", "", g, e.when, "position:absolute;left:30px;top:" + y + "px;width:170px;text-align:right;font-size:40px;font-weight:900;color:" + GLD + ";opacity:0");
    const card = mk("div", "glass", g, "", "left:290px;top:" + (y - 8) + "px;width:790px;height:" + (step - 36) + "px");
    mk("div", "", card, e.text, "position:absolute;left:28px;right:28px;top:0;height:100%;display:flex;align-items:center;font-size:" + (N <= 3 ? 46 : 40) + "px;font-weight:800;line-height:1.3");
    tl.fromTo(dot, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)", immediateRender: false }, t - 0.1);
    tl.fromTo(wh, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.35, immediateRender: false }, t - 0.1);
    tl.fromTo(card, { opacity: 0, x: 80, scale: 0.95 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.5)", immediateRender: false }, t);
  });
});
