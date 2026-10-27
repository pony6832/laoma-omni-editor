// 場景 P：一週天氣 第 150～156 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("P", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(7) + 0.1, P.t["颱風影響　週四到週一"]);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const cards = [
    [P.t["週四"], iconWave("#5fd0ff"), P.t["近海風浪增大"], CYA, tw(2, "禮拜四")],
    [P.t["週五"], iconRain("#5fd0ff"), P.t["北部、東半部下雨"], IND, tw(3, "禮拜五")],
    [P.t["週六"], iconCloud(), P.t["雨後漸漸轉多雲"], "#9fb4d8", tw(5, "禮拜六")],
    [P.t["週日"], iconCloudSun(), P.t["多雲時晴"], GLD, tw(5, "禮拜天")],
    [P.t["週一"], iconWind(), P.t["東北季風再度增強"], COR, tw(6, "禮拜一")],
  ];
  cards.forEach((c, i) => {
    const e = mk("div", "glass", g, "", "left:" + (25 + i * 217) + "px;top:140px;width:200px;height:470px;border-top:10px solid " + c[3]);
    mk("div", "", e, c[0], "position:absolute;left:0;right:0;top:20px;text-align:center;font-size:54px;font-weight:900;color:" + c[3]);
    mk("div", "", e, c[1], "position:absolute;left:0;right:0;top:110px;text-align:center;transform:scale(1.8);transform-origin:center top");
    mk("div", "", e, c[2], "position:absolute;left:16px;right:16px;top:280px;text-align:center;font-size:38px;font-weight:800;line-height:1.35");
    tl.fromTo(e, { opacity: 0, y: 80, rotationX: -30 }, { opacity: 1, y: 0, rotationX: 0, duration: 0.55, ease: "back.out(1.4)", immediateRender: false }, c[4] - 0.2);
    if (i === 1) {
      const sub = mk("div", "", e, P.t["中南部　雲量多"], "position:absolute;left:12px;right:12px;top:410px;text-align:center;font-size:34px;font-weight:800;color:#cfd8ea;opacity:0");
      tl.fromTo(sub, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, tw(4, "中部南部"));
    }
  });
}
});
