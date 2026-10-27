// 通用範本：把「已移植的圖鑑效果」（catalog/fx/<id>.js）放進面板，效果依字幕時間點開始播放。
// params.v：topic 頁首標籤、fx 圖鑑效果 id（counter／karaoke／quote…）、params 效果參數（見各效果檔的 defaults）、
//          line／key 效果開始的字幕行與關鍵字、fit 相對行號（填了就把 params.span 設成該句字幕長度，給 karaoke 用）、
//          delays [{line,key}] 讓效果內每個項目各自對上字幕時間（算成相對 t0 的秒數寫進 params.delays；目前 chart 支援）、
//          lead 填 true＝效果從該場景第一句就開始（標籤先出現），數字等到 line／key 才開始（寫進 params.delay，目前 counter 支援）、
//          dur 播放秒數（省略用效果預設）、x／y／w／h 畫布位置與大小（預設填滿面板）、lines 本場景句數
defScene("g_fx", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, tk = V.key ? tw(V.line || 1, V.key) : T0(V.line || 1), t0 = V.lead ? T0(1) : tk;
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const params = Object.assign({ font: '"NotoTC"', textFont: '"NotoTC"', numFont: '"NotoTC"' }, V.params || {});
  if (V.delays) params.delays = V.delays.map((d) => (d.key ? tw(d.line, d.key) : T0(d.line)) - t0);
  if (V.lead) params.delay = Math.max(0, tk - t0);
  if (V.fit) params.span = Math.max(0.5, T1(V.fit) - T0(V.fit));
  fxMount(g, V.fx, { t0, t1: T1(n) + 0.05, x: V.x != null ? V.x : 0, y: V.y != null ? V.y : 0, w: V.w || 1130, h: V.h || 760, params, pal: __PAL, bg: null, dur: V.dur || Math.max(FX[V.fx].dur, T1(n) - t0 + 0.1) });
});
