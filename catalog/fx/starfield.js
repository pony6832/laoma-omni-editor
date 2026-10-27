// 移植自圖鑑 starfield（星空穿梭）。原版：300 多顆星從中心往鏡頭飛，越近越亮、拉出光痕，少數星點用主色。
// 參數：count 星數、speed 飛行速度（原版 0.22）
fxDefine("starfield", {
  dur: 8,
  defaults: { count: 320, speed: 0.22 },
  draw(x, w, h, t, P, C) {
    const { rnd, rgb, A } = C;
    C.clear(x, w, h);
    const f = Math.min(w, h) * 0.25; x.lineCap = "round";
    for (let i = 0; i < P.count; i++) {
      const sx = rnd(i + 1) * 2 - 1, sy = rnd(i + 999) * 2 - 1, z = 1 - ((rnd(i + 77) + t * P.speed) % 1), z0 = Math.min(1, z + 0.04); if (z < 0.03) continue;
      const k = 1 - z; x.strokeStyle = i % 6 ? `rgba(237,239,245,${k})` : rgb(A, k); x.lineWidth = 0.4 + k * 2.4;
      x.beginPath(); x.moveTo(w / 2 + (sx / z0) * f, h / 2 + (sy / z0) * f); x.lineTo(w / 2 + (sx / z) * f, h / 2 + (sy / z) * f); x.stroke();
    }
  },
});
