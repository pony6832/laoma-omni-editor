// ================= 工具函式 =================
const ST = $("#stage");
function topicChip(t0, t1, text) {
  const e = mk("div", "topic", $("#hdr"), text);
  tl.fromTo(e, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)", immediateRender: false }, t0 + 0.25);
  tl.to(e, { opacity: 0, duration: 0.25 }, t1 - 0.05);
}
function pscene(t0, t1, topic) {
  const g = mk("div", "pscene", ST);
  tl.fromTo(g, { opacity: 0, scale: 0.96, y: 24 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, t0);
  tl.to(g, { opacity: 0, duration: 0.3 }, t1 - 0.05);
  if (topic) topicChip(t0, t1, topic);
  g._t0 = t0; g._t1 = t1;
  return g;
}
function oscene(t0, t1) {
  const g = mk("div", "oscene", $("#ovl"));
  tl.set(g, { opacity: 1 }, t0);
  tl.set(g, { opacity: 0 }, t1);
  return g;
}
function pop(el, t, tOut, from) {
  tl.fromTo(el, Object.assign({ opacity: 0, scale: 0.7 }, from || {}), { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.4, ease: "back.out(1.8)", immediateRender: false }, t);
  if (tOut != null) tl.to(el, { opacity: 0, duration: 0.25 }, tOut);
}
function chip(g, x, y, html, k, t, tOut, from) {
  const e = mk("div", "chip " + (k || "c"), g, html, (x < 0 ? "right:" + -x : "left:" + x) + "px;top:" + y + "px");
  pop(e, t, tOut, from || { x: -60 });
  return e;
}
function lbl(g, x, y, text, t, tOut, css) {
  const e = mk("div", "lbl", g, text, "left:" + x + "px;top:" + y + "px;" + (css || ""));
  tl.fromTo(e, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, immediateRender: false }, t);
  if (tOut != null) tl.to(e, { opacity: 0, duration: 0.25 }, tOut);
  return e;
}
function pin(g, x, y, t, tOut) {
  const e = mk("div", "pin", g, "", "left:" + x + "px;top:" + y + "px");
  tl.fromTo(e, { opacity: 0, scale: 0.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(3)", immediateRender: false }, t);
  if (tOut != null) tl.to(e, { opacity: 0, duration: 0.2 }, tOut);
  return e;
}
function bignum(g, x, y, css, from, to, t, dur, suffix, tOut) {
  const e = mk("div", "bignum", g, "", "left:" + x + "px;top:" + y + "px;" + css);
  const num = mk("span", "", e, String(from)), sf = mk("small", "", e, suffix || "", "font-size:.4em;margin-left:10px;font-weight:800;color:#fff");
  tl.fromTo(e, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.7)", immediateRender: false }, t);
  const o = { v: from };
  tl.to(o, { v: to, duration: dur, ease: "power2.out", onUpdate: () => { num.textContent = Math.round(o.v).toLocaleString("en-US"); } }, t + 0.1);
  if (tOut != null) tl.to(e, { opacity: 0, duration: 0.25 }, tOut);
  return e;
}
function stamp(g, x, y, text, t, tOut, rot, color, size) {
  const e = mk("div", "stampbox", g, text, (x < 0 ? "right:" + -x : "left:" + x) + "px;top:" + y + "px;" + (color ? "color:" + color + ";border-color:" + color + ";" : "") + (size ? "font-size:" + size + "px;border-width:" + Math.round(size / 12) + "px;padding:4px " + Math.round(size / 3) + "px;letter-spacing:2px" : ""));
  tl.fromTo(e, { scale: 3, opacity: 0, rotation: rot - 10 }, { scale: 1, opacity: 1, rotation: rot, duration: 0.2, ease: "power4.in", immediateRender: false }, t);
  tl.fromTo(e, { x: 0 }, { x: 8, duration: 0.04, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, t + 0.2);
  if (tOut != null) tl.to(e, { opacity: 0, scale: 1.08, duration: 0.25 }, tOut);
  return e;
}
function rain(g, x, y, w, h, t0, t1, n, seed, clip) {
  const box = mk("div", "layer", g);
  box.style.opacity = 0;
  if (clip) box.style.clipPath = 'path("' + clip + '")';
  const r = rng(seed || 3);
  tl.fromTo(box, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t0);
  tl.to(box, { opacity: 0, duration: 0.3 }, t1 - 0.1);
  for (let i = 0; i < n; i++) {
    const d = mk("div", "drop", box), dx = x + r() * w, dy0 = y - 30, dd = 0.5 + r() * 0.4, st = t0 + r() * dd;
    d.style.left = dx + "px"; d.style.top = dy0 + "px";
    gsap.set(d, { rotation: 12, opacity: 0.9 });
    const rep = Math.max(0, Math.floor((t1 - st) / dd) - 1);
    tl.fromTo(d, { y: 0 }, { y: h + 50, x: -(h + 50) * 0.2, duration: dd, ease: "none", repeat: rep, immediateRender: false }, st);
  }
  return box;
}
// 沿 SVG 路徑前進並描出軌跡；els：[{el, h}]（h＝元素半徑，用來置中）
function follow(path, els, t0, dur, ease, onP) {
  const Lg = path.getTotalLength();
  path.style.strokeDasharray = Lg; path.style.strokeDashoffset = Lg;
  const o = { p: 0 };
  tl.to(o, {
    p: 1, duration: dur, ease: ease || "power1.inOut",
    onUpdate() {
      const pt = path.getPointAtLength(o.p * Lg);
      path.style.strokeDashoffset = Lg * (1 - o.p);
      if (path.dataset && path.dataset.mk) { if (o.p > 0.985) path.setAttribute("marker-end", path.dataset.mk); else path.removeAttribute("marker-end"); }
      els.forEach((e) => gsap.set(e.el, { x: pt.x - e.h, y: pt.y - e.h }));
      if (onP) onP(o.p, pt);
    },
  }, t0);
  return Lg;
}
function smoothD(pts, closed) {
  const n = pts.length;
  let d = "M" + pts[0][0].toFixed(1) + " " + pts[0][1].toFixed(1);
  const m = closed ? n : n - 1, g = (i) => pts[(i + n) % n];
  for (let i = 0; i < m; i++) {
    const p0 = closed ? g(i - 1) : pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = closed ? g(i + 1) : pts[i + 1], p3 = closed ? g(i + 2) : pts[Math.min(i + 2, n - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += "C" + c1[0].toFixed(1) + " " + c1[1].toFixed(1) + " " + c2[0].toFixed(1) + " " + c2[1].toFixed(1) + " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
  }
  return closed ? d + "Z" : d;
}
function lineD(pts, closed) { return "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L") + (closed ? "Z" : ""); }

// ---- 地理資料（經緯度）
const GEO = {
  ea: { lon0: 112, lat1: 36, kx: 37.6, ky: 42.2 },
  tw: { lon0: 116.7, lat1: 26.9, kx: 123.7, ky: 135 },
  twz: { lon0: 117.9, lat1: 25.75, kx: 169.6, ky: 185 },
};
const TAIWAN = [[121.54,25.30],[121.65,25.28],[121.78,25.19],[121.92,25.13],[122.0,25.02],[121.93,24.85],[121.87,24.6],[121.82,24.4],[121.62,24.08],[121.6,23.75],[121.52,23.5],[121.42,23.25],[121.33,23.05],[121.18,22.75],[121.0,22.45],[120.88,22.2],[120.85,21.92],[120.72,22.1],[120.7,22.35],[120.58,22.55],[120.3,22.62],[120.17,22.95],[120.1,23.3],[120.15,23.55],[120.2,23.8],[120.35,24.1],[120.52,24.3],[120.68,24.6],[120.82,24.85],[121.0,25.0],[121.2,25.1],[121.4,25.18]];
const CHINA = [[112,40],[122.6,40],[122.6,37.4],[121.0,36.8],[120.2,36.0],[119.3,35.3],[119.2,34.6],[120.3,33.5],[121.0,32.5],[121.9,31.7],[121.9,30.9],[121.0,30.4],[121.9,29.9],[121.6,28.8],[121.1,28.0],[120.6,27.2],[120.1,26.6],[119.7,25.8],[119.0,25.2],[118.7,24.8],[118.1,24.4],[117.3,23.6],[116.6,22.9],[115.5,22.7],[114.5,22.5],[113.5,22.2],[113.0,21.9],[112.0,21.7],[112,17]];
const KOREA = [[126.3,34.4],[127.2,34.5],[128.0,34.8],[129.0,35.1],[129.4,35.9],[129.5,40],[124.5,40],[125.6,37.8],[126.5,36.5],[126.4,35.2]];
const KYUSHU = [[129.8,33.6],[130.9,33.9],[131.7,33.6],[131.9,32.8],[131.6,31.6],[131.0,31.0],[130.6,31.2],[130.2,31.4],[130.2,32.3],[129.9,32.8],[129.7,33.1]];
const SHIKOKU = [[132.7,33.9],[133.9,34.3],[134.7,34.2],[134.5,33.6],[133.5,33.2],[132.9,32.8],[132.4,33.2]];
const HONSHU = [[130.9,34.0],[132.2,34.2],[133.4,34.4],[134.7,34.6],[135.2,34.7],[135.2,34.2],[135.9,33.5],[136.9,34.4],[137.6,34.6],[138.4,34.6],[139.0,34.7],[139.9,34.9],[140.3,35.2],[140.8,35.7],[140.9,36.5],[140.6,36.8],[137.0,37.0],[136.7,36.5],[136.2,35.9],[135.4,35.6],[134.0,35.6],[132.8,35.5],[131.7,34.9],[131.0,34.5]];
const PLACE = { 台灣: [121.0, 23.7], 那霸: [127.68, 26.21], 九州: [131.0, 32.3], 奄美島: [129.4, 28.3], 台北: [121.56, 25.04], 基隆: [121.74, 25.13], 宜蘭: [121.75, 24.75], 花蓮: [121.6, 23.98], 桃園: [121.3, 24.99], 新竹: [120.97, 24.8], 苗栗: [120.82, 24.56], 台中: [120.68, 24.15], 墾丁: [120.8, 21.95] };

function drawMap(g, kind) {
  const geo = GEO[kind], id = ++UID, isTW = kind !== "ea";
  const P = (lon, lat) => [(lon - geo.lon0) * geo.kx, (geo.lat1 - lat) * geo.ky];
  const bgd = mk("div", "pbg", g); mk("div", "ptint", g);
  tl.fromTo(bgd, { scale: 1.04 }, { scale: 1.14, duration: Math.max(4, (g._t1 || 10) - (g._t0 || 0)), ease: "none", immediateRender: false }, g._t0 || 0);
  const svg = se("svg", { class: "ovs", width: 1130, height: 760, viewBox: "0 0 1130 760" }, g);
  const defs = se("defs", {}, svg);
  const f = se("filter", { id: "gl" + id, x: "-20%", y: "-20%", width: "140%", height: "140%" }, defs);
  se("feGaussianBlur", { stdDeviation: 5, result: "b" }, f);
  const fm = se("feMerge", {}, f); se("feMergeNode", { in: "b" }, fm); se("feMergeNode", { in: "SourceGraphic" }, fm);
  const lg = se("linearGradient", { id: "lg" + id, x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
  se("stop", { offset: "0", "stop-color": "#35637d" }, lg); se("stop", { offset: "1", "stop-color": "#1f3f56" }, lg);
  const tg = se("linearGradient", { id: "tg" + id, x1: 0, y1: 0, x2: 0.4, y2: 1 }, defs);
  se("stop", { offset: "0", "stop-color": "#6aa9c6" }, tg); se("stop", { offset: "1", "stop-color": "#2f6f93" }, tg);
  const gr = se("g", { stroke: "rgba(160,205,255,.16)", "stroke-width": 1 }, svg);
  const stepLon = kind === "ea" ? 5 : 1, stepLat = kind === "ea" ? 5 : 1;
  for (let lo = Math.ceil(geo.lon0 / stepLon) * stepLon; lo < geo.lon0 + 1130 / geo.kx; lo += stepLon) { const x = P(lo, 0)[0]; se("line", { x1: x, y1: 0, x2: x, y2: 760 }, gr); }
  for (let la = Math.ceil((geo.lat1 - 760 / geo.ky) / stepLat) * stepLat; la < geo.lat1; la += stepLat) { const y = P(0, la)[1]; se("line", { x1: 0, y1: y, x2: 1130, y2: y }, gr); }
  const land = (pts, smooth, fill) => {
    const xy = pts.map((p) => P(p[0], p[1])), d = smooth ? smoothD(xy, true) : lineD(xy, true);
    se("path", { d, fill: fill || "url(#lg" + id + ")", stroke: "rgba(150,215,255,.85)", "stroke-width": 2.2, "stroke-linejoin": "round", filter: "url(#gl" + id + ")" }, svg);
    return d;
  };
  const LD = (isTW ? LANDTW : LANDEA).map((r) => lineD(r.map((p) => P(p[0], p[1])), true)).join("");
  se("path", { d: LD, fill: "none", stroke: "rgba(120,200,255,.22)", "stroke-width": 9, "stroke-linejoin": "round" }, svg);
  se("path", { d: LD, fill: "url(#lg" + id + ")", stroke: "rgba(150,215,255,.9)", "stroke-width": isTW ? 2.4 : 1.8, "stroke-linejoin": "round", filter: "url(#gl" + id + ")" }, svg);
  const twD = TWN.map((r) => lineD(r.map((p) => P(p[0], p[1])), true)).join("");
  const cd = {};
  Object.keys(TWC).forEach((n) => { cd[n] = TWC[n].map((r) => lineD(r.map((p) => P(p[0], p[1])), true)).join(""); });
  if (isTW) {
    se("path", { d: twD, fill: "url(#tg" + id + ")", stroke: "rgba(150,215,255,.95)", "stroke-width": 3, "stroke-linejoin": "round", filter: "url(#gl" + id + ")" }, svg);
    Object.keys(cd).forEach((n) => se("path", { d: cd[n], fill: "none", stroke: "rgba(230,245,255,.62)", "stroke-width": 1.4, "stroke-linejoin": "round" }, svg));
  } else {
    se("path", { d: twD, fill: "url(#tg" + id + ")", stroke: "rgba(150,215,255,.95)", "stroke-width": 2.2, "stroke-linejoin": "round", filter: "url(#gl" + id + ")" }, svg);
  }
  const ov = se("svg", { class: "ovs", width: 1130, height: 760, viewBox: "0 0 1130 760" }, g);
  const ovd = se("defs", {}, ov);
  const cp = se("clipPath", { id: "cp" + id }, ovd); se("path", { d: twD }, cp);
  const ah = se("marker", { id: "ah" + id, viewBox: "0 0 10 10", refX: 6, refY: 5, markerWidth: 5, markerHeight: 5, orient: "auto-start-reverse" }, ovd);
  se("path", { d: "M0 0L10 5L0 10z", fill: "context-stroke" }, ah);
  const M = { geo, P, svg, ov, defs: ovd, twD, cd, cpId: "cp" + id, ahId: "ah" + id, glId: "gl" + id, kind };
  M.regionD = (names) => names.map((n) => cd[n] || "").join("");
  return M;
}
// 縣市名稱（只標主要行政區）
function countyLabels(g, M, t0, t1) {
  const fs = M.kind === "twz" ? 24 : 19;
  Object.keys(TWL).forEach((k, i) => {
    const p = M.P(TWL[k][0], TWL[k][1]);
    const e = mk("div", "lbl", g, k, "left:" + (p[0] - fs * k.length * 0.5) + "px;top:" + (p[1] - fs * 0.6) + "px;font-size:" + fs + "px;font-weight:800;color:#eef7ff;text-shadow:0 1px 6px rgba(0,30,60,.95),0 0 3px rgba(0,30,60,.9)");
    tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t0 + 0.3 + i * 0.05);
    if (t1 != null) tl.to(e, { opacity: 0, duration: 0.25 }, t1 - 0.1);
  });
}
function mpath(M, ptsLL, color, w, opts) {
  opts = opts || {};
  const xy = ptsLL.map((p) => M.P(p[0], p[1]));
  const e = se("path", { d: smoothD(xy, false), fill: "none", stroke: color, "stroke-width": w, "stroke-linecap": "round", "stroke-linejoin": "round", filter: opts.glow ? "url(#" + M.glId + ")" : "none" }, M.ov);
  if (opts.dash) e.setAttribute("stroke-dasharray", opts.dash);
  if (opts.arrow) e.dataset.mk = "url(#" + M.ahId + ")";
  e.style.opacity = 0;
  return { el: e, xy };
}
// 颱風圖示＋暴風圈（以公里換算像素：1 緯度 ≈ 111 公里）
function typhEl(g, M, size, ringKm, t0, t1) {
  const spinDur = Math.max(2, (t1 || t0 + 20) - t0) / 6;
  const el = mk("div", "typh", g, '<img src="assets/typhoon.png" alt="">', "width:" + size + "px;height:" + size + "px");
  let ring = null;
  if (ringKm) {
    const rpx = (ringKm / 111) * M.geo.ky;
    ring = mk("div", "ring", g, "", "width:" + rpx * 2 + "px;height:" + rpx * 2 + "px");
    const dr = mk("div", "", ring, "", "position:absolute;left:12%;top:12%;width:76%;height:76%;border-radius:50%;border:3px dashed rgba(255,190,170,.75)");
    tl.fromTo(dr, { rotation: 0 }, { rotation: -360 * spinDur / 2, duration: spinDur * 6, ease: "none", immediateRender: false }, t0);
  }
  const halo = mk("div", "", g, "", "position:absolute;left:0;top:0;width:" + size * 1.9 + "px;height:" + size * 1.9 + "px;border-radius:50%;background:radial-gradient(circle,rgba(150,205,255,.55),rgba(150,205,255,0) 68%);opacity:0;pointer-events:none");
  g.insertBefore(halo, el);
  const img = el.firstChild;
  tl.fromTo(img, { rotation: 0 }, { rotation: -360 * spinDur, duration: spinDur * 6, ease: "none", immediateRender: false }, t0);
  tl.fromTo([el, halo], { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t0);
  tl.fromTo(halo.firstChild || halo, { scale: 1 }, { scale: 1, duration: 0.01, immediateRender: false }, t0);
  tl.to(halo, { scale: 1.12, duration: 1.3, yoyo: true, repeat: Math.max(0, Math.floor(((t1 || t0 + 20) - t0) / 1.3) - 1), ease: "sine.inOut" }, t0 + 0.4);
  if (ring) tl.fromTo(ring, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, t0);
  if (t1 != null) { tl.to([el, halo], { opacity: 0, duration: 0.3 }, t1); if (ring) tl.to(ring, { opacity: 0, duration: 0.3 }, t1); }
  return { el, ring, halo, h: size / 2, rh: ring ? (ringKm / 111) * M.geo.ky : 0, hh: size * 0.95 };
}
function putAt(M, t, lon, lat) { const p = M.P(lon, lat); gsap.set(t.el, { x: p[0] - t.h, y: p[1] - t.h }); gsap.set(t.halo, { x: p[0] - t.hh, y: p[1] - t.hh }); if (t.ring) gsap.set(t.ring, { x: p[0] - t.rh, y: p[1] - t.rh }); }
function followT(M, t, path, t0, dur, ease, extra) {
  const els = [{ el: t.el, h: t.h }, { el: t.halo, h: t.hh }]; if (t.ring) els.push({ el: t.ring, h: t.rh });
  return follow(path.el, els, t0, dur, ease, extra);
}
function showPath(path, t0, dur) { tl.fromTo(path.el, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, t0); }
function hidePath(path, t) { tl.to(path.el, { opacity: 0, duration: 0.3 }, t); }
function tri(g, cx, cy) { return null; }

/*__SCENES__*/
