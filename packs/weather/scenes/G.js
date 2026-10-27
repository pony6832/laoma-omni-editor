// 場景 G：明天氣溫 第 67～75 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("G", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(9) + 0.1, P.t["明天　氣溫大降"]);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const big = mk("div", "", g, P.t["明天　週四"], "position:absolute;left:0;right:0;top:250px;text-align:center;font-size:120px;font-weight:900;opacity:0;text-shadow:0 0 30px rgba(95,208,255,.7)");
  tl.fromTo(big, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, T0(1));
  tl.to(big, { opacity: 0, y: -80, duration: 0.4 }, T0(4));
  chip(g, 30, 24, P.t["東北季風環境"], "cy", T0(3), T1(4), { y: -20 });
  chip(g, 30, 24, P.t["北部　明顯變涼"], "cy", tw(5, "北部"), null, { y: -20 });
  const base = 650, bars = [[P.t["昨天"], P.n["d1"], 150, "#ff6a4d", tw(7, "34")], [P.t["今天"], P.n["d2"], 400, "#ff9a3d", tw(6, "31")], [P.t["明天"], P.n["d3"], 650, "#5fd0ff", tw(8, "25")], [P.t["明晚"], P.n["d4"], 900, "#6f8bff", tw(9, "22")]];
  mk("div", "", g, "", "position:absolute;left:80px;top:" + base + "px;width:970px;height:4px;background:rgba(255,255,255,.4)");
  bars.forEach((b) => {
    const h = (b[1] - 10) * 14;
    const bar = mk("div", "", g, "", "position:absolute;left:" + b[2] + "px;top:" + (base - h) + "px;width:150px;height:" + h + "px;border-radius:16px 16px 0 0;background:linear-gradient(180deg," + b[3] + ",rgba(0,0,0,.35));transform-origin:bottom;opacity:0;box-shadow:0 0 30px " + b[3] + "88");
    tl.fromTo(bar, { opacity: 0, scaleY: 0 }, { opacity: 1, scaleY: 1, duration: 0.7, ease: "power3.out", immediateRender: false }, b[4] - 0.2);
    mk("div", "", g, b[0], "position:absolute;left:" + b[2] + "px;top:" + (base + 14) + "px;width:150px;text-align:center;font-size:40px;font-weight:800");
    bignum(g, b[2] + 14, base - h - 100, "font-size:84px;color:" + b[3], 0, b[1], b[4] - 0.1, 0.8, "°");
  });
  chip(g, 520, 190, P.t["下降　6 度"], "r", tw(8, "25") + 0.3, T1(9) + 1, { y: -20 });
}
});
