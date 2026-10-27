// 移植自圖鑑 quote（引言卡）。原版：左上主色大引號彈出，引言逐行遮罩升起，最後出現署名。
// 參數：lines 引言行（陣列）、by 署名（含破折號，空字串＝不顯示）、font 字型
fxDefine("quote", {
  dur: 5,
  defaults: { lines: ["好的設計是", "讓人看不見設計"], by: "— 設計師 迪特・拉姆斯", font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, eOC, eOB, rgb, A, FG } = C;
    C.clear(x, w, h);
    const p = eOB(cl(tt / 0.5));
    x.save(); x.translate(w * 0.14, h * 0.3); x.scale(p, p); x.fillStyle = rgb(A); x.font = `900 ${h * 0.45}px Georgia,serif`; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText("“", -w * 0.03, 0); x.restore();
    const fs = h * 0.11;
    P.lines.forEach((s, i) => {
      const q = eOC(cl((tt - 0.5 - i * 0.4) / 0.6));
      x.save(); x.beginPath(); x.rect(0, h * 0.38 + i * fs * 1.4 - fs * 0.7, w, fs * 1.4); x.clip();
      x.fillStyle = FG; x.font = `900 ${fs}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText(s, w * 0.2, h * 0.38 + i * fs * 1.4 + (1 - q) * fs * 1.3); x.restore();
    });
    if (P.by) {
      const r = cl((tt - 1.6) / 0.5);
      x.globalAlpha = r; x.fillStyle = rgb(A); x.fillRect(w * 0.2, h * 0.8, w * 0.06 * r, 2);
      x.fillStyle = "rgba(237,239,245,.7)"; x.font = `500 ${fs * 0.45}px ${P.font}`; x.fillText(P.by, w * 0.28, h * 0.8); x.globalAlpha = 1;
    }
  },
});
