// ================= 台灣地圖場景與天氣特效 =================
const NORTH = ["基隆市", "台北市", "新北市", "桃園市"];
const NORTH5 = NORTH.concat(["新竹縣", "新竹市"]);
const EAST = ["宜蘭縣", "花蓮縣", "台東縣"];
const CSOUTH = ["苗栗縣", "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義縣", "嘉義市", "台南市", "高雄市", "屏東縣"];
const MOUNT = ["南投縣", "台中市", "花蓮縣"];

function twScene(t0, t1, topic, kind) {
  const g = pscene(t0, t1, topic);
  const M = drawMap(g, kind || "tw");
  countyLabels(g, M, t0, t1);
  return { g, M };
}
function regionBox(M, names) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  names.forEach((n) => (TWC[n] || []).forEach((r) => r.forEach((p) => { const q = M.P(p[0], p[1]); x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); })));
  return { x0, y0, x1, y1, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, w: x1 - x0, h: y1 - y0 };
}
function regionClip(M, names) {
  const id = "rc" + (++UID), cp = se("clipPath", { id }, M.defs);
  names.forEach((n) => se("path", { d: M.cd[n] }, cp));
  return id;
}
function tintRegion(M, names, color, t0, t1) {
  const gt = se("g", { "clip-path": "url(#" + regionClip(M, names) + ")" }, M.ov);
  se("rect", { x: 0, y: 0, width: 1130, height: 760, fill: color }, gt);
  gsap.set(gt, { opacity: 0 });
  tl.fromTo(gt, { opacity: 0 }, { opacity: 1, duration: 0.7, immediateRender: false }, t0);
  if (t1 != null) tl.to(gt, { opacity: 0, duration: 0.4 }, t1);
  return gt;
}
function sprite(g, src, x, y, w, op, t0, t1, drift, delay) {
  const e = mk("img", "", g, "", "position:absolute;left:" + x + "px;top:" + y + "px;width:" + w + "px;opacity:0;pointer-events:none");
  e.src = src;
  tl.fromTo(e, { opacity: 0, x: -drift }, { opacity: op, x: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, t0 + delay);
  tl.to(e, { x: drift, duration: Math.max(2, t1 - t0), ease: "none" }, t0 + delay + 0.9);
  if (t1 != null) tl.to(e, { opacity: 0, duration: 0.5 }, t1);
  return e;
}
// 雨：區域藍色著色＋雨雲＋斜向雨絲＋地面漣漪
function rainRegion(g, M, names, t0, t1, o) {
  o = o || {};
  const b = regionBox(M, names), r = rng(o.seed || 5), n = o.n || 260, k = o.k || 4;
  tintRegion(M, names, o.tint || "rgba(55,135,255,.42)", t0, t1);
  for (let i = 0; i < k; i++) {
    const w = Math.max(360, b.w * 1.9) * (0.85 + r() * 0.5);
    sprite(g, "assets/raincloud.png", b.cx - w / 2 + (i - (k - 1) / 2) * b.w * 0.3, b.y0 - w * 0.42 + r() * 24, w, 0.95, t0, t1, 24 + r() * 16, i * 0.15);
  }
  const fl = mk("div", "", g, "", "position:absolute;left:" + (b.cx - b.w) + "px;top:" + (b.y0 - b.h * 0.5) + "px;width:" + b.w * 2 + "px;height:" + b.h * 1.5 + "px;border-radius:50%;background:radial-gradient(circle,rgba(225,238,255,.8),rgba(225,238,255,0) 70%);opacity:0;mix-blend-mode:screen");
  [1.3, 3.0, 4.7].forEach((dt) => { if (t0 + dt + 0.5 < t1) tl.fromTo(fl, { opacity: 0 }, { opacity: 0.9, duration: 0.07, yoyo: true, repeat: 3, ease: "none", immediateRender: false }, t0 + dt); });
  const box = mk("div", "layer", g);
  box.style.opacity = 0;
  box.style.clipPath = 'path("' + M.regionD(names) + '")';
  tl.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, t0 + 0.3);
  tl.to(box, { opacity: 0, duration: 0.3 }, t1 - 0.1);
  for (let i = 0; i < n; i++) {
    const d = mk("div", "drop", box), dd = 0.34 + r() * 0.3, st = t0 + 0.3 + r() * dd;
    d.style.left = b.x0 - 40 + r() * (b.w + 80) + "px"; d.style.top = b.y0 - 60 + "px";
    gsap.set(d, { rotation: 14, opacity: 0.55 + r() * 0.45 });
    const rep = Math.max(0, Math.floor((t1 - st) / dd) - 1);
    tl.fromTo(d, { y: 0, x: 0 }, { y: b.h + 110, x: -(b.h + 110) * 0.25, duration: dd, ease: "none", repeat: rep, immediateRender: false }, st);
  }
  for (let i = 0; i < 18; i++) {
    const cx = b.x0 + r() * b.w, cy = b.y0 + r() * b.h;
    const e = mk("div", "", box, "", "position:absolute;left:" + (cx - 15) + "px;top:" + (cy - 6) + "px;width:30px;height:12px;border-radius:50%;border:2px solid rgba(215,238,255,.95);opacity:0");
    const dd = 0.7 + r() * 0.5, st = t0 + 0.4 + r() * dd, rep = Math.max(0, Math.floor((t1 - st) / dd) - 1);
    tl.fromTo(e, { scale: 0.2, opacity: 0.95 }, { scale: 1.4, opacity: 0, duration: dd, ease: "power1.out", repeat: rep, immediateRender: false }, st);
  }
}
// 雲層：白色積雲飄移
function cloudsRegion(g, M, names, t0, t1, o) {
  o = o || {};
  const b = regionBox(M, names), r = rng(o.seed || 8), k = o.k || 6;
  for (let i = 0; i < k; i++) {
    const w = (o.w || 240) * (0.8 + r() * 0.5), col = i % 2;
    sprite(g, "assets/cloud.png", b.x0 + b.w * (0.25 + col * 0.5) - w / 2 + (r() - 0.5) * 40, b.y0 + (i / Math.max(1, k - 1)) * b.h * 0.95 - w * 0.2, w, o.op || 0.88, t0, t1, 16 + r() * 12, i * 0.12);
  }
}
// 山區霧氣
function fogRegion(g, M, names, t0, t1, o) {
  o = o || {};
  const b = regionBox(M, names), r = rng(o.seed || 12), k = o.k || 3;
  for (let i = 0; i < k; i++) {
    const w = 420 + r() * 140;
    sprite(g, "assets/mist.png", b.cx - w / 2 + (r() - 0.5) * 70, b.cy - w * 0.28 + (i - (k - 1) / 2) * 80, w, 0.95, t0, t1, 46, i * 0.2);
  }
}
function sunIcon(g, x, y, t0, t1) {
  const s = mk("div", "", g, "", "position:absolute;left:" + (x - 190) + "px;top:" + (y - 190) + "px;width:380px;height:380px;border-radius:50%;background:radial-gradient(circle,rgba(255,215,110,.75),rgba(255,200,80,0) 66%);opacity:0");
  const ic = mk("div", "", g, iconSun(), "position:absolute;left:" + (x - 32) + "px;top:" + (y - 32) + "px;width:64px;height:64px;opacity:0");
  tl.fromTo(s, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", immediateRender: false }, t0);
  tl.to(s, { scale: 1.1, duration: 0.9, yoyo: true, repeat: Math.max(0, Math.floor((t1 - t0 - 0.8) / 0.9) - 1), ease: "sine.inOut" }, t0 + 0.8);
  tl.fromTo(ic, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 2.4, duration: 0.7, ease: "back.out(1.8)", immediateRender: false }, t0 + 0.1);
  tl.to(ic.firstChild, { rotation: 180, duration: Math.max(2, t1 - t0), ease: "none", transformOrigin: "50% 50%" }, t0 + 0.1);
  tl.to([s, ic], { opacity: 0, duration: 0.3 }, t1);
}
function waves(g, M, t0, t1) {
  const o = M.P(122.35, 25.0), o2 = M.P(122.35, 22.6);
  [0, 1, 2, 3].forEach((i) => {
    const pts = [];
    for (let k = 0; k <= 10; k++) pts.push([o[0] + i * 34 + Math.sin(k * 1.2 + i) * 12, o[1] + (o2[1] - o[1]) * (k / 10)]);
    const p = se("path", { d: smoothD(pts, false), fill: "none", stroke: "rgba(215,238,255," + (0.95 - i * 0.14) + ")", "stroke-width": 6 - i, "stroke-linecap": "round", "stroke-dasharray": "40 24" }, M.ov);
    p.style.opacity = 0;
    tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t0 + i * 0.15);
    tl.fromTo(p, { strokeDashoffset: 0 }, { strokeDashoffset: -128, duration: Math.max(2, t1 - t0), ease: "none", immediateRender: false }, t0);
    tl.to(p, { opacity: 0, duration: 0.3 }, t1);
  });
}
