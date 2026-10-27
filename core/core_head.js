// ================= 核心：背景、口播視窗、字幕、地圖與動畫工具 =================
const COR = "__PAL_coral__", IND = "__PAL_indigo__", CYA = "__PAL_cyan__", GRN = "__PAL_green__", RED = "__PAL_red__", GLD = "__PAL_gold__";
let UID = 0;
const R0 = rng(11);

// ---- 背景：夜空緩推＋漂浮光點
tl.fromTo("#bg", { scale: 1 }, { scale: 1.08, duration: T, ease: "none" }, 0);
{
  const bgEl = $("#bg");
  for (let i = 0; i < 22; i++) {
    const d = mk("div", "dot", bgEl), s = 3 + R0() * 7;
    d.style.cssText = "left:" + R0() * 1920 + "px;top:" + R0() * 1080 + "px;width:" + s + "px;height:" + s + "px;opacity:" + (0.1 + R0() * 0.25);
    tl.to(d, { y: -(200 + R0() * 400), duration: T, ease: "none" }, 0);
  }
}

// ---- 口播視窗模式（全屏／右側小窗）。一律用 fromTo，確保任意跳幀都可重現
const FULLV = { x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px 0px 0px round 0px)" };
const SPLITV = { x: 863.4, y: 78.8, scale: 0.78, clipPath: "inset(40px 642px 66px 470px round 36px)" };
gsap.set("#vbox", FULLV);
gsap.set("#name", { x: 60, y: 815 });
function setMode(t, mode, dur) {
  dur = dur || 0.7;
  const a = mode === "split" ? FULLV : SPLITV, b = mode === "split" ? SPLITV : FULLV;
  tl.fromTo("#vbox", a, Object.assign({ duration: dur, ease: "power3.inOut", immediateRender: false }, b), t);
  tl.fromTo("#vshade", { opacity: mode === "split" ? 1 : 0 }, { opacity: mode === "split" ? 0 : 1, duration: dur, ease: "none", immediateRender: false }, t);
  tl.fromTo("#vframe", { opacity: mode === "split" ? 0 : 1 }, { opacity: mode === "split" ? 1 : 0, duration: dur, ease: "none", immediateRender: false }, t);
  const nA = mode === "split" ? { x: 60, y: 815 } : { x: 1230, y: 800 }, nB = mode === "split" ? { x: 1230, y: 800 } : { x: 60, y: 815 };
  tl.fromTo("#name", nA, Object.assign({ duration: dur, ease: "power3.inOut", immediateRender: false }, nB), t);
}

// ---- 跳接點：畫面緩推交錯（藏接點）
C.cuts.forEach((c, i) => {
  const len = (i + 1 < C.cuts.length ? C.cuts[i + 1] : D) - c;
  const a = i % 2 === 0 ? 1.0 : 1.07, b = i % 2 === 0 ? 1.045 : 1.03;
  tl.fromTo("#vdrift", { scale: a }, { scale: b, duration: len, ease: "none", immediateRender: false }, c);
});
tl.set("#vdrift", { scale: 1 }, 0);

// ---- 頁首
tl.fromTo("#logo", { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, 0.2);
tl.fromTo("#series", { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, 0.35);
tl.fromTo("#badge", { opacity: 0, scale: 0.3, rotation: -180 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.6, ease: "back.out(1.6)" }, 0.3);
tl.to("#badge", { rotation: 360, duration: T, ease: "none" }, 1);
tl.fromTo("#name", { opacity: 0 }, { opacity: 1, duration: 0.5, immediateRender: false }, 1.0);

// ---- 開場：標題 kinetic
{
  const t1 = $("#opener .t1");
  [...__OPENER__].forEach((ch) => mk("span", "oc", t1, ch));
  tl.fromTo("#opener", { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0);
  tl.fromTo("#opener .oc", { y: 90, opacity: 0, scale: 1.4 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.07 }, 0.1);
  tl.fromTo("#opener .t2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 0.7);
  tl.to("#opener", { opacity: 0, duration: 0.4 }, 2.05);
}

// ---- 字幕：逐字高亮（karaoke）
{
  const cb = $("#capbox");
  const disp = (s) => s.replace(/(\d),(?=\d)/g, "$1").replace(/[，。、,]/g, " ").replace(//g, ",").replace(/!/g, "！").replace(/\?/g, "？").replace(/[《》]/g, "").replace(/\s+/g, " ").trim();
  function split(txt) {
    const ch = [...txt];
    if (keepc(txt).length <= 19) return [txt];
    let best = -1, bd = 1e9;
    ch.forEach((c, i) => { if (/[，、]/.test(c) || (c === "," && !(/\d/.test(ch[i - 1] || "") && /\d/.test(ch[i + 1] || "")))) { const d = Math.abs(i - ch.length / 2); if (d < bd) { bd = d; best = i; } } });
    if (best < 0) best = Math.floor(ch.length / 2);
    return [ch.slice(0, best + 1).join(""), ch.slice(best + 1).join("")];
  }
  L.forEach((ln) => {
    const parts = split(ln.text), tot = parts.reduce((a, p) => a + Math.max(1, keepc(p).length), 0);
    let cur = ln.t0;
    parts.forEach((p) => {
      const seg = ((ln.t1 - ln.t0) * Math.max(1, keepc(p).length)) / tot, st = cur, en = cur + seg;
      cur = en;
      const txt = disp(p);
      if (!txt) return;
      const n = [...txt].length, fs = n <= 14 ? 58 : n <= 18 ? 52 : 46;
      const w = mk("div", "cap", cb), pl = mk("span", "pill", w);
      pl.style.fontSize = fs + "px";
      [...txt].forEach((c) => mk("span", "cc", pl, c === " " ? "&nbsp;" : c));
      tl.set(w, { opacity: 1 }, st);
      tl.fromTo(pl, { y: 14, scale: 0.95 }, { y: 0, scale: 1, duration: 0.14, ease: "power2.out", immediateRender: false }, st);
      tl.to(w.querySelectorAll(".cc"), { color: COR, duration: 0.02, stagger: Math.max(0.012, ((en - st) * 0.8) / n) }, st);
      tl.set(w, { opacity: 0 }, en);
    });
  });
}
tl.fromTo("#pfill", { scaleX: 0 }, { scaleX: 1, duration: D, ease: "none" }, 0);
tl.to("#grain", { x: -120, y: 90, duration: T, ease: "steps(" + Math.round(T * 12) + ")" }, 0);

