// 通用範本：大數字（由圖鑑移植版 counter 繪製；舊手寫版保留為 g_number_legacy）
// params.v：topic、label 數字上方說明、value 數字（與 text 二選一）、text 區間等不能跳動的數字（如 "7～9"）、
//          unit 單位、note 下方補充、line/key 數字出現時機、lines 本場景句數
// 與舊版差異：不支援 from（起始值一律從 0 跳）。標籤從場景第一句就出現，數字等到 line/key 才開始。
defScene("g_number", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, tk = V.key ? tw(V.line || 1, V.key) : T0(V.line || 1), t0 = T0(1);
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const params = { font: '"NotoTC"', textFont: '"NotoTC"', numFont: '"NotoTC"', label: V.label, unit: V.unit || "", note: V.note || "", tag: "", align: "center", bar: false, numSize: 0.31, numColor: "accent", delay: Math.max(0, tk - t0) };
  if (V.text) params.text = V.text; else params.value = V.value;
  fxMount(g, "counter", { t0, t1: T1(n) + 0.05, x: 0, y: 0, w: 1130, h: 760, params, pal: __PAL, bg: null, dur: Math.max(FX.counter.dur, T1(n) - t0 + 0.1) });
});
