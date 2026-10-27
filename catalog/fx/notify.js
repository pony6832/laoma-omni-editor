// 移植自圖鑑 notify（通知堆疊）。原版：手機鎖屏上通知每 1.1 秒從上方彈入，舊的往下壓疊縮小。
// 參數：items 通知文字（循環使用）、clock 鎖屏時間文字、interval 每則間隔秒、font 字型、numFont 時間文字字型
fxDefine("notify", {
  dur: 6,
  defaults: { items: ["新訂單 #1024", "新訂單 #1025", "有人按讚了你的影片", "新訂單 #1026", "新追蹤者 +12"], clock: "9:41", interval: 1.1, font: '"Noto Sans TC"', numFont: "Unbounded,sans-serif" },
  draw(x, w, h, t, P, C) {
    const { cl, eOB, rr, rgb, A } = C;
    C.scene(x, w, h, "#1E2433", "rgba(237,239,245,.15)", P.clock, P.numFont);
    const N = P.items, T = P.interval, k = Math.floor(t / T), p = eOB(cl((t % T) / 0.45)), nh = h * 0.15, nw = w * 0.84;
    for (let j = 0; j < 4; j++) {
      const idx = k - j; if (idx < 0) continue;
      const pos = j - 1 + p, Yp = h * 0.06 + Math.max(0, pos) * nh * 0.32 + (pos < 0 ? pos * nh * 1.3 : 0), s = 1 - Math.max(0, pos) * 0.05;
      x.save(); x.translate(w / 2, Yp + nh / 2); x.scale(s, s); x.globalAlpha = j == 3 ? 1 - p : 1;
      x.fillStyle = "rgba(245,246,250,.92)"; rr(x, -nw / 2, -nh / 2, nw, nh, nh * 0.25); x.fillStyle = rgb(A); rr(x, -nw / 2 + nh * 0.2, -nh * 0.3, nh * 0.6, nh * 0.6, nh * 0.15);
      x.fillStyle = "#161922"; x.font = `600 ${nh * 0.28}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText(N[idx % N.length], -nw / 2 + nh * 0.95, 0); x.restore();
    }
  },
});
