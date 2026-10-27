// 移植自圖鑑 clockdial（24 小時錶盤）。原版：24 格刻度隨時間逐格點亮（輔色到主色），指針轉動，下方顯示時間。
// 參數：speed 每秒走幾小時（原版 3）、mono 等寬字型（原版 JetBrains Mono，本機沒有會退回預設等寬）
fxDefine("clockdial", {
  dur: 8,
  defaults: { speed: 3, mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, C) {
    const { mix, rgb, A, FG, M } = C;
    C.clear(x, w, h);
    const cx = w / 2, cy = h / 2, R = h * 0.4, hr = (t * P.speed) % 24;
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2 - Math.PI / 2, on = i <= hr; x.strokeStyle = on ? mix(i / 23) : M; x.lineWidth = on ? 4 : 2; x.beginPath(); x.moveTo(cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82); x.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); x.stroke(); }
    const a = (hr / 24) * Math.PI * 2 - Math.PI / 2; x.strokeStyle = rgb(A); x.lineWidth = 3; x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * R * 0.7, cy + Math.sin(a) * R * 0.7); x.stroke();
    x.fillStyle = FG; x.font = `600 ${h * 0.09}px ${P.mono}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(String(Math.floor(hr)).padStart(2, "0") + ":00", cx, cy + R * 0.38);
  },
});
