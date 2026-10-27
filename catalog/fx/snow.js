// 移植自圖鑑 snow（雪花飄落）。原版：160 片雪花依遠近不同速度飄落並左右搖擺，背景為深藍漸層。
// 參數：count 雪花數、bg 是否畫深藍漸層底（false＝透明底，只剩雪花）
fxDefine("snow", {
  dur: 8,
  defaults: { count: 160, bg: true },
  draw(x, w, h, t, P, C) {
    const { rnd } = C;
    if (P.bg) { const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#1A2240"); g.addColorStop(1, "#2E3B66"); x.fillStyle = g; x.fillRect(0, 0, w, h); }
    x.fillStyle = "rgba(255,255,255,.9)";
    for (let i = 0; i < P.count; i++) { const z = 0.3 + 0.7 * rnd(i), Yp = ((rnd(i + 1) * h + t * h * 0.12 * z) % (h + 10)) - 5, X = rnd(i + 2) * w + Math.sin(t * z * 1.5 + i) * 12 * z; x.globalAlpha = 0.3 + 0.7 * z; x.beginPath(); x.arc(X, Yp, 1 + 2.2 * z, 0, 7); x.fill(); }
    x.globalAlpha = 1;
  },
});
