// 移植自圖鑑 panel（面板滑入轉場）。原版：畫面 A 變暗，淺色面板（畫面 B）從右側滑入並帶陰影。
// 參數：textA／textB 兩個畫面上的字、numFont 字型
fxDefine("panel", {
  dur: 2.6,
  defaults: { textA: "SCENE 1", textB: "SCENE 2", numFont: "Unbounded,sans-serif" },
  draw(x, w, h, t, P, C) {
    const { cl, FG } = C, BG = C.BG === null ? "#12151D" : C.BG;
    const p = 1 - Math.pow(2, -10 * cl((t - 0.5) / 1.2));
    C.scene(x, w, h, BG, FG, P.textA, P.numFont); x.fillStyle = `rgba(0,0,0,${0.4 * p})`; x.fillRect(0, 0, w, h);
    x.save(); x.translate(w * (1 - p) + (p < 0.001 ? 40 : 0), 0); x.shadowColor = "rgba(0,0,0,.6)"; x.shadowBlur = 30; x.shadowOffsetX = -10; x.fillStyle = "#F2EFE8"; x.fillRect(0, 0, w, h); x.shadowColor = "transparent";
    x.fillStyle = BG; x.font = `700 ${h * 0.13}px ${P.numFont}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(P.textB, w / 2, h / 2); x.restore();
  },
});
