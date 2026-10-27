// 場景 B＋C：東亞地圖（冷高壓南下、颱風與環境場）第 12～38 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("BC", function (T0, T1, tw, te, P) {
{
  const t0 = T0(1) - 0.1, t1 = T1(27) + 0.1;
  const g = pscene(t0, t1, null);
  topicChip(T0(1), T1(14), P.t["冷高壓南下"]);
  topicChip(T0(15), T1(27), P.t["颱風進不來"]);
  const M = drawMap(g, "ea");
  const gB = mk("div", "layer", g), gC = mk("div", "layer", g);
  tl.fromTo(gB, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, T1(14));
  tl.fromTo(gC, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, T0(15) - 0.1);
  const ovB = se("g", {}, M.ov), ovC = se("g", {}, M.ov);
  tl.fromTo(ovB, { opacity: 1 }, { opacity: 0, duration: 0.4, immediateRender: false }, T1(14));
  gsap.set(ovC, { opacity: 0 });
  tl.fromTo(ovC, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, T0(15) - 0.1);
  const MB = Object.assign({}, M, { ov: ovB }), MC = Object.assign({}, M, { ov: ovC });
  const place = (name, dx, dy, t, tOut, css) => { const p = M.P(PLACE[name][0], PLACE[name][1]); return lbl(g, p[0] + dx, p[1] + dy, name, t, tOut, css); };
  place(P.t["台灣"], 24, -6, T0(1) + 0.5, null);
  const tp = M.P(...P.g["pt1"]); pin(g, tp[0], tp[1], T0(1) + 0.5, null);

  // ---- 颱風本體（全程）
  const Ty = typhEl(g, M, 120, 250, T0(1) + 0.3, t1);
  putAt(M, Ty, ...P.g["pt2"]);
  chip(gB, 300, 24, P.t["目前：週三"], "i", T0(1) + 0.3, T1(14));
  lbl(g, M.P(...P.g["pt2"])[0] + 62, M.P(...P.g["pt2"])[1] - 10, P.t["颱風"], T0(1) + 0.7, null);
  const turn = mpath(MB, P.g["path1"], CYA, 6, { arrow: true, glow: true });
  showPath(turn, tw(2, "轉彎"));
  follow(turn.el, [], tw(2, "轉彎"), 1.0, "power2.out");
  tl.to(turn.el, { opacity: 0, duration: 0.4 }, T1(3) + 0.6);
  lbl(gB, 450, 140, P.t["正在轉彎"], tw(2, "轉彎"), T1(3) + 0.5, "color:" + CYA);

  // ---- B：冷高壓下來了
  const hp = M.P(...P.g["pt3"]);
  const H = mk("div", "", gB, P.t["高"], "position:absolute;left:0;top:0;width:100px;height:100px;margin:-50px 0 0 -50px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#9fd0ff,#2d5fd0 70%);border:4px solid #fff;font-size:58px;font-weight:900;text-align:center;line-height:92px;box-shadow:0 0 40px rgba(95,160,255,.9);opacity:0");
  gsap.set(H, { x: hp[0], y: hp[1] });
  const cold = mk("div", "", gB, "", "position:absolute;left:-200px;top:-260px;width:800px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(80,150,255,.55),rgba(80,150,255,0) 70%);opacity:0");
  tl.fromTo(cold, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out", immediateRender: false }, tw(4, "冷高壓"));
  tl.fromTo(H, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", immediateRender: false }, tw(4, "冷高壓"));
  [0, 1, 2].forEach((i) => {
    const rg = mk("div", "ring", gB, "", "width:100px;height:100px;border-color:#7fb5ff;background:none");
    gsap.set(rg, { x: hp[0] - 50, y: hp[1] - 50 });
    tl.fromTo(rg, { opacity: 0.9, scale: 1 }, { opacity: 0, scale: 2.2, duration: 1.6, ease: "power1.out", repeat: 6, immediateRender: false }, tw(4, "冷高壓") + i * 0.55);
  });
  lbl(gB, hp[0] + 60, hp[1] - 22, P.t["冷高壓"], tw(4, "冷高壓") + 0.2, null, "font-size:36px;color:#9fd0ff");
  // 北部風起、變涼
  chip(gB, 520, 250, P.t["北部　風起、變涼"], "cy", tw(7, "風開始"), T1(8) + 0.3, { x: 60 });
  const wind = [0, 1, 2].map((i) => mpath(MB, [[121.6 + i * 0.1, 26.1 + i * 0.35], [122.2, 25.6 + i * 0.25], [122.9, 25.2 + i * 0.3]], "#d6ecff", 3, { glow: true }));
  wind.forEach((w, i) => { showPath(w, tw(7, "風開始") + i * 0.2); follow(w.el, [], tw(7, "風開始") + i * 0.2, 0.9, "power2.out"); tl.to(w.el, { opacity: 0, duration: 0.3 }, T1(8) + 0.2); });
  // 東北季風南下（三條箭頭）
  const mon = [0, 1, 2].map((i) => mpath(MB, [[129.2 - i * 1.2, 30.4 - i * 0.8], [126.6 - i * 0.9, 28.0 - i * 0.7], [123.6 - i * 0.5, 25.8 - i * 0.7]], CYA, 6, { arrow: true, glow: true }));
  mon.forEach((m, i) => { showPath(m, tw(9, "東北季風") + i * 0.25); follow(m.el, [], tw(9, "東北季風") + i * 0.25, 1.2, "power2.out"); tl.to(m.el, { opacity: 0, duration: 0.4 }, T1(10)); });
  chip(gB, 620, 40, P.t["東北季風　逐漸南下"], "cy", tw(9, "東北季風"), T1(10));
  // 儀表（gauge）：冷高壓中心 1038 百帕
  const gx = 690, gy = 30;
  const gw = mk("div", "glass", gB, "", "left:" + gx + "px;top:" + gy + "px;width:410px;height:290px");
  tl.fromTo(gw, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, tw(11, "中心") - 0.2);
  const gs = se("svg", { width: 360, height: 200, viewBox: "0 0 360 200", style: "position:absolute;left:25px;top:10px" }, gw);
  se("path", { d: "M40 170 A140 140 0 0 1 320 170", fill: "none", stroke: "rgba(255,255,255,.18)", "stroke-width": 22, "stroke-linecap": "round" }, gs);
  const arc = se("path", { d: "M40 170 A140 140 0 0 1 320 170", fill: "none", stroke: "url(#gg" + UID + ")", "stroke-width": 22, "stroke-linecap": "round" }, gs);
  const gdf = se("defs", {}, gs), gg = se("linearGradient", { id: "gg" + UID, x1: 0, y1: 0, x2: 1, y2: 0 }, gdf);
  se("stop", { offset: "0", "stop-color": "#5fd0ff" }, gg); se("stop", { offset: "1", "stop-color": "#ff6a4d" }, gg);
  const alen = Math.PI * 140; arc.style.strokeDasharray = alen; arc.style.strokeDashoffset = alen;
  const gv = { p: 0 };
  tl.to(gv, { p: 0.76, duration: 1.4, ease: "power2.out", onUpdate: () => { arc.style.strokeDashoffset = alen * (1 - gv.p); } }, tw(11, "1038") - 0.5);
  mk("div", "", gw, P.t["冷高壓中心"], "position:absolute;left:0;right:0;top:12px;text-align:center;font-size:30px;font-weight:800;color:#cfe3ff");
  bignum(gw, 40, 128, "font-size:88px;color:#fff",...P.n["bignum1"], tw(11, "1038") - 0.5, 1.4, P.t["百帕"]);
  tl.to(gw, { opacity: 0, duration: 0.3 }, T1(12) + 0.2);
  // 高壓移動路徑：西北 → 華北 → 江南
  const hpath = mpath(MB, P.g["path2"], "#9fd0ff", 5, { dash: "10 10", glow: true, arrow: true });
  showPath(hpath, tw(12, "正在由"));
  follow(hpath.el, [{ el: H, h: 0 }], tw(12, "正在由"), T1(14) - tw(12, "正在由") + 0.2, "none", (p) => { gsap.set(H, { x: "+=0" }); });
  [[P.t["西北地區"], ...P.g["pt9"], P.t["西北地區"]], [P.t["華北"], ...P.g["pt10"], P.t["華北"]], [P.t["江南"], ...P.g["pt11"], P.t["江南地區"]]].forEach((a) => {
    const p = M.P(a[1], a[2]); lbl(gB, p[0] + 36, p[1] - 10, a[0], tw(12, a[3]), T1(14), "color:#dff0ff");
  });
  bignum(gB, 640, 110, "font-size:100px;color:" + CYA,...P.n["bignum2"], tw(14, "35公里") - 0.5, 1.2, P.t["公里／小時"]);
  lbl(gB, 642, 74, P.t["冷空氣南下速度"], tw(13, "冷空氣"), null, "font-size:34px");

  // ---- C：颱風與環境場
  const t26 = tw(15, "1000公里");
  const lineP = mpath(MC, P.g["path3"], CYA, 4, { dash: "10 8", glow: true });
  showPath(lineP, T0(15) + 0.3); follow(lineP.el, [], T0(15) + 0.3, 1.2, "power2.out");
  chip(gC, 330, 330, P.t["距離台灣　約"], "cy", T0(15) + 0.5, T1(15) + 1, { x: 0, y: 30 });
  bignum(gC, 330, 400, "font-size:96px;color:#fff",...P.n["bignum3"], t26 - 0.3, 1.5, P.t["公里"], T1(17));
  // 台灣東北季風環境場
  const env = mk("div", "", gC, "", "left:0;top:0;position:absolute;width:420px;height:340px;border-radius:50%;background:radial-gradient(circle,rgba(95,208,255,.55),rgba(95,208,255,0) 72%);opacity:0");
  gsap.set(env, { x: tp[0] - 210, y: tp[1] - 170 });
  tl.fromTo(env, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out", immediateRender: false }, tw(16, "環境場"));
  chip(gC, 30, 24, P.t["台灣環境場：東北季風"], "cy", tw(16, "環境場"), T1(20));
  [0, 1, 2].forEach((i) => {
    const m = mpath(MC, [[124.6 - i * 0.7, 28.4 - i * 0.6], [123.3 - i * 0.5, 26.5 - i * 0.6], [121.9 - i * 0.2, 24.8 - i * 0.7]], CYA, 6, { arrow: true, glow: true });
    showPath(m, tw(17, "東北季風") + i * 0.3); follow(m.el, [], tw(17, "東北季風") + i * 0.3, 1.1, "power2.out"); tl.to(m.el, { opacity: 0, duration: 0.4 }, T1(20));
  });
  // 屏障＋颱風被擋
  const wallP = mpath(MC, P.g["path4"], "#8fe4ff", 12, { glow: true, dash: "4 14" });
  showPath(wallP, tw(19, "環境場")); follow(wallP.el, [], tw(19, "環境場"), 0.9, "power2.out"); tl.to(wallP.el, { opacity: 0, duration: 0.4 }, T1(20) + 0.5);
  const b1 = mpath(MC, P.g["path5"], "rgba(255,255,255,0)", 1, {});
  followT(MC, Ty, b1, tw(19, "颱風") + 0.2, T1(20) - tw(19, "颱風") - 1.2, "power1.inOut");
  stamp(gC, 300, 120, P.t["進不來！"], tw(20, "不可能"), T1(21), -7, RED, 96);
  // 鋒面
  const front = P.g["path6"];
  const fxy = front.map((p) => M.P(p[0], p[1]));
  const fg = se("g", {}, ovC);
  const fcloud = se("path", { d: smoothD(fxy, false), fill: "none", stroke: "rgba(215,235,255,.35)", "stroke-width": 44, "stroke-linecap": "round", filter: "url(#" + M.glId + ")" }, fg);
  const fline = se("path", { d: smoothD(fxy, false), fill: "none", stroke: "#58a6ff", "stroke-width": 5, "stroke-linecap": "round" }, fg);
  const flen = fline.getTotalLength();
  for (let s = 30; s < flen; s += 46) {
    const a = fline.getPointAtLength(s), b = fline.getPointAtLength(s + 2), ang = Math.atan2(b.y - a.y, b.x - a.x);
    const nx = Math.sin(ang), ny = -Math.cos(ang); // 往東南側（左下）
    const sx = a.x + nx * -1 * 0, tx = a.x - nx * 16, ty = a.y - ny * 16;
    se("polygon", { points: (a.x - Math.cos(ang) * 9) + "," + (a.y - Math.sin(ang) * 9) + " " + (a.x + Math.cos(ang) * 9) + "," + (a.y + Math.sin(ang) * 9) + " " + tx + "," + ty, fill: "#58a6ff" }, fg);
  }
  gsap.set(fg, { opacity: 0 });
  tl.fromTo(fg, { opacity: 0 }, { opacity: 1, duration: 1.0, immediateRender: false }, tw(21, "鋒面雲帶") - 0.5);
  tl.fromTo(fg, { x: 0, y: 0 }, { x: 16, y: 46, duration: T1(26) - tw(26, "逐漸到達") + 0.4, ease: "power1.inOut", immediateRender: false }, tw(26, "逐漸到達") - 0.4);
  const fp = M.P(...P.g["pt4"]);
  lbl(gC, fp[0] - 70, fp[1] - 60, P.t["鋒面雲帶"], tw(21, "鋒面雲帶"), T1(24) + 1, "font-size:38px;color:#bfe0ff");
  place(P.t["九州"], 20, -40, tw(23, "日本"), T1(26));
  const jp = M.P(...P.g["pt5"]); lbl(gC, jp[0] - 20, jp[1] - 10, P.t["日本"], tw(23, "日本"), T1(26) + 0.5, "font-size:34px");
  const ec = M.P(...P.g["pt6"]); lbl(gC, ec[0] - 100, ec[1] - 40, P.t["東海"], tw(23, "東海"), T1(26) + 0.5, "font-size:34px");
  rain(gC, M.P(...P.g["pt7"])[0], M.P(...P.g["pt7"])[1], 280, 190, tw(25, "日本"), T1(26), 36, 5);
  const np = M.P(...P.g["pt8"]); pin(gC, np[0], np[1], tw(26, "那霸"), null);
  lbl(gC, np[0] + 16, np[1] - 8, P.t["那霸"], tw(26, "那霸"), null, "color:" + GLD);
  // 颱風沿鋒面雲帶向東北
  const along = mpath(MC, P.g["path7"], "#ffb199", 6, { glow: true, arrow: true });
  showPath(along, tw(27, "這個系統"));
  followT(MC, Ty, along, tw(27, "這個系統"), T1(27) - tw(27, "這個系統") + 0.2, "power1.inOut");
}
});
