// 場景 D：山谷比喻 第 39～48 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("D", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(10) + 0.1, P.t["高壓是山　颱風走山谷"]);
  g.style.background = "#0c1a33 url(assets/valley.png) center / cover no-repeat";
  mk("div", "ptint", g);
  const sv = se("svg", { class: "ovs", width: 1130, height: 760, viewBox: "0 0 1130 760" }, g);
  const defs = se("defs", {}, sv);
  const gl = se("filter", { id: "vg" + (++UID), x: "-30%", y: "-30%", width: "160%", height: "160%" }, defs); se("feGaussianBlur", { stdDeviation: 6, result: "b" }, gl);
  const fm = se("feMerge", {}, gl); se("feMergeNode", { in: "b" }, fm); se("feMergeNode", { in: "SourceGraphic" }, fm);
  const vp = [[565, 620], [560, 540], [585, 450], [575, 390], [570, 350]];
  const vd = smoothD(vp, false);
  const road = se("path", { d: vd, fill: "none", stroke: "rgba(255,200,170,.9)", "stroke-width": 18, "stroke-linecap": "round", filter: "url(#vg" + UID + ")" }, sv);
  road.style.opacity = 0;
  const T2 = mk("div", "typh", g, '<img src="assets/typhoon.png" alt="">', "width:200px;height:200px");
  tl.fromTo(T2.firstChild, { rotation: 0 }, { rotation: -360 * 6, duration: 36, ease: "none", immediateRender: false }, T0(4));
  gsap.set(T2, { x: 565 - 100, y: 620 - 100, scale: 1 });
  tl.fromTo(T2, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, tw(4, "颱風") - 0.3);
  const Lg = road.getTotalLength(); road.style.strokeDasharray = Lg; road.style.strokeDashoffset = Lg;
  const o = { p: 0 };
  tl.to(o, { p: 1, duration: T1(10) - tw(4, "颱風") + 0.1, ease: "power1.inOut", onUpdate() {
    const pt = road.getPointAtLength(o.p * Lg), sc = 1 - 0.78 * o.p;
    road.style.strokeDashoffset = Lg * (1 - o.p);
    gsap.set(T2, { x: pt.x - 100, y: pt.y - 100, scale: sc });
  } }, tw(4, "颱風"));
  tl.fromTo(road, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, tw(4, "颱風"));
  // 標籤
  chip(g, 40, 28, P.t["兩個高壓　＝　山"], "i", tw(2, "兩個高壓"), T1(3), { y: -30 });
  chip(g, 380, 90, P.t["山中間　＝　山谷"], "y", tw(3, "山中間"), null, { y: -30 });
  chip(g, 40, 300, P.t["大陸冷高壓"], "i", tw(8, "大陸冷高壓"), null, { x: -80 });
  chip(g, 800, 130, P.t["太平洋高壓"], "c", tw(7, "太平洋高壓"), null, { x: 80 });
  chip(g, 360, 650, P.t["颱風未來要走的路線"], "c", tw(10, "颱風未來"), null, { y: 40 });
  // 不會爬山
  const nx = mk("div", "", g, "✕", "position:absolute;left:250px;top:420px;font-size:150px;font-weight:900;color:" + RED + ";text-shadow:0 0 30px rgba(255,77,94,.9);opacity:0");
  tl.fromTo(nx, { opacity: 0, scale: 3 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power4.in", immediateRender: false }, tw(6, "不會爬山"));
  tl.to(nx, { opacity: 0, duration: 0.3 }, T1(6) + 0.4);
  const wiggle = mk("div", "", g, P.t["不會爬山"], "position:absolute;left:180px;top:560px;font-size:64px;font-weight:900;color:#fff;text-shadow:0 4px 12px rgba(0,0,0,.8);opacity:0");
  tl.fromTo(wiggle, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, immediateRender: false }, tw(6, "不會爬山"));
  tl.to(wiggle, { opacity: 0, duration: 0.3 }, T1(6) + 0.4);
}
});
