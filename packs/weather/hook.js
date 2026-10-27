// ================= HOOK：精華預告（0～H 秒）＋「衝進颱風眼」轉場 =================
const th = gsap.timeline();
const tlMain = tl;
tl = th;
const HK = $("#hook");
const VS = 2.2, X0 = 17.6;
const CLIPS = [[2.2, 5.45], [5.45, 8.45], [8.45, 11.65], [11.65, 14.75], [14.75, 17.6]];

// 影片窗（口播精華）與開場插入畫面
th.fromTo("#hvwrap", { opacity: 0 }, { opacity: 1, duration: 0.15, immediateRender: false }, VS - 0.05);
th.fromTo("#hinswrap", { opacity: 0, scale: 1.0 }, { opacity: 1, scale: 1.14, duration: VS + 0.3, ease: "none", immediateRender: false }, 0);
th.to("#hinswrap", { opacity: 0, duration: 0.2 }, VS);
// 每支精華：緩推＋切入閃白＋徽標
CLIPS.forEach((c, i) => {
  th.fromTo("#hvdrift", { scale: 1.16 }, { scale: 1.0, duration: c[1] - c[0], ease: "power2.out", immediateRender: false }, c[0]);
  th.fromTo("#hflash", { opacity: 0 }, { opacity: 0.7, duration: 0.07, yoyo: true, repeat: 1, ease: "none", immediateRender: false }, c[0]);
  const lab = mk("div", "", HK, "重點 0" + (i + 1) + " / 05", "position:absolute;left:360px;top:36px;padding:6px 26px;border-radius:30px;background:rgba(14,22,42,.85);border:2px solid " + COR + ";font-size:34px;font-weight:900;color:#fff;opacity:0;z-index:206");
  th.fromTo(lab, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.25, immediateRender: false }, c[0] + 0.05);
  th.to(lab, { opacity: 0, duration: 0.15 }, c[1] - 0.05);
});

