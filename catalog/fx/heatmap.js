// 移植自圖鑑 heatmap（熱力格）。原版：26 欄 × 7 列的格子由左往右逐欄亮起，深淺代表數值，左上角有標題。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   values 二維資料 [欄][列]（每格 0～1；省略＝用原版的固定偽亂數示範資料）、cols／rows 省略 values 時的欄列數（原版 26×7）、
//   title 標題、span 逐欄亮完的秒數（原版 3.5）、font 字型
fxDefine("heatmap", {
  dur: 5,
  defaults: { values: null, cols: 26, rows: 7, title: "半年更新紀錄", span: 3.5, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, rr, rnd } = K;
    const { A, FG } = K;
    K.clear(x, w, h);
    const V = P.values, C = V ? V.length : P.cols, R = V ? V[0].length : P.rows, g = Math.min((w * 0.9) / C, (h * 0.7) / R), x0 = (w - C * g) / 2, y0 = (h - R * g) / 2, n = Math.floor(cl((t % 5) / P.span) * C);
    for (let i = 0; i < C; i++) for (let j = 0; j < R; j++) {
      const v = V ? V[i][j] : rnd(i * 7 + j), on = i <= n;
      x.fillStyle = on ? (v < 0.25 ? "#2A3040" : v < 0.5 ? rgb(A, 0.35) : v < 0.75 ? rgb(A, 0.65) : rgb(A)) : "#1E2330"; rr(x, x0 + i * g + 1, y0 + j * g + 1, g - 2, g - 2, 2);
    }
    x.fillStyle = FG; x.font = `600 ${h * 0.06}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "bottom"; x.fillText(P.title, x0, y0 - 6);
  },
});
