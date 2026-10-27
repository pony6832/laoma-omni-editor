// 移植自圖鑑 ptimeline（透視時間公路）。原版：年份沿著透視公路從遠方迎面而來，每個里程碑有主色圓點。
// 參數：years 年份（或任何里程碑文字）、speed 前進速度（原版 0.2）、numFont 字型
fxDefine("ptimeline", {
  dur: 8,
  defaults: { years: ["1989", "1995", "2005", "2015", "2026"], speed: 0.2, numFont: "Unbounded,sans-serif" },
  draw(x, w, h, t, P, C) {
    const { cl, rgb, A, B, FG } = C;
    C.clear(x, w, h);
    const hz = h * 0.28, Ys = P.years; x.strokeStyle = rgb(B, 0.6); x.lineWidth = 1.5; x.beginPath(); x.moveTo(w / 2 - w * 0.02, hz); x.lineTo(w * 0.1, h); x.moveTo(w / 2 + w * 0.02, hz); x.lineTo(w * 0.9, h); x.stroke();
    Ys.forEach((yr, i) => {
      const z = (i / Ys.length + t * P.speed) % 1, e = z * z, Yp = hz + (h - hz) * e, sc = 0.2 + e * 1.2; x.globalAlpha = cl(z * 3) * cl((1 - z) * 6); x.fillStyle = rgb(A); x.beginPath(); x.arc(w / 2, Yp, 4 * sc + 1, 0, 7); x.fill();
      x.fillStyle = FG; x.font = `700 ${h * 0.09 * sc}px ${P.numFont}`; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText(yr, w / 2 + 18 * sc, Yp);
    });
    x.globalAlpha = 1;
  },
});
