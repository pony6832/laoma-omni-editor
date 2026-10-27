// 移植自圖鑑 counter（數字跳動）。原版：數字 0→12,480 用 2.2 秒先快後慢，標籤在上、進度條同步長出，結束時跳出「+38%」。
// 參數（預設值＝原版，所以預設參數下與原版逐像素相同）：
//   label 上方標籤、value 終值、tag 完成徽章文字（空字串＝不顯示）、count 跳動秒數、numFont／textFont 字型
// 擴充參數（預設都不改變畫面）：
//   unit 單位（畫在數字右側，例：%、小時、公里）、text 不跳動的數字文字（例：7～9，淡入）、bar 是否畫進度條、
//   align "left"｜"center"、numSize 數字字級（相對高度，原版 0.24）、numColor 數字顏色（"accent"＝主題主色，省略＝原版白色）、
//   note 補充說明（數字跳完後淡入，金色）、delay 數字延後幾秒才開始跳（標籤與進度條底先出現，數字等關鍵字）
fxDefine("counter", {
  dur: 4.2,
  defaults: { label: "本月新增使用者", value: 12480, tag: "+38%", count: 2.2, numFont: "Unbounded,sans-serif", textFont: '"Noto Sans TC"', unit: "", text: null, bar: true, align: "left", numSize: 0.24, numColor: null, note: "", delay: 0 },
  draw(x, w, h, tt, P, C) {
    const { cl, eOC, eOB, rr, rgb, A, BG, FG, M, Y } = C;
    C.clear(x, w, h);
    const td = tt - P.delay, p = eOC(cl(td / P.count));
    const v = P.text != null ? P.text : Math.round(P.value * p).toLocaleString("en-US");
    const center = P.align === "center", X = center ? w * 0.5 : w * 0.1;
    x.textAlign = center ? "center" : "left"; x.textBaseline = "alphabetic"; x.fillStyle = "#9AA1B3"; x.font = `500 ${h * 0.065}px ${P.textFont}`; x.fillText(P.label, X, h * 0.3);
    x.fillStyle = P.numColor === "accent" ? rgb(A) : P.numColor || FG; x.font = `700 ${h * P.numSize}px ${P.numFont}`;
    if (P.text != null) x.globalAlpha = cl(td / 0.4);
    else if (P.delay > 0 && td < 0) x.globalAlpha = 0;
    if (P.unit) { // 數字＋單位當成一組置中／靠左
      const mw = x.measureText(v).width, gap = h * 0.02;
      x.font = `800 ${h * P.numSize * 0.4}px ${P.textFont}`; const uw = x.measureText(P.unit).width;
      const x0 = center ? w / 2 - (mw + gap + uw) / 2 : X;
      x.textAlign = "left"; x.font = `700 ${h * P.numSize}px ${P.numFont}`; x.fillText(v, x0, h * 0.6);
      x.font = `800 ${h * P.numSize * 0.4}px ${P.textFont}`; x.fillText(P.unit, x0 + mw + gap, h * 0.6);
      x.textAlign = center ? "center" : "left";
    } else x.fillText(v, X, h * 0.6);
    x.globalAlpha = 1;
    if (P.bar) { x.fillStyle = M; x.fillRect(w * 0.1, h * 0.72, w * 0.8, 6); x.fillStyle = rgb(A); x.fillRect(w * 0.1, h * 0.72, w * 0.8 * p, 6); }
    if (P.note) {
      const q2 = eOC(cl((td - P.count) / 0.45));
      x.save(); x.globalAlpha = q2; x.fillStyle = Y; x.font = `800 ${h * 0.058}px ${P.textFont}`; x.textAlign = center ? "center" : "left"; x.fillText(P.note, X, h * 0.86 + (1 - q2) * 16); x.restore();
    }
    const q = P.tag ? eOB(cl((td - P.count) / 0.4)) : 0;
    if (q > 0) {
      x.save(); x.translate(w * 0.78, h * 0.18); x.scale(q, q); x.fillStyle = "#7BD88F"; rr(x, -w * 0.09, -h * 0.055, w * 0.18, h * 0.11, h * 0.055);
      x.fillStyle = BG === null ? "#12151D" : BG; x.font = `700 ${h * 0.065}px ${P.numFont}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(P.tag, 0, 2); x.restore();
    }
  },
});
