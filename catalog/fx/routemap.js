// 移植自圖鑑 routemap（地圖路線描繪）。原版：點陣地圖上，虛線路線逐段畫出，移動點拖著主色尾跡，經過的據點亮起。
// 參數：points 據點（0～1 的相對座標 [[x,y],…]）、drawSpan 路線畫完的秒數、dots 是否畫點陣底圖
// 注意：原版虛線流動用未取模的 t，移植版用本地時間 tt；原版 t<6 時兩者相同（比對範圍內逐像素相同）
fxDefine("routemap", {
  dur: 6,
  defaults: { points: [[0.12, 0.7], [0.3, 0.35], [0.52, 0.6], [0.7, 0.3], [0.88, 0.55]], drawSpan: 4.5, dots: true },
  draw(x, w, h, tt, P, C) {
    const { cl, rgb, A, FG, M } = C;
    C.clear(x, w, h);
    if (P.dots) { x.fillStyle = M; for (let j = 0; j < h; j += 10) for (let i = 0; i < w; i += 10) { const n = Math.sin(i * 0.013) + Math.cos(j * 0.017 + i * 0.004) + Math.sin((i + j) * 0.006); if (n > 0.4) x.fillRect(i, j, 3, 3); } }
    const pts = P.points, seg = pts.length - 1, p = cl(tt / P.drawSpan) * seg;
    const pt = (s) => { const a = Math.min(seg - 1, Math.floor(s)), f = s - a; return [(pts[a][0] + (pts[a + 1][0] - pts[a][0]) * f) * w, (pts[a][1] + (pts[a + 1][1] - pts[a][1]) * f) * h]; };
    x.strokeStyle = rgb(A); x.lineWidth = 3; x.setLineDash([8, 6]); x.lineDashOffset = -tt * 20; x.beginPath();
    for (let s = 0; s <= p; s += 0.02) { const q = pt(s); s ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]); }
    x.stroke(); x.setLineDash([]);
    pts.forEach(([px, py], i) => { if (i <= p + 0.01) { x.fillStyle = FG; x.beginPath(); x.arc(px * w, py * h, 5, 0, 7); x.fill(); } });
    for (let k = 0; k < 8; k++) { const q = pt(Math.max(0, p - k * 0.03)); x.fillStyle = rgb(A, 1 - k / 8); x.beginPath(); x.arc(q[0], q[1], 7 - k * 0.6, 0, 7); x.fill(); }
  },
});
