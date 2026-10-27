// 移植自圖鑑 linechart（折線描繪）。原版：折線與下方面積由左往右逐步描出，前端有脈動亮點，背景有三條格線。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   data 各點高度（0～1，至少 2 個點）、span 描完的秒數（原版 2.4）
fxDefine("linechart", {
  dur: 4.5,
  defaults: { data: [0.3, 0.42, 0.36, 0.55, 0.5, 0.66, 0.62, 0.8, 0.92], span: 2.4, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC } = K;
    const { A, FG, M } = K;
    K.clear(x, w, h);
    const T = 4.5, tt = t % T, d = P.data, n = d.length, L = w * 0.1, R = w * 0.9, base = h * 0.85, fade = 1 - cl((tt - 4) / 0.4), p = eOC(cl(tt / P.span));
    const pts = d.map((v, i) => [L + ((R - L) * i) / (n - 1), base - v * h * 0.65]); x.globalAlpha = fade; x.strokeStyle = M; x.lineWidth = 1;
    for (let k = 1; k <= 3; k++) { const Yp = base - k * h * 0.2; x.beginPath(); x.moveTo(L, Yp); x.lineTo(R, Yp); x.stroke(); }
    x.save(); x.beginPath(); x.rect(0, 0, L + (R - L) * p, h); x.clip(); const g = x.createLinearGradient(0, h * 0.15, 0, base); g.addColorStop(0, rgb(A, 0.35)); g.addColorStop(1, rgb(A, 0));
    x.fillStyle = g; x.beginPath(); x.moveTo(L, base); pts.forEach((q) => x.lineTo(q[0], q[1])); x.lineTo(R, base); x.closePath(); x.fill();
    x.strokeStyle = rgb(A); x.lineWidth = 3; x.lineJoin = "round"; x.beginPath(); pts.forEach((q, i) => (i ? x.lineTo(q[0], q[1]) : x.moveTo(q[0], q[1]))); x.stroke(); x.restore();
    const sg = Math.min(n - 2, Math.floor(p * (n - 1))), f = p * (n - 1) - sg, hx = pts[sg][0] + (pts[sg + 1][0] - pts[sg][0]) * f, hy = pts[sg][1] + (pts[sg + 1][1] - pts[sg][1]) * f;
    x.fillStyle = rgb(A, 0.3); x.beginPath(); x.arc(hx, hy, 8 + 4 * Math.sin(t * 6), 0, 7); x.fill(); x.fillStyle = FG; x.beginPath(); x.arc(hx, hy, 4, 0, 7); x.fill(); x.fillRect(L, base, R - L, 2); x.globalAlpha = 1;
  },
});
