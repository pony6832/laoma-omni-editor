// 移植自圖鑑 matrixrain（數位雨）。原版：一串串字元從上往下掉，頭是白色、前段主色、後段輔色漸淡。
// 參數：chars 字元集、mono 等寬字型。原版字元用 JetBrains Mono，本機沒有時會退回預設等寬字型
fxDefine("matrixrain", {
  dur: 8,
  defaults: { chars: "01アイウエオカキクケコサシスセソ", mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, C) {
    const { rnd, rgb, A, B, FG } = C;
    C.clear(x, w, h);
    const chars = P.chars, cs = Math.max(10, h / 22), cols = Math.ceil(w / cs);
    x.font = `600 ${cs}px ${P.mono}`; x.textAlign = "center"; x.textBaseline = "top";
    for (let i = 0; i < cols; i++) {
      const sp = 0.25 + rnd(i) * 0.35, hy = ((t * sp + rnd(i + 9)) % 1.4) * h * 1.4 - h * 0.2, L = 8 + Math.floor(rnd(i + 4) * 10);
      for (let k = 0; k < L; k++) {
        const Yp = hy - k * cs; if (Yp < -cs || Yp > h) continue;
        const ch = chars[Math.floor(rnd(i * 31 + Math.floor(Yp / cs) + Math.floor(t * 8) * (k < 2 ? 1 : 0)) * chars.length)];
        x.fillStyle = k == 0 ? FG : rgb(k < 3 ? A : B, 1 - k / L); x.fillText(ch, i * cs + cs / 2, Yp);
      }
    }
  },
});
