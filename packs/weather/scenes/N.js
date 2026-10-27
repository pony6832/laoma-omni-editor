// 場景 N：影響時間 第 128～132 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("N", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(5) + 0.1, P.t["影響時間"]);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const cols = [[P.t["週四"], 60, "#6f8bff"], [P.t["週五"], 400, "#ff6a4d"], [P.t["週六"], 740, "#5fd0ff"]];
  cols.forEach((c, i) => {
    const e = mk("div", "glass", g, "", "left:" + c[1] + "px;top:120px;width:330px;height:520px;border-top:10px solid " + c[2]);
    mk("div", "", e, c[0], "position:absolute;left:0;right:0;top:16px;text-align:center;font-size:56px;font-weight:900;color:" + c[2]);
    tl.fromTo(e, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, T0(1) + i * 0.15);
  });
  [P.t["上午"], P.t["下午"], P.t["晚上"]].forEach((t, i) => mk("div", "", g, t, "position:absolute;left:430px;top:" + (220 + i * 120) + "px;font-size:34px;font-weight:700;color:rgba(255,255,255,.55)"));
  const band = mk("div", "", g, "", "position:absolute;left:410px;top:340px;width:310px;height:240px;border-radius:18px;background:linear-gradient(180deg,rgba(255,77,94,.65),rgba(255,106,77,.5));border:3px solid #ff8f8f;opacity:0;box-shadow:0 0 40px rgba(255,77,94,.7)");
  tl.fromTo(band, { opacity: 0, scaleY: 0.2 }, { opacity: 1, scaleY: 1, duration: 0.6, ease: "power3.out", transformOrigin: "top", immediateRender: false }, tw(3, "禮拜五的下午"));
  tl.to(band, { boxShadow: "0 0 70px rgba(255,77,94,1)", duration: 0.5, yoyo: true, repeat: 3, ease: "sine.inOut" }, tw(3, "禮拜五的下午") + 0.6);
  chip(g, 130, 670, P.t["影響時間：週五下午到晚上"], "r", tw(3, "禮拜五的下午"), null, { y: 30 });
  const ty = mk("div", "typh", g, '<img src="assets/typhoon.png" alt="">', "width:150px;height:150px");
  gsap.set(ty, { x: 80, y: 40 });
  tl.fromTo(ty.firstChild, { rotation: 0 }, { rotation: -360 * 3, duration: 18, ease: "none", immediateRender: false }, T0(1));
  tl.fromTo(ty, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, T0(1));
  tl.fromTo(ty, { x: 80, scale: 1 }, { x: 800, scale: 0.55, duration: T1(5) - T0(1), ease: "power1.inOut", immediateRender: false }, T0(1));
  const ok = mk("div", "", g, P.t["✔　已經走掉"], "position:absolute;left:760px;top:380px;width:300px;font-size:54px;font-weight:900;color:" + GRN + ";opacity:0;text-align:center;text-shadow:0 0 20px rgba(77,227,154,.7)");
  tl.fromTo(ok, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", immediateRender: false }, tw(5, "颱風已經走掉"));
}
});
