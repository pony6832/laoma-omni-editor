// 場景 F：冷空氣灌進颱風 第 56～66 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("F", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(11) + 0.1, P.t["冷空氣灌進颱風"]);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const ty = mk("div", "typh", g, '<img src="assets/typhoon.png" alt="">', "width:440px;height:440px");
  gsap.set(ty, { x: 70, y: 170 });
  tl.fromTo(ty, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", immediateRender: false }, T0(1));
  tl.fromTo(ty.firstChild, { rotation: 0 }, { rotation: -360 * 4, duration: 24, ease: "none", immediateRender: false }, T0(1));
  chip(g, 30, 24, P.t["衛星雲圖"], "cy", tw(2, "衛星雲圖"), T1(3));
  const scan = mk("div", "", g, "", "position:absolute;left:0;top:0;width:1130px;height:6px;background:linear-gradient(90deg,transparent,#8fe4ff,transparent);opacity:0");
  tl.fromTo(scan, { opacity: 1, y: 0 }, { y: 754, duration: 1.8, ease: "none", immediateRender: false }, tw(2, "衛星雲圖"));
  tl.to(scan, { opacity: 0, duration: 0.2 }, tw(2, "衛星雲圖") + 1.8);
  // 冷空氣（藍色箭頭）從北方灌入
  const sv = se("svg", { class: "ovs", width: 1130, height: 760, viewBox: "0 0 1130 760" }, g);
  const df = se("defs", {}, sv), mkr = se("marker", { id: "ahF", viewBox: "0 0 10 10", refX: 6, refY: 5, markerWidth: 4, markerHeight: 4, orient: "auto" }, df);
  se("path", { d: "M0 0L10 5L0 10z", fill: "#7fc4ff" }, mkr);
  [130, 230, 330, 430].forEach((x, i) => {
    const p = se("path", { d: "M" + x + " 20 C" + (x + 20) + " 90 " + (x + 10) + " 140 " + (x + 30) + " 230", fill: "none", stroke: "#7fc4ff", "stroke-width": 8, "stroke-linecap": "round", "marker-end": "url(#ahF)" }, sv);
    const Lg = p.getTotalLength(); p.style.strokeDasharray = Lg; p.style.strokeDashoffset = Lg;
    const o = { p: 0 };
    tl.to(o, { p: 1, duration: 1.2, ease: "power2.out", onUpdate: () => { p.style.strokeDashoffset = Lg * (1 - o.p); } }, tw(3, "冷空氣") + i * 0.2);
    tl.to(p, { opacity: 0, duration: 0.4 }, T1(6));
  });
  const cold = mk("div", "", g, "", "position:absolute;left:40px;top:140px;width:500px;height:500px;border-radius:50%;background:radial-gradient(circle,rgba(70,140,255,0) 25%,rgba(70,140,255,.6) 100%);opacity:0");
  tl.fromTo(cold, { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: 1.2, immediateRender: false }, tw(3, "冷空氣") + 0.6);
  // 溫度計：熱的系統 → 被冷空氣灌進
  const tube = mk("div", "", g, "", "position:absolute;left:830px;top:60px;width:80px;height:330px;border-radius:40px;border:4px solid rgba(255,255,255,.7);background:rgba(10,16,34,.7);overflow:hidden;opacity:0");
  const fillR = mk("div", "", tube, "", "position:absolute;left:0;bottom:0;width:100%;height:100%;background:linear-gradient(0deg,#ff4d3d,#ff9a3d);transform-origin:bottom");
  const fillB = mk("div", "", tube, "", "position:absolute;left:0;bottom:0;width:100%;height:100%;background:linear-gradient(0deg,#3a7bff,#7fc4ff);transform-origin:bottom;opacity:0");
  tl.fromTo(tube, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, T0(4));
  tl.fromTo(fillR, { scaleY: 0.92 }, { scaleY: 0.3, duration: T1(6) - T0(5), ease: "power1.inOut", immediateRender: false }, T0(5));
  tl.fromTo(fillB, { opacity: 0, scaleY: 0.92 }, { opacity: 1, scaleY: 0.3, duration: T1(6) - T0(5), ease: "power1.inOut", immediateRender: false }, T0(5));
  chip(g, 640, 30, P.t["颱風＝熱的系統"], "c", tw(4, "熱的系統"), T0(5) + 0.5, { y: -20 });
  chip(g, 640, 400, P.t["冷空氣從高空灌入"], "cy", tw(5, "冷空氣"), T1(6), { y: 20 });
  // 強度折線
  const cp = mk("div", "glass", g, "", "left:620px;top:450px;width:480px;height:280px");
  tl.fromTo(cp, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4, immediateRender: false }, tw(7, "沒有再更強") - 0.3);
  mk("div", "", cp, P.t["颱風強度"], "position:absolute;left:20px;top:10px;font-size:30px;font-weight:800;color:#cfe3ff");
  const cs = se("svg", { width: 480, height: 280, viewBox: "0 0 480 280", style: "position:absolute;left:0;top:0" }, cp);
  const pts = [[60, 90], [230, 150], [420, 220]];
  const cl = se("path", { d: smoothD(pts, false), fill: "none", stroke: "#ff6a4d", "stroke-width": 7, "stroke-linecap": "round" }, cs);
  const cL = cl.getTotalLength(); cl.style.strokeDasharray = cL; cl.style.strokeDashoffset = cL;
  const co = { p: 0 };
  tl.to(co, { p: 1, duration: T1(11) - tw(7, "沒有再更強"), ease: "none", onUpdate: () => { cl.style.strokeDashoffset = cL * (1 - co.p); } }, tw(7, "沒有再更強"));
  [[P.t["今天下午"], 0, tw(7, "沒有再更強")], [P.t["明天"], 1, tw(9, "明天開始")], [P.t["東南外海"], 2, tw(11, "越接近")]].forEach((a) => {
    const d = se("circle", { cx: pts[a[1]][0], cy: pts[a[1]][1], r: 10, fill: "#fff", opacity: 0 }, cs);
    tl.fromTo(d, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, a[2]);
    const lb = mk("div", "", cp, a[0], "position:absolute;left:" + (pts[a[1]][0] - 40) + "px;top:" + (pts[a[1]][1] + 20) + "px;font-size:28px;font-weight:800;opacity:0");
    tl.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, a[2]);
  });
  const dn = mk("div", "", g, P.t["↓ 越來越弱"], "position:absolute;left:340px;top:640px;font-size:70px;font-weight:900;color:" + COR + ";opacity:0;text-shadow:0 0 20px rgba(255,106,77,.7)");
  tl.fromTo(dn, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: 0.3, immediateRender: false }, tw(8, "只有再更弱"));
  tl.to(dn, { opacity: 0, duration: 0.3 }, T1(11));
}
});
