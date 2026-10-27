// 移植自圖鑑 checklist（步驟清單打勾）。原版：4 個步驟，進度線往下延伸，經過的圓點亮起並畫出勾勾。
// 參數：steps 步驟文字（原版 4 個；數量不同時線長會跟著變）、span 進度線走完的秒數（原版 3.2）、font 字型
fxDefine("checklist", {
  dur: 5,
  defaults: { steps: ["上傳素材", "自動配效果", "逐字字幕", "輸出 9:16"], span: 3.2, font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, eOB, rgb, A, FG, M } = C, BG = C.BG === null ? "#12151D" : C.BG;
    C.clear(x, w, h);
    const S = P.steps, N = S.length - 1, x0 = w * 0.22, fs = h * 0.08, gap = h * 0.19, y0 = h * 0.2;
    x.strokeStyle = M; x.lineWidth = 3; x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0, y0 + gap * N); x.stroke();
    const lp = cl(tt / P.span) * N; x.strokeStyle = rgb(A); x.beginPath(); x.moveTo(x0, y0); x.lineTo(x0, y0 + gap * Math.min(N, lp)); x.stroke();
    S.forEach((s, i) => {
      const Yp = y0 + i * gap, on = lp >= i, p = eOB(cl((lp - i) * 2.5));
      x.fillStyle = on ? rgb(A) : "#2A3040"; x.beginPath(); x.arc(x0, Yp, fs * 0.5 * (on ? 0.8 + 0.2 * p : 1), 0, 7); x.fill();
      if (on) { x.strokeStyle = BG; x.lineWidth = 3; x.beginPath(); const c = cl((lp - i) * 3); x.moveTo(x0 - fs * 0.22, Yp); x.lineTo(x0 - fs * 0.22 + fs * 0.15 * Math.min(1, c * 2), Yp + fs * 0.15 * Math.min(1, c * 2)); if (c > 0.5) x.lineTo(x0 - fs * 0.07 + fs * 0.3 * (c - 0.5) * 2, Yp + fs * 0.15 - fs * 0.35 * (c - 0.5) * 2); x.stroke(); }
      x.fillStyle = on ? FG : "rgba(237,239,245,.4)"; x.font = `700 ${fs}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText(s, x0 + fs * 1.1, Yp);
    });
  },
});
