// （舊版手寫實作，保留給需要沿用舊外觀的專案；新專案請用 g_number，已改由圖鑑移植版 counter／chart 繪製）
// 通用範本：大數字（數字跳動＋單位＋說明）
// params.v：topic、label 數字上方說明、value 數字（與 text 二選一）、text 區間等不能跳動的數字（如 "7～9"）、
//          from 起始值、unit 單位、note 下方補充、line/key 數字出現時機、lines 本場景句數
defScene("g_number_legacy", function (T0, T1, tw, te, P) {
  const V = P.v, n = V.lines, t = V.key ? tw(V.line || 1, V.key) : T0(V.line || 1);
  const g = pscene(T0(1) - 0.1, T1(n) + 0.1, V.topic);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const lb = mk("div", "", g, V.label, "position:absolute;left:40px;right:40px;top:120px;text-align:center;font-size:54px;font-weight:800;color:#cfe3ff;opacity:0");
  tl.fromTo(lb, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.45, immediateRender: false }, T0(1));
  const box = mk("div", "", g, "", "position:absolute;left:0;right:0;top:230px;text-align:center");
  const css = "position:relative;left:auto;top:auto;display:inline-block;font-size:240px;color:" + COR + ";text-shadow:0 0 40px rgba(255,106,77,.5)";
  if (V.text) {
    const e = mk("div", "bignum", box, V.text, css);
    mk("small", "", e, V.unit || "", "font-size:.32em;margin-left:14px;font-weight:800;color:#fff");
    pop(e, t, null);
  } else {
    bignum(box, 0, 0, css, V.from || 0, V.value, t, 1.4, V.unit || "");
  }
  if (V.note) {
    const nt = mk("div", "", g, V.note, "position:absolute;left:60px;right:60px;top:560px;text-align:center;font-size:44px;font-weight:800;color:" + GLD + ";opacity:0");
    tl.fromTo(nt, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.45, immediateRender: false }, t + 1.0);
  }
});
