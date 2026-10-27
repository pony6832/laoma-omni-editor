// 財經範本：指數／股價看板（數字跳動＋漲跌箭頭；台股慣例：漲紅跌綠）
// params.v：topic、name 標的名稱、value 數值（整數，與 text 二選一）、text 不跳動的數值字串、from 起始值、
//          change 漲跌點數字串（如 "+215"）、pct 漲跌幅字串（如 "1.02%"）、dir "up"|"down"、note 補充、line/key 數字出現時機、lines 本場景句數
defScene("g_ticker", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, t = V.key ? tw(V.line || 1, V.key) : T0(V.line || 1);
  const up = V.dir !== "down", col = up ? RED : GRN;
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const nm = mk("div", "", g, V.name, "position:absolute;left:40px;right:40px;top:110px;text-align:center;font-size:62px;font-weight:900;color:#cfe3ff;opacity:0");
  tl.fromTo(nm, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.45, immediateRender: false }, T0(1));
  const box = mk("div", "", g, "", "position:absolute;left:0;right:0;top:210px;text-align:center");
  const css = "position:relative;left:auto;top:auto;display:inline-block;font-size:210px;color:#fff;text-shadow:0 0 40px " + col + "88";
  if (V.text) { pop(mk("div", "bignum", box, V.text, css), t, null); }
  else { bignum(box, 0, 0, css, V.from || 0, V.value, t, 1.4, V.unit || ""); }
  const row = mk("div", "", g, "<span style='font-size:90px'>" + (up ? "▲" : "▼") + "</span> " + (V.change || "") + (V.pct ? "　" + V.pct : ""),
    "position:absolute;left:40px;right:40px;top:470px;text-align:center;font-size:84px;font-weight:900;color:" + col + ";opacity:0");
  tl.fromTo(row, { opacity: 0, y: 40, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, t + 1.0);
  if (V.note) {
    const nt = mk("div", "", g, V.note, "position:absolute;left:60px;right:60px;top:610px;text-align:center;font-size:44px;font-weight:800;color:" + GLD + ";opacity:0");
    tl.fromTo(nt, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, immediateRender: false }, t + 1.5);
  }
});
