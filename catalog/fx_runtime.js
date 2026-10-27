// 圖鑑效果移植層。圖鑑 HTML 的 DRAW 函式是「整張畫面＋寫死的字、數字、顏色＋自己 t%T 循環」，
// 這裡把它改成「純函式（只看本地時間 tt）＋參數 P＋調色盤 C」，由 HyperFrames 的 GSAP 時間軸驅動，任意跳幀都能重現。
// 移植規則：1) 繪圖指令照抄；2) 寫死的字／數字／顏色改成 P.xxx／C.xxx，預設值＝原版，所以預設參數下與原版逐像素相同；
//          3) 去掉 t%T 循環（tt 從 0 開始，播完停在最後一格）；4) clear 改成 C.clear，才能選擇透明底疊在版面上。
const FX = {};
function fxDefine(id, spec) { FX[id] = spec; }

// 調色盤：預設＝圖鑑原版（也就是氣象主題的色盤）；pal 傳主題色盤（coral／indigo／gold…）即換色
function fxHelpers(pal, bg) {
  const hex = (s) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  pal = pal || {};
  const A = pal.coral ? hex(pal.coral) : [255, 106, 77], B = pal.indigo ? hex(pal.indigo) : [111, 139, 255];
  const Y = pal.gold || "#FFC857", FG = "#EDEFF5", M = "#2A3040", BG = bg === undefined ? "#12151D" : bg;
  const rgb = (c, al = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${al})`;
  const bgc = BG === null ? "#12151D" : BG;
  const cl = (v) => Math.max(0, Math.min(1, v)), eIO = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
  const scene = (x, w, h, bg, fg, txt, font) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.font = `700 ${h * 0.13}px ${font || "Unbounded,sans-serif"}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, w / 2, h / 2); };
  return {
    A, B, Y, FG, M, BG, rgb,
    // 轉場示範：畫面 A 被 path 形狀裁出的畫面 B 逐步揭開（圖鑑原版的 TR 輔助函式）
    TR: (x, w, h, t, path, font) => { const p = eIO(cl(((t % 2.6) - 0.5) / 1.4)); scene(x, w, h, bgc, FG, "SCENE 1", font); if (p <= 0) return; x.save(); x.beginPath(); path(p); x.clip(); scene(x, w, h, rgb(A), bgc, "SCENE 2", font); x.restore(); },
    heart: (x, cx, cy, s) => { x.beginPath(); x.moveTo(cx, cy + s * 0.7); x.bezierCurveTo(cx - s * 1.2, cy - s * 0.1, cx - s * 0.6, cy - s, cx, cy - s * 0.45); x.bezierCurveTo(cx + s * 0.6, cy - s, cx + s * 1.2, cy - s * 0.1, cx, cy + s * 0.7); x.fill(); },
    cyc: [pal.coral || "#ff6a4d", pal.cyan || "#5fd0ff", pal.gold || "#ffc857", pal.indigo || "#6f8bff", pal.green || "#4de39a"], // 依序換色用（長條圖 colors:"cycle"）
    mix: (k, al = 1) => rgb([B[0] + (A[0] - B[0]) * k, B[1] + (A[1] - B[1]) * k, B[2] + (A[2] - B[2]) * k], al),
    cl: (v) => Math.max(0, Math.min(1, v)),
    eOC: (p) => 1 - Math.pow(1 - p, 3),
    eOB: (p) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
    eIO: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    rr: (x, X, Y2, w, h, r) => { x.beginPath(); x.roundRect ? x.roundRect(X, Y2, w, h, r) : x.rect(X, Y2, w, h); x.fill(); },
    rnd: (n) => { const v = Math.sin(n * 12.9898) * 43758.5453; return v - Math.floor(v); },
    scene: (x, w, h, bg, fg, txt, font) => { x.fillStyle = bg; x.fillRect(0, 0, w, h); x.fillStyle = fg; x.font = `700 ${h * 0.13}px ${font || "Unbounded,sans-serif"}`; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(txt, w / 2, h / 2); },
    clear: (x, w, h) => { if (BG === null) x.clearRect(0, 0, w, h); else { x.fillStyle = BG; x.fillRect(0, 0, w, h); } },
    // 介面微動態類（圖鑑 180 版新增）共用的亮底方格、卡片、文字、游標；原版寫死淺色底與字型，這裡照抄不隨主題變
    UI_LT: "#EEF0F6", UI_INK: "#161922", UI_B: "#3B6BFF", UI_G: "#2DBE60",
    uiBg: (x, w, h) => { x.fillStyle = "#EEF0F6"; x.fillRect(0, 0, w, h); x.fillStyle = "rgba(120,130,160,.10)"; for (let i = 16; i < w; i += 16) x.fillRect(i, 0, .6, h); for (let j = 16; j < h; j += 16) x.fillRect(0, j, w, .6); },
    uiCard: (x, X, Y, W, H, r = 14) => { x.save(); x.shadowColor = "rgba(40,50,90,.20)"; x.shadowBlur = 22; x.shadowOffsetY = 9; x.fillStyle = "#fff"; x.beginPath(); x.roundRect ? x.roundRect(X, Y, W, H, r) : x.rect(X, Y, W, H); x.fill(); x.restore(); },
    uiText: (x, s, X, Y, fs, col, wt = 600, al = "center") => { x.font = `${wt} ${fs}px "Noto Sans TC",Unbounded,sans-serif`; x.textAlign = al; x.textBaseline = "middle"; x.fillStyle = col; x.fillText(s, X, Y); },
    uiCursor: (x, X, Y, s = 1) => { x.save(); x.translate(X, Y); x.scale(s, s); x.fillStyle = "#161922"; x.strokeStyle = "#fff"; x.lineWidth = 1.5; x.beginPath(); x.moveTo(0, 0); x.lineTo(0, 18); x.lineTo(5, 14); x.lineTo(9, 22); x.lineTo(12, 20.5); x.lineTo(8, 13); x.lineTo(14, 13); x.closePath(); x.fill(); x.stroke(); x.restore(); },
  };
}

// 掛到版面：在容器 g 裡放一張 canvas，從 t0 起播 spec.dur 秒（或 o.dur），期間用 GSAP 時間軸驅動繪圖。
// o：{t0, t1（消失時間，可省）, x, y, w, h, params, pal, bg（null＝透明）, dur}
function fxMount(g, id, o) {
  const spec = FX[id];
  if (!spec) throw new Error("圖鑑效果尚未移植：" + id);
  const P = Object.assign({}, spec.defaults, o.params || {});
  const w = o.w, h = o.h, dpr = o.dpr || 1, dur = o.dur || spec.dur;
  const cv = mk("canvas", "", g, "", `position:absolute;left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px;opacity:0`);
  cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
  const x = cv.getContext("2d"), C = fxHelpers(o.pal, o.bg === undefined ? null : o.bg);
  C.canvas = cv; C.dpr = dpr; // 少數效果（如 glitch）需要自己的畫布與像素比
  const st = { t: 0 };
  const draw = () => { x.setTransform(dpr, 0, 0, dpr, 0, 0); spec.draw(x, w, h, st.t, P, C); };
  draw();
  if (document.fonts) document.fonts.load('900 40px NotoTC').then(draw); // 字型載入後補畫一次
  tl.fromTo(cv, { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, o.t0);
  tl.fromTo(st, { t: 0 }, { t: dur, duration: dur, ease: "none", immediateRender: false, onUpdate: draw }, o.t0);
  if (o.t1 != null) tl.to(cv, { opacity: 0, duration: 0.25 }, o.t1);
  return cv;
}
