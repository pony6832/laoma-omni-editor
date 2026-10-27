// 移植自圖鑑 candle（K 線行情）。原版：22 根 K 線持續更新（漲用主色、跌用輔色），下方行情跑馬燈滾動。
// 參數：count K 線根數、ticker 跑馬燈文字、speed 跑馬燈速度（像素／秒）、mono 等寬字型
fxDefine("candle", {
  dur: 8,
  defaults: { count: 22, ticker: "INDEX 23,415 ▲0.82%   USD 31.42 ▼0.12%   GOLD 2,684 ▲0.45%   ", speed: 60, mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, C) {
    const { rnd, rgb, A, B, FG } = C;
    C.clear(x, w, h);
    const n = P.count, cw = (w * 0.8) / n, base = h * 0.42, sh = Math.floor(t * 2), Pf = (s) => 18 * Math.sin(s * 0.35) + (rnd(s) - 0.5) * 10, sc = h * 0.009; x.lineWidth = 1;
    for (let i = 0; i < n; i++) {
      const s = i + sh, o = Pf(s - 1), c = Pf(s), hi = Math.max(o, c) + rnd(s + 0.3) * 5, lo = Math.min(o, c) - rnd(s + 0.6) * 5, X = w * 0.1 + i * cw, col = c >= o ? rgb(A) : rgb(B);
      x.strokeStyle = col; x.beginPath(); x.moveTo(X + cw / 2, base - hi * sc); x.lineTo(X + cw / 2, base - lo * sc); x.stroke(); x.fillStyle = col; x.fillRect(X + cw * 0.15, base - Math.max(o, c) * sc, cw * 0.7, Math.max(2, Math.abs(c - o) * sc));
    }
    x.fillStyle = "#1A1F2B"; x.fillRect(0, h * 0.82, w, h * 0.18); x.font = `500 ${h * 0.07}px ${P.mono}`; x.textBaseline = "middle"; x.textAlign = "left";
    const s = P.ticker, tw = x.measureText(s).width; for (let o = -(t * P.speed) % tw; o < w; o += tw) { x.fillStyle = FG; x.fillText(s, o, h * 0.91); }
  },
});
