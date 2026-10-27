// 場景 L：週五降雨分布 第 113～117 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("L", function (T0, T1, tw, te, P) {
{
  const { g, M } = twScene(T0(1) - 0.1, T1(5) + 0.1, P.t["週五　降雨分布"], "twz");
  const Ty = typhEl(g, M, 130, 0, T0(1), T1(5) + 0.1);
  putAt(M, Ty, ...P.g["pt1"]);
  chip(g, 30, 24, P.t["週五"], "r", T0(2), T1(5), { y: -20 });
  rainRegion(g, M, NORTH.concat(EAST), tw(3, "下雨"), T1(5), { n: 200, seed: 7, k: 5 });
  chip(g, 30, 110, P.t["北部、東半部　下雨"], "i", tw(3, "北部"), T1(5), { y: -20 });
  cloudsRegion(g, M, CSOUTH, tw(4, "雲層多"), T1(5), { k: 6, w: 240 });
  chip(g, 30, 196, P.t["中南部　雲層多"], "g", tw(4, "中部南部"), T1(5), { y: -20 });
  const cir = mpath(M, P.g["path1"], "#ffb199", 8, { arrow: true, glow: true, dash: "14 9" });
  showPath(cir, tw(5, "外圍")); follow(cir.el, [], tw(5, "外圍"), 1.5, "power2.out"); hidePath(cir, T1(5));
  chip(g, -20, 650, P.t["外圍環流影響"], "c", tw(5, "外圍"), T1(5), { y: 30 });
}
});
