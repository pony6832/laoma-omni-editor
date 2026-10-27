// 移植自圖鑑 funnel（漏斗圖）。原版：四層漏斗由上往下依序淡入，每層寫著名稱與數字（數字從 0 跳到終值），顏色由主色漸變到輔色。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   stages 各層 [名稱, 數值]（至少 2 層）、stepW 每層縮窄的寬度比例（原版 0.17；層數多時要調小）、rowH 每層高度（相對高度，原版 0.19）、
//   gap 每層出現間隔秒（原版 0.4）、font 字型
fxDefine("funnel", {
  dur: 5,
  defaults: { stages: [["曝光", 10000], ["點擊", 3200], ["加入購物車", 900], ["下單", 240]], stepW: 0.17, rowH: 0.19, gap: 0.4, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"' },
  draw(x, w, h, t, P, K) {
    const { mix, cl, eOC } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    K.clear(x, w, h);
    const S = P.stages, tt = t % 5, sh = h * P.rowH, top = h * 0.1, last = Math.max(1, S.length - 1);
    S.forEach(([l, v], i) => {
      const p = eOC(cl((tt - i * P.gap) / 0.5)), w0 = w * (0.8 - i * P.stepW), w1 = w * (0.8 - (i + 1) * P.stepW), Yp = top + i * sh * 1.08; if (p <= 0) return;
      x.globalAlpha = p; x.fillStyle = mix(1 - i / last); x.beginPath(); x.moveTo(w / 2 - w0 / 2, Yp); x.lineTo(w / 2 + w0 / 2, Yp); x.lineTo(w / 2 + w1 / 2, Yp + sh); x.lineTo(w / 2 - w1 / 2, Yp + sh); x.closePath(); x.fill(); x.fillStyle = BG; x.font = `700 ${sh * 0.36}px ${P.font}`; x.textAlign = "center"; x.textBaseline = "middle";
      x.fillText(l + " " + Math.round(v * p).toLocaleString(), w / 2, Yp + sh / 2); x.globalAlpha = 1;
    });
  },
});
