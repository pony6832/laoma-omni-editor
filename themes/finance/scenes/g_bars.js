// 財經範本：橫向長條比較（由圖鑑移植版 chart 橫向模式繪製；舊手寫版保留為 g_bars_legacy）
// params.v：topic、title、unit 單位、bars [{label, value, line, key}]（line/key 決定該根出現的字幕時機）、lines 本場景句數
defScene("g_bars", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, t0 = T0(1), mx = Math.max(...V.bars.map((b) => b.value));
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const params = {
    font: '"NotoTC"', title: V.title, orient: "h", colors: "cycle", fadeAt: null, data: V.bars.map((b) => b.value / mx), labels: V.bars.map((b) => b.label),
    values: V.bars.map((b) => b.value.toLocaleString("en-US") + (V.unit || "")), delays: V.bars.map((b) => (b.key ? tw(b.line, b.key) : T0(b.line)) - t0),
  };
  fxMount(g, "chart", { t0, t1: T1(n) + 0.05, x: 0, y: 0, w: 1130, h: 760, params, pal: __PAL, bg: null, dur: Math.max(FX.chart.dur, T1(n) - t0 + 0.1) });
});
