// 移植自圖鑑 sticker（貼紙彈出）。原版：鋸齒圓形貼紙彈性彈出並晃動回正，周圍 6 顆金色小星閃爍。
// 參數：text 貼紙字、numFont 字型
fxDefine("sticker", {
  dur: 3,
  defaults: { text: "NEW!", numFont: "Unbounded,sans-serif" },
  draw(x, w, h, t, P, C) {
    const { cl, rgb, A, FG } = C;
    C.clear(x, w, h);
    const tt = t, p = cl(tt / 0.6), e = p < 1 ? 1 + Math.sin(p * Math.PI * 3) * Math.exp(-p * 4) * 0.6 - 0.4 * (1 - p) * (1 - p) : 1, r = Math.min(w, h) * 0.26;
    x.save(); x.translate(w / 2, h / 2); x.rotate(-0.2 + Math.sin(tt * 6) * 0.1 * Math.exp(-tt * 2)); x.scale(e, e);
    x.fillStyle = rgb(A); x.beginPath(); for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, rr_ = i % 2 ? r : r * 1.12; x.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_); } x.closePath(); x.fill(); x.lineWidth = 4; x.strokeStyle = FG; x.stroke();
    x.fillStyle = FG; x.font = `900 ${r * 0.48}px ${P.numFont}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(P.text, 0, 0); x.restore();
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + t, d = r * 1.5, q = Math.sin(t * 4 + i) * 0.5 + 0.5; x.fillStyle = `rgba(255,200,87,${q})`; x.beginPath(); x.arc(w / 2 + Math.cos(a) * d, h / 2 + Math.sin(a) * d, 3, 0, 7); x.fill(); }
  },
});
