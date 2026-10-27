// 場景 K：強度減弱、暴風圈縮小 第 101～112 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("K", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(12) + 0.1, P.t["強度減弱　暴風圈縮小"]);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const steps = [[P.t["強烈"], 300, 270, "#ff4d5e", tw(1, "禮拜四")], [P.t["中度"], 220, 190, "#ffb03d", tw(6, "中度")], [P.t["輕度"], 150, 130, "#6fd0ff", tw(7, "輕度")]];
  steps.forEach((s, i) => {
    const cx = 215 + i * 350, cy = 340;
    const ring = mk("div", "ring", g, "", "width:" + s[1] * 1.3 + "px;height:" + s[1] * 1.3 + "px;border-color:" + s[3]);
    gsap.set(ring, { x: cx - s[1] * 0.65, y: cy - s[1] * 0.65 });
    const ty = mk("div", "typh", g, '<img src="assets/typhoon.png" alt="">', "width:" + s[2] + "px;height:" + s[2] + "px");
    gsap.set(ty, { x: cx - s[2] / 2, y: cy - s[2] / 2 });
    tl.fromTo(ty.firstChild, { rotation: 0 }, { rotation: -360 * 3, duration: 18, ease: "none", immediateRender: false }, s[4]);
    tl.fromTo([ty, ring], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, s[4]);
    const nm = mk("div", "", g, s[0], "position:absolute;left:" + (cx - 100) + "px;top:540px;width:200px;text-align:center;font-size:64px;font-weight:900;color:" + s[3]);
    tl.fromTo(nm, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, s[4] + 0.2);
    if (i < 2) { const ar = mk("div", "", g, "➜", "position:absolute;left:" + (cx + 150) + "px;top:290px;font-size:80px;color:#fff;opacity:0"); tl.fromTo(ar, { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.3, immediateRender: false }, steps[i + 1][4] - 0.3); }
  });
  chip(g, 30, 24, P.t["週四到週五　強度減弱"], "r", tw(1, "禮拜四到禮拜五"), T0(5), { y: -20 });
  chip(g, -20, 24, P.t["暴風圈跟著縮小"], "i", tw(3, "暴風圈"), T1(8), { y: -20 });
  const lab = mk("div", "", g, P.t["越往北走　暴風圈越小"], "position:absolute;left:0;right:0;top:640px;text-align:center;font-size:58px;font-weight:900;color:#fff;opacity:0;text-shadow:0 4px 14px rgba(0,0,0,.8)");
  tl.fromTo(lab, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, tw(10, "當它到達"));
}
});
