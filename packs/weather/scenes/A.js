// 場景 A：開場（全屏口播＋圖卡）第 1～11 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("A", function (T0, T1, tw, te, P) {
setMode(T0(12) - 0.2, "split");
{
  const tA1 = T0(12) - 0.2;
  const g = oscene(0, tA1 + 0.5);
  // 第 29 號颱風統計卡
  const card = mk("div", "glass", g, "", "left:1250px;top:130px;width:620px;height:330px");
  const ty = mk("div", "", card, '<img src="assets/typhoon.png" alt="" style="width:100%;height:100%">', "position:absolute;left:14px;top:40px;width:250px;height:250px;filter:drop-shadow(0 0 16px rgba(160,210,255,.6))");
  tl.fromTo(ty.firstChild, { rotation: 0 }, { rotation: -360 * 5, duration: 30, ease: "none", immediateRender: false }, T0(2));
  mk("div", "", card, P.t["今年　第"], "position:absolute;left:290px;top:30px;font-size:40px;font-weight:800;color:#cfe3ff");
  bignum(card, 290, 70, "font-size:150px;color:" + COR,...P.n["bignum1"], tw(2, "29號") - 0.2, 1.2, P.t["號"]);
  const tag = mk("div", "", card, P.t["強烈颱風"], "position:absolute;left:290px;top:250px;padding:6px 26px;border-radius:14px;background:" + RED + ";font-size:44px;font-weight:900;opacity:0");
  tl.fromTo(tag, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, tw(2, "強烈颱風"));
  tl.fromTo(card, { opacity: 0, x: 120, scale: 0.9 }, { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, T0(2));
  tl.to(card, { opacity: 0, x: 80, duration: 0.3 }, T0(4) - 0.2);

  // 「皮皮剉」情緒字
  tl.fromTo("#insBox", { opacity: 0, y: 30, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, T0(3));
  tl.to("#insBox", { opacity: 0, duration: 0.35 }, T0(3) + 3.7);
  const sc = mk("div", "", g, P.t["皮皮剉！"], "position:absolute;left:150px;top:540px;font-size:110px;font-weight:900;color:#fff;text-shadow:0 0 30px rgba(255,106,77,.9),0 6px 0 #c02b1c;opacity:0");
  tl.fromTo(sc, { opacity: 0, scale: 2.4, rotation: -10 }, { opacity: 1, scale: 1, rotation: -6, duration: 0.25, ease: "power4.in", immediateRender: false }, T0(3));
  tl.fromTo(sc, { x: 0 }, { x: 10, duration: 0.05, yoyo: true, repeat: 9, ease: "none", immediateRender: false }, T0(3) + 0.25);
  tl.to(sc, { opacity: 0, duration: 0.25 }, T1(3) + 0.3);

  // 迷你地圖：颱風接近台灣
  const mini = mk("div", "pscene", g, "", "left:1180px;top:110px;transform-origin:0 0;border-radius:40px;");
  gsap.set(mini, { scale: 0.5, opacity: 0 });
  const MM = drawMap(mini, "ea");
  const ty2 = typhEl(mini, MM, 150, 260, T0(4), T1(5) + 2);
  putAt(MM, ty2, ...P.g["pt2"]);
  const pth = mpath(MM, P.g["path1"], RED, 6, { arrow: true, dash: "14 10", glow: true });
  tl.fromTo(mini, { opacity: 0, scale: 0.42, x: 80 }, { opacity: 1, scale: 0.5, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T0(4));
  showPath(pth, T0(4) + 0.3);
  followT(MM, ty2, pth, T0(4) + 0.4, T1(5) - T0(4) - 0.6, "power1.inOut");
  const tp = MM.P(...P.g["pt1"]);
  const alarm = mk("div", "ring", mini, "", "width:200px;height:200px;border-color:#ff4d5e");
  gsap.set(alarm, { x: tp[0] - 100, y: tp[1] - 100 });
  tl.fromTo(alarm, { opacity: 0.9, scale: 0.3 }, { opacity: 0, scale: 1.8, duration: 0.7, repeat: 3, ease: "power2.out", immediateRender: false }, T0(5) + 0.8);
  const q = mk("div", "", g, P.t["直撲台灣？"], "position:absolute;left:1260px;top:560px;padding:6px 26px;border-radius:16px;background:rgba(14,22,42,.88);font-size:84px;font-weight:900;color:" + RED + ";text-shadow:0 0 24px rgba(255,77,94,.7);opacity:0");
  tl.fromTo(q, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power4.in", immediateRender: false }, tw(5, "直撲台灣"));
  tl.to([mini, q], { opacity: 0, duration: 0.35 }, T0(6) + 0.1);

  // 時間軸：週三→週一，並標出光復節連假
  const bar = mk("div", "glass", g, "", "left:90px;top:640px;width:1400px;height:150px");
  tl.fromTo(bar, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, T0(6) + 0.3);
  const days = [P.t["週三"], P.t["週四"], P.t["週五"], P.t["週六"], P.t["週日"], P.t["週一"]];
  mk("div", "", bar, "", "position:absolute;left:100px;right:100px;top:72px;height:6px;border-radius:3px;background:rgba(255,255,255,.2)");
  const fill = mk("div", "", bar, "", "position:absolute;left:100px;top:72px;height:6px;width:1200px;border-radius:3px;background:linear-gradient(90deg," + IND + "," + COR + ");transform-origin:left center");
  tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: T1(8) - T0(7) - 0.4, ease: "none", immediateRender: false }, T0(7));
  const nodes = days.map((d, i) => {
    const n = mk("div", "", bar, '<div style="width:34px;height:34px;border-radius:50%;background:' + (i >= 3 ? COR : IND) + ';border:5px solid #fff;margin:0 auto"></div><div style="margin-top:12px;font-size:36px;font-weight:800;text-align:center">' + d + "</div>", "position:absolute;left:" + (100 + i * 240 - 50) + "px;top:55px;width:100px;opacity:0");
    tl.fromTo(n, { opacity: 0, y: 20, scale: 0.6 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, T0(7) + i * ((T1(8) - T0(7) - 0.6) / 5));
    return n;
  });
  const fest = mk("div", "", g, P.t["光復節　三天連假"], "position:absolute;left:830px;top:565px;padding:8px 34px;border-radius:16px;background:" + COR + ";color:#1d0c08;font-size:50px;font-weight:900;opacity:0;box-shadow:0 10px 26px rgba(0,0,0,.45)");
  tl.fromTo(fest, { opacity: 0, y: 30, scale: 0.7 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, tw(10, "光復節"));
  [3, 4, 5].forEach((i) => tl.to(nodes[i], { scale: 1.25, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, tw(10, "光復節") + 0.2));
  tl.to([bar, fest], { opacity: 0, duration: 0.3 }, tA1);
}
});
