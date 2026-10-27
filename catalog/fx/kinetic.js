// 移植自圖鑑 kinetic（文字動態）。原版：標題分行由下往上彈入，間隔 0.32 秒，指定行用主色，下方主色底線展開，最後整體上移淡出。
// 參數：lines 各行文字、hi 用主色的行（索引）、gap 逐行間隔秒、fadeAt 開始淡出的秒數（null＝不淡出）、font 字型
fxDefine("kinetic", {
  dur: 4,
  defaults: { lines: ["動態", "讓內容", "開口說話"], hi: 1, gap: 0.32, fadeAt: 3.2, font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, eOB, eOC, rgb, A, FG } = C;
    C.clear(x, w, h);
    const q = P.fadeAt == null ? 0 : cl((tt - P.fadeAt) / 0.5), fs = h * 0.17, N = P.lines.length;
    x.font = `900 ${fs}px ${P.font}`; x.textBaseline = "alphabetic"; x.textAlign = "left";
    P.lines.forEach((wd, i) => {
      const p = cl((tt - i * P.gap) / 0.5), e = eOB(p);
      x.globalAlpha = p * (1 - q); x.fillStyle = i === P.hi ? rgb(A) : FG;
      x.fillText(wd, w * 0.09, h * 0.32 + i * fs * 1.2 + (1 - e) * 40 - q * 30);
    });
    x.globalAlpha = 1 - q; x.fillStyle = rgb(A);
    x.fillRect(w * 0.09, h * 0.32 + (N - 1) * fs * 1.2 + fs * 0.25, w * 0.5 * eOC(cl((tt - 1.2) / 0.6)), 5); x.globalAlpha = 1;
  },
});
