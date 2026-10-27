// 移植自圖鑑 countdown（倒數圓環）。原版：3、2、1 倒數，每秒一圈，數字從放大回彈並在結尾淡出，外圈主色環隨時間收縮。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   from 從幾開始倒數（原版 3）、per 每個數字停留秒數（原版 1）、numFont 數字字型
fxDefine("countdown", {
  dur: 3,
  defaults: { from: 3, per: 1, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl } = K;
    const { A, FG, M } = K;
    K.clear(x, w, h);
    const n = P.from - Math.floor((t % (P.from * P.per)) / P.per), p = (t % P.per) / P.per, R = h * 0.32; x.strokeStyle = M; x.lineWidth = 10; x.beginPath(); x.arc(w / 2, h / 2, R, 0, 7); x.stroke();
    x.strokeStyle = rgb(A); x.lineCap = "round"; x.beginPath(); x.arc(w / 2, h / 2, R, -Math.PI / 2, -Math.PI / 2 + (1 - p) * Math.PI * 2); x.stroke(); x.lineCap = "butt";
    const s = 1 + 0.4 * Math.pow(1 - cl(p / 0.3), 3); x.save(); x.translate(w / 2, h / 2); x.scale(s, s); x.globalAlpha = 1 - cl((p - 0.8) / 0.2); x.fillStyle = FG; x.font = `700 ${h * 0.3}px ${P.numFont}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(n, 0, 0); x.restore(); x.globalAlpha = 1;
  },
});
