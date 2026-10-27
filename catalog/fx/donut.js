// 移植自圖鑑 donut（環圈圖）。原版：環圈依比例逐段畫出，中間數字從 0 跳到第一段的比例，右側圖例逐項淡入。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   data 各段占比（0～1，加總建議 1）、labels 圖例文字（與 data 一一對應）、colors 各段顏色（CSS 色字串，省略＝主色／輔色／金／綠）、
//   center 中間要跳到的數字（原版 42）、unit 中間數字的單位（原版 %）、span 環圈畫完的秒數（原版 1.8）、rowGap 圖例列距（相對高度，原版 0.13）
fxDefine("donut", {
  dur: 4.5,
  defaults: { data: [0.42, 0.26, 0.19, 0.13], labels: ["直播 42%", "短影音 26%", "文章 19%", "Podcast 13%"], colors: null, center: 42, unit: "%", span: 1.8, rowGap: 0.13, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"' },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOC, rr } = K;
    const { A, B, Y, FG, M } = K;
    K.clear(x, w, h);
    const T = 4.5, tt = t % T, D = P.data, C = P.colors || [rgb(A), rgb(B), Y, "#7BD88F"], cx = w * 0.33, cy = h / 2, r = Math.min(w, h) * 0.28, fade = 1 - cl((tt - 4) / 0.4), p = eOC(cl(tt / P.span));
    x.globalAlpha = fade; x.lineWidth = r * 0.32; x.strokeStyle = M; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
    let a0 = -Math.PI / 2, acc = 0;
    D.forEach((v, i) => { const len = v * cl((p - acc) / v) * Math.PI * 2 - 0.03; if (len > 0.01) { x.strokeStyle = C[i % C.length]; x.beginPath(); x.arc(cx, cy, r, a0, a0 + len); x.stroke(); } a0 += v * Math.PI * 2; acc += v; });
    x.fillStyle = FG; x.textAlign = "center"; x.textBaseline = "middle"; x.font = `700 ${r * 0.42}px ${P.numFont}`; x.fillText(Math.round(P.center * cl(p / D[0])) + P.unit, cx, cy);
    P.labels.forEach((l, i) => {
      const q = eOC(cl((tt - 0.3 - i * 0.15) / 0.5)); x.globalAlpha = fade * q; const Yp = h * (0.3 + i * P.rowGap);
      x.fillStyle = C[i % C.length]; rr(x, w * 0.64, Yp - 6, 12, 12, 3); x.fillStyle = FG; x.textAlign = "left"; x.font = `500 ${h * 0.06}px ${P.font}`; x.fillText(l, w * 0.64 + 20, Yp);
    });
    x.globalAlpha = 1;
  },
});
