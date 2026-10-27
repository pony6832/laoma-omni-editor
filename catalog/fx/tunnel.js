// 移植自圖鑑 tunnel（無限隧道）。原版：14 層方框往鏡頭放大並旋轉，顏色由輔色漸變到主色。
// 參數：layers 層數、speed 前進速度（原版 0.16）
fxDefine("tunnel", {
  dur: 8,
  defaults: { layers: 14, speed: 0.16 },
  draw(x, w, h, t, P, C) {
    const { mix } = C;
    C.clear(x, w, h);
    const n = P.layers, S = Math.max(w, h) * 1.5; x.save(); x.translate(w / 2, h / 2);
    for (let k = 0; k < n; k++) { const z = (k / n + t * P.speed) % 1, s = Math.pow(z, 2.3) * S; x.save(); x.rotate(z * 1.4 + t * 0.15); x.strokeStyle = mix(z, z); x.lineWidth = 0.5 + z * 4; x.strokeRect(-s / 2, -s / 2, s, s); x.restore(); }
    x.restore();
  },
});
