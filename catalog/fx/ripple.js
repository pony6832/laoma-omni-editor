// 移植自圖鑑 ripple（水波漣漪）。原版：5 個水波源隨機位置擴散出三圈橢圓漣漪，顏色在輔色與主色間漸變。
// 參數：count 同時存在的水波源數
fxDefine("ripple", {
  dur: 8,
  defaults: { count: 5 },
  draw(x, w, h, t, P, C) {
    const { rnd, mix } = C;
    C.clear(x, w, h);
    const R = Math.max(w, h) * 0.45; x.lineWidth = 2;
    for (let i = 0; i < P.count; i++) {
      const u = t * 0.3 + i / P.count, p = u % 1, cy = Math.floor(u), cx = w * (0.15 + 0.7 * rnd(cy * 13 + i + 1)), cyy = h * (0.2 + 0.6 * rnd(cy * 17 + i + 0.5));
      for (let j = 0; j < 3; j++) { const r = p * R - j * 14; if (r <= 0) continue; x.strokeStyle = mix(rnd(cy + i + 2), (1 - p) * (1 - j * 0.3)); x.beginPath(); x.ellipse(cx, cyy, r, r * 0.5, 0, 0, 7); x.stroke(); }
      if (p < 0.08) { x.fillStyle = `rgba(237,239,245,${1 - p / 0.08})`; x.beginPath(); x.arc(cx, cyy, 3, 0, 7); x.fill(); }
    }
  },
});
