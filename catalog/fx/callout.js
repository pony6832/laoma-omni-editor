// 移植自圖鑑 callout（標註線）。原版：在產品畫面上從兩個點依序拉出標註線並寫上說明，起點會脈動。
// 參數：items 標註（[起點x, 起點y, 終點x, 終點y, 文字]，座標 0～1）、sceneText 底圖示範文字、scene 是否畫示範底圖（false＝透明，疊在實拍畫面上）、font／numFont 字型
// 注意：原版脈動用未取模的 t，移植版用本地時間 tt；原版 t<4 時兩者相同
fxDefine("callout", {
  dur: 4,
  defaults: { items: [[0.36, 0.45, 0.14, 0.2, "輕 30%"], [0.62, 0.6, 0.86, 0.82, "續航 2 倍"]], sceneText: "PRODUCT", scene: true, font: '"Noto Sans TC"', numFont: "Unbounded,sans-serif" },
  draw(x, w, h, tt, P, C) {
    const { cl, eOC, rgb, A, FG } = C;
    if (P.scene) C.scene(x, w, h, "#1B2233", "rgba(237,239,245,.1)", P.sceneText, P.numFont);
    P.items.forEach(([ax, ay, bx, by, l], i) => {
      const p = eOC(cl((tt - i * 0.6) / 0.6)), q = eOC(cl((tt - i * 0.6 - 0.5) / 0.4)), dir = bx > ax ? 1 : -1;
      x.strokeStyle = rgb(A); x.fillStyle = rgb(A); x.lineWidth = 2; x.beginPath(); x.arc(ax * w, ay * h, 5 + 2 * Math.sin(tt * 5), 0, 7); x.fill(); x.beginPath(); x.moveTo(ax * w, ay * h); x.lineTo(ax * w + (bx - ax) * w * p, ay * h + (by - ay) * h * p); x.stroke();
      if (q > 0) { x.beginPath(); x.moveTo(bx * w, by * h); x.lineTo(bx * w + dir * w * 0.12 * q, by * h); x.stroke(); x.globalAlpha = q; x.fillStyle = FG; x.font = `700 ${h * 0.07}px ${P.font}`; x.textAlign = dir > 0 ? "left" : "right"; x.textBaseline = "bottom"; x.fillText(l, bx * w, by * h - 6); x.globalAlpha = 1; }
    });
  },
});
