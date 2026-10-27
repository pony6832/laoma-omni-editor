// 移植自圖鑑 splitscreen（前後對比滑桿）。原版：左 BEFORE、右 AFTER，中間分隔線左右來回滑動，把手是白色圓點。
// 參數：textA／textB 兩側文字、numFont 字型
fxDefine("splitscreen", {
  dur: 6,
  defaults: { textA: "BEFORE", textB: "AFTER", numFont: "Unbounded,sans-serif" },
  draw(x, w, h, t, P, C) {
    const { rgb, A, FG } = C, BG = C.BG === null ? "#12151D" : C.BG;
    const s = w * (0.5 + 0.38 * Math.sin(t * 1.2));
    C.scene(x, w, h, "#2A3040", "rgba(237,239,245,.8)", P.textA, P.numFont); x.save(); x.beginPath(); x.rect(s, 0, w - s, h); x.clip(); C.scene(x, w, h, rgb(A), BG, P.textB, P.numFont); x.restore();
    x.fillStyle = FG; x.fillRect(s - 1.5, 0, 3, h); x.beginPath(); x.arc(s, h / 2, 14, 0, 7); x.fill(); x.fillStyle = BG; x.font = "700 13px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText("⇆", s, h / 2);
  },
});
