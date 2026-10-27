// 移植自圖鑑 gradientwave（流動色帶波，介面微動態）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：[]。原版的 t%T 循環與數字未改動。
fxDefine("gradientwave", {
  dur: 4.0,
  defaults: { T: [], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { uiText, UI_INK } = K;
    {
x.fillStyle='#F7F3FF';x.fillRect(0,0,w,h);const L=[['#FFB36B','#FF6A8A',.3,1.0],['#FF6A8A','#B65BFF',.4,1.3],['#B65BFF','#5B8CFF',.5,.8],['#5B8CFF','#6FE0FF',.6,1.1]];
  L.forEach(([c1,c2,b,sp],i)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,c1);g.addColorStop(1,c2);x.fillStyle=g;x.globalAlpha=.92;x.beginPath();x.moveTo(0,h);for(let X=0;X<=w;X+=4){const u=X/w;x.lineTo(X,h*(b+.05*i)+Math.sin(u*5+t*sp+i*1.7)*h*.09+Math.sin(u*9-t*sp*1.3+i)*h*.035)}x.lineTo(w,h);x.closePath();x.fill()});x.globalAlpha=1;uiText(x,'Flow',w*.07,h*.1,h*.07,UI_INK,800,'left')
    }
  },
});
