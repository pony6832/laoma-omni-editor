// 場景 O：海警與陸警 第 133～149 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("O", function (T0, T1, tw, te, P) {
{
  const { g, M } = twScene(T0(1) - 0.1, T1(17) + 0.1, P.t["海警　陸警"], "tw");
  const Ty = typhEl(g, M, 130, 95, T0(1), T1(17) + 0.1);
  putAt(M, Ty, ...P.g["pt3"]);
  const buf = se("path", { d: M.twD, fill: "none", stroke: "rgba(255,200,100,.7)", "stroke-width": 60, "stroke-linejoin": "round", "stroke-dasharray": "2 14", "stroke-linecap": "round", opacity: 0 }, M.ov);
  tl.fromTo(buf, { opacity: 0 }, { opacity: 1, duration: 0.6, immediateRender: false }, tw(4, "近海"));
  const A = mpath(M, P.g["path1"], GRN, 7, { arrow: true, glow: true });
  showPath(A, tw(2, "北轉的角度"));
  followT(M, Ty, A, tw(2, "北轉的角度"), T1(4) - tw(2, "北轉的角度") + 0.5, "power1.inOut");
  chip(g, 30, 24, P.t["近海通過"], "g", tw(2, "北轉的角度"), T1(4) + 0.4, { y: -20 });
  chip(g, 30, 110, P.t["⚠　海警會發"], "y", tw(5, "海警"), T1(6), { y: -20 });
  const lp = M.P(...P.g["pt1"]);
  const land = mk("div", "", g, "？", "position:absolute;left:" + (lp[0] - 90) + "px;top:" + (lp[1] - 100) + "px;width:180px;height:200px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.55),rgba(255,255,255,0) 70%);font-size:110px;font-weight:900;text-align:center;line-height:200px;opacity:0");
  g.insertBefore(land, g.querySelector(".lbl"));
  tl.fromTo(land, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, yoyo: true, repeat: 3, immediateRender: false }, tw(6, "陸警"));
  tl.to(land, { opacity: 0, duration: 0.3 }, T1(7));
  chip(g, 30, 196, P.t["陸警？看暴風圈"], "r", tw(6, "陸警"), T1(7) + 0.3, { y: -20 });
  tl.fromTo(Ty.ring, { scale: 1 }, { scale: 0.65, duration: T1(9) - T0(8), ease: "power1.inOut", immediateRender: false }, T0(8));
  chip(g, 30, 282, P.t["暴風圈縮小"], "g", tw(9, "縮小"), T1(10) + 0.3, { y: -20 });
  chip(g, -20, 24, P.t["影響最明顯：週五"], "r", tw(11, "週五"), T1(11) + 0.4, { y: -20 });
  const rp = M.P(...P.g["pt2"]);
  const red = mk("div", "", g, "", "position:absolute;left:" + (rp[0] - 160) + "px;top:" + (rp[1] - 120) + "px;width:320px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(255,60,60,.6),rgba(255,60,60,0) 70%);opacity:0");
  tl.fromTo(red, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, immediateRender: false }, tw(12, "強的風雨區"));
  tl.to(red, { opacity: 0, duration: 0.3 }, T0(13));
  chip(g, -20, 110, P.t["強風雨區在海面"], "r", tw(12, "強的風雨區"), T1(12), { y: -20 });
  const Bp = mpath(M, P.g["path2"], RED, 8, { arrow: true, glow: true, dash: "14 10" });
  showPath(Bp, tw(13, "轉不過去")); follow(Bp.el, [], tw(13, "轉不過去"), 1.2, "power2.out"); hidePath(Bp, T0(15));
  chip(g, -20, 200, P.t["除非轉不過去"], "r", tw(13, "轉不過去"), T0(15), { y: -20 });
  chip(g, 30, 650, P.t["要轉上去了"], "g", tw(15, "轉上去"), null, { y: 30 });
  chip(g, -20, 650, P.t["往北偏"], "i", tw(16, "資料"), null, { y: 30 });
}
});
