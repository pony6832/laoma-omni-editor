// 片尾
// 行號為相對場景起點（1＝scenes[].from 那一行）
defScene("OUT", function (T0, T1, tw, te, P) {
{
  const E0 = D - 0.1, TRI = "polygon(0% 0%, 260% 0%, 0% 260%)";
  tl.fromTo("#endA", { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)" }, { clipPath: TRI, duration: 0.6, ease: "power3.inOut" }, E0);
  tl.fromTo("#endB", { clipPath: "polygon(0% 0%, 0% 0%, 0% 0%)" }, { clipPath: TRI, duration: 0.6, ease: "power3.inOut" }, E0 + 0.15);
  const e1 = $("#e1");
  [...P.t["鎖定中時新聞網"]].forEach((ch) => mk("span", "ec", e1, ch));
  tl.fromTo("#elogo", { scale: 0.85, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, E0 + 0.5);
  tl.fromTo("#e1 .ec", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.06 }, E0 + 0.8);
  tl.fromTo("#e2", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4 }, E0 + 1.2);
  tl.fromTo("#e3", { opacity: 0 }, { opacity: 1, duration: 0.4 }, E0 + 1.5);
  tl.fromTo("#sweep", { x: -200 }, { x: 900, duration: 0.9, ease: "power2.inOut" }, E0 + 1.1);
}
});
