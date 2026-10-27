// 場景 R：另一股冷高壓 第 166～168 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("R", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(3) + 0.1, P.t["下週一　再降溫"]);
  const M = drawMap(g, "ea");
  const hp = M.P(...P.g["pt1"]);
  const H = mk("div", "", g, P.t["高"], "position:absolute;left:0;top:0;width:100px;height:100px;margin:-50px 0 0 -50px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#9fd0ff,#2d5fd0 70%);border:4px solid #fff;font-size:58px;font-weight:900;text-align:center;line-height:92px;box-shadow:0 0 40px rgba(95,160,255,.9);opacity:0");
  gsap.set(H, { x: hp[0], y: hp[1] });
  tl.fromTo(H, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: false }, T0(1) + 0.3);
  const hpth = mpath(M, P.g["path1"], "#9fd0ff", 6, { dash: "10 10", glow: true, arrow: true });
  showPath(hpth, tw(2, "冷高壓"));
  follow(hpth.el, [{ el: H, h: 0 }], tw(2, "冷高壓"), T1(3) - tw(2, "冷高壓") + 0.2, "power1.inOut");
  chip(g, 30, 24, P.t["週一　另一股冷高壓　再度南下"], "cy", tw(2, "另外"), null, { y: -20 });
  const tp = M.P(...P.g["pt2"]); pin(g, tp[0], tp[1], T0(1), null);
  chip(g, 30, 640, P.t["週二　溫度再往下降　↓"], "i", tw(3, "週二"), null, { y: 30 });
}
});
