// 場景 M：週五到週六的移動路徑 第 118～127 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("M", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(10) + 0.1, P.t["路徑預測　週五到週六"]);
  const M = drawMap(g, "ea");
  const lb = (name, dx, dy, t) => { const p = M.P(PLACE[name][0], PLACE[name][1]); return lbl(g, p[0] + dx, p[1] + dy, name, t, null); };
  lb(P.t["台灣"], 22, -6, T0(1));
  const tp = M.P(...P.g["pt1"]); pin(g, tp[0], tp[1], T0(1), null);
  const Ty = typhEl(g, M, 110, 200, T0(1), T1(10) + 0.1);
  putAt(M, Ty, ...P.g["pt7"]);
  const s1 = mpath(M, P.g["path1"], "#ffb199", 6, { glow: true });
  const s2 = mpath(M, P.g["path2"], "#ffb199", 6, { glow: true });
  const s3 = mpath(M, P.g["path3"], "#ffb199", 6, { glow: true });
  [s1, s2, s3].forEach((s) => { s.el.style.opacity = 1; });
  followT(M, Ty, s1, tw(1, "禮拜五的晚上") , T1(5) - tw(1, "禮拜五的晚上"), "power1.inOut");
  followT(M, Ty, s2, T0(6), T1(7) - T0(6), "power1.inOut");
  followT(M, Ty, s3, T0(8), T1(10) - T0(8), "power1.inOut");
  const P1 = M.P(...P.g["pt2"]), P2 = M.P(...P.g["pt3"]), P3 = M.P(...P.g["pt4"]);
  pin(g, P1[0], P1[1], T1(5), null); pin(g, P2[0], P2[1], T1(7), null); pin(g, P3[0], P3[1], T1(10), null);
  chip(g, P1[0] - 360, P1[1] - 10, P.t["週五晚上"], "r", tw(1, "禮拜五的晚上"), null, { x: -50 });
  chip(g, P2[0] - 420, P2[1] - 70, P.t["週六早上　那霸西方"], "c", tw(6, "禮拜六"), null, { x: -50 });
  chip(g, P3[0] - 470, P3[1] - 120, P.t["週六晚上　九州南方"], "i", tw(8, "禮拜六"), null, { x: -50 });
  stamp(g, 40, 585, P.t["拜拜　颱風走了"], tw(2, "拜拜"), T1(4), -5, GRN, 72);
  lb(P.t["那霸"], 14, 6, T0(6)); const np = M.P(...P.g["pt5"]); pin(g, np[0], np[1], T0(6), null);
  lb(P.t["九州"], 18, -30, tw(9, "九州"));
  lb(P.t["奄美島"], 18, -4, tw(10, "奄美島")); const ap = M.P(...P.g["pt6"]); pin(g, ap[0], ap[1], tw(10, "奄美島"), null);
  chip(g, 30, 24, P.t["往北移動　離開東北方海面"], "cy", tw(4, "往北"), T1(5) + 0.6, { y: -20 });
}
});
