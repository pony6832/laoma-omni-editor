// 場景 I：下雨區域 第 83～89 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("I", function (T0, T1, tw, te, P) {
{
  const { g, M } = twScene(T0(1) - 0.1, T1(7) + 0.1, P.t["北部東部飄雨"], "twz");
  const Ty = typhEl(g, M, 150, 0, T0(1), T1(7) + 0.1);
  putAt(M, Ty, ...P.g["pt2"]);
  rainRegion(g, M, NORTH.concat(EAST), tw(1, "下雨"), T1(4) + 1.0, { n: 200, seed: 4, k: 5 });
  chip(g, 30, 24, P.t["北部、東部　下雨"], "i", tw(1, "下雨"), T1(4) + 1.0, { y: -20 });
  const vap = mpath(M, P.g["path1"], "#bfe0ff", 9, { arrow: true, glow: true });
  showPath(vap, tw(3, "水氣")); follow(vap.el, [], tw(3, "水氣"), 1.4, "power2.out"); hidePath(vap, T1(4));
  chip(g, -20, 540, P.t["季風拉進水氣"], "cy", tw(3, "東北季風"), T1(4), { y: -20 });
  const sp = M.P(...P.g["pt1"]);
  sunIcon(g, sp[0], sp[1], tw(5, "桃園以南"), T1(7) + 0.3);
  chip(g, 30, 640, P.t["桃園以南　好天氣"], "y", tw(5, "桃園以南"), T1(7) + 0.3, { y: 30 });
  chip(g, -20, 650, P.t["週四　好天氣"], "g", tw(6, "禮拜四"), T1(7) + 0.3, { y: 30 });
}
});
