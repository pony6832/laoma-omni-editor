function compass(g, cx, cy, r, tIn, tOut) {
  const w = mk("div", "", g, "", "position:absolute;left:" + (cx - r) + "px;top:" + (cy - r) + "px;width:" + r * 2 + "px;height:" + r * 2 + "px;border-radius:50%;border:4px solid rgba(255,255,255,.6);background:rgba(14,22,42,.8);opacity:0;box-shadow:0 10px 30px rgba(0,0,0,.5)");
  [["北", 0], ["東", 90], ["南", 180], ["西", 270]].forEach((a) => {
    const rad = ((a[1] - 90) * Math.PI) / 180;
    mk("div", "", w, a[0], "position:absolute;left:" + (r + Math.cos(rad) * (r - 28) - 16) + "px;top:" + (r + Math.sin(rad) * (r - 28) - 20) + "px;width:32px;text-align:center;font-size:30px;font-weight:900;color:" + (a[1] === 0 ? COR : "#cfe3ff"));
  });
  const arrow = mk("div", "", w, "", "position:absolute;left:" + (r - 10) + "px;top:" + (r - r * 0.7) + "px;width:20px;height:" + r * 1.4 + "px;transform-origin:50% 50%");
  mk("div", "", arrow, "", "position:absolute;left:0;top:0;width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-bottom:" + r * 0.7 + "px solid " + COR);
  mk("div", "", arrow, "", "position:absolute;left:8px;top:" + r * 0.7 + "px;width:4px;height:" + r * 0.7 + "px;background:rgba(255,255,255,.5)");
  tl.fromTo(w, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, tIn);
  if (tOut != null) tl.to(w, { opacity: 0, duration: 0.3 }, tOut);
  return { w, arrow };
}
function iconWave(c) { return '<svg width="64" height="44" viewBox="0 0 64 44"><path d="M2 14 Q10 2 18 14 T34 14 T50 14 T62 14 M2 30 Q10 18 18 30 T34 30 T50 30 T62 30" fill="none" stroke="' + c + '" stroke-width="5" stroke-linecap="round"/></svg>'; }
function iconRain(c) { return '<svg width="64" height="64" viewBox="0 0 64 64"><ellipse cx="32" cy="22" rx="24" ry="14" fill="#9fb4d8"/><g stroke="' + c + '" stroke-width="5" stroke-linecap="round"><line x1="18" y1="44" x2="12" y2="58"/><line x1="32" y1="44" x2="26" y2="58"/><line x1="46" y1="44" x2="40" y2="58"/></g></svg>'; }
function iconCloud() { return '<svg width="64" height="64" viewBox="0 0 64 64"><ellipse cx="30" cy="36" rx="24" ry="14" fill="#cfd8ea"/><ellipse cx="42" cy="28" rx="14" ry="12" fill="#e4eaf6"/></svg>'; }
function iconCloudSun() { return '<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="40" cy="22" r="13" fill="#ffc857"/><ellipse cx="28" cy="42" rx="22" ry="12" fill="#cfd8ea"/></svg>'; }
function iconSun() { return '<svg width="64" height="64" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="#ffc857"/><g stroke="#ffc857" stroke-width="5" stroke-linecap="round"><line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/><line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/><line x1="12" y1="12" x2="18" y2="18"/><line x1="46" y1="46" x2="52" y2="52"/><line x1="12" y1="52" x2="18" y2="46"/><line x1="46" y1="18" x2="52" y2="12"/></g></svg>'; }
function iconWind() { return '<svg width="64" height="64" viewBox="0 0 64 64"><g fill="none" stroke="#5fd0ff" stroke-width="5" stroke-linecap="round"><path d="M4 22 H40 a9 9 0 1 0 -9 -9"/><path d="M4 36 H50 a9 9 0 1 1 -9 9"/><path d="M4 50 H28"/></g></svg>'; }