// 品牌（Logo＋標籤）
{
  const lg = mk("div", "", HK, '<img src="assets/logo.png" style="height:52px;display:block" alt="">', "position:absolute;left:60px;top:24px;height:66px;padding:6px 20px;background:#fff;border-radius:16px;display:flex;align-items:center;z-index:206");
  const hb = mk("div", "", HK, "HIGHLIGHT　重點預告", "position:absolute;right:60px;top:30px;padding:8px 30px;border-radius:40px;background:linear-gradient(90deg,#ff6a4d,#ff8f6d);color:#1d0c08;font-size:34px;font-weight:900;letter-spacing:3px;z-index:206");
  th.fromTo([lg, hb], { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.8)", stagger: 0.1 }, 0.1);
  th.to([lg, hb], { opacity: 0, duration: 0.3 }, X0 + 0.3);
}

// ---- 開場問句（0～2.2）：kinetic
{
  const t1 = mk("div", "", HK, "", "position:absolute;left:0;right:0;top:330px;text-align:center;font-size:190px;font-weight:900;white-space:nowrap;z-index:205;text-shadow:0 8px 40px rgba(0,0,0,.8)");
  [..."第29號颱風"].forEach((ch) => mk("span", "oc", t1, ch));
  const t2 = mk("div", "", HK, "會直撲台灣嗎？", "position:absolute;left:0;right:0;top:560px;text-align:center;font-size:130px;font-weight:900;color:" + COR + ";z-index:205;text-shadow:0 6px 30px rgba(0,0,0,.8);opacity:0");
  th.fromTo(t1.querySelectorAll(".oc"), { y: 120, opacity: 0, scale: 1.5 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.06 }, 0.2);
  th.fromTo(t2, { opacity: 0, scale: 2.2 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power4.in", immediateRender: false }, 0.9);
  th.fromTo(t2, { x: 0 }, { x: 10, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, 1.2);
  th.to([t1, t2], { opacity: 0, duration: 0.15 }, VS - 0.05);
}

// ---- 重點 01（2.2～5.45）：直撲台灣
{
  const a = CLIPS[0][0];
  const card = mk("div", "glass", HK, "", "left:1240px;top:150px;width:620px;height:320px;z-index:204");
  const ty = mk("div", "", card, '<img src="assets/typhoon.png" style="width:100%;height:100%" alt="">', "position:absolute;left:14px;top:36px;width:250px;height:250px");
  th.fromTo(ty.firstChild, { rotation: 0 }, { rotation: -360 * 3, duration: 20, ease: "none", immediateRender: false }, a);
  mk("div", "", card, "今年　第", "position:absolute;left:290px;top:28px;font-size:40px;font-weight:800;color:#cfe3ff");
  bignum(card, 290, 66, "font-size:150px;color:" + COR, 0, 29, a + 0.15, 1.0, "號");
  const tg = mk("div", "", card, "強烈颱風", "position:absolute;left:290px;top:246px;padding:6px 26px;border-radius:14px;background:" + RED + ";font-size:44px;font-weight:900");
  th.fromTo(card, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, a + 0.05);
  th.to(card, { opacity: 0, duration: 0.2 }, CLIPS[0][1] - 0.1);
  const q = mk("div", "", HK, "直撲台灣？", "position:absolute;left:90px;top:610px;font-size:170px;font-weight:900;color:" + RED + ";text-shadow:0 0 40px rgba(255,77,94,.8),0 8px 0 #7a1020;opacity:0;z-index:204");
  th.fromTo(q, { opacity: 0, scale: 2.4, rotation: -8 }, { opacity: 1, scale: 1, rotation: -4, duration: 0.25, ease: "power4.in", immediateRender: false }, a + 0.5);
  th.fromTo(q, { x: 0 }, { x: 12, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, a + 0.75);
  th.to(q, { opacity: 0, duration: 0.2 }, CLIPS[0][1] - 0.1);
}

// ---- 重點 02（5.45～8.45）：山谷
{
  const a = CLIPS[1][0];
  const card = mk("div", "", HK, "", "position:absolute;left:1190px;top:140px;width:660px;height:372px;border-radius:26px;overflow:hidden;border:3px solid rgba(255,200,170,.8);box-shadow:0 20px 50px rgba(0,0,0,.6);background:url(assets/valley.png) center / cover;opacity:0;z-index:204");
  const tphc = mk("div", "", card, '<img src="assets/typhoon.png" style="width:100%;height:100%" alt="">', "position:absolute;left:290px;top:210px;width:100px;height:100px");
  th.fromTo(tphc.firstChild, { rotation: 0 }, { rotation: -720, duration: 3, ease: "none", immediateRender: false }, a);
  th.fromTo(tphc, { y: 0, scale: 1 }, { y: -110, scale: 0.55, duration: CLIPS[1][1] - a - 0.3, ease: "power1.inOut", immediateRender: false }, a + 0.1);
  th.fromTo(card, { opacity: 0, y: 60, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, a + 0.05);
  th.to(card, { opacity: 0, duration: 0.2 }, CLIPS[1][1] - 0.1);
  const st = mk("div", "stampbox", HK, "不會爬山", "left:90px;top:560px;font-size:150px;z-index:204");
  th.fromTo(st, { scale: 3, opacity: 0, rotation: -14 }, { scale: 1, opacity: 1, rotation: -6, duration: 0.2, ease: "power4.in", immediateRender: false }, a + 1.55);
  th.fromTo(st, { x: 0 }, { x: 8, duration: 0.04, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, a + 1.75);
  th.to(st, { opacity: 0, duration: 0.2 }, CLIPS[1][1] - 0.1);
}

// ---- 重點 03（8.45～11.65）：氣溫 31 → 25
{
  const a = CLIPS[2][0];
  const g1 = mk("div", "glass", HK, "", "left:90px;top:520px;width:760px;height:300px;z-index:204");
  th.fromTo(g1, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, a + 0.05);
  mk("div", "", g1, "明天　北部高溫", "position:absolute;left:36px;top:20px;font-size:42px;font-weight:800;color:#cfe3ff");
  bignum(g1, 36, 80, "font-size:170px;color:#5fd0ff", 31, 25, a + 0.3, 1.6, "°C");
  const dn = mk("div", "", g1, "↓ 6 度", "position:absolute;left:470px;top:110px;padding:6px 26px;border-radius:16px;background:" + RED + ";font-size:64px;font-weight:900;opacity:0");
  th.fromTo(dn, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.4)", immediateRender: false }, a + 1.4);
  const ch = mk("div", "chip i", HK, "晚上剩　22 度", "left:1360px;top:640px;font-size:56px;z-index:204");
  th.fromTo(ch, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.35, ease: "back.out(1.8)", immediateRender: false }, a + 1.7);
  th.to([g1, ch], { opacity: 0, duration: 0.2 }, CLIPS[2][1] - 0.1);
}

// ---- 重點 04（11.65～14.75）：拜拜颱風走了
{
  const a = CLIPS[3][0];
  const st = mk("div", "stampbox", HK, "拜拜　颱風走了", "left:90px;top:560px;font-size:130px;color:" + GRN + ";border-color:" + GRN + ";z-index:204");
  th.fromTo(st, { scale: 3, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: -5, duration: 0.2, ease: "power4.in", immediateRender: false }, a + 1.65);
  th.fromTo(st, { x: 0 }, { x: 8, duration: 0.04, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, a + 1.85);
  th.to(st, { opacity: 0, duration: 0.2 }, CLIPS[3][1] - 0.1);
  const c1 = mk("div", "chip r", HK, "週五晚上", "left:90px;top:150px;font-size:60px;z-index:204");
  th.fromTo(c1, { opacity: 0, x: -80 }, { opacity: 1, x: 0, duration: 0.35, ease: "back.out(1.8)", immediateRender: false }, a + 0.1);
  th.to(c1, { opacity: 0, duration: 0.2 }, CLIPS[3][1] - 0.1);
}

// ---- 重點 05（14.75～17.6）：強風雨全在海上
{
  const a = CLIPS[4][0];
  const rc = mk("img", "", HK, "", "position:absolute;left:1180px;top:100px;width:700px;opacity:0;z-index:203");
  rc.src = "assets/raincloud.png";
  th.fromTo(rc, { opacity: 0, x: 80 }, { opacity: 0.95, x: 0, duration: 0.6, ease: "power2.out", immediateRender: false }, a + 0.1);
  th.to(rc, { opacity: 0, duration: 0.2 }, CLIPS[4][1] - 0.1);
  const st = mk("div", "stampbox", HK, "強風雨　全在海上", "left:90px;top:540px;font-size:125px;color:" + CYA + ";border-color:" + CYA + ";z-index:204");
  th.fromTo(st, { scale: 3, opacity: 0, rotation: -12 }, { scale: 1, opacity: 1, rotation: -4, duration: 0.2, ease: "power4.in", immediateRender: false }, a + 0.9);
  th.fromTo(st, { x: 0 }, { x: 8, duration: 0.04, yoyo: true, repeat: 5, ease: "none", immediateRender: false }, a + 1.1);
  th.to(st, { opacity: 0, duration: 0.2 }, CLIPS[4][1] - 0.05);
}

// ---- 字幕（與旁白稿一致）
{
  const caps = [
    [2.25, 4.0, "未來整個會直撲台灣"], [4.0, 5.4, "有多嚴重有多嚴重"],
    [5.55, 7.25, "颱風只會在山谷裡走"], [7.25, 8.4, "不會爬山"],
    [8.5, 10.0, "那明天25度"], [10.1, 11.6, "晚上剩22度"],
    [11.7, 13.3, "到了禮拜五的晚上的時候"], [13.3, 14.7, "拜拜颱風走了"],
    [14.8, 17.55, "全部都在海面上"],
  ];
  const cb = $("#hcap");
  caps.forEach((c) => {
    const n = [...c[2]].length, fs = n <= 14 ? 62 : 54;
    const w = mk("div", "cap", cb), pl = mk("span", "pill", w);
    pl.style.fontSize = fs + "px";
    [...c[2]].forEach((ch) => mk("span", "cc", pl, ch));
    th.set(w, { opacity: 1 }, c[0]);
    th.fromTo(pl, { y: 14, scale: 0.95 }, { y: 0, scale: 1, duration: 0.14, ease: "power2.out", immediateRender: false }, c[0]);
    th.to(w.querySelectorAll(".cc"), { color: COR, duration: 0.02, stagger: Math.max(0.012, ((c[1] - c[0]) * 0.8) / n) }, c[0]);
    th.set(w, { opacity: 0 }, c[1]);
  });
}

// ---- 轉場：衝進颱風眼 → 白光 → 正片
{
  const tx = mk("div", "", HK, "預告結束　完整解析馬上開始", "position:absolute;left:0;right:0;top:780px;text-align:center;font-size:64px;font-weight:900;color:#fff;letter-spacing:6px;opacity:0;z-index:215;text-shadow:0 4px 20px rgba(0,0,0,.9)");
  th.fromTo(tx, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, immediateRender: false }, X0 + 0.05);
  th.to(tx, { opacity: 0, duration: 0.25 }, X0 + 1.0);
  th.to("#hvwrap", { opacity: 0.18, duration: 0.8, ease: "power2.in" }, X0);
  // 放射速度線
  const rays = mk("div", "", HK, "", "position:absolute;left:50%;top:50%;width:3200px;height:3200px;margin:-1600px 0 0 -1600px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.55) 0deg 1.2deg,rgba(255,255,255,0) 1.2deg 7deg);opacity:0;z-index:208;-webkit-mask-image:radial-gradient(circle,transparent 8%,#000 40%);mask-image:radial-gradient(circle,transparent 8%,#000 40%)");
  th.fromTo(rays, { opacity: 0, scale: 0.5, rotation: 0 }, { opacity: 0.9, scale: 1.3, rotation: 40, duration: H - X0 - 0.2, ease: "power2.in", immediateRender: false }, X0 + 0.1);
  // 颱風：以颱風眼為中心由小放大並高速旋轉
  const W = 760, ex = 0.477 * W, ey = 0.496 * W;
  const tv = mk("div", "", HK, '<img src="assets/typhoon.png" style="width:100%;height:100%;display:block" alt="">', "position:absolute;left:" + (960 - ex) + "px;top:" + (540 - ey) + "px;width:" + W + "px;height:" + W + "px;transform-origin:" + ex + "px " + ey + "px;opacity:0;z-index:210;filter:drop-shadow(0 0 40px rgba(160,210,255,.9))");
  th.fromTo(tv, { scale: 0.14, rotation: 0, opacity: 0 }, { scale: 0.14, rotation: 0, opacity: 0, duration: 0.01, immediateRender: false }, X0 - 0.1);
  th.to(tv, { opacity: 1, duration: 0.25, ease: "none" }, X0);
  th.fromTo(tv, { scale: 0.14 }, { scale: 24, duration: H - X0 - 0.15, ease: "power4.in", immediateRender: false }, X0);
  th.fromTo(tv, { rotation: 0 }, { rotation: -540, duration: H - X0 - 0.15, ease: "power2.in", immediateRender: false }, X0);
  // 白光封場 → 正片
  th.fromTo("#hwhite", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.in", immediateRender: false }, H - 0.55);
  th.set("#hook", { opacity: 0 }, H);
  th.to("#hwhite", { opacity: 0, duration: 0.8, ease: "power2.out" }, H);
  // 正片起點的衝擊波
  [0, 1, 2].forEach((i) => {
    const rg = mk("div", "", $("#hwhite").parentNode, "", "position:absolute;left:50%;top:50%;width:300px;height:300px;margin:-150px 0 0 -150px;border-radius:50%;border:" + (14 - i * 3) + "px solid " + (i === 1 ? CYA : COR) + ";opacity:0;z-index:212;pointer-events:none");
    th.fromTo(rg, { scale: 0.2, opacity: 0.95 }, { scale: 9, opacity: 0, duration: 1.1, ease: "power2.out", immediateRender: false }, H + i * 0.12);
  });
}

// ---- 組裝：預告在前、正片整體後移 H 秒
tl = tlMain;
const rootTl = gsap.timeline({ paused: true });
tlMain.paused(false);
rootTl.add(th, 0);
rootTl.add(tlMain, H);
window.__timelines["main"] = rootTl;
rootTl.seek(0);
