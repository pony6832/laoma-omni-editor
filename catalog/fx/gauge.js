// 移植自圖鑑 gauge（儀表指數）。原版：半圓儀表從 0 衝到 78，外環主色、內環副值用輔色，有刻度，中間顯示數字。
// 參數：value 主值（0～1，原版 0.78）、inner 內環副值（0～1，原版 0.55）、span 衝到目標的秒數（原版 1.8）、numFont 字型
fxDefine("gauge", {
  dur: 4,
  defaults: { value: 0.78, inner: 0.55, span: 1.8, numFont: "Unbounded,sans-serif" },
  draw(x, w, h, t, P, C) {
    const { cl, eOC, rgb, A, B, FG, M } = C;
    C.clear(x, w, h);
    const cx = w / 2, cy = h * 0.6, R = h * 0.38, p = eOC(cl(t / P.span)), v = P.value * p + 0.015 * Math.sin(t * 6) * p;
    x.lineCap = "round"; x.lineWidth = h * 0.05;
    x.strokeStyle = M; x.beginPath(); x.arc(cx, cy, R, Math.PI * 0.8, Math.PI * 2.2); x.stroke(); x.strokeStyle = rgb(A); x.beginPath(); x.arc(cx, cy, R, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * v)); x.stroke();
    x.lineWidth = 3; x.strokeStyle = rgb(B, 0.8); x.beginPath(); x.arc(cx, cy, R * 0.78, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * P.inner * p)); x.stroke(); x.lineCap = "butt"; x.lineWidth = 1.5; x.strokeStyle = FG;
    for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.8 + (1.4 * i) / 10); x.beginPath(); x.moveTo(cx + Math.cos(a) * R * 0.62, cy + Math.sin(a) * R * 0.62); x.lineTo(cx + Math.cos(a) * R * 0.68, cy + Math.sin(a) * R * 0.68); x.stroke(); }
    x.fillStyle = FG; x.font = `700 ${h * 0.14}px ${P.numFont}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(Math.round(v * 100), cx, cy);
  },
});
