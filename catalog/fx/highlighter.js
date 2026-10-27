// 移植自圖鑑 highlighter（螢光筆劃重點）。原版：兩行字，第二行被螢光筆畫過，最後一圈主色手繪圈起來。
// 參數：lines 各行（[文字, 是否螢光筆 0／1]）、circle 是否畫手繪圈、font 字型
fxDefine("highlighter", {
  dur: 3.5,
  defaults: { lines: [["重點不是做更多，", 0], ["而是做對的事", 1]], circle: true, font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, eOC, rgb, A, FG } = C;
    C.clear(x, w, h);
    const fs = h * 0.12; x.font = `900 ${fs}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "middle";
    P.lines.forEach(([s, hl], i) => {
      const Yp = h * 0.38 + i * fs * 1.6, tw = x.measureText(s).width;
      if (hl) { const p = eOC(cl((tt - 0.6) / 0.7)); x.fillStyle = "rgba(255,200,87,.85)"; x.beginPath(); x.moveTo(w * 0.08 - 6, Yp - fs * 0.05); x.lineTo(w * 0.08 + tw * p, Yp - fs * 0.12); x.lineTo(w * 0.08 + tw * p + 4, Yp + fs * 0.48); x.lineTo(w * 0.08 - 4, Yp + fs * 0.52); x.fill(); }
      x.fillStyle = FG; x.fillText(s, w * 0.08, Yp);
    });
    const q = P.circle ? eOC(cl((tt - 1.5) / 0.8)) : 0;
    if (q > 0) { x.strokeStyle = rgb(A); x.lineWidth = 3; x.beginPath(); x.ellipse(w * 0.08 + fs * 1.0, h * 0.38, fs * 1.3, fs * 0.75, -0.05, -Math.PI * 0.9, -Math.PI * 0.9 + q * Math.PI * 2.1); x.stroke(); }
  },
});
