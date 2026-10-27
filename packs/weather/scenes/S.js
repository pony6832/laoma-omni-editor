// 場景 S：放假問題（全屏口播）第 169～177 句
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("S", function (T0, T1, tw, te, P) {
setMode(T0(1) - 0.3, "full");
{
  const g = oscene(T0(1) - 0.3, D + 0.1);
  const shock = mk("div", "", g, P.t["蛤！？什麼！"], "position:absolute;left:120px;top:150px;font-size:150px;font-weight:900;color:#fff;text-shadow:0 0 30px rgba(255,106,77,.9),0 8px 0 #c02b1c;opacity:0");
  tl.fromTo(shock, { opacity: 0, scale: 2.6, rotation: -12 }, { opacity: 1, scale: 1, rotation: -5, duration: 0.25, ease: "power4.in", immediateRender: false }, T0(1));
  tl.fromTo(shock, { x: 0 }, { x: 12, duration: 0.05, yoyo: true, repeat: 7, ease: "none", immediateRender: false }, T0(1) + 0.25);
  tl.to(shock, { opacity: 0, duration: 0.3 }, T0(2) + 0.6);
  chip(g, 90, 160, P.t["小編：放不放假？"], "y", tw(2, "放不放假"), T1(2) + 1.5, { x: -80 });
  stamp(g, 90, 300, P.t["放假＝政治問題"], tw(3, "放假是政治"), T1(4) + 0.4, -5, COR);
  stamp(g, 90, 520, P.t["請去問政治人物"], tw(5, "請你去問"), T1(6) + 0.3, -4, IND);
  chip(g, 90, 160, P.t["氣象人只懂氣象"], "cy", tw(7, "氣象人"), T1(8), { x: -80 });
  const deep = mk("div", "", g, P.t["太深奧了"], "position:absolute;left:100px;top:300px;font-size:150px;font-weight:900;color:" + GLD + ";text-shadow:0 0 30px rgba(255,200,87,.7),0 8px 0 #8a6a12;opacity:0");
  tl.fromTo(deep, { opacity: 0, scale: 2.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power4.in", immediateRender: false }, tw(9, "太深奧"));
}
});
