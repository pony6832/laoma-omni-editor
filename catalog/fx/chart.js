// 移植自圖鑑 chart（圖表生長）。原版：7 根長條依序由下往上彈出，最後一根用主色強調，結尾整張淡出。
// 參數（預設值＝原版，所以預設參數下與原版逐像素相同）：data 各根高度（0～1）、gap 逐根間隔秒、fadeAt 開始淡出的秒數（null＝不淡出）
// 擴充參數（預設都不改變畫面）：
//   title 標題文字、delays 每根各自的開始秒數（省略＝依 gap 依序；用來讓每根對上各自的字幕時間）、labels 每根的標籤文字、values 每根的數值文字（長條旁顯示）、orient "v"（直向，原版）｜"h"（橫向，標籤在左、數值在右）、
//   colors "last"（只強調最後一根，原版）｜"cycle"（依序換主題色）、font 字型
fxDefine("chart", {
  dur: 4,
  defaults: { data: [0.35, 0.5, 0.42, 0.68, 0.6, 0.82, 0.95], gap: 0.12, fadeAt: 3.5, title: "", delays: null, labels: null, values: null, orient: "v", colors: "last", font: '"Noto Sans TC"' },
  draw(x, w, h, tt, P, C) {
    const { cl, eOB, rgb, rr, A, B, FG, M } = C;
    C.clear(x, w, h);
    const d = P.data, n = d.length, fade = P.fadeAt == null ? 1 : 1 - cl((tt - P.fadeAt) / 0.4);
    const dl = (i) => (P.delays ? P.delays[i] : i * P.gap);
    const colOf = (i) => (P.colors === "cycle" ? C.cyc[i % C.cyc.length] : i === n - 1 ? rgb(A) : rgb(B, 0.55));
    if (P.orient === "h") { // 橫向：標籤在左、長條向右生長、數值在長條末端
      const top = P.title ? h * 0.22 : h * 0.1, area = h * 0.9 - top, rh = area / n, bh = rh * 0.62, x0 = w * 0.26;
      let maxw = w * 0.56;
      if (P.values) { x.font = `900 ${Math.min(h * 0.075, bh * 0.75)}px ${P.font}`; maxw = Math.min(maxw, w * 0.97 - x0 - Math.max(...P.values.map((s) => x.measureText(s).width)) - w * 0.015); } // 留空間給最長的數值文字
      x.globalAlpha = fade;
      if (P.title) { x.save(); x.globalAlpha = fade * cl(tt / 0.45); x.fillStyle = FG; x.font = `900 ${h * 0.075}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "top"; x.fillText(P.title, w * 0.045, h * 0.05); x.restore(); }
      d.forEach((v, i) => {
        const p = eOB(cl((tt - dl(i)) / 0.7)), y0 = top + i * rh + (rh - bh) / 2, bw2 = Math.max(0, v * maxw * p), a = cl((tt - dl(i)) / 0.35);
        x.save(); x.globalAlpha = fade * a; x.fillStyle = FG; x.font = `800 ${Math.min(h * 0.07, bh * 0.7)}px ${P.font}`; x.textAlign = "right"; x.textBaseline = "middle";
        if (P.labels) x.fillText(P.labels[i], w * 0.22, y0 + bh / 2); x.restore();
        x.fillStyle = colOf(i); rr(x, x0, y0, bw2, bh, 6);
        if (P.values) { x.save(); x.globalAlpha = fade * cl((tt - dl(i) - 0.4) / 0.35); x.fillStyle = FG; x.font = `900 ${Math.min(h * 0.075, bh * 0.75)}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "middle"; x.fillText(P.values[i], x0 + bw2 + w * 0.015, y0 + bh / 2); x.restore(); }
      });
      x.globalAlpha = 1; return;
    }
    const base = h * 0.86, gw = w * 0.8, bw = (gw / n) * 0.62;
    x.globalAlpha = fade; x.strokeStyle = M; x.lineWidth = 1;
    for (let k = 1; k <= 3; k++) { const Yp = base - k * h * 0.22; x.beginPath(); x.moveTo(w * 0.1, Yp); x.lineTo(w * 0.9, Yp); x.stroke(); }
    d.forEach((v, i) => { const p = eOB(cl((tt - dl(i)) / 0.7)), bh = v * h * 0.68 * p; x.fillStyle = colOf(i); rr(x, w * 0.1 + (i * gw) / n + (gw / n - bw) / 2, base - bh, bw, bh, 4); });
    x.fillStyle = FG; x.fillRect(w * 0.1, base, w * 0.8, 2); x.globalAlpha = 1;
    if (P.labels || P.values) {
      x.save(); x.textAlign = "center"; x.fillStyle = FG;
      d.forEach((v, i) => {
        const cx = w * 0.1 + (i * gw) / n + gw / n / 2, p = eOB(cl((tt - dl(i)) / 0.7)), a = fade * cl((tt - dl(i)) / 0.4);
        x.globalAlpha = a;
        if (P.labels) { x.textBaseline = "top"; x.font = `800 ${h * 0.05}px ${P.font}`; x.fillText(P.labels[i], cx, base + h * 0.025); }
        if (P.values) { x.textBaseline = "alphabetic"; x.font = `900 ${h * 0.055}px ${P.font}`; x.fillText(P.values[i], cx, base - v * h * 0.68 * p - h * 0.015); }
      });
      x.restore();
    }
  },
});
