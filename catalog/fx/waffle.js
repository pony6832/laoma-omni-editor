// 移植自圖鑑 waffle（人形點陣）。原版：300 個小人形（30×10）由左往右逐格亮起到 72%，左上角顯示百分比。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   value 要亮到的比例（0～1，原版 0.72）、cols／rows 欄數與列數（原版 30×10）、span 亮完的秒數（原版 2.5）、
//   unit 百分比後的單位（原版 %）、label 百分比右側的說明文字（省略＝不畫）、font 字型
fxDefine("waffle", {
  dur: 4,
  defaults: { value: 0.72, cols: 30, rows: 10, span: 2.5, unit: "%", label: "", numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC } = K;
    const { A, FG, M } = K;
    K.clear(x, w, h);
    const C = P.cols, R = P.rows, s = Math.min((w * 0.84) / C, (h * 0.7) / R), x0 = (w - C * s) / 2, y0 = h * 0.22, n = Math.floor(eOC(cl((t % 4) / P.span)) * C * R * P.value);
    for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) { const k = i * R + j; x.fillStyle = k < n ? rgb(A) : M; x.beginPath(); x.arc(x0 + i * s + s / 2, y0 + j * s + s * 0.28, s * 0.17, 0, 7); x.fill(); x.fillRect(x0 + i * s + s * 0.32, y0 + j * s + s * 0.48, s * 0.36, s * 0.38); }
    x.fillStyle = FG; x.font = `700 ${h * 0.1}px ${P.numFont}`; x.textAlign = "left"; x.textBaseline = "alphabetic"; const pct = Math.round((n / (C * R)) * 100) + P.unit; x.fillText(pct, x0, h * 0.17);
    if (P.label) { const pw = x.measureText(pct).width; x.font = `600 ${h * 0.06}px ${P.font}`; x.fillText(P.label, x0 + pw + h * 0.03, h * 0.17); }
  },
});
