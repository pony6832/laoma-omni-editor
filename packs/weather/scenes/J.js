// 場景 J：北轉角度大／小 第 90～100 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("J", function (T0, T1, tw, te, P) {
{
  const { g, M } = twScene(T0(1) - 0.1, T1(11) + 0.1, P.t["北轉角度是關鍵"], "tw");
  const Ty = typhEl(g, M, 130, 95, T0(1), T1(11) + 0.1);
  putAt(M, Ty, ...P.g["pt3"]);
  chip(g, 30, 24, P.t["颱風最接近：週五"], "r", tw(1, "禮拜五") - 0.5, T1(2), { y: -20 });
  stamp(g, 15, 330, P.t["北轉是重點"], tw(4, "北轉的重點"), T1(4) + 0.5, -6, COR, 62);
  const A = mpath(M, P.g["path1"], GRN, 8, { arrow: true, glow: true });
  const B = mpath(M, P.g["path2"], RED, 8, { arrow: true, glow: true });
  showPath(A, tw(5, "北轉的角度大"));
  followT(M, Ty, A, tw(5, "北轉的角度大"), T1(7) - tw(5, "北轉的角度大"), "power1.inOut");
  chip(g, -20, 24, P.t["角度大：暴風圈在海面上"], "g", tw(6, "暴風圈"), T1(7) + 0.3, { y: -20 });
  hidePath(A, T0(8));
  const sB = M.P(...P.g["pt1"]);
  tl.fromTo(Ty.el, { x: sB[0] - Ty.h, y: sB[1] - Ty.h }, { x: sB[0] - Ty.h, y: sB[1] - Ty.h, duration: 0.01, immediateRender: false }, T0(8) - 0.05);
  tl.fromTo(Ty.halo, { x: sB[0] - Ty.hh, y: sB[1] - Ty.hh }, { x: sB[0] - Ty.hh, y: sB[1] - Ty.hh, duration: 0.01, immediateRender: false }, T0(8) - 0.05);
  tl.fromTo(Ty.ring, { x: sB[0] - Ty.rh, y: sB[1] - Ty.rh }, { x: sB[0] - Ty.rh, y: sB[1] - Ty.rh, duration: 0.01, immediateRender: false }, T0(8) - 0.05);
  showPath(B, tw(8, "角度小"));
  followT(M, Ty, B, tw(8, "角度小"), T1(9) - tw(8, "角度小"), "power1.inOut");
  chip(g, -20, 24, P.t["角度小：暴風圈碰到陸地"], "r", tw(9, "暴風圈"), T1(11), { y: -20 });
  const fp = M.P(...P.g["pt2"]);
  const flash = mk("div", "", g, "", "position:absolute;left:" + (fp[0] - 150) + "px;top:" + (fp[1] - 150) + "px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,77,94,.65),rgba(255,77,94,0) 70%);opacity:0");
  tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.5, yoyo: true, repeat: 3, immediateRender: false }, tw(9, "碰到我們"));
  tl.to(flash, { opacity: 0, duration: 0.3 }, T1(11));
  chip(g, 30, 650, P.t["觀察北轉角度"], "y", tw(10, "今天"), T1(11), { y: 30 });
}
});
