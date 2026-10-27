// 移植自圖鑑 stamp（報紙蓋章）。原版：報紙直行欄位緩慢捲動，1 秒後紅色印章從大到小重重蓋下、微傾斜。
// 參數：text 印章字、paper 是否畫報紙底（false＝透明底，只畫欄位與印章）、stampAt 蓋章時間（秒）、font 字型
fxDefine("stamp", {
  dur: 3.5,
  defaults: { text: "首創", paper: true, stampAt: 1, font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, eOC, rnd } = C;
    if (P.paper) { x.fillStyle = "#EDE6D6"; x.fillRect(0, 0, w, h); }
    x.fillStyle = "#8A8172";
    for (let c = 0; c < 14; c++) for (let r = 0; r < 16; r++) if (rnd(c * 31 + r) > 0.15) x.fillRect(w * 0.08 + c * w * 0.06, h * 0.06 + ((r * h * 0.055 + tt * 20) % (h * 0.88)), w * 0.035, h * 0.03);
    if (tt > P.stampAt) {
      const p = cl((tt - P.stampAt) / 0.25), s = 2.4 - 1.4 * eOC(p);
      x.save(); x.translate(w * 0.6, h * 0.5); x.rotate(-0.18); x.scale(s, s); x.globalAlpha = 0.9 * p; x.strokeStyle = "#C8321E"; x.lineWidth = 5; x.strokeRect(-w * 0.17, -h * 0.13, w * 0.34, h * 0.26);
      x.fillStyle = "#C8321E"; x.font = `900 ${h * 0.14}px ${P.font}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(P.text, 0, 0); x.restore();
    }
  },
});
