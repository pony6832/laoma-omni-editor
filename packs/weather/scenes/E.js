// 場景 E：今天／明天重點、媒體標題 第 49～55 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("E", function (T0, T1, tw, te, P) {
{
  const g = pscene(T0(1) - 0.1, T1(7) + 0.1, P.t["重點與媒體標題"]);
  mk("div", "pbg", g); mk("div", "ptint", g);
  const mkCard = (x, title, body, k, t) => {
    const c = mk("div", "glass", g, "", "left:" + x + "px;top:70px;width:500px;height:300px;border-top:10px solid " + k);
    mk("div", "", c, title, "position:absolute;left:36px;top:30px;font-size:46px;font-weight:900;color:" + k);
    mk("div", "", c, body, "position:absolute;left:36px;top:110px;width:430px;font-size:54px;font-weight:900;line-height:1.3");
    tl.fromTo(c, { opacity: 0, y: 60, rotationY: 40 }, { opacity: 1, y: 0, rotationY: 0, duration: 0.55, ease: "back.out(1.5)", immediateRender: false }, t);
    return c;
  };
  mkCard(50, P.t["今天　重點"], P.t["北方東北季風　增強"], CYA, tw(2, "今天"));
  mkCard(580, P.t["明天　重點"], P.t["颱風強度　減弱"], COR, tw(3, "明天"));
  const heads = [[P.t["史上最強"], P.t["史上最強"], RED], [P.t["最無敵"], P.t["最無敵"], "#ff8a3d"], [P.t["最可怕"], P.t["最可怕"], "#d83a8f"]];
  heads.forEach((h, i) => {
    const e = mk("div", "", g, '<b style="background:' + h[2] + ';padding:4px 14px;border-radius:8px;margin-right:16px;font-size:30px">頭條</b>' + h[0] + "！", "position:absolute;left:" + (70 + i * 80) + "px;top:" + (420 + i * 95) + "px;padding:14px 34px;border-radius:14px;background:rgba(245,245,250,.95);color:#1b1f2b;font-size:58px;font-weight:900;opacity:0;box-shadow:0 12px 30px rgba(0,0,0,.5)");
    tl.fromTo(e, { opacity: 0, x: -200, rotation: -4 + i * 3 }, { opacity: 1, x: 0, rotation: -2 + i * 2, duration: 0.35, ease: "back.out(1.8)", immediateRender: false }, tw(6, h[1]) - 0.1);
    tl.to(e, { opacity: 0.18, duration: 0.4 }, tw(7, "不用想"));
  });
  stamp(g, 250, 330, P.t["不用想那麼多"], tw(7, "不用想"), T1(7), -5, GRN);
}
});
