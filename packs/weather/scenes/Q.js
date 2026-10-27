// 場景 Q：降雨分區 第 157～165 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("Q", function (T0, T1, tw, te, P) {
{
  const { g, M } = twScene(T0(1) - 0.1, T1(9) + 0.1, P.t["雨區與雲量分布"], "twz");
  rainRegion(g, M, NORTH5.concat(EAST), tw(2, "北部東部"), T1(5) + 1.0, { n: 200, seed: 9, k: 5 });
  chip(g, 30, 24, P.t["北部、東部降雨"], "i", tw(2, "北部東部"), T1(5) + 1.0, { y: -20 });
  chip(g, 30, 110, P.t["週五到週六早上"], "cy", tw(2, "週五"), T1(5) + 1.0, { y: -20 });
  tintRegion(M, MOUNT, "rgba(30,100,255,.5)", tw(4, "山區"), T1(5) + 0.8);
  chip(g, -20, 110, P.t["山區　雨較多"], "i", tw(4, "山區"), T1(5) + 0.8, { y: -20 });
  chip(g, -20, 196, P.t["平地　雨較少"], "cy", tw(5, "平地"), T1(5) + 0.8, { y: -20 });
  cloudsRegion(g, M, CSOUTH, tw(6, "新竹以南"), T1(9), { k: 7, w: 240 });
  [[P.t["新竹"], tw(6, "新竹")], [P.t["苗栗"], tw(7, "苗栗")], [P.t["台中"], tw(7, "台中")], [P.t["墾丁"], tw(7, "墾丁")]].forEach((a) => {
    const p = M.P(PLACE[a[0]][0], PLACE[a[0]][1]); pin(g, p[0], p[1], a[1], null);
  });
  chip(g, 30, 650, P.t["新竹以南雲量多"], "g", tw(8, "雲量多"), T1(9), { y: 30 });
  fogRegion(g, M, MOUNT, tw(9, "起霧"), T1(9), { k: 3 });
  rainRegion(g, M, P.r["r1"], tw(9, "陣雨"), T1(9), { n: 60, seed: 21, k: 2, tint: "rgba(60,140,255,.22)" });
  chip(g, -20, 560, P.t["山區起霧　零星陣雨"], "cy", tw(9, "起霧"), T1(9), { y: 30 });
}
});
