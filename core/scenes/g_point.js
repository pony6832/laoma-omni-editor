// 通用範本：重點字卡（大關鍵詞＋說明＋最多 3 個小標籤）
// params.v：topic 頁首標籤、keyword 關鍵詞、sub 說明（可空）、chips [{text,line,key}]、lines 本場景句數
defScene("g_point", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines;
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const fs = Math.min(130, Math.floor(1000 / Math.max(V.keyword.length, 1)));
  const ky = V.sub ? 190 : 230;
  const kw = mk("div", "", g, V.keyword, "position:absolute;left:40px;right:40px;top:" + ky + "px;text-align:center;font-size:" + fs + "px;font-weight:900;line-height:1.15;opacity:0;text-shadow:0 0 36px rgba(95,208,255,.55)");
  tl.fromTo(kw, { opacity: 0, scale: 1.5, y: 20 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, T0(1));
  const bar = mk("div", "", g, "", "position:absolute;left:325px;top:" + (ky + Math.round(fs * 1.25)) + "px;width:480px;height:8px;border-radius:4px;background:linear-gradient(90deg," + COR + "," + GLD + ");transform-origin:left;opacity:0");
  tl.fromTo(bar, { opacity: 0, scaleX: 0 }, { opacity: 1, scaleX: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, T0(1) + 0.35);
  if (V.sub) {
    const s = mk("div", "", g, V.sub, "position:absolute;left:60px;right:60px;top:" + (ky + Math.round(fs * 1.25) + 50) + "px;text-align:center;font-size:46px;font-weight:800;line-height:1.4;color:#cfe3ff;opacity:0");
    tl.fromTo(s, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, immediateRender: false }, T0(1) + 0.6);
  }
  (V.chips || []).slice(0, 3).forEach((c, i) => chip(g, 40 + i * 360, 620, c.text, ["c", "cy", "g"][i % 3], c.key ? tw(c.line, c.key) : T0(c.line), T1(n) + 0.3, { y: 30 }));
});
