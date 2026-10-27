// 移植自圖鑑 karaoke（字幕逐字高亮）。原版：一句話跟著語音逐字變黃並微跳，字有深色描邊。
// 參數：text 句子、span 從第一個字到最後一個字亮完的秒數（原版 2.6；用在口播時填該句字幕長度）、font 字型
fxDefine("karaoke", {
  dur: 3.5,
  defaults: { text: "三秒抓住注意力的字幕", span: 2.6, font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, Y, FG } = C;
    C.clear(x, w, h);
    const s = P.text, n = s.length, fs = Math.min(h * 0.13, (w * 0.8) / n), k = cl(tt / P.span) * n;
    x.font = `900 ${fs}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "middle";
    let X = (w - x.measureText(s).width) / 2;
    const Yp = h * 0.7;
    for (let i = 0; i < n; i++) {
      const cw = x.measureText(s[i]).width, on = i < k, sc = on ? 1 + 0.2 * Math.sin(Math.PI * cl(k - i)) : 1;
      x.save(); x.translate(X + cw / 2, Yp); x.scale(sc, sc); x.lineWidth = fs * 0.16; x.lineJoin = "round";
      x.strokeStyle = C.BG === null ? "#12151D" : C.BG; x.strokeText(s[i], -cw / 2, 0); x.fillStyle = on ? Y : FG; x.fillText(s[i], -cw / 2, 0); x.restore();
      X += cw;
    }
  },
});
