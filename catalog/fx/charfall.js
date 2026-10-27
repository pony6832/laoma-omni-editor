// 移植自圖鑑 charfall（逐字落下回彈）。原版：每個字從上方旋轉落下並回彈，間隔 0.1 秒，指定幾個字用主色，最後整行淡出。
// 參數：text 標題、hi 用主色的字（索引陣列）、gap 逐字間隔秒、fadeAt 開始淡出的秒數（null＝不淡出）、font 字型
fxDefine("charfall", {
  dur: 3.5,
  defaults: { text: "逐字落下回彈", hi: [2, 3], gap: 0.1, fadeAt: 3, font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, eOB, rgb, A, FG } = C;
    C.clear(x, w, h);
    const s = P.text, fs = h * 0.17, n = s.length, sw = fs * 1.05, x0 = w / 2 - (sw * (n - 1)) / 2;
    x.font = `900 ${fs}px ${P.font}`; x.textAlign = "center"; x.textBaseline = "middle";
    for (let i = 0; i < n; i++) {
      const p = cl((tt - i * P.gap) / 0.55), e = eOB(p);
      x.save(); x.translate(x0 + i * sw, h / 2 - (1 - e) * h * 0.6); x.rotate((1 - e) * (i % 2 ? 0.6 : -0.6));
      x.globalAlpha = p * (P.fadeAt == null ? 1 : 1 - cl((tt - P.fadeAt) / 0.4));
      x.fillStyle = P.hi.includes(i) ? rgb(A) : FG; x.fillText(s[i], 0, 0); x.restore();
    }
  },
});
