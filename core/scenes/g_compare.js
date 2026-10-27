// 通用範本：左右對照
// params.v：topic、left/right {title, items[], line, key}（line/key 決定該側出現時機）、lines 本場景句數
defScene("g_compare", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines;
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  [[V.left, 40, RED], [V.right, 590, GRN]].forEach(([c, x, col]) => {
    const t = c.key ? tw(c.line, c.key) : T0(c.line);
    const e = mk("div", "glass", g, "", "left:" + x + "px;top:110px;width:500px;height:540px;border-top:14px solid " + col);
    mk("div", "", e, c.title, "position:absolute;left:0;right:0;top:30px;text-align:center;font-size:62px;font-weight:900;color:" + col);
    c.items.forEach((s, i) => {
      const it = mk("div", "", e, s, "position:absolute;left:36px;right:36px;top:" + (140 + i * 125) + "px;font-size:42px;font-weight:800;line-height:1.35;opacity:0");
      tl.fromTo(it, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, t + 0.35 + i * 0.35);
    });
    tl.fromTo(e, { opacity: 0, x: x < 300 ? -100 : 100, scale: 0.94 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t - 0.15);
  });
  const vs = mk("div", "", g, "VS", "position:absolute;left:515px;top:340px;width:100px;height:100px;border-radius:50%;background:" + GLD + ";color:#1d0c08;font-size:44px;font-weight:900;text-align:center;line-height:100px;opacity:0;z-index:3");
  const tv = V.right.key ? tw(V.right.line, V.right.key) : T0(V.right.line);
  tl.fromTo(vs, { opacity: 0, scale: 0.2, rotation: -90 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)", immediateRender: false }, tv - 0.1);
});
