// 移植自圖鑑 splitflap（機場翻牌字，文字標題）。繪圖指令逐字照抄原版；示範文字抽成 P.T、字型抽成 P.numFont／P.font／P.mono（預設＝原版）。
// P.T 預設：["NOW", "BOARDING", "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"]。原版的 t%T 循環與數字未改動。
fxDefine("splitflap", {
  dur: 5.0,
  defaults: { T: ["NOW", "BOARDING", "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"], numFont: "Unbounded,sans-serif", font: '"Noto Sans TC"', mono: '"JetBrains Mono",monospace' },
  draw(x, w, h, t, P, K) {
    const { rgb, rr, rnd } = K;
    const { A, FG } = K;
    const BG = K.BG === null ? "#12151D" : K.BG;
    const clear = (x, w, h) => K.clear(x, w, h);
    {
clear(x,w,h);const L=['NOW','BOARDING'],CH='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',tt=t%5,cw=Math.min(w*.095,h*.2),chh=cw*1.35;x.font=`700 ${chh*.68}px "JetBrains Mono",monospace`;x.textAlign='center';x.textBaseline='middle';
  L.forEach((s,r)=>{const x0=w/2-s.length*cw*1.08/2,Yp=h*.32+r*chh*1.25;for(let i=0;i<s.length;i++){const X=x0+i*cw*1.08,land=.3+(r*3+i)*.09,ch=tt<land?CH[Math.floor(rnd(i*13+r*7+Math.floor(tt*20))*CH.length)]:s[i];
    x.fillStyle='#232937';rr(x,X,Yp,cw,chh,4);x.fillStyle=tt<land?'rgba(237,239,245,.6)':(r?rgb(A):FG);x.fillText(ch,X+cw/2,Yp+chh/2);x.fillStyle=BG;x.fillRect(X,Yp+chh/2-1,cw,2)}})
    }
  },
});
