// 場景 H：路徑轉向與東部風浪 第 76～82 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("H", function (T0, T1, tw, te, P) {
{
  const { g, M } = twScene(T0(1) - 0.1, T1(7) + 0.1, P.t["路徑轉北　風浪增大"], "tw");
  const Ty = typhEl(g, M, 150, 110, T0(1), T1(7) + 0.1);
  putAt(M, Ty, ...P.g["pt1"]);
  chip(g, 30, 24, P.t["強度減弱"], "cy", tw(1, "冷空氣"), T1(1) + 1.5, { y: -20 });
  tl.fromTo(Ty.ring, { scale: 1 }, { scale: 0.8, duration: T1(2) - T0(1), ease: "power1.inOut", immediateRender: false }, T0(1));
  const pth = mpath(M, P.g["path1"], "#ffb199", 7, { arrow: true, glow: true });
  showPath(pth, tw(2, "路徑"));
  followT(M, Ty, pth, tw(2, "路徑"), T1(5) - tw(2, "路徑"), "power1.inOut");
  const cm = compass(g, 150, 560, 100, tw(3, "西北") - 0.3, T1(6));
  const a0 = -45, a1 = -22.5;
  tl.fromTo(cm.arrow, { rotation: a0 }, { rotation: a0, duration: 0.01, immediateRender: false }, tw(3, "西北") - 0.3);
  tl.fromTo(cm.arrow, { rotation: a0 }, { rotation: a1, duration: 0.8, ease: "power2.inOut", immediateRender: false }, tw(4, "北北西"));
  tl.fromTo(cm.arrow, { rotation: a1 }, { rotation: 0, duration: 0.8, ease: "power2.inOut", immediateRender: false }, tw(4, "往北偏"));
  lbl(g, 270, 520, P.t["西北"], tw(3, "西北"), tw(4, "北北西"), "font-size:36px;color:" + GLD);
  lbl(g, 270, 520, P.t["北北西"], tw(4, "北北西"), tw(4, "往北偏"), "font-size:36px;color:" + GLD);
  lbl(g, 270, 520, P.t["往北偏"], tw(4, "往北偏"), T1(6), "font-size:36px;color:" + GLD);
  chip(g, -20, 650, P.t["明天仍在遠洋"], "i", tw(6, "遠洋"), T1(7) + 0.5, { y: 30 });
  waves(g, M, tw(7, "風浪"), T1(7) + 0.4);
  chip(g, -20, 24, P.t["東部海域　風浪增大"], "cy", tw(7, "東部海域"), T1(7) + 0.5, { y: -20 });
}
});
