// 移植自圖鑑 bokeh（散景光斑）。原版：34 個柔焦光圈慢慢漂浮、明暗呼吸，顏色在主色／輔色／金色間輪替，背景為深藍漸層。
// 參數：count 光圈數、bg 是否畫深藍漸層底（false＝透明底，只剩光斑，疊在別的畫面上）
fxDefine("bokeh", {
  dur: 8,
  defaults: { count: 34, bg: true },
  draw(x, w, h, t, P, C) {
    const { rnd, rgb, A, B } = C;
    if (P.bg) { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#141833"); g.addColorStop(1, "#0B0D16"); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    x.save(); x.globalCompositeOperation = "lighter";
    for (let i = 0; i < P.count; i++) {
      const r = h * (0.03 + 0.09 * rnd(i)), X = (((rnd(i + 1) * w + t * w * 0.02 * (rnd(i + 2) - 0.5) * 4) % w) + w) % w, Yp = rnd(i + 3) * h + Math.sin(t * 0.5 + i) * h * 0.03, al = 0.12 + 0.25 * rnd(i + 4) * (0.6 + 0.4 * Math.sin(t + i));
      const rg = x.createRadialGradient(X, Yp, r * 0.6, X, Yp, r);
      const c = [A, B, [255, 200, 87]][i % 3]; rg.addColorStop(0, rgb(c, al)); rg.addColorStop(1, rgb(c, 0)); x.fillStyle = rg; x.beginPath(); x.arc(X, Yp, r, 0, 7); x.fill();
    }
    x.restore();
  },
});
