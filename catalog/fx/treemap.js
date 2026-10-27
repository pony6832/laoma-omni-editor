// 移植自圖鑑 treemap（矩形樹狀圖）。原版：五塊矩形依序彈出，面積代表占比，塊內左上寫名稱。
// 資料參數（預設值＝原版，預設參數下與原版逐像素相同）：
//   blocks 手動版面 [x, y, 寬, 高, 文字, 顏色]（座標與尺寸為 0～1；顏色可填 "A"（主色）、"B"（輔色）或 [r,g,b]）、
//   items 自動版面 [{label, value, color?}]（填了就依數值比例自動切版，最大的在左；優先於 blocks）、gap 逐塊彈出間隔秒（原版 0.25）、font 字型
fxDefine("treemap", {
  dur: 4.5,
  defaults: {
    blocks: [[0, 0, 0.5, 1, "影音 42%", "A"], [0.5, 0, 0.5, 0.55, "新聞 26%", "B"], [0.5, 0.55, 0.25, 0.45, "社群 19%", [255, 200, 87]], [0.75, 0.55, 0.25, 0.25, "Podcast 8%", [123, 216, 143]], [0.75, 0.8, 0.25, 0.2, "其他 5%", [154, 161, 179]]],
    items: null, gap: 0.25, numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"',
  },
  draw(x, w, h, t, P, K) {
    const { rgb, cl, eOB, rr } = K;
    const { A, B } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    K.clear(x, w, h);
    const pal = [A, B, [255, 200, 87], [123, 216, 143], [154, 161, 179]], colOf = (c) => (c === "A" ? A : c === "B" ? B : c);
    // 自動切版：依序把第一項切在左（水平）或上（垂直），剩下的遞迴交替切
    const lay = (its, X, Y, W, H, horiz, out) => {
      if (its.length === 1) { out.push([X, Y, W, H, its[0]]); return out; }
      const tot = its.reduce((s, q) => s + q.value, 0), f = its[0].value / tot;
      if (horiz) { out.push([X, Y, W * f, H, its[0]]); return lay(its.slice(1), X + W * f, Y, W * (1 - f), H, false, out); }
      out.push([X, Y, W, H * f, its[0]]); return lay(its.slice(1), X, Y + H * f, W, H * (1 - f), true, out);
    };
    const L = P.items ? lay([...P.items].sort((a, b) => b.value - a.value), 0, 0, 1, 1, true, []).map(([a, b, c, d, q], i) => [a, b, c, d, q.label, q.color || pal[i % pal.length]]) : P.blocks;
    const tt = t % 4.5, m = w * 0.04;
    L.forEach(([a, b, c_, d_, l, col], i) => {
      const p = eOB(cl((tt - i * P.gap) / 0.5)), X = m + a * (w - 2 * m), Yp = m + b * (h - 2 * m), W_ = c_ * (w - 2 * m), H_ = d_ * (h - 2 * m); if (p <= 0) return; x.save(); x.translate(X + W_ / 2, Yp + H_ / 2); x.scale(p, p); x.fillStyle = rgb(colOf(col), 0.9); rr(x, -W_ / 2 + 2, -H_ / 2 + 2, W_ - 4, H_ - 4, 6);
      x.fillStyle = BG; x.font = `700 ${Math.min(H_ * 0.18, W_ * 0.12)}px ${P.font}`; x.textAlign = "left"; x.textBaseline = "top"; x.fillText(l, -W_ / 2 + 10, -H_ / 2 + 8); x.restore();
    });
  },
});
