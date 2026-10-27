// 移植自圖鑑 radar（雷達圖）。原版：六邊形格線，掃描光束旋轉，資料多邊形從中心展開。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   values 各軸數值（0～1，數量即軸數，至少 3 個）、span 展開的秒數（原版 1.2）、
//   labels 各軸名稱（省略＝不畫；有填時畫在各軸外側，隨展開淡入）、font 字型
fxDefine("radar", {
  dur: 4,
  defaults: { values: [0.9, 0.7, 0.85, 0.6, 0.95, 0.75], span: 1.2, labels: null, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC } = K;
    const { A, B, FG, M } = K;
    K.clear(x, w, h);
    const cx = w / 2, cy = h * 0.52, R = h * 0.38, V = P.values, n = V.length, p = eOC(cl((t % 4) / P.span)); x.strokeStyle = M; x.lineWidth = 1;
    for (let r = 1; r <= 4; r++) { x.beginPath(); for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2; x.lineTo(cx + (Math.cos(a) * R * r) / 4, cy + (Math.sin(a) * R * r) / 4); } x.stroke(); }
    if (x.createConicGradient) { const g = x.createConicGradient(t * 1.5, cx, cy); g.addColorStop(0, rgb(B, 0.4)); g.addColorStop(0.15, rgb(B, 0)); g.addColorStop(1, rgb(B, 0)); x.fillStyle = g; x.beginPath(); x.arc(cx, cy, R, 0, 7); x.fill(); }
    x.beginPath(); for (let i = 0; i <= n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2, v = V[i % n] * p; x.lineTo(cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v); } x.fillStyle = rgb(A, 0.3); x.fill(); x.strokeStyle = rgb(A); x.lineWidth = 2; x.stroke();
    if (P.labels) {
      x.save(); x.globalAlpha = p; x.fillStyle = FG; x.font = `700 ${h * 0.05}px ${P.font}`; x.textAlign = "center"; x.textBaseline = "middle";
      for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 - Math.PI / 2; x.fillText(P.labels[i], cx + Math.cos(a) * R * 1.18, cy + Math.sin(a) * R * 1.14); }
      x.restore();
    }
  },
});
