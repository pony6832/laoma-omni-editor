// 移植自圖鑑 blurzoom（模糊縮放交疊轉場）。原版：畫面 A 放大、模糊、淡出，同時畫面 B 從小放大、由模糊變清晰淡入。
// 參數：textA／textB 兩個畫面上的字、numFont 字型。這是轉場示範：實際使用要把兩個畫面換成內容
fxDefine("blurzoom", {
  dur: 2.6,
  defaults: { textA: "SCENE 1", textB: "SCENE 2", numFont: "Unbounded,sans-serif" },
  draw(x, w, h, t, P, C) {
    const { cl, eIO, FG } = C, BG = C.BG === null ? "#12151D" : C.BG;
    const p = eIO(cl((t - 0.5) / 1.4)); C.clear(x, w, h);
    const L = (s, a, bl, bg, txt) => { x.save(); x.filter = `blur(${bl}px)`; x.globalAlpha = a; x.translate(w / 2, h / 2); x.scale(s, s); x.translate(-w / 2, -h / 2); C.scene(x, w, h, bg, FG, txt, P.numFont); x.restore(); };
    L(1 + p * 0.3, 1 - p, p * 12, BG, P.textA); L(0.8 + p * 0.2, p, (1 - p) * 12, "#1B2A4A", P.textB);
  },
});
