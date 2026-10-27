// 圖鑑 HTML 原版的繪圖輔助函式與 DRAW 物件（逐字擷取，只供移植版比對用，不進建置）
/* ---------- drawing ---------- */
const BG='#12151D',FG='#EDEFF5',A=[255,106,77],B=[111,139,255],Y='#FFC857',M='#2A3040';
const rgb=(c,al=1)=>`rgba(${c[0]|0},${c[1]|0},${c[2]|0},${al})`;
const mix=(k,al=1)=>rgb([B[0]+(A[0]-B[0])*k,B[1]+(A[1]-B[1])*k,B[2]+(A[2]-B[2])*k],al);
const cl=v=>Math.max(0,Math.min(1,v));
const eOC=p=>1-Math.pow(1-p,3);
const eOB=p=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(p-1,3)+c1*Math.pow(p-1,2)};
const rnd=n=>{const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
const clear=(x,w,h)=>{x.fillStyle=BG;x.fillRect(0,0,w,h)};
const rr=(x,X,Y,w,h,r)=>{x.beginPath();x.roundRect?x.roundRect(X,Y,w,h,r):x.rect(X,Y,w,h);x.fill()};
const eIO=p=>p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;
const scene=(x,w,h,bg,fg,txt)=>{x.fillStyle=bg;x.fillRect(0,0,w,h);x.fillStyle=fg;x.font=`700 ${h*.13}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(txt,w/2,h/2)};
const heart=(x,cx,cy,s)=>{x.beginPath();x.moveTo(cx,cy+s*.7);x.bezierCurveTo(cx-s*1.2,cy-s*.1,cx-s*.6,cy-s,cx,cy-s*.45);x.bezierCurveTo(cx+s*.6,cy-s,cx+s*1.2,cy-s*.1,cx,cy+s*.7);x.fill()};


const off=(st,w,h,d)=>{if(!st.o||st.o.width!==Math.round(w*d)){st.o=document.createElement('canvas');st.o.width=Math.round(w*d);st.o.height=Math.round(h*d)}const o=st.o.getContext('2d');o.setTransform(d,0,0,d,0,0);o.clearRect(0,0,w,h);return o};
const TR=(x,w,h,t,path)=>{const p=eIO(cl(((t%2.6)-.5)/1.4));scene(x,w,h,BG,FG,'SCENE 1');if(p<=0)return;x.save();x.beginPath();path(p);x.clip();scene(x,w,h,rgb(A),BG,'SCENE 2');x.restore()};

const LY=(x,w,h,t,st,k,id,d,al=1,mode='lighten')=>{const S=st[k]||(st[k]={st:{}});if(!S.c||S.c.width!==Math.round(w*d)){S.c=document.createElement('canvas');S.c.width=Math.round(w*d);S.c.height=Math.round(h*d);S.st={}}const o=S.c.getContext('2d');o.setTransform(d,0,0,d,0,0);o.globalAlpha=1;o.globalCompositeOperation='source-over';o.filter='none';DRAW[id](o,w,h,t,S.st,S.c,d);x.save();x.globalCompositeOperation=mode;x.globalAlpha=al;x.drawImage(S.c,0,0,w,h);x.restore()};
const GRV=(x,w,h,t,g,v)=>{const f=Math.floor(t*24);x.save();for(let i=0;i<500;i++){x.fillStyle=`rgba(255,255,255,${rnd(f*1000+i)*g*2})`;x.fillRect(rnd(f*7+i*3.1)*w,rnd(f*13+i*1.7)*h,1.4,1.4)}const vg=x.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,w*.7);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${v})`);x.fillStyle=vg;x.fillRect(0,0,w,h);x.restore()};
const UI_LT='#EEF0F6',UI_INK='#161922',UI_B='#3B6BFF',UI_G='#2DBE60';
const uiBg=(x,w,h)=>{x.fillStyle=UI_LT;x.fillRect(0,0,w,h);x.fillStyle='rgba(120,130,160,.10)';for(let i=16;i<w;i+=16)x.fillRect(i,0,.6,h);for(let j=16;j<h;j+=16)x.fillRect(0,j,w,.6)};
const uiCard=(x,X,Y,W,H,r=14)=>{x.save();x.shadowColor='rgba(40,50,90,.20)';x.shadowBlur=22;x.shadowOffsetY=9;x.fillStyle='#fff';rr(x,X,Y,W,H,r);x.restore()};
const uiText=(x,s,X,Y,fs,col,wt=600,al='center')=>{x.font=`${wt} ${fs}px "Noto Sans TC",Unbounded,sans-serif`;x.textAlign=al;x.textBaseline='middle';x.fillStyle=col;x.fillText(s,X,Y)};
const uiCursor=(x,X,Y,s=1)=>{x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle='#161922';x.strokeStyle='#fff';x.lineWidth=1.5;x.beginPath();x.moveTo(0,0);x.lineTo(0,18);x.lineTo(5,14);x.lineTo(9,22);x.lineTo(12,20.5);x.lineTo(8,13);x.lineTo(14,13);x.closePath();x.fill();x.stroke();x.restore()};
const DRAW={
grid(x,w,h,t){clear(x,w,h);const cols=20,rows=12,cw=w/cols,ch=h/rows,s=Math.min(cw,ch);
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const dx=i-cols/2+.5,dy=(j-rows/2+.5)*1.25,d=Math.hypot(dx,dy);
    const k=(Math.sin(d*.65-t*3)+1)/2,sz=s*(.22+.55*k),ang=Math.atan2(dy,dx);
    const X=(i+.5)*cw+Math.cos(ang)*k*3-sz/2,Yp=(j+.5)*ch+Math.sin(ang)*k*3-sz/2;
    x.fillStyle=mix(k,.3+.7*k);rr(x,X,Yp,sz,sz,sz*.25)}},
flow(x,w,h,t,st){if(!st.p){clear(x,w,h);st.p=Array.from({length:260},()=>({x:Math.random()*w,y:Math.random()*h}))}
  x.fillStyle='rgba(18,21,29,0.09)';x.fillRect(0,0,w,h);x.lineWidth=1.3;
  st.p.forEach((p,i)=>{const an=(Math.sin(p.x*.012+t*.4)+Math.cos(p.y*.015-t*.3))*Math.PI;
    const nx=p.x+Math.cos(an)*1.5,ny=p.y+Math.sin(an)*1.5;x.strokeStyle=i%3?rgb(B,.8):rgb(A,.9);
    x.beginPath();x.moveTo(p.x,p.y);x.lineTo(nx,ny);x.stroke();p.x=nx;p.y=ny;
    if(p.x<0||p.x>w||p.y<0||p.y>h||Math.random()<.004){p.x=Math.random()*w;p.y=Math.random()*h}})},
blob(x,w,h,t){clear(x,w,h);const draw=(cx,cy,r,ph,fill)=>{x.beginPath();for(let i=0;i<=90;i++){const th=i/90*Math.PI*2;
    const rad=r*(1+.12*Math.sin(3*th+t*1.3+ph)+.08*Math.sin(5*th-t*1.7)+.05*Math.sin(7*th+t*2.1+ph));
    const X=cx+Math.cos(th)*rad,Yp=cy+Math.sin(th)*rad;i?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.closePath();x.fillStyle=fill;x.fill()};
  const r=Math.min(w,h)*.3;draw(w/2+Math.cos(t*.6)*r*.9,h/2+Math.sin(t*.8)*r*.4,r*.45,2,rgb(B,.35));
  const g=x.createLinearGradient(w/2-r,h/2-r,w/2+r,h/2+r);g.addColorStop(0,rgb(A));g.addColorStop(1,rgb(B));draw(w/2,h/2,r,0,g)},
gradient(x,w,h,t){clear(x,w,h);x.globalCompositeOperation='lighter';
  [[A,.5+.32*Math.sin(t*.5),.5+.3*Math.cos(t*.7)],[B,.5+.3*Math.cos(t*.4+1),.5+.32*Math.sin(t*.6+2)],[[255,200,87],.5+.34*Math.sin(t*.35+3),.5+.28*Math.cos(t*.5+1)]]
  .forEach(([c,px,py])=>{const X=px*w,Yp=py*h,r=Math.max(w,h)*.42;const g=x.createRadialGradient(X,Yp,0,X,Yp,r);
    g.addColorStop(0,rgb(c,.75));g.addColorStop(1,rgb(c,0));x.fillStyle=g;x.fillRect(0,0,w,h)});
  x.globalCompositeOperation='source-over';x.fillStyle=FG;x.font=`900 ${h*.11}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillText('你的標題放這裡',w/2,h/2)},
parallax(x,w,h,t){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#141833');g.addColorStop(1,'#2B2550');x.fillStyle=g;x.fillRect(0,0,w,h);
  const sx=w*.7,sy=h*.38,sr=h*.12;const sg=x.createRadialGradient(sx,sy,sr*.5,sx,sy,sr*3);sg.addColorStop(0,'rgba(255,200,87,.45)');sg.addColorStop(1,'rgba(255,200,87,0)');
  x.fillStyle=sg;x.fillRect(0,0,w,h);x.fillStyle=Y;x.beginPath();x.arc(sx,sy,sr,0,7);x.fill();
  [[.55,.09,.006,14,'#2E3462'],[.68,.08,.011,32,'#4A55B8'],[.82,.07,.02,70,'#E0583F']].forEach(([b,amp,f,sp,col],li)=>{
    x.fillStyle=col;x.beginPath();x.moveTo(0,h);for(let X=0;X<=w+4;X+=4){const u=X+t*sp;x.lineTo(X,h*b-Math.sin(u*f+li)*h*amp-Math.sin(u*f*2.3+li*2)*h*amp*.4)}x.lineTo(w,h);x.fill()})},
kinetic(x,w,h,t){clear(x,w,h);const T=4,tt=t%T,q=cl((tt-3.2)/.5),fs=h*.17;
  x.font=`900 ${fs}px "Noto Sans TC"`;x.textBaseline='alphabetic';x.textAlign='left';
  ['動態','讓內容','開口說話'].forEach((wd,i)=>{const p=cl((tt-i*.32)/.5),e=eOB(p);x.globalAlpha=p*(1-q);
    x.fillStyle=i===1?rgb(A):FG;x.fillText(wd,w*.09,h*.32+i*fs*1.2+(1-e)*40-q*30)});
  x.globalAlpha=1-q;x.fillStyle=rgb(A);x.fillRect(w*.09,h*.32+2*fs*1.2+fs*.25,w*.5*eOC(cl((tt-1.2)/.6)),5);x.globalAlpha=1},
typewriter(x,w,h,t){clear(x,w,h);const L=[['> ','產生網格動畫…'],['> ','grid.wave(20, 12)'],['> ','export("reel.mp4")'],['✓ ','完成，共 120 幀']];
  const tot=L.reduce((s,l)=>s+l[1].length,0),T=6.5,tt=t%T;let n=Math.floor(cl(tt/4.2)*tot);
  const fs=Math.max(11,h*.075);x.font=`400 ${fs}px "JetBrains Mono","Noto Sans TC",monospace`;x.textBaseline='top';x.textAlign='left';
  let cx=0,cy=0;for(let i=0;i<L.length;i++){const l=L[i];if(i>0&&n<=0)break;const s=l[1].slice(0,Math.max(0,n));n-=l[1].length;const Yp=h*.2+i*fs*1.7;
    x.fillStyle=i===3?'#7BD88F':rgb(A);x.fillText(l[0],w*.08,Yp);
    const pw=x.measureText(l[0]).width;x.fillStyle=FG;x.fillText(s,w*.08+pw,Yp);cx=w*.08+pw+x.measureText(s).width;cy=Yp}
  if(Math.floor(t*2)%2===0){x.fillStyle=FG;x.fillRect(cx+2,cy,fs*.55,fs*1.1)}},
glitch(x,w,h,t,st,c,dpr){clear(x,w,h);const fs=h*.24;x.font=`700 ${fs}px Unbounded,"Noto Sans TC",sans-serif`;x.textAlign='center';x.textBaseline='middle';
  const sd=Math.floor(t*9),on=rnd(sd)<.42;const dx=on?(rnd(sd+1)-.5)*16:0;
  if(on){x.globalCompositeOperation='lighter';x.fillStyle=rgb(A,.9);x.fillText('GLITCH',w/2-dx,h/2);x.fillStyle=rgb(B,.9);x.fillText('GLITCH',w/2+dx,h/2);x.globalCompositeOperation='source-over'}
  else{x.fillStyle=FG;x.fillText('GLITCH',w/2,h/2)}
  if(on){x.save();x.setTransform(1,0,0,1,0,0);const W=c.width,H=c.height;for(let k=0;k<4;k++){const sy=rnd(sd*3+k)*H,sh=(4+rnd(sd*7+k)*18)*dpr,off=(rnd(sd*5+k)-.5)*50*dpr;x.drawImage(c,0,sy,W,sh,off,sy,W,sh)}x.restore()}
  x.fillStyle='rgba(0,0,0,.18)';for(let Yp=0;Yp<h;Yp+=3)x.fillRect(0,Yp,w,1)},
marquee(x,w,h,t){clear(x,w,h);const rows=[['限時優惠 · 全館 5 折 · ',1,FG,null],['NEW ARRIVAL · 新品上市 · ',-1,BG,rgb(A)],['FREE SHIPPING · 免運 · ',1,rgb(B),null]];
  const fs=h*.15;rows.forEach(([s,dir,col,band],i)=>{x.save();const cy=h*(.22+i*.28);x.translate(w/2,cy);if(band)x.rotate(-.05);x.translate(-w/2,0);
    if(band){x.fillStyle=band;x.fillRect(-20,-fs*.75,w+40,fs*1.5)}
    x.font=`900 ${fs}px "Noto Sans TC"`;x.textBaseline='middle';x.textAlign='left';x.fillStyle=col;
    const tw=x.measureText(s).width,off=((t*55*dir)%tw+tw)%tw;for(let X=off-tw;X<w;X+=tw)x.fillText(s,X,0);x.restore()})},
counter(x,w,h,t){clear(x,w,h);const T=4.2,tt=t%T,p=eOC(cl(tt/2.2));const v=Math.round(12480*p).toLocaleString('en-US');
  x.textAlign='left';x.textBaseline='alphabetic';x.fillStyle='#9AA1B3';x.font=`500 ${h*.065}px "Noto Sans TC"`;x.fillText('本月新增使用者',w*.1,h*.3);
  x.fillStyle=FG;x.font=`700 ${h*.24}px Unbounded,sans-serif`;x.fillText(v,w*.1,h*.6);
  x.fillStyle=M;x.fillRect(w*.1,h*.72,w*.8,6);x.fillStyle=rgb(A);x.fillRect(w*.1,h*.72,w*.8*p,6);
  const q=eOB(cl((tt-2.2)/.4));if(q>0){x.save();x.translate(w*.78,h*.18);x.scale(q,q);x.fillStyle='#7BD88F';rr(x,-w*.09,-h*.055,w*.18,h*.11,h*.055);
    x.fillStyle=BG;x.font=`700 ${h*.065}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('+38%',0,2);x.restore()}},
chart(x,w,h,t){clear(x,w,h);const T=4,tt=t%T,d=[.35,.5,.42,.68,.6,.82,.95],n=d.length,base=h*.86,gw=w*.8,bw=gw/n*.62,fade=1-cl((tt-3.5)/.4);
  x.globalAlpha=fade;x.strokeStyle=M;x.lineWidth=1;for(let k=1;k<=3;k++){const Yp=base-k*h*.22;x.beginPath();x.moveTo(w*.1,Yp);x.lineTo(w*.9,Yp);x.stroke()}
  d.forEach((v,i)=>{const p=eOB(cl((tt-i*.12)/.7)),bh=v*h*.68*p;x.fillStyle=i===n-1?rgb(A):rgb(B,.55);rr(x,w*.1+i*gw/n+(gw/n-bw)/2,base-bh,bw,bh,4)});
  x.fillStyle=FG;x.fillRect(w*.1,base,w*.8,2);x.globalAlpha=1},
sphere(x,w,h,t,st){clear(x,w,h);if(!st.pts){st.pts=[];const N=380,g=Math.PI*(3-Math.sqrt(5));for(let i=0;i<N;i++){const y=1-i/(N-1)*2,r=Math.sqrt(1-y*y),th=g*i;st.pts.push([Math.cos(th)*r,y,Math.sin(th)*r])}}
  const R=Math.min(w,h)*.38,ry=t*.5,tl=.4,cy=Math.cos(ry),sy=Math.sin(ry),ct=Math.cos(tl),stl=Math.sin(tl);
  st.pts.forEach(([px,py,pz])=>{const x1=px*cy-pz*sy,z1=px*sy+pz*cy,y2=py*ct-z1*stl,z2=py*stl+z1*ct,k=(z2+1)/2;
    x.fillStyle=mix(k,.15+.85*k);x.beginPath();x.arc(w/2+x1*R,h/2+y2*R,.6+k*2.2,0,7);x.fill()})},
audio(x,w,h,t){clear(x,w,h);const n=48,bw=w*.84/n;for(let i=0;i<n;i++){let v=.5+.5*Math.sin(i*.35+t*4)*Math.cos(i*.13-t*2.3);v=v*(.35+.65*Math.sin(Math.PI*(i+.5)/n));
  const bh=v*h*.36+3;x.fillStyle=mix(i/(n-1));rr(x,w*.08+i*bw+bw*.18,h/2-bh,bw*.64,bh*2,bw*.32)}},
line(x,w,h,t){clear(x,w,h);const T=3.6,tt=t%T,p=eOC(cl(tt/2)),fade=1-cl((tt-3.1)/.4),cx=w/2,cy=h/2,r=Math.min(w,h)*.32;
  x.globalAlpha=fade;x.lineCap='round';x.lineJoin='round';const Lc=2*Math.PI*r;x.lineWidth=4;x.strokeStyle=rgb(A);x.setLineDash([Lc,Lc]);x.lineDashOffset=Lc*(1-p);
  x.beginPath();x.arc(cx,cy,r,-Math.PI/2,Math.PI*1.5);x.stroke();
  const P=[[-.45,.4],[-.45,-.35],[0,.15],[.45,-.35],[.45,.4]].map(([a,b])=>[cx+a*r,cy+b*r]);let Lp=0;for(let i=1;i<P.length;i++)Lp+=Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1]);
  const p2=eOC(cl((tt-.4)/1.6));x.strokeStyle=FG;x.setLineDash([Lp,Lp]);x.lineDashOffset=Lp*(1-p2);x.beginPath();P.forEach(([a,b],i)=>i?x.lineTo(a,b):x.moveTo(a,b));x.stroke();x.setLineDash([]);
  const f=eOB(cl((tt-2)/.5));if(f>0){x.fillStyle=rgb(A,.25);x.beginPath();x.arc(cx,cy,r*f*.98,0,7);x.fill()}x.globalAlpha=1},
burst(x,w,h,t){clear(x,w,h);const ray=(cx,cy,r,n,col,lw,sp,ph)=>{x.save();x.translate(cx,cy);x.rotate(t*sp);x.strokeStyle=col;x.lineWidth=lw;x.lineCap='round';
    for(let i=0;i<n;i++){const a=i/n*Math.PI*2,l=r*(.6+.3*Math.sin(t*2.6+i*1.3+ph));x.beginPath();x.moveTo(Math.cos(a)*r*.22,Math.sin(a)*r*.22);x.lineTo(Math.cos(a)*l,Math.sin(a)*l);x.stroke()}x.restore()};
  const r=Math.min(w,h)*.4;ray(w*.42,h*.52,r,16,rgb(A),Math.max(4,r*.07),.35,0);ray(w*.83,h*.24,r*.35,12,rgb(B),3,-.6,1)},
bounce(x,w,h,t){clear(x,w,h);const g=h*.8,r=h*.09;x.fillStyle=M;x.fillRect(w*.08,g,w*.84,2);
  [rgb(A),rgb(B),Y].forEach((col,i)=>{const ph=t*2.6+i*.7,ys=Math.abs(Math.sin(ph)),cx=w*(.28+i*.22);let sx=1,sy=1;
    if(ys<.18){sx=1+(.18-ys)*2.2;sy=1/sx}const cy=g-r*sy-ys*h*.5;
    x.fillStyle='rgba(0,0,0,.45)';x.beginPath();x.ellipse(cx,g+3,r*(1.1-ys*.6),r*.22*(1-ys*.5),0,0,7);x.fill();
    x.fillStyle=col;x.beginPath();x.ellipse(cx,cy,r*sx,r*sy,0,0,7);x.fill()})},
tunnel(x,w,h,t){clear(x,w,h);const n=14,S=Math.max(w,h)*1.5;x.save();x.translate(w/2,h/2);
  for(let k=0;k<n;k++){const z=((k/n+t*.16)%1),s=Math.pow(z,2.3)*S;x.save();x.rotate(z*1.4+t*.15);x.strokeStyle=mix(z,z);x.lineWidth=.5+z*4;x.strokeRect(-s/2,-s/2,s,s);x.restore()}x.restore()},
loader(x,w,h,t){clear(x,w,h);const r=Math.min(w,h)*.27,cx=w/2,cy=h/2;x.lineCap='round';x.lineWidth=8;x.strokeStyle=M;x.beginPath();x.arc(cx,cy,r,0,7);x.stroke();
  const st=t*4.2,len=Math.PI*(.25+1.2*(Math.sin(t*2.2)+1)/2);x.strokeStyle=rgb(A);x.beginPath();x.arc(cx,cy,r,st,st+len);x.stroke();
  x.fillStyle=FG;x.font=`700 ${r*.42}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(Math.floor((t*22)%101)+'%',cx,cy+2)},
starfield(x,w,h,t){clear(x,w,h);const f=Math.min(w,h)*.25;x.lineCap='round';
  for(let i=0;i<320;i++){const sx=rnd(i+1)*2-1,sy=rnd(i+999)*2-1,z=1-((rnd(i+77)+t*.22)%1),z0=Math.min(1,z+.04);if(z<.03)continue;
    const k=1-z;x.strokeStyle=i%6?`rgba(237,239,245,${k})`:rgb(A,k);x.lineWidth=.4+k*2.4;
    x.beginPath();x.moveTo(w/2+sx/z0*f,h/2+sy/z0*f);x.lineTo(w/2+sx/z*f,h/2+sy/z*f);x.stroke()}},
plexus(x,w,h,t){clear(x,w,h);const N=56,P=[];for(let i=0;i<N;i++)P.push([w*(.5+.47*Math.sin(t*(.1+rnd(i+1)*.2)+rnd(i+3)*6.28)),h*(.5+.45*Math.cos(t*(.08+rnd(i+5)*.2)+rnd(i+9)*6.28))]);
  const D=Math.min(w,h)*.3;x.lineWidth=1;
  for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const d=Math.hypot(P[i][0]-P[j][0],P[i][1]-P[j][1]);if(d<D){x.strokeStyle=mix(P[i][0]/w,(1-d/D)*.7);x.beginPath();x.moveTo(P[i][0],P[i][1]);x.lineTo(P[j][0],P[j][1]);x.stroke()}}
  P.forEach(([a,b],i)=>{x.fillStyle=i%4?FG:rgb(A);x.beginPath();x.arc(a,b,i%4?1.8:3,0,7);x.fill()})},
aurora(x,w,h,t){const g0=x.createLinearGradient(0,0,0,h);g0.addColorStop(0,'#070A14');g0.addColorStop(1,'#151A36');x.fillStyle=g0;x.fillRect(0,0,w,h);
  for(let i=0;i<40;i++){x.fillStyle=`rgba(237,239,245,${.25+.5*rnd(i+50)*(.6+.4*Math.sin(t*2+i))})`;x.fillRect(rnd(i+11)*w,rnd(i+23)*h*.6,1.5,1.5)}
  x.globalCompositeOperation='lighter';
  [[[123,216,143],0],[B,1.7],[A,3.3]].forEach(([c,ph],k)=>{const base=h*(.26+k*.12),f=X=>base+Math.sin(X*.006+t*.5+ph)*h*.1+Math.sin(X*.017-t*.8+ph)*h*.035;
    const g=x.createLinearGradient(0,base-h*.15,0,base+h*.45);g.addColorStop(0,rgb(c,0));g.addColorStop(.3,rgb(c,.5));g.addColorStop(1,rgb(c,0));x.fillStyle=g;
    x.beginPath();x.moveTo(0,f(0));for(let X=6;X<=w+6;X+=6)x.lineTo(X,f(X));for(let X=w+6;X>=0;X-=6)x.lineTo(X,f(X)+h*(.25+.12*Math.sin(X*.01+t+ph)));x.closePath();x.fill()});
  x.globalCompositeOperation='source-over'},
ripple(x,w,h,t){clear(x,w,h);const R=Math.max(w,h)*.45;x.lineWidth=2;
  for(let i=0;i<5;i++){const u=t*.3+i/5,p=u%1,cy=Math.floor(u),cx=w*(.15+.7*rnd(cy*13+i+1)),cyy=h*(.2+.6*rnd(cy*17+i+.5));
    for(let j=0;j<3;j++){const r=p*R-j*14;if(r<=0)continue;x.strokeStyle=mix(rnd(cy+i+2),(1-p)*(1-j*.3));x.beginPath();x.ellipse(cx,cyy,r,r*.5,0,0,7);x.stroke()}
    if(p<.08){x.fillStyle=`rgba(237,239,245,${1-p/.08})`;x.beginPath();x.arc(cx,cyy,3,0,7);x.fill()}}},
scramble(x,w,h,t){clear(x,w,h);const T=5,tt=t%T,S='MOTION 2026',G='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*@$',fs=Math.min(h*.2,w/S.length*1.45);
  x.font=`600 ${fs}px "JetBrains Mono",monospace`;x.textBaseline='middle';x.textAlign='left';const cw=x.measureText('M').width,X0=(w-cw*S.length)/2,out=cl((tt-4.3)/.5);
  x.globalAlpha=1-out;for(let i=0;i<S.length;i++){if(S[i]===' '||tt<i*.04)continue;const done=tt>.4+i*.12;
    x.fillStyle=done?FG:rgb(A,.85);x.fillText(done?S[i]:G[Math.floor(rnd(i*31+Math.floor(t*18))*G.length)],X0+i*cw,h/2)}
  x.fillStyle='#9AA1B3';x.font=`400 ${h*.06}px "JetBrains Mono",monospace`;x.fillText(tt>1.8?'decrypted ✓':'decrypting…',X0,h/2+fs*.95);x.globalAlpha=1},
ptext(x,w,h,t,st){clear(x,w,h);if(!st.pts){const o=document.createElement('canvas');o.width=Math.max(1,w|0);o.height=Math.max(1,h|0);const ox=o.getContext('2d');
    ox.fillStyle='#fff';ox.font=`700 ${h*.32}px Unbounded,"Noto Sans TC",sans-serif`;ox.textAlign='center';ox.textBaseline='middle';ox.fillText('HELLO',w/2,h/2);
    const d=ox.getImageData(0,0,o.width,o.height).data,step=Math.max(3,Math.round(w/110));st.pts=[];
    for(let Y=0;Y<o.height;Y+=step)for(let X=0;X<o.width;X+=step)if(d[(Y*o.width+X)*4+3]>128)st.pts.push([X,Y,Math.random()*w,Math.random()*h,Math.random()])}
  const T=5,tt=t%T,p=eOC(cl((tt-.2)/1.6))*(1-eIO(cl((tt-3.8)/1))),r=Math.max(1.5,w/200);
  st.pts.forEach(([tx,ty,sx,sy,k],i)=>{const X=sx+(tx-sx)*p+Math.sin(t*2+i)*(1-p)*6,Yp=sy+(ty-sy)*p+Math.cos(t*2+i)*(1-p)*6;x.fillStyle=mix(k,.35+.65*p);x.fillRect(X-r/2,Yp-r/2,r,r)})},
rotator(x,w,h,t){clear(x,w,h);const W=['影片','網站','品牌','動畫'],P=1.4,u=t/P,i=Math.floor(u)%W.length,m=eOB(cl(((u%1)-.7)/.3));
  const fs=h*.16;x.font=`900 ${fs}px "Noto Sans TC"`;x.textBaseline='middle';x.textAlign='left';const pre='我們做',pw=x.measureText(pre).width,bw=fs*2.2,X0=w/2-(pw+fs*.15+bw)/2,bx=X0+pw+fs*.15;
  x.fillStyle=FG;x.fillText(pre,X0,h/2);x.save();x.beginPath();x.rect(bx,h/2-fs*.7,bw,fs*1.4);x.clip();x.fillStyle=rgb(A);
  x.fillText(W[i],bx+fs*.05,h/2-m*fs*1.4);x.fillText(W[(i+1)%W.length],bx+fs*.05,h/2+(1-m)*fs*1.4);x.restore();x.fillStyle=rgb(A);x.fillRect(bx,h/2+fs*.72,bw-fs*.1,4)},
donut(x,w,h,t){clear(x,w,h);const T=4.5,tt=t%T,D=[.42,.26,.19,.13],C=[rgb(A),rgb(B),Y,'#7BD88F'],cx=w*.33,cy=h/2,r=Math.min(w,h)*.28,fade=1-cl((tt-4)/.4),p=eOC(cl(tt/1.8));
  x.globalAlpha=fade;x.lineWidth=r*.32;x.strokeStyle=M;x.beginPath();x.arc(cx,cy,r,0,7);x.stroke();
  let a0=-Math.PI/2,acc=0;D.forEach((v,i)=>{const len=v*cl((p-acc)/v)*Math.PI*2-.03;if(len>.01){x.strokeStyle=C[i];x.beginPath();x.arc(cx,cy,r,a0,a0+len);x.stroke()}a0+=v*Math.PI*2;acc+=v});
  x.fillStyle=FG;x.textAlign='center';x.textBaseline='middle';x.font=`700 ${r*.42}px Unbounded,sans-serif`;x.fillText(Math.round(42*cl(p/.42))+'%',cx,cy);
  ['直播 42%','短影音 26%','文章 19%','Podcast 13%'].forEach((l,i)=>{const q=eOC(cl((tt-.3-i*.15)/.5));x.globalAlpha=fade*q;const Yp=h*(.3+i*.13);
    x.fillStyle=C[i];rr(x,w*.64,Yp-6,12,12,3);x.fillStyle=FG;x.textAlign='left';x.font=`500 ${h*.06}px "Noto Sans TC"`;x.fillText(l,w*.64+20,Yp)});x.globalAlpha=1},
linechart(x,w,h,t){clear(x,w,h);const T=4.5,tt=t%T,d=[.3,.42,.36,.55,.5,.66,.62,.8,.92],n=d.length,L=w*.1,R=w*.9,base=h*.85,fade=1-cl((tt-4)/.4),p=eOC(cl(tt/2.4));
  const P=d.map((v,i)=>[L+(R-L)*i/(n-1),base-v*h*.65]);x.globalAlpha=fade;x.strokeStyle=M;x.lineWidth=1;
  for(let k=1;k<=3;k++){const Yp=base-k*h*.2;x.beginPath();x.moveTo(L,Yp);x.lineTo(R,Yp);x.stroke()}
  x.save();x.beginPath();x.rect(0,0,L+(R-L)*p,h);x.clip();const g=x.createLinearGradient(0,h*.15,0,base);g.addColorStop(0,rgb(A,.35));g.addColorStop(1,rgb(A,0));
  x.fillStyle=g;x.beginPath();x.moveTo(L,base);P.forEach(q=>x.lineTo(q[0],q[1]));x.lineTo(R,base);x.closePath();x.fill();
  x.strokeStyle=rgb(A);x.lineWidth=3;x.lineJoin='round';x.beginPath();P.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));x.stroke();x.restore();
  const sg=Math.min(n-2,Math.floor(p*(n-1))),f=p*(n-1)-sg,hx=P[sg][0]+(P[sg+1][0]-P[sg][0])*f,hy=P[sg][1]+(P[sg+1][1]-P[sg][1])*f;
  x.fillStyle=rgb(A,.3);x.beginPath();x.arc(hx,hy,8+4*Math.sin(t*6),0,7);x.fill();x.fillStyle=FG;x.beginPath();x.arc(hx,hy,4,0,7);x.fill();x.fillRect(L,base,R-L,2);x.globalAlpha=1},
arcs(x,w,h,t){clear(x,w,h);const gs=Math.max(9,w/42);x.fillStyle=M;
  for(let X=gs/2;X<w;X+=gs)for(let Yp=gs/2;Yp<h;Yp+=gs){if(Math.sin(X*.013)*Math.cos(Yp*.02)+Math.sin(X*.004+Yp*.006)>.15)x.fillRect(X-1,Yp-1,2.2,2.2)}
  const N=[...Array(9)].map((_,i)=>[w*(.1+.8*rnd(i*3+1)),h*(.2+.6*rnd(i*3+2))]),E=.55,cur=Math.floor(t/E);x.lineWidth=2;
  for(let k=cur-5;k<=cur;k++){const a=N[Math.floor(rnd(k*1.7+.3)*9)],b=N[Math.floor(rnd(k*2.9+4)*9)];if(a===b)continue;const age=(t-k*E)/2.2;if(age<0||age>1)continue;
    const mx=(a[0]+b[0])/2,my=Math.min(a[1],b[1])-Math.hypot(b[0]-a[0],b[1]-a[1])*.4,p=eOC(cl(age/.6)),fd=1-cl((age-.6)/.4);
    x.strokeStyle=mix(rnd(k+.7),.9*fd);x.beginPath();for(let s=0;s<=24;s++){const u=s/24*p;x[s?'lineTo':'moveTo']((1-u)*(1-u)*a[0]+2*(1-u)*u*mx+u*u*b[0],(1-u)*(1-u)*a[1]+2*(1-u)*u*my+u*u*b[1])}x.stroke();
    if(p>=.99){x.strokeStyle=rgb(A,fd);x.beginPath();x.arc(b[0],b[1],4+(1-fd)*14,0,7);x.stroke()}}
  N.forEach(([a,b])=>{x.fillStyle=FG;x.beginPath();x.arc(a,b,3,0,7);x.fill()})},
morph(x,w,h,t){clear(x,w,h);const poly=n=>th=>{if(!n)return 1;const s=2*Math.PI/n,a=((th%s)+s)%s-s/2;return Math.cos(Math.PI/n)/Math.cos(a)};
  const S=[poly(0),poly(4),poly(3),poly(6)],u=t/1.6,i=Math.floor(u)%4,j=(i+1)%4,f=eOB(cl(((u%1)-.45)/.55)),R=Math.min(w,h)*.34,cx=w/2,cy=h/2,rot=t*.4;
  x.beginPath();for(let k=0;k<=120;k++){const th=k/120*Math.PI*2,r=R*(S[i](th)+(S[j](th)-S[i](th))*f);x[k?'lineTo':'moveTo'](cx+Math.cos(th+rot)*r,cy+Math.sin(th+rot)*r)}x.closePath();
  const g=x.createLinearGradient(cx-R,cy-R,cx+R,cy+R);g.addColorStop(0,rgb(A));g.addColorStop(1,rgb(B));x.fillStyle=g;x.fill();x.strokeStyle=FG;x.lineWidth=2;x.stroke()},
orbit(x,w,h,t){clear(x,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*.42,O=[[1,.32,.3,rgb(A),1.1],[.72,.38,-.5,rgb(B),-1.6],[.5,.5,.9,Y,2.4]];
  const pl=O.map(([s,e,tl,c,sp])=>{const a=t*sp,px=Math.cos(a)*R*s,py=Math.sin(a)*R*s*e;return{x:cx+px*Math.cos(tl)-py*Math.sin(tl),y:cy+px*Math.sin(tl)+py*Math.cos(tl),front:Math.sin(a)>0,c}});
  x.strokeStyle='rgba(237,239,245,.18)';x.lineWidth=1.2;O.forEach(([s,e,tl])=>{x.beginPath();x.ellipse(cx,cy,R*s,R*s*e,tl,0,7);x.stroke()});
  const dot=p=>{x.fillStyle=p.c;x.beginPath();x.arc(p.x,p.y,R*.06,0,7);x.fill()};pl.filter(p=>!p.front).forEach(dot);
  const g=x.createRadialGradient(cx-R*.06,cy-R*.06,0,cx,cy,R*.2);g.addColorStop(0,'#FFFFFF');g.addColorStop(1,'#B9C2DA');x.fillStyle=g;x.beginPath();x.arc(cx,cy,R*.2,0,7);x.fill();
  x.fillStyle=BG;x.font=`700 ${R*.085}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('LOGO',cx,cy+1);pl.filter(p=>p.front).forEach(dot)},
wipe(x,w,h,t){const tt=t%4,R=Math.hypot(w,h),first=tt<2,s1=()=>scene(x,w,h,BG,FG,'SCENE 1'),s2=()=>scene(x,w,h,rgb(A),BG,'SCENE 2'),p=eIO(cl(((first?tt:tt-2)-1.1)/.8));
  (first?s1:s2)();if(p>0){x.save();x.beginPath();x.arc(first?w*.15:w*.85,first?h*.85:h*.15,R*p,0,7);x.clip();(first?s2:s1)();x.restore()}},
slices(x,w,h,t){const tt=t%4,first=tt<2,lt=first?tt:tt-2,n=8,s1=()=>scene(x,w,h,BG,FG,'SCENE 1'),s2=()=>scene(x,w,h,rgb(B),BG,'SCENE 2');
  (first?s1:s2)();for(let k=0;k<n;k++){const p=eOC(cl((lt-.8-k*.06)/.5));if(p<=0)continue;const y0=k*h/n,X=first?0:w*(1-p),ww=w*p;
    x.save();x.beginPath();x.rect(X,y0,ww,h/n+1);x.clip();(first?s2:s1)();x.restore();if(p<1){x.fillStyle=rgb(A);x.fillRect(first?ww-3:X,y0,3,h/n+1)}}},
confetti(x,w,h,t){clear(x,w,h);const T=3.6,tt=t%T,cyc=Math.floor(t/T),C=[rgb(A),rgb(B),Y,'#7BD88F',FG],tau=(1-Math.exp(-2.2*tt))/2.2,fd=1-cl((tt-3)/.5);
  const q=eOB(cl((tt-.25)/.5));if(q>0){x.save();x.globalAlpha=fd;x.translate(w/2,h*.45);x.scale(q,q);x.fillStyle=FG;x.font=`900 ${h*.13}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillText('恭喜達標！',0,0);x.restore()}
  for(let i=0;i<140;i++){const s=cyc*1000+i,side=i%2,vx=(side?1:-1)*(.25+rnd(s+1)*.6)*w*1.6,vy=-(.8+rnd(s+2)*.7)*h*2.4;
    const X=(side?w*.04:w*.96)+vx*tau+Math.sin(tt*5+i)*10*tt,Yp=h*1.02+vy*tau+.5*h*1.1*tt*tt;
    x.save();x.globalAlpha=fd;x.translate(X,Yp);x.rotate(tt*(3+rnd(s+3)*5)+i);x.scale(1,Math.cos(tt*9+i));x.fillStyle=C[i%5];x.fillRect(-4,-6,8,12);x.restore()}x.globalAlpha=1},
like(x,w,h,t){clear(x,w,h);const tt=t%2.6,cx=w*.4,cy=h*.56,S=Math.min(w,h)*.22,ring=cl(tt/.5);
  if(ring<1){x.strokeStyle=rgb(A,1-ring);x.lineWidth=6*(1-ring)+1;x.beginPath();x.arc(cx,cy-S*.1,S*(.4+1.1*eOC(ring)),0,7);x.stroke()}
  const q=eOC(cl((tt-.05)/.6));if(q<1)for(let i=0;i<10;i++){const a=i/10*Math.PI*2,d=S*(.6+.9*q);x.globalAlpha=1-q;x.fillStyle=i%2?rgb(B):Y;x.beginPath();x.arc(cx+Math.cos(a)*d,cy-S*.1+Math.sin(a)*d,4*(1-q)+1,0,7);x.fill()}
  x.globalAlpha=1;x.fillStyle=rgb(A);heart(x,cx,cy,S*eOB(cl((tt-.1)/.45))*(1-cl((tt-2.3)/.3)));
  for(let k=0;k<6;k++){const u=(t*.35+k/6)%1;x.globalAlpha=(1-u)*.9;x.fillStyle=[rgb(A),rgb(B),Y][k%3];heart(x,w*.8+Math.sin(u*9+k)*w*.04,h*(.95-u*.85),Math.min(w,h)*.045*(.6+u*.5))}x.globalAlpha=1},
perspgrid(x,w,h,t){clear(x,w,h);const hz=h*.42;const g=x.createLinearGradient(0,hz-h*.3,0,hz);g.addColorStop(0,'rgba(255,106,77,0)');g.addColorStop(1,'rgba(255,106,77,.35)');x.fillStyle=g;x.fillRect(0,hz-h*.3,w,h*.3);x.lineWidth=1.2;
  for(let i=-12;i<=12;i++){x.strokeStyle=rgb(B,.6);x.beginPath();x.moveTo(w/2+i*w*.02,hz);x.lineTo(w/2+i*w*.22,h);x.stroke()}
  for(let i=0;i<12;i++){const z=((i+t*1.2)%12)/12,Yp=hz+(h-hz)*z*z;x.strokeStyle=rgb(A,.25+.75*z);x.beginPath();x.moveTo(0,Yp);x.lineTo(w,Yp);x.stroke()}},
maskrise(x,w,h,t){clear(x,w,h);const T=4,tt=t%T,fs=h*.13,L=['CRAFTED','於細節之中','2026'],q=cl((tt-3.3)/.5);x.textAlign='left';x.textBaseline='alphabetic';
  L.forEach((s,i)=>{const p=1-Math.pow(2,-10*cl((tt-i*.25)/.9)),by=h*.34+i*fs*1.35;x.save();x.beginPath();x.rect(0,by-fs*1.1,w,fs*1.35);x.clip();
    x.font=`${i==1?900:400} ${fs}px "Noto Sans TC",sans-serif`;x.fillStyle=i==2?Y:FG;x.globalAlpha=1-q;x.fillText(s,w*.1,by+(1-p)*fs*1.2);x.restore()});
  x.fillStyle=rgb(A);x.fillRect(w*.1,h*.34+3*fs*1.35-fs*.7,w*.25*eOC(cl((tt-.8)/1))*(1-q),2)},
charfall(x,w,h,t){clear(x,w,h);const s='逐字落下回彈',T=3.5,tt=t%T,fs=h*.17,n=s.length,sw=fs*1.05,x0=w/2-sw*(n-1)/2;x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';
  for(let i=0;i<n;i++){const p=cl((tt-i*.1)/.55),e=eOB(p);x.save();x.translate(x0+i*sw,h/2-(1-e)*h*.6);x.rotate((1-e)*(i%2?.6:-.6));x.globalAlpha=p*(1-cl((tt-3)/.4));x.fillStyle=i==2||i==3?rgb(A):FG;x.fillText(s[i],0,0);x.restore()}},
beatslam(x,w,h,t){clear(x,w,h);const W=['FACEBOOK','YOUTUBE','LINE','INSTAGRAM','TIKTOK','THREADS'],b=60/128,k=Math.floor(t/b),p=(t%b)/b,s=1+.6*Math.pow(1-cl(p/.25),3);
  x.save();x.translate(w/2+(p<.15?(rnd(k)-.5)*12:0),h/2);x.scale(s,s);x.font=`700 ${Math.min(h*.16,w*.09)}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=k%3==0?rgb(A):FG;x.fillText(W[k%W.length],0,0);x.restore();
  x.fillStyle=rgb(A,.6*(1-p));x.fillRect(0,0,w,h*.02);x.fillRect(0,h*.98,w,h*.02)},
strokeflow(x,w,h,t){clear(x,w,h);const fs=h*.3;x.font=`700 ${fs}px Unbounded,sans-serif`;x.textBaseline='middle';x.textAlign='left';x.lineWidth=1.5;const s='CONTENT · NEWS · DATA · ',tw=x.measureText(s).width;
  [[.3,1,FG],[.72,-1,rgb(A)]].forEach(([yy,d,c])=>{x.strokeStyle=c;let o=((-t*40*d)%tw+tw)%tw-tw;for(;o<w;o+=tw)x.strokeText(s,o,h*yy)})},
karaoke(x,w,h,t){clear(x,w,h);const s='三秒抓住注意力的字幕',T=3.5,tt=t%T,n=s.length,fs=Math.min(h*.13,w*.8/n),k=cl(tt/2.6)*n;x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';
  let X=(w-x.measureText(s).width)/2;const Yp=h*.7;for(let i=0;i<n;i++){const cw=x.measureText(s[i]).width,on=i<k,sc=on?1+.2*Math.sin(Math.PI*cl(k-i)):1;
    x.save();x.translate(X+cw/2,Yp);x.scale(sc,sc);x.lineWidth=fs*.16;x.lineJoin='round';x.strokeStyle=BG;x.strokeText(s[i],-cw/2,0);x.fillStyle=on?Y:FG;x.fillText(s[i],-cw/2,0);x.restore();X+=cw}},
highlighter(x,w,h,t){clear(x,w,h);const T=3.5,tt=t%T,fs=h*.12;x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';
  [['重點不是做更多，',0],['而是做對的事',1]].forEach(([s,hl],i)=>{const Yp=h*.38+i*fs*1.6,tw=x.measureText(s).width;if(hl){const p=eOC(cl((tt-.6)/.7));x.fillStyle='rgba(255,200,87,.85)';x.beginPath();x.moveTo(w*.08-6,Yp-fs*.05);x.lineTo(w*.08+tw*p,Yp-fs*.12);x.lineTo(w*.08+tw*p+4,Yp+fs*.48);x.lineTo(w*.08-4,Yp+fs*.52);x.fill()}x.fillStyle=FG;x.fillText(s,w*.08,Yp)});
  const q=eOC(cl((tt-1.5)/.8));if(q>0){x.strokeStyle=rgb(A);x.lineWidth=3;x.beginPath();x.ellipse(w*.08+fs*1.0,h*.38,fs*1.3,fs*.75,-.05,-Math.PI*.9,-Math.PI*.9+q*Math.PI*2.1);x.stroke()}},
radar(x,w,h,t){clear(x,w,h);const cx=w/2,cy=h*.52,R=h*.38,n=6,V=[.9,.7,.85,.6,.95,.75],p=eOC(cl((t%4)/1.2));x.strokeStyle=M;x.lineWidth=1;
  for(let r=1;r<=4;r++){x.beginPath();for(let i=0;i<=n;i++){const a=i/n*Math.PI*2-Math.PI/2;x.lineTo(cx+Math.cos(a)*R*r/4,cy+Math.sin(a)*R*r/4)}x.stroke()}
  if(x.createConicGradient){const g=x.createConicGradient(t*1.5,cx,cy);g.addColorStop(0,rgb(B,.4));g.addColorStop(.15,rgb(B,0));g.addColorStop(1,rgb(B,0));x.fillStyle=g;x.beginPath();x.arc(cx,cy,R,0,7);x.fill()}
  x.beginPath();for(let i=0;i<=n;i++){const a=i/n*Math.PI*2-Math.PI/2,v=V[i%n]*p;x.lineTo(cx+Math.cos(a)*R*v,cy+Math.sin(a)*R*v)}x.fillStyle=rgb(A,.3);x.fill();x.strokeStyle=rgb(A);x.lineWidth=2;x.stroke()},
candle(x,w,h,t){clear(x,w,h);const n=22,cw=w*.8/n,base=h*.42,sh=Math.floor(t*2),P=s=>18*Math.sin(s*.35)+(rnd(s)-.5)*10,sc=h*.009;x.lineWidth=1;
  for(let i=0;i<n;i++){const s=i+sh,o=P(s-1),c=P(s),hi=Math.max(o,c)+rnd(s+.3)*5,lo=Math.min(o,c)-rnd(s+.6)*5,X=w*.1+i*cw,col=c>=o?rgb(A):rgb(B);
    x.strokeStyle=col;x.beginPath();x.moveTo(X+cw/2,base-hi*sc);x.lineTo(X+cw/2,base-lo*sc);x.stroke();x.fillStyle=col;x.fillRect(X+cw*.15,base-Math.max(o,c)*sc,cw*.7,Math.max(2,Math.abs(c-o)*sc))}
  x.fillStyle='#1A1F2B';x.fillRect(0,h*.82,w,h*.18);x.font=`500 ${h*.07}px "JetBrains Mono",monospace`;x.textBaseline='middle';x.textAlign='left';
  const s='INDEX 23,415 ▲0.82%   USD 31.42 ▼0.12%   GOLD 2,684 ▲0.45%   ',tw=x.measureText(s).width;for(let o=-(t*60)%tw;o<w;o+=tw){x.fillStyle=FG;x.fillText(s,o,h*.91)}},
bubble(x,w,h,t){clear(x,w,h);const D=[[.27,.55,.24,'YouTube'],[.56,.4,.17,'IG'],[.76,.64,.13,'TikTok'],[.47,.77,.09,'FB'],[.84,.28,.08,'X'],[.13,.24,.07,'LINE']],tt=t%4;
  D.forEach(([px,py,r,l],i)=>{const p=eOB(cl((tt-i*.15)/.6)),R=Math.max(0,r*h*p*(1+.03*Math.sin(t*2+i))),Yp=py*h+Math.sin(t+i)*4;x.fillStyle=i%2?rgb(B,.55):rgb(A,.8);x.beginPath();x.arc(px*w,Yp,R,0,7);x.fill();
    if(p>.8){x.fillStyle=FG;x.font=`700 ${Math.max(9,R*.32)}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(l,px*w,Yp)}})},
waffle(x,w,h,t){clear(x,w,h);const C=30,R=10,s=Math.min(w*.84/C,h*.7/R),x0=(w-C*s)/2,y0=h*.22,n=Math.floor(eOC(cl((t%4)/2.5))*C*R*.72);
  for(let j=0;j<R;j++)for(let i=0;i<C;i++){const k=i*R+j;x.fillStyle=k<n?rgb(A):M;x.beginPath();x.arc(x0+i*s+s/2,y0+j*s+s*.28,s*.17,0,7);x.fill();x.fillRect(x0+i*s+s*.32,y0+j*s+s*.48,s*.36,s*.38)}
  x.fillStyle=FG;x.font=`700 ${h*.1}px Unbounded,sans-serif`;x.textAlign='left';x.textBaseline='alphabetic';x.fillText(Math.round(n/(C*R)*100)+'%',x0,h*.17)},
gauge(x,w,h,t){clear(x,w,h);const cx=w/2,cy=h*.6,R=h*.38,p=eOC(cl((t%4)/1.8)),v=.78*p+.015*Math.sin(t*6)*p;x.lineCap='round';x.lineWidth=h*.05;
  x.strokeStyle=M;x.beginPath();x.arc(cx,cy,R,Math.PI*.8,Math.PI*2.2);x.stroke();x.strokeStyle=rgb(A);x.beginPath();x.arc(cx,cy,R,Math.PI*.8,Math.PI*(.8+1.4*v));x.stroke();
  x.lineWidth=3;x.strokeStyle=rgb(B,.8);x.beginPath();x.arc(cx,cy,R*.78,Math.PI*.8,Math.PI*(.8+1.4*.55*p));x.stroke();x.lineCap='butt';x.lineWidth=1.5;x.strokeStyle=FG;
  for(let i=0;i<=10;i++){const a=Math.PI*(.8+1.4*i/10);x.beginPath();x.moveTo(cx+Math.cos(a)*R*.62,cy+Math.sin(a)*R*.62);x.lineTo(cx+Math.cos(a)*R*.68,cy+Math.sin(a)*R*.68);x.stroke()}
  x.fillStyle=FG;x.font=`700 ${h*.14}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(Math.round(v*100),cx,cy)},
clockdial(x,w,h,t){clear(x,w,h);const cx=w/2,cy=h/2,R=h*.4,hr=(t*3)%24;
  for(let i=0;i<24;i++){const a=i/24*Math.PI*2-Math.PI/2,on=i<=hr;x.strokeStyle=on?mix(i/23):M;x.lineWidth=on?4:2;x.beginPath();x.moveTo(cx+Math.cos(a)*R*.82,cy+Math.sin(a)*R*.82);x.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);x.stroke()}
  const a=hr/24*Math.PI*2-Math.PI/2;x.strokeStyle=rgb(A);x.lineWidth=3;x.beginPath();x.moveTo(cx,cy);x.lineTo(cx+Math.cos(a)*R*.7,cy+Math.sin(a)*R*.7);x.stroke();
  x.fillStyle=FG;x.font=`600 ${h*.09}px "JetBrains Mono",monospace`;x.textAlign='center';x.textBaseline='middle';x.fillText(String(Math.floor(hr)).padStart(2,'0')+':00',cx,cy+R*.38)},
wireglobe(x,w,h,t){clear(x,w,h);const cx=w/2,cy=h/2,R=h*.4,rot=t*.4,tl=.35;x.lineWidth=1;
  const P=(la,lo)=>{const c=Math.cos(la),X=c*Math.sin(lo+rot),Yv=Math.sin(la),Z=c*Math.cos(lo+rot);return[cx+X*R,cy-(Yv*Math.cos(tl)-Z*Math.sin(tl))*R,Yv*Math.sin(tl)+Z*Math.cos(tl)]};
  x.strokeStyle=rgb(B,.45);for(let lo=0;lo<12;lo++){x.beginPath();for(let k=0;k<=40;k++){const p=P(-Math.PI/2+k/40*Math.PI,lo/12*Math.PI*2);k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.stroke()}
  x.strokeStyle=rgb(B,.3);for(let la=-2;la<=2;la++){x.beginPath();for(let k=0;k<=60;k++){const p=P(la*.5,k/60*Math.PI*2);k?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1])}x.stroke()}
  for(let i=0;i<8;i++){const p=P((rnd(i)-.5)*2,rnd(i+9)*6.28);if(p[2]>0){x.fillStyle=rgb(A,.5+.5*Math.sin(t*4+i));x.beginPath();x.arc(p[0],p[1],4,0,7);x.fill()}}},
ptimeline(x,w,h,t){clear(x,w,h);const hz=h*.28,Ys=['1989','1995','2005','2015','2026'];x.strokeStyle=rgb(B,.6);x.lineWidth=1.5;x.beginPath();x.moveTo(w/2-w*.02,hz);x.lineTo(w*.1,h);x.moveTo(w/2+w*.02,hz);x.lineTo(w*.9,h);x.stroke();
  Ys.forEach((yr,i)=>{const z=(i/Ys.length+t*.2)%1,e=z*z,Yp=hz+(h-hz)*e,sc=.2+e*1.2;x.globalAlpha=cl(z*3)*cl((1-z)*6);x.fillStyle=rgb(A);x.beginPath();x.arc(w/2,Yp,4*sc+1,0,7);x.fill();
    x.fillStyle=FG;x.font=`700 ${h*.09*sc}px Unbounded,sans-serif`;x.textAlign='left';x.textBaseline='middle';x.fillText(yr,w/2+18*sc,Yp)});x.globalAlpha=1},
neural(x,w,h,t){clear(x,w,h);const L=[3,5,5,2],pos=L.map((n,l)=>Array.from({length:n},(_,i)=>[w*(.15+l*.7/(L.length-1)),h*(.5+(i-(n-1)/2)*.17)]));x.lineWidth=1;
  for(let l=0;l<L.length-1;l++)pos[l].forEach((a,i)=>pos[l+1].forEach((b,j)=>{x.strokeStyle=rgb(B,.18);x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke();
    const ph=((t*.8-l*.33+rnd(i*7+j+l*31)*.3)%1+1)%1;if(ph<.33){const u=ph/.33;x.fillStyle=rgb(A);x.beginPath();x.arc(a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,2.5,0,7);x.fill()}}));
  pos.forEach((ly,l)=>ly.forEach(([X,Yp],i)=>{x.fillStyle=mix(.5+.5*Math.sin(t*4-l*1.5+i));x.beginPath();x.arc(X,Yp,7,0,7);x.fill()}))},
packets(x,w,h,t){clear(x,w,h);const N=[[.12,.3],[.12,.7],[.5,.5],[.88,.25],[.88,.5],[.88,.75]],E=[[0,2],[1,2],[2,3],[2,4],[2,5]],bz=(u,a,m1,m2,b)=>(1-u)**3*a+3*(1-u)**2*u*m1+3*(1-u)*u*u*m2+u**3*b;x.lineWidth=2;
  E.forEach(([a,b],k)=>{const P=N[a],Q=N[b],mx=(P[0]+Q[0])/2;x.strokeStyle=M;x.beginPath();x.moveTo(P[0]*w,P[1]*h);x.bezierCurveTo(mx*w,P[1]*h,mx*w,Q[1]*h,Q[0]*w,Q[1]*h);x.stroke();
    for(let q=0;q<3;q++){const u=(t*.5+q/3+k*.17)%1;x.fillStyle=k<2?rgb(B):rgb(A);x.fillRect(bz(u,P[0],mx,mx,Q[0])*w-5,bz(u,P[1],P[1],Q[1],Q[1])*h-3,10,6)}});
  N.forEach(([px,py],i)=>{x.fillStyle=i==2?rgb(A):'#2A3040';rr(x,px*w-h*.06,py*h-h*.06,h*.12,h*.12,6)})},
flipclock(x,w,h,t){clear(x,w,h);const v=Math.floor(t),p=eIO(cl((t%1)/.4)),N=String(v%100).padStart(2,'0'),O=String((v+99)%100).padStart(2,'0'),cw=h*.4,ch=h*.56,gap=12,Yp=h/2-ch/2;
  for(let i=0;i<2;i++){const X=w/2-cw-gap/2+i*(cw+gap),card=(d,y0,y1)=>{x.save();x.beginPath();x.rect(X,y0,cw,y1-y0);x.clip();x.fillStyle='#232937';rr(x,X,Yp,cw,ch,10);x.fillStyle=FG;x.font=`700 ${ch*.7}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(d,X+cw/2,h/2+ch*.03);x.restore()};
    card(N[i],Yp,h/2);if(p<1){card(O[i],h/2,Yp+ch);const half=p<.5,s=half?1-p*2:(p-.5)*2;x.save();x.translate(0,h/2);x.scale(1,Math.max(.001,s));x.translate(0,-h/2);half?card(O[i],Yp,h/2):card(N[i],h/2,Yp+ch);x.restore()}else card(N[i],h/2,Yp+ch);
    x.fillStyle=BG;x.fillRect(X,h/2-1,cw,2)}},
countdown(x,w,h,t){clear(x,w,h);const n=3-Math.floor(t%3),p=t%1,R=h*.32;x.strokeStyle=M;x.lineWidth=10;x.beginPath();x.arc(w/2,h/2,R,0,7);x.stroke();
  x.strokeStyle=rgb(A);x.lineCap='round';x.beginPath();x.arc(w/2,h/2,R,-Math.PI/2,-Math.PI/2+(1-p)*Math.PI*2);x.stroke();x.lineCap='butt';
  const s=1+.4*Math.pow(1-cl(p/.3),3);x.save();x.translate(w/2,h/2);x.scale(s,s);x.globalAlpha=1-cl((p-.8)/.2);x.fillStyle=FG;x.font=`700 ${h*.3}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(n,0,0);x.restore();x.globalAlpha=1},
lightsweep(x,w,h,t,st,c,d){clear(x,w,h);const o=off(st,w,h,d),fs=Math.min(h*.24,w*.17);o.font=`700 ${fs}px Unbounded,sans-serif`;o.textAlign='center';o.textBaseline='middle';o.fillStyle=FG;o.fillText('BRAND',w/2,h/2);
  const p=((t%3)/3)*1.8-.4;o.globalCompositeOperation='source-atop';const g=o.createLinearGradient(w*(p-.15),0,w*(p+.15),h*.3);g.addColorStop(0,'rgba(255,200,87,0)');g.addColorStop(.5,'rgba(255,200,87,1)');g.addColorStop(1,'rgba(255,200,87,0)');
  o.fillStyle=g;o.fillRect(0,0,w,h);o.globalCompositeOperation='source-over';x.drawImage(st.o,0,0,w,h)},
stamp(x,w,h,t){x.fillStyle='#EDE6D6';x.fillRect(0,0,w,h);const tt=t%3.5;x.fillStyle='#8A8172';
  for(let c=0;c<14;c++)for(let r=0;r<16;r++)if(rnd(c*31+r)>.15)x.fillRect(w*.08+c*w*.06,h*.06+((r*h*.055+tt*20)%(h*.88)),w*.035,h*.03);
  if(tt>1){const p=cl((tt-1)/.25),s=2.4-1.4*eOC(p);x.save();x.translate(w*.6,h*.5);x.rotate(-.18);x.scale(s,s);x.globalAlpha=.9*p;x.strokeStyle='#C8321E';x.lineWidth=5;x.strokeRect(-w*.17,-h*.13,w*.34,h*.26);
    x.fillStyle='#C8321E';x.font=`900 ${h*.14}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillText('首創',0,0);x.restore()}},
gears(x,w,h,t){x.fillStyle='#0F2A4A';x.fillRect(0,0,w,h);x.strokeStyle='rgba(255,255,255,.08)';x.lineWidth=1;x.beginPath();for(let X=0;X<w;X+=16){x.moveTo(X,0);x.lineTo(X,h)}for(let Yp=0;Yp<h;Yp+=16){x.moveTo(0,Yp);x.lineTo(w,Yp)}x.stroke();
  const G=(cx,cy,r,n,a,col)=>{x.strokeStyle=col;x.lineWidth=2;x.beginPath();for(let i=0;i<n*4;i++){const q=i%4,rr_=q<2?r*1.18:r,aa=a+(i+(q==1||q==2?.0:0))/(n*4)*Math.PI*2;x.lineTo(cx+Math.cos(aa)*rr_,cy+Math.sin(aa)*rr_)}x.closePath();x.stroke();x.beginPath();x.arc(cx,cy,r*.3,0,7);x.stroke()};
  const r1=h*.22,r2=h*.13;G(w*.4,h*.52,r1,14,t*.6,FG);G(w*.4+(r1+r2)*1.08,h*.52-r2*.35,r2,9,-t*.6*14/9,rgb(A))},
prism(x,w,h,t){clear(x,w,h);const F=[['新聞',A],['資料',B],['服務',[255,200,87]]],T=1.6,k=Math.floor(t/T),p=eIO(cl((t%T-.9)/.7)),a=p*Math.PI/2,H=h*.36,cy=h/2,f1=F[k%3],f2=F[(k+1)%3],h1=H*Math.cos(a),h2=H*Math.sin(a),top=cy-(h1+h2)/2;
  x.fillStyle=rgb(f1[1],1-.45*p);x.fillRect(w*.2,top+h2,w*.6,h1);x.fillStyle=rgb(f2[1],.55+.45*p);x.fillRect(w*.2,top,w*.6,h2);x.font=`900 ${h*.14}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=BG;
  if(h1>6){x.save();x.translate(w/2,top+h2+h1/2);x.scale(1,h1/H);x.fillText(f1[0],0,0);x.restore()}if(h2>6){x.save();x.translate(w/2,top+h2/2);x.scale(1,h2/H);x.fillText(f2[0],0,0);x.restore()}},
honeycomb(x,w,h,t){clear(x,w,h);const r=h*.11,tt=t%4;for(let j=-2;j<=2;j++)for(let i=-5;i<=5;i++){const X=w/2+(i+(j&1)*.5)*r*1.8,Yp=h/2+j*r*1.56;if(X<-r||X>w+r)continue;
  const p=eOB(cl((tt-Math.hypot(i,j)*.12)/.5))*(1-cl((tt-3.4)/.4));if(p<=0)continue;x.fillStyle=((i+j)%3+3)%3==0?rgb(A,.9):rgb(B,.25+.2*((i*j)&1));x.beginPath();
  for(let s=0;s<6;s++){const a=s/6*Math.PI*2+Math.PI/6;x.lineTo(X+Math.cos(a)*r*.9*p,Yp+Math.sin(a)*r*.9*p)}x.fill()}},
search(x,w,h,t){clear(x,w,h);const tt=t%5,q='動態效果 圖鑑 範例',n=Math.floor(cl((tt-.3)/1.4)*q.length),bx=w*.12,bw=w*.76,by=h*.14,bh=h*.14;x.fillStyle='#232937';rr(x,bx,by,bw,bh,bh/2);
  x.strokeStyle=rgb(A);x.lineWidth=2;x.beginPath();x.arc(bx+bh*.5,by+bh/2,bh*.18,0,7);x.stroke();x.font=`500 ${bh*.42}px "Noto Sans TC"`;x.fillStyle=FG;x.textAlign='left';x.textBaseline='middle';x.fillText(q.slice(0,n)+(Math.floor(t*2)%2?'|':''),bx+bh,by+bh/2);
  for(let i=0;i<4;i++){const p=eOC(cl((tt-2-i*.18)/.4)),Yp=by+bh*1.4+i*bh*.9+(1-p)*12;x.globalAlpha=p;x.fillStyle='#1A1F2B';rr(x,bx,Yp,bw,bh*.7,8);x.fillStyle=i==0?rgb(A):rgb(B,.8);x.fillRect(bx+14,Yp+bh*.16,bw*(.3+rnd(i)*.3),5);x.fillStyle=M;x.fillRect(bx+14,Yp+bh*.42,bw*.7,4)}x.globalAlpha=1},
polaroid(x,w,h,t){clear(x,w,h);const tt=t%4,C=['#3A4B7A','#7A3E35','#2F5E55','#6B5A2E','#4C3A6E'];C.forEach((c,i)=>{const p=eOB(cl((tt-i*.35)/.6));if(p<=0)return;const fw=h*.5,fh=fw*1.18;
  x.save();x.translate(w/2+(i-2)*w*.06,h/2+(1-p)*h);x.rotate((rnd(i)-.5)*.5);x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=12;x.fillStyle='#F2EFE8';x.fillRect(-fw/2,-fh/2,fw,fh);x.shadowColor='transparent';x.fillStyle=c;x.fillRect(-fw*.43,-fh/2+fw*.07,fw*.86,fw*.86);x.restore()})},
crt(x,w,h,t){const tt=t%4,on=cl(tt/.35);clear(x,w,h);x.save();x.translate(w/2,h/2);x.scale(1,Math.max(.004,eOC(on)));x.fillStyle=on<1?FG:'#0F1A14';x.fillRect(-w/2,-h/2,w,h);x.restore();
  if(on>=1){const L=['BIOS v1.995 ...OK','MEM 640K ...OK','MODEM 56K CONNECT','> WELCOME'],n=Math.floor((tt-.4)/.5);x.font=`400 ${h*.07}px "JetBrains Mono",monospace`;x.textAlign='left';x.textBaseline='top';x.fillStyle='#7BD88F';L.slice(0,Math.max(0,n+1)).forEach((s,i)=>x.fillText(s,w*.08,h*.15+i*h*.11))}
  x.fillStyle='rgba(0,0,0,.25)';for(let Yp=0;Yp<h;Yp+=3)x.fillRect(0,Yp,w,1);const v=x.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,w*.65);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.6)');x.fillStyle=v;x.fillRect(0,0,w,h)},
carousel(x,w,h,t){clear(x,w,h);const n=6,R=w*.32,it=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t*.6;it.push([Math.sin(a)*R,Math.cos(a),i])}
  it.sort((p,q)=>p[1]-q[1]).forEach(([X,z,i])=>{const s=.55+.45*(z+1)/2,cw=h*.34*s,ch=h*.46*s;x.globalAlpha=.35+.65*(z+1)/2;x.fillStyle=i%2?rgb(B):rgb(A);rr(x,w/2+X-cw/2,h/2-ch/2,cw,ch,8);
    x.fillStyle=BG;x.font=`700 ${ch*.2}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(String(i+1).padStart(2,'0'),w/2+X,h/2)});x.globalAlpha=1},
coverflow(x,w,h,t){clear(x,w,h);const k=t/1.4,f=Math.floor(k),c=f+eIO(cl((k-f)*1.6)),cw=h*.46,L=[];for(let i=Math.floor(c)-4;i<=Math.floor(c)+4;i++)L.push(i);
  L.sort((a,b)=>Math.abs(b-c)-Math.abs(a-c)).forEach(i=>{const d=i-c,ad=Math.min(Math.abs(d),1),X=w/2+Math.sign(d)*ad*cw*.7+d*cw*.28,s=1-ad*.25;
    x.save();x.translate(X,h*.44);x.transform(1-.5*ad,Math.sign(d)*ad*.15,0,1,0,0);x.scale(s,s);x.fillStyle=mix((((i%5)+5)%5)/4);x.fillRect(-cw/2,-cw/2,cw,cw);x.globalAlpha=.22;x.scale(1,-1);x.fillRect(-cw/2,-cw*.9,cw,cw*.4);x.restore()})},
phone(x,w,h,t){clear(x,w,h);const ph=h*.84,pw=ph*.5;[[w*.33,0],[w*.67,1]].forEach(([cx,k])=>{const y0=h*.08+Math.sin(t+k*2)*4;x.fillStyle='#2A3040';rr(x,cx-pw/2,y0,pw,ph,pw*.14);x.fillStyle='#0B0E14';rr(x,cx-pw/2+5,y0+5,pw-10,ph-10,pw*.11);
  x.save();x.beginPath();x.rect(cx-pw/2+5,y0+pw*.2,pw-10,ph-pw*.3);x.clip();const sc=(t*30+k*50)%(ph*.42);for(let i=0;i<9;i++){const Yp=y0+pw*.22+i*ph*.14-sc;x.fillStyle=i%3==0?(k?rgb(B,.8):rgb(A,.8)):'#1E2433';rr(x,cx-pw/2+12,Yp,pw-24,ph*.11,6)}x.restore()})},
bento(x,w,h,t){clear(x,w,h);const G=[[0,0,2,2],[2,0,2,1],[4,0,2,1],[2,1,1,1],[3,1,3,1],[0,2,3,1],[3,2,3,1]],u=w*.88/6,v=h*.84/3,b=60/128,n=Math.floor((t%(b*10))/b);
  G.forEach(([i,j,gw,gh],k)=>{if(k>n)return;const s=k==n?eOB(cl(((t%b)/b)/.5)):1,X=w*.06+i*u+3,Yp=h*.08+j*v+3,W=gw*u-6,H=gh*v-6;x.save();x.translate(X+W/2,Yp+H/2);x.scale(s,s);x.fillStyle=k==0?rgb(A):k%2?'#232937':rgb(B,.4);rr(x,-W/2,-H/2,W,H,10);x.restore()})},
splitscreen(x,w,h,t){const s=w*(.5+.38*Math.sin(t*1.2));scene(x,w,h,'#2A3040','rgba(237,239,245,.8)','BEFORE');x.save();x.beginPath();x.rect(s,0,w-s,h);x.clip();scene(x,w,h,rgb(A),BG,'AFTER');x.restore();
  x.fillStyle=FG;x.fillRect(s-1.5,0,3,h);x.beginPath();x.arc(s,h/2,14,0,7);x.fill();x.fillStyle=BG;x.font='700 13px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('⇆',s,h/2)},
callout(x,w,h,t){scene(x,w,h,'#1B2233','rgba(237,239,245,.1)','PRODUCT');const tt=t%4;[[.36,.45,.14,.2,'輕 30%'],[.62,.6,.86,.82,'續航 2 倍']].forEach(([ax,ay,bx,by,l],i)=>{const p=eOC(cl((tt-i*.6)/.6)),q=eOC(cl((tt-i*.6-.5)/.4)),dir=bx>ax?1:-1;
  x.strokeStyle=rgb(A);x.fillStyle=rgb(A);x.lineWidth=2;x.beginPath();x.arc(ax*w,ay*h,5+2*Math.sin(t*5),0,7);x.fill();x.beginPath();x.moveTo(ax*w,ay*h);x.lineTo(ax*w+(bx-ax)*w*p,ay*h+(by-ay)*h*p);x.stroke();
  if(q>0){x.beginPath();x.moveTo(bx*w,by*h);x.lineTo(bx*w+dir*w*.12*q,by*h);x.stroke();x.globalAlpha=q;x.fillStyle=FG;x.font=`700 ${h*.07}px "Noto Sans TC"`;x.textAlign=dir>0?'left':'right';x.textBaseline='bottom';x.fillText(l,bx*w,by*h-6);x.globalAlpha=1}})},
dissolve(x,w,h,t){TR(x,w,h,t,p=>{const n=24,m=15,cw=w/n,ch=h/m;for(let i=0;i<n;i++)for(let j=0;j<m;j++)if(rnd(i*97+j)<p)x.rect(i*cw,j*ch,cw+.5,ch+.5)})},
hexmask(x,w,h,t){TR(x,w,h,t,p=>{const r=h*.09,D=Math.hypot(w/2,h/2);for(let j=-1;j<9;j++)for(let i=-1;i<14;i++){const X=(i+(j&1)*.5)*r*1.75,Yp=j*r*1.5,s=cl(p*2.2-Math.hypot(X-w/2,Yp-h/2)/D)*r*1.05;
  if(s<=0)continue;x.moveTo(X+s,Yp);for(let k=1;k<=6;k++){const a=k/6*Math.PI*2;x.lineTo(X+Math.cos(a)*s,Yp+Math.sin(a)*s)}}})},
clockwipe(x,w,h,t){TR(x,w,h,t,p=>{x.moveTo(w/2,h/2);x.arc(w/2,h/2,w,-Math.PI/2,-Math.PI/2+p*Math.PI*2+.001);x.closePath()})},
doors(x,w,h,t){TR(x,w,h,t,p=>x.rect(w/2*(1-p),0,w*p,h))},
liquid(x,w,h,t){TR(x,w,h,t,p=>{const lv=h*(1.1-p*1.3);x.moveTo(0,h);for(let X=0;X<=w;X+=6)x.lineTo(X,lv+Math.sin(X*.02+t*5)*h*.06*Math.sin(p*Math.PI)+Math.sin(X*.045-t*3)*h*.03);x.lineTo(w,h);x.closePath()})},
iris(x,w,h,t){const p=eIO(cl(((t%2.6)-.5)/1.4)),D=Math.hypot(w,h)/2;TR(x,w,h,t,q=>x.arc(w/2,h/2,q*D,0,7));
  [0,.12,.24].forEach((d,i)=>{const q=cl(p*1.3-d);if(q>0&&q<1){x.strokeStyle=i%2?rgb(B,1-q):`rgba(255,200,87,${1-q})`;x.lineWidth=4;x.beginPath();x.arc(w/2,h/2,q*D*1.1,0,7);x.stroke()}})},
shatter(x,w,h,t){const p=cl(((t%2.6)-.5)/1.4);scene(x,w,h,rgb(A),BG,'SCENE 2');const n=6,m=4,cw=w/n,ch=h/m;
  for(let i=0;i<n;i++)for(let j=0;j<m;j++)for(let k=0;k<2;k++){const s=i*13+j*7+k,d=cl(p*1.6-rnd(s)*.6);if(d>=1)continue;const P=k?[[i,j],[i+1,j],[i,j+1]]:[[i+1,j],[i+1,j+1],[i,j+1]],
    cx=(P[0][0]+P[1][0]+P[2][0])/3*cw,cy=(P[0][1]+P[1][1]+P[2][1])/3*ch;x.save();x.translate(cx,cy+d*d*h*1.4);x.rotate(d*(rnd(s+1)-.5)*4);x.translate(-cx,-cy);
    x.beginPath();P.forEach(([a,b],q)=>q?x.lineTo(a*cw,b*ch):x.moveTo(a*cw,b*ch));x.closePath();x.clip();scene(x,w,h,BG,FG,'SCENE 1');x.restore()}},
push(x,w,h,t){const p=eIO(cl(((t%2.6)-.5)/1.4));x.save();x.translate(-p*w,0);scene(x,w,h,BG,FG,'SCENE 1');x.translate(w,0);scene(x,w,h,rgb(A),BG,'SCENE 2');x.restore()},
flash(x,w,h,t){const tt=t%2.6;tt<1.2?scene(x,w,h,BG,FG,'SCENE 1'):scene(x,w,h,rgb(A),BG,'SCENE 2');const f=Math.max(0,1-Math.abs(tt-1.2)/.25);
  if(f>0){x.fillStyle=`rgba(255,255,255,${f*.9})`;x.fillRect(0,0,w,h);x.save();x.translate(w/2,h/2);x.rotate(tt);x.fillStyle=`rgba(255,236,190,${f})`;for(let i=0;i<8;i++){x.rotate(Math.PI/4);x.beginPath();x.moveTo(0,-4);x.lineTo(w*.7*f,0);x.lineTo(0,4);x.fill()}x.restore()}},
softdiag(x,w,h,t,st,c,d){const p=eIO(cl(((t%2.6)-.5)/1.4)),s=-.3+p*1.6;scene(x,w,h,'#1B2A4A',FG,'SCENE 2');const o=off(st,w,h,d);scene(o,w,h,BG,FG,'SCENE 1');
  o.globalCompositeOperation='destination-out';const g=o.createLinearGradient(0,0,w,h*.6);g.addColorStop(cl(s-.25),'rgba(0,0,0,1)');g.addColorStop(cl(s),'rgba(0,0,0,0)');o.fillStyle=g;o.fillRect(0,0,w,h);o.globalCompositeOperation='source-over';x.drawImage(st.o,0,0,w,h)},
blurzoom(x,w,h,t){const p=eIO(cl(((t%2.6)-.5)/1.4));clear(x,w,h);const L=(s,a,bl,bg,txt)=>{x.save();x.filter=`blur(${bl}px)`;x.globalAlpha=a;x.translate(w/2,h/2);x.scale(s,s);x.translate(-w/2,-h/2);scene(x,w,h,bg,FG,txt);x.restore()};
  L(1+p*.3,1-p,p*12,BG,'SCENE 1');L(.8+p*.2,p,(1-p)*12,'#1B2A4A','SCENE 2')},
panel(x,w,h,t){const p=1-Math.pow(2,-10*cl(((t%2.6)-.5)/1.2));scene(x,w,h,BG,FG,'SCENE 1');x.fillStyle=`rgba(0,0,0,${.4*p})`;x.fillRect(0,0,w,h);
  x.save();x.translate(w*(1-p)+(p<.001?40:0),0);x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=30;x.shadowOffsetX=-10;x.fillStyle='#F2EFE8';x.fillRect(0,0,w,h);x.shadowColor='transparent';
  x.fillStyle=BG;x.font=`700 ${h*.13}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('SCENE 2',w/2,h/2);x.restore()},
filmfx(x,w,h,t){const s=1+.04*((t%6)/6);x.save();x.translate(w/2,h/2);x.scale(s,s);x.translate(-w/2,-h/2);scene(x,w,h,'#1B2233',FG,'CINEMA');x.restore();
  const v=x.createRadialGradient(w/2,h/2,h*.3,w/2,h/2,w*.7);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.75)');x.fillStyle=v;x.fillRect(0,0,w,h);
  const f=Math.floor(t*24);for(let i=0;i<900;i++){x.fillStyle=`rgba(255,255,255,${rnd(f*1000+i)*.14})`;x.fillRect(rnd(f*7+i*3.1)*w,rnd(f*13+i*1.7)*h,1.5,1.5)}},
camshake(x,w,h,t){const b=60/128,p=(t%b)/b,k=Math.floor(t/b),f=Math.pow(1-cl(p/.35),2),W=['CUT','BEAT','HIT'][k%3];clear(x,w,h);x.save();x.translate(w/2+(rnd(k)-.5)*30*f,h/2+(rnd(k+.5)-.5)*20*f);x.scale(1+.08*f,1+.08*f);
  x.font=`700 ${h*.26}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.globalCompositeOperation='lighter';x.fillStyle=rgb(A,.9);x.fillText(W,-12*f,0);x.fillStyle=rgb(B,.9);x.fillText(W,12*f,0);
  x.fillStyle=`rgba(237,239,245,${.4+.6*(1-f)})`;x.fillText(W,0,0);x.restore();x.globalCompositeOperation='source-over'},
hud(x,w,h,t){scene(x,w,h,'#161B26','rgba(237,239,245,.18)','HUD');const m=w*.05,l=h*.08;x.strokeStyle=FG;x.lineWidth=2;
  [[m,m,1,1],[w-m,m,-1,1],[m,h-m,1,-1],[w-m,h-m,-1,-1]].forEach(([X,Yp,a,b])=>{x.beginPath();x.moveTo(X,Yp+b*l);x.lineTo(X,Yp);x.lineTo(X+a*l,Yp);x.stroke()});
  if(Math.floor(t*1.5)%2){x.fillStyle='#FF3B30';x.beginPath();x.arc(m+l*.6,m+l*.9,5,0,7);x.fill()}x.fillStyle=FG;x.font=`600 ${Math.max(10,h*.055)}px "JetBrains Mono",monospace`;x.textAlign='left';x.textBaseline='middle';x.fillText('REC',m+l*.6+12,m+l*.9);
  const s=Math.floor(t),fr=Math.floor((t%1)*30),z=v=>String(v).padStart(2,'0');x.textAlign='right';x.fillText(`00:${z(Math.floor(s/60)%60)}:${z(s%60)}:${z(fr)}`,w-m-l*.4,m+l*.9);x.textAlign='left';x.fillText('CH.03 / BRAND',m+l*.4,h-m-l*.7);
  x.fillStyle=rgb(A);x.fillRect(m,h-m-4,(w-2*m)*((t%10)/10),3);x.lineWidth=1;x.beginPath();x.moveTo(w/2-12,h/2);x.lineTo(w/2+12,h/2);x.moveTo(w/2,h/2-12);x.lineTo(w/2,h/2+12);x.stroke()},
glasswall(x,w,h,t){const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#070B22');g.addColorStop(1,'#151A45');x.fillStyle=g;x.fillRect(0,0,w,h);
  [[A,.72,.28,.32],[B,.25,.7,.4]].forEach(([c,px,py,r],i)=>{const X=w*(px+.04*Math.sin(t*.6+i*2)),Yp=h*(py+.05*Math.cos(t*.5+i)),R=h*r*2;const rg=x.createRadialGradient(X,Yp,0,X,Yp,R);rg.addColorStop(0,rgb(c,.5));rg.addColorStop(1,rgb(c,0));x.fillStyle=rg;x.fillRect(0,0,w,h)});
  const lt=t%5,cam=eIO(cl(lt/3.6)),cw=w*.17,ch=h*.42;for(let r=1;r>=0;r--)for(let c=0;c<4;c++){const i=r*4+c,p=eOC(cl((lt-.15-i*.07)/.9));if(p<=0)continue;const d=r?0.82:1,X=w/2+(c-1.5)*cw*1.12*d-cam*w*.04+(r?w*.08:0),Yp=h*.44+(r-.5)*h*.42-(1-p)*h*.15;
    x.save();x.translate(X,Yp);x.globalAlpha=p*(r?.7:1);if(r)x.filter='blur(1.5px)';x.fillStyle='rgba(255,255,255,.08)';rr(x,-cw*d/2,-ch*d/2,cw*d,ch*d,12);x.strokeStyle='rgba(255,255,255,.25)';x.lineWidth=1;x.strokeRect&&0;
    x.beginPath();x.roundRect?x.roundRect(-cw*d/2,-ch*d/2,cw*d,ch*d,12):x.rect(-cw*d/2,-ch*d/2,cw*d,ch*d);x.stroke();x.fillStyle=i%2?rgb(A,.9):rgb(B,.9);x.beginPath();x.arc(0,-ch*d*.1,cw*d*.22,0,7);x.fill();x.fillStyle='rgba(255,255,255,.7)';x.fillRect(-cw*d*.3,ch*d*.18,cw*d*.6,3);x.restore()}},
heroorbit(x,w,h,t){const bg=x.createRadialGradient(w/2,h*.45,0,w/2,h*.45,w*.7);bg.addColorStop(0,'#1B2160');bg.addColorStop(1,'#05081A');x.fillStyle=bg;x.fillRect(0,0,w,h);
  const cx=w/2,cy=h/2,RX=w*.38,RY=h*.18,tl=-.12,n=6,O=[];for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t*.9,ox=Math.cos(a)*RX,oy=Math.sin(a)*RY;O.push({i,z:Math.sin(a),X:cx+ox*Math.cos(tl)-oy*Math.sin(tl),Y:cy+ox*Math.sin(tl)+oy*Math.cos(tl)})}
  x.save();x.translate(cx,cy);x.rotate(tl);x.strokeStyle='rgba(170,180,255,.35)';x.lineWidth=1;x.beginPath();x.ellipse(0,0,RX,RY,0,0,7);x.stroke();x.restore();
  const dot=o=>{const s=h*(.05+.035*(o.z+1)/2);x.globalAlpha=.4+.6*(o.z+1)/2;x.fillStyle=[rgb(A),rgb(B),Y,'#7BD88F','#E1306C','#FF0000'][o.i];rr(x,o.X-s,o.Y-s,s*2,s*2,s*.5);x.globalAlpha=1};
  O.filter(o=>o.z<0).forEach(dot);const pw=h*.36,ph=h*.72;x.save();x.translate(cx,cy);x.rotate(-.04+.02*Math.sin(t*.8));x.fillStyle='#8C93B0';rr(x,-pw/2-5,-ph/2-5,pw+10,ph+10,pw*.16);x.fillStyle='#0B0E1C';rr(x,-pw/2,-ph/2,pw,ph,pw*.13);
  x.beginPath();x.rect(-pw/2,-ph/2+pw*.12,pw,ph-pw*.14);x.clip();const sc=(t*40)%(ph*.5);for(let k=0;k<6;k++){x.fillStyle=k%2?'#2A3040':rgb(A,.75);rr(x,-pw/2+6,-ph/2+pw*.15+k*ph*.25-sc,pw-12,ph*.21,6)}x.restore();O.filter(o=>o.z>=0).sort((a,b)=>a.z-b.z).forEach(dot)},
kenburns(x,w,h,t,st,c,d){const o=off(st,w,h,d);{const g=o.createLinearGradient(0,0,0,h);g.addColorStop(0,'#F6B26B');g.addColorStop(.55,'#C0577A');g.addColorStop(1,'#2B1E3F');o.fillStyle=g;o.fillRect(0,0,w,h);o.fillStyle='rgba(255,236,190,.9)';o.beginPath();o.arc(w*.68,h*.42,h*.1,0,7);o.fill();
    [['#3A2850',.62],['#22183A',.75],['#120C22',.88]].forEach(([col,b],k)=>{o.fillStyle=col;o.beginPath();o.moveTo(0,h);for(let X=0;X<=w;X+=8)o.lineTo(X,h*b-Math.sin(X*.02+k*2)*h*.06-Math.sin(X*.007+k)*h*.08);o.lineTo(w,h);o.fill()});}
  const T=6,p=(t%T)/T,s=1.04+.12*p,dx=(-.5+p)*w*.04;x.save();x.translate(w/2+dx,h/2);x.scale(s,s);x.drawImage(st.o,-w/2,-h/2,w,h);x.restore();x.fillStyle=`rgba(0,0,0,${cl(1-p*12)+cl((p-.92)*12)})`;x.fillRect(0,0,w,h)},
sepiacolor(x,w,h,t){const tt=t%5,p=eIO(cl((tt-1.8)/1.4));const S=[[64,120,180],[230,120,70],[70,160,110]],G=[150,128,100];const m=(a,k)=>a.map((v,i)=>G[i]+(v-G[i])*k);
  x.fillStyle=rgb(m([20,24,36],p));x.fillRect(0,0,w,h);for(let i=0;i<3;i++){x.fillStyle=rgb(m(S[i],p));rr(x,w*(.1+i*.28),h*.25,w*.24,h*.5,8)}
  x.fillStyle=`rgba(255,255,255,${.85})`;x.font=`700 ${h*.12}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText(p<.5?'1989':'2026',w/2,h*.5);
  const f=Math.floor(t*24);for(let i=0;i<400*(1-p);i++){x.fillStyle=`rgba(255,240,210,${rnd(f*900+i)*.25})`;x.fillRect(rnd(f*7+i*3.1)*w,rnd(f*13+i*1.7)*h,1.5,1.5)}if(p<1){x.fillStyle=`rgba(90,60,20,${.18*(1-p)})`;x.fillRect(0,0,w,h)}},
wordcollapse(x,w,h,t){clear(x,w,h);const W=['創新','品質','服務'],tt=t%4.6,out=cl((tt-3.4)/.4),fs=Math.min(h*.18,w*.1);x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';
  W.forEach((s,i)=>{const p=cl((tt-.3-i*.6)/.3),e=eOB(p),X=w/2+(i-1)*w*.28;x.save();x.globalAlpha=p;x.translate(X+(w/2-X)*eIO(out),h*.42+(1-e)*20);x.scale(1-out*.85,1-out*.85);x.fillStyle=i==1?rgb(A):FG;x.fillText(s,0,0);x.restore()});
  const lw=w*.7*eOC(cl((tt-1.9)/.5))*(1-out);x.fillStyle=rgb(A);x.fillRect(w/2-lw/2,h*.58,lw,3);const q=cl((tt-3.7)/.4);if(q>0){x.globalAlpha=q;x.fillStyle=FG;x.font=`700 ${fs*.6}px Unbounded,sans-serif`;x.fillText('BRAND',w/2,h*.45);x.globalAlpha=1}},
gooey(x,w,h,t,st,c,d){const o=off(st,w,h,d);o.fillStyle='#000';o.fillRect(0,0,w,h);o.filter='blur(10px)';o.fillStyle='#fff';
  for(let i=0;i<5;i++){const a=t*(.6+i*.17)+i*1.3,r=h*(.08+.03*(i%3));o.beginPath();o.arc(w/2+Math.cos(a)*w*.18*Math.sin(t*.4+i),h/2+Math.sin(a*1.3)*h*.2,r,0,7);o.fill()}
  o.beginPath();o.arc(w/2,h/2,h*.13,0,7);o.fill();o.filter='none';x.save();x.filter='contrast(30)';x.drawImage(st.o,0,0,w,h);x.restore();x.save();x.globalCompositeOperation='multiply';const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,rgb(A));g.addColorStop(1,rgb(B));x.fillStyle=g;x.fillRect(0,0,w,h);x.restore()},
circletext(x,w,h,t){clear(x,w,h);const s='SCROLL · FOLLOW · SAVE · SHARE · ',R=h*.33,n=s.length;x.font=`700 ${h*.07}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=FG;
  for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t*.5;x.save();x.translate(w/2+Math.cos(a)*R,h/2+Math.sin(a)*R);x.rotate(a+Math.PI/2);x.fillText(s[i],0,0);x.restore()}
  x.fillStyle=rgb(A);x.beginPath();x.arc(w/2,h/2,R*.55,0,7);x.fill();x.fillStyle=BG;x.font=`900 ${h*.09}px "Noto Sans TC"`;x.fillText('追蹤',w/2,h/2)},
ascii(x,w,h,t){clear(x,w,h);const C=' .:-=+*#%@',cs=Math.max(8,h/26),cols=Math.floor(w/cs*1.7),rows=Math.floor(h/cs),cw=w/cols;x.font=`600 ${cs}px "JetBrains Mono",monospace`;x.textAlign='center';x.textBaseline='middle';
  const lx=Math.cos(t),ly=Math.sin(t*.7)*.6;for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const u=(i*cw-w/2)/(h*.38),v=(j*cs+cs/2-h/2)/(h*.38),r2=u*u+v*v;let b=0;
    if(r2<1){const z=Math.sqrt(1-r2);b=cl(.15+.85*(u*lx*-.7+v*ly*-.7+z*.7))}else b=.06*(.5+.5*Math.sin(i*.5+j*.3-t*3));const k=Math.min(C.length-1,Math.floor(b*C.length));if(k<1)continue;x.fillStyle=r2<1?mix(b):rgb(B,.5);x.fillText(C[k],i*cw+cw/2,j*cs+cs/2)}},
dither(x,w,h,t){clear(x,w,h);const M=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5],tt=t%5,p=eIO(cl(tt/2.5))*(1-cl((tt-4.2)/.6)),cs=Math.max(3,h/70);x.fillStyle=rgb(A);
  for(let j=0;j*cs<h;j++)for(let i=0;i*cs<w;i++){const u=(i*cs-w/2)/(h*.4),v=(j*cs-h/2)/(h*.4),r=Math.hypot(u,v),b=(r<1?.35+.65*Math.sqrt(1-r*r)*(.5+.5*(-u*.5-v*.6+.6)):.08+.12*(j*cs/h))*p;if(b*16>M[(j%4)*4+(i%4)]+.5)x.fillRect(i*cs,j*cs,cs*.9,cs*.9)}},
spotlight(x,w,h,t){scene(x,w,h,'#1B2233',FG,'');x.font=`900 ${h*.16}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillStyle=rgb(A);x.fillText('找到重點',w/2,h*.42);x.fillStyle=FG;x.font=`500 ${h*.06}px "Noto Sans TC"`;x.fillText('聚光燈照到哪裡，內容就出現在哪裡',w/2,h*.62);
  const tt=t%6,o=cl((tt-4.4)/.8),cx=w*(.5+.32*Math.sin(t*.9)),cy=h*(.5+.25*Math.sin(t*1.4)),R=h*(.22+.9*eIO(o));const g=x.createRadialGradient(cx,cy,R*.55,cx,cy,R);g.addColorStop(0,'rgba(5,6,10,0)');g.addColorStop(1,'rgba(5,6,10,.96)');x.fillStyle=g;x.fillRect(0,0,w,h)},
odometer(x,w,h,t){clear(x,w,h);const T=4.5,tt=t%T,v=48216*eOC(cl(tt/3)),N=5,dh=h*.3,dw=dh*.62,x0=w/2-N*dw/2,y0=h/2-dh/2;x.font=`700 ${dh*.78}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';
  for(let k=0;k<N;k++){const pw=Math.pow(10,N-1-k),q=v/pw,base=Math.floor(q)%10,fr=pw===1?q-Math.floor(q):cl(((q-Math.floor(q))*pw-(pw-1))),X=x0+k*dw;x.fillStyle='#232937';rr(x,X+2,y0,dw-4,dh,8);
    x.save();x.beginPath();x.rect(X,y0,dw,dh);x.clip();x.fillStyle=k<2?rgb(A):FG;x.fillText(base,X+dw/2,h/2-fr*dh);x.fillText((base+1)%10,X+dw/2,h/2+dh-fr*dh);x.restore()}
  x.fillStyle='rgba(18,21,29,.6)';x.fillRect(x0,y0,N*dw,dh*.12);x.fillRect(x0,y0+dh*.88,N*dw,dh*.12)},
barrace(x,w,h,t){clear(x,w,h);const L=['YouTube','IG','TikTok','FB','LINE'],V=[[60,30,10,80,50],[70,45,30,78,55],[78,62,55,74,58],[85,75,80,70,60],[90,82,95,66,61]],C=[rgb(A),rgb(B),Y,'#7BD88F','#9AA1B3'];
  const yr=(t*.5)%(V.length-1),a=Math.floor(yr),f=eIO(yr-a),val=L.map((_,i)=>V[a][i]+(V[a+1][i]-V[a][i])*f),rk=y=>{const s=L.map((_,i)=>i).sort((p,q)=>V[y][q]-V[y][p]),r=[];s.forEach((i,k)=>r[i]=k);return r},r0=rk(a),r1=rk(a+1),bh=h*.12;
  L.forEach((l,i)=>{const r=r0[i]+(r1[i]-r0[i])*f,Yp=h*.14+r*bh*1.3,bw=w*.62*val[i]/100;x.fillStyle=C[i];rr(x,w*.2,Yp,bw,bh,4);x.fillStyle=FG;x.font=`600 ${bh*.45}px Unbounded,sans-serif`;x.textAlign='right';x.textBaseline='middle';x.fillText(l,w*.18,Yp+bh/2);x.textAlign='left';x.fillText(Math.round(val[i]),w*.2+bw+6,Yp+bh/2)});
  x.fillStyle='rgba(237,239,245,.25)';x.font=`700 ${h*.2}px Unbounded,sans-serif`;x.textAlign='right';x.textBaseline='alphabetic';x.fillText(String(2022+Math.round(yr)),w*.95,h*.95)},
linerace(x,w,h,t){clear(x,w,h);const S=[[A,s=>.3+.5*s+.08*Math.sin(s*9)],[B,s=>.25+.35*s+.1*Math.sin(s*6+1)],[[255,200,87],s=>.2+.6*s*s+.05*Math.sin(s*12)]],L=['A 品牌','B 品牌','C 品牌'],p=eIO(cl(((t%5))/3.6)),x0=w*.1,x1=w*.78;x.strokeStyle=M;x.lineWidth=1;
  for(let k=0;k<4;k++){const Yp=h*.85-k*h*.22;x.beginPath();x.moveTo(x0,Yp);x.lineTo(x1,Yp);x.stroke()}S.forEach(([c,f],i)=>{x.strokeStyle=rgb(c);x.lineWidth=3;x.beginPath();for(let s=0;s<=p;s+=.01){const X=x0+(x1-x0)*s,Yp=h*.85-f(s)*h*.7;s?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke();
    const X=x0+(x1-x0)*p,Yp=h*.85-f(p)*h*.7;x.fillStyle=rgb(c);x.beginPath();x.arc(X,Yp,5,0,7);x.fill();x.font=`700 ${h*.06}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';x.fillText(L[i]+' '+Math.round(f(p)*100),X+10,Yp)})},
weightwave(x,w,h,t){clear(x,w,h);const s='字重波浪WAVE',n=s.length,fs=Math.min(h*.2,w*.11),Wt=[300,400,500,700,900];x.textBaseline='middle';x.textAlign='center';let tw=0;const ws=[];
  for(let i=0;i<n;i++){const k=.5+.5*Math.sin(t*3-i*.55),wt=Wt[Math.round(k*4)];x.font=`${wt} ${fs}px "Noto Sans TC",Unbounded,sans-serif`;const cw=x.measureText(s[i]).width*(.85+.3*k);ws.push([wt,cw,k]);tw+=cw}
  let X=(w-tw)/2;ws.forEach(([wt,cw,k],i)=>{x.font=`${wt} ${fs}px "Noto Sans TC",Unbounded,sans-serif`;x.save();x.translate(X+cw/2,h/2);x.scale(.85+.3*k,1);x.fillStyle=mix(k);x.fillText(s[i],0,0);x.restore();X+=cw})},
blurin(x,w,h,t){clear(x,w,h);const s='每個字都清楚登場',T=4,tt=t%T,n=s.length,fs=Math.min(h*.14,w*.8/n);x.font=`700 ${fs}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';let X=(w-x.measureText(s).width)/2;const q=cl((tt-3.3)/.5);
  for(let i=0;i<n;i++){const p=eOC(cl((tt-.2-i*.09)/.7)),cw=x.measureText(s[i]).width;x.save();x.filter=`blur(${(1-p)*12+q*10}px)`;x.globalAlpha=p*(1-q);x.fillStyle=i>=5?rgb(A):FG;x.fillText(s[i],X,h/2+(1-p)*fs*.5);x.restore();X+=cw}},
zoomtext(x,w,h,t,st,c,d){const T=3.2,tt=t%T,p=cl((tt-.6)/2),s=Math.pow(60,eIO(p));scene(x,w,h,BG,FG,'');const o=off(st,w,h,d);scene(o,w,h,rgb(A),BG,'SCENE 2');o.globalCompositeOperation='destination-in';
  const fs=h*.42;o.font=`900 ${fs}px Unbounded,sans-serif`;o.textBaseline='middle';o.textAlign='left';const off_=o.measureText('B').width+o.measureText('I').width/2;o.save();o.translate(w/2,h/2);o.scale(s,s);o.fillText('BIG',-off_,0);o.restore();o.globalCompositeOperation='source-over';x.drawImage(st.o,0,0,w,h)},
mosaic(x,w,h,t){clear(x,w,h);const C=4,R=3,cw=w/C,ch=h/R,tt=t%5,P=[[A,B],[B,Y],[Y,A]];const big=(X,Yp)=>{const k=X/w;return mix(k,1)};
  for(let j=0;j<R;j++)for(let i=0;i<C;i++){const p=cl((tt-.3-(i+j)*.15)/.5),q=cl((tt-2.2-(i+j)*.12)/.5),fl=q>0?q:p,sc=Math.abs(Math.cos(fl*Math.PI)),X=i*cw,Yp=j*ch;if(p<=0)continue;x.save();x.translate(X+cw/2,Yp+ch/2);x.scale(Math.max(.02,sc),1);
    if(q<.5){const g=x.createLinearGradient(-cw/2,-ch/2,cw/2,ch/2);const pr=P[(i+j)%3];g.addColorStop(0,typeof pr[0]==='string'?pr[0]:rgb(pr[0]));g.addColorStop(1,typeof pr[1]==='string'?pr[1]:rgb(pr[1]));x.fillStyle=g;x.fillRect(-cw/2+2,-ch/2+2,cw-4,ch-4)}
    else{const g=x.createLinearGradient(-X-cw/2,0,w-X-cw/2,0);g.addColorStop(0,rgb(B));g.addColorStop(1,rgb(A));x.fillStyle=g;x.fillRect(-cw/2,-ch/2,cw,ch)}x.restore()}
  if(tt>3.4){x.globalAlpha=cl((tt-3.4)/.4);x.fillStyle=BG;x.font=`700 ${h*.14}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('RECAP',w/2,h/2);x.globalAlpha=1}},
cardswipe(x,w,h,t){clear(x,w,h);const T=1.2,k=Math.floor(t/T),p=eIO(cl((t%T-.5)/.6)),cw=w*.42,ch=h*.62,C=[rgb(A),rgb(B),'#FFC857','#7BD88F'];
  for(let j=3;j>=0;j--){const idx=k+j,dep=j-p;if(dep<-0.999)continue;x.save();if(j===0){x.translate(w/2+p*w*.8,h/2+p*h*.1);x.rotate(p*.5)}else{x.translate(w/2,h/2+dep*h*.04);x.scale(1-dep*.06,1-dep*.06)}
    x.globalAlpha=j===0?1-p*.5:1-dep*.2;x.fillStyle=C[idx%4];rr(x,-cw/2,-ch/2,cw,ch,14);x.fillStyle=BG;x.font=`700 ${ch*.3}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('#'+(idx%10+1),0,0);x.restore()}},
chat(x,w,h,t){clear(x,w,h);const M_=[['今天剪好了嗎？',0],['快好了，在加動態',1],['有字幕嗎？',0],['有，逐字高亮 ✓',1]],T=7,tt=t%T,fs=h*.065;x.font=`500 ${fs}px "Noto Sans TC"`;x.textBaseline='middle';let Yp=h*.12;
  M_.forEach(([s,me],i)=>{const st0=.4+i*1.4,ty=tt-st0;if(ty<0)return;const bw=x.measureText(s).width+fs*1.4,bh=fs*1.9,X=me?w*.92-bw:w*.08;x.fillStyle=me?rgb(A):'#2A3040';
    if(ty<.6){const dw=fs*2.6;rr(x,me?w*.92-dw:w*.08,Yp,dw,bh,bh/2);for(let k=0;k<3;k++){x.fillStyle=`rgba(237,239,245,${.4+.6*(Math.floor(t*6+k)%3==0)})`;x.beginPath();x.arc((me?w*.92-dw:w*.08)+dw*(.3+k*.2),Yp+bh/2,fs*.12,0,7);x.fill()}}
    else{const p=eOB(cl((ty-.6)/.3));x.save();x.translate(me?X+bw:X,Yp+bh/2);x.scale(p,p);rr(x,me?-bw:0,-bh/2,bw,bh,bh/2);x.fillStyle=FG;x.textAlign='left';x.fillText(s,(me?-bw:0)+fs*.7,0);x.restore()}Yp+=bh*1.3})},
notify(x,w,h,t){scene(x,w,h,'#1E2433','rgba(237,239,245,.15)','9:41');const N=['新訂單 #1024','新訂單 #1025','有人按讚了你的影片','新訂單 #1026','新追蹤者 +12'],T=1.1,k=Math.floor(t/T),p=eOB(cl((t%T)/.45)),nh=h*.15,nw=w*.84;
  for(let j=0;j<4;j++){const idx=k-j;if(idx<0)continue;const pos=j-1+p,Yp=h*.06+Math.max(0,pos)*nh*.32+(pos<0?pos*nh*1.3:0),s=1-Math.max(0,pos)*.05;x.save();x.translate(w/2,Yp+nh/2);x.scale(s,s);x.globalAlpha=j==3?1-p:1;
    x.fillStyle='rgba(245,246,250,.92)';rr(x,-nw/2,-nh/2,nw,nh,nh*.25);x.fillStyle=rgb(A);rr(x,-nw/2+nh*.2,-nh*.3,nh*.6,nh*.6,nh*.15);x.fillStyle='#161922';x.font=`600 ${nh*.28}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';x.fillText(N[idx%N.length],-nw/2+nh*.95,0);x.restore()}},
checklist(x,w,h,t){clear(x,w,h);const S=['上傳素材','自動配效果','逐字字幕','輸出 9:16'],T=5,tt=t%T,x0=w*.22,fs=h*.08,gap=h*.19,y0=h*.2;x.strokeStyle=M;x.lineWidth=3;x.beginPath();x.moveTo(x0,y0);x.lineTo(x0,y0+gap*3);x.stroke();
  const lp=cl(tt/3.2)*3;x.strokeStyle=rgb(A);x.beginPath();x.moveTo(x0,y0);x.lineTo(x0,y0+gap*Math.min(3,lp));x.stroke();S.forEach((s,i)=>{const Yp=y0+i*gap,on=lp>=i,p=eOB(cl((lp-i)*2.5));x.fillStyle=on?rgb(A):'#2A3040';x.beginPath();x.arc(x0,Yp,fs*.5*(on?.8+.2*p:1),0,7);x.fill();
    if(on){x.strokeStyle=BG;x.lineWidth=3;x.beginPath();const c=cl((lp-i)*3);x.moveTo(x0-fs*.22,Yp);x.lineTo(x0-fs*.22+fs*.15*Math.min(1,c*2),Yp+fs*.15*Math.min(1,c*2));if(c>.5)x.lineTo(x0-fs*.07+fs*.3*(c-.5)*2,Yp+fs*.15-fs*.35*(c-.5)*2);x.stroke()}
    x.fillStyle=on?FG:'rgba(237,239,245,.4)';x.font=`700 ${fs}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';x.fillText(s,x0+fs*1.1,Yp)})},
routemap(x,w,h,t){clear(x,w,h);x.fillStyle=M;for(let j=0;j<h;j+=10)for(let i=0;i<w;i+=10){const n=Math.sin(i*.013)+Math.cos(j*.017+i*.004)+Math.sin((i+j)*.006);if(n>.4)x.fillRect(i,j,3,3)}
  const P=[[.12,.7],[.3,.35],[.52,.6],[.7,.3],[.88,.55]],seg=P.length-1,tt=t%6,p=cl(tt/4.5)*seg,pt=s=>{const a=Math.min(seg-1,Math.floor(s)),f=s-a;return[(P[a][0]+(P[a+1][0]-P[a][0])*f)*w,(P[a][1]+(P[a+1][1]-P[a][1])*f)*h]};
  x.strokeStyle=rgb(A);x.lineWidth=3;x.setLineDash([8,6]);x.lineDashOffset=-t*20;x.beginPath();for(let s=0;s<=p;s+=.02){const q=pt(s);s?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke();x.setLineDash([]);
  P.forEach(([px,py],i)=>{if(i<=p+.01){x.fillStyle=FG;x.beginPath();x.arc(px*w,py*h,5,0,7);x.fill()}});for(let k=0;k<8;k++){const q=pt(Math.max(0,p-k*.03));x.fillStyle=rgb(A,1-k/8);x.beginPath();x.arc(q[0],q[1],7-k*.6,0,7);x.fill()}},
lightleak(x,w,h,t){scene(x,w,h,'#2A3040',FG,'MEMORIES');x.save();x.globalCompositeOperation='screen';[[255,140,60,.55],[255,80,90,.4],[255,210,120,.45]].forEach(([r,g,b,a],i)=>{const X=w*(.5+.6*Math.sin(t*.35+i*2.1)),Yp=h*(.5+.5*Math.cos(t*.27+i*1.3)),R=h*(.6+.25*Math.sin(t*.5+i));
  const rg=x.createRadialGradient(X,Yp,0,X,Yp,R);rg.addColorStop(0,`rgba(${r},${g},${b},${a})`);rg.addColorStop(1,`rgba(${r},${g},${b},0)`);x.fillStyle=rg;x.fillRect(0,0,w,h)});x.restore()},
lissajous(x,w,h,t){clear(x,w,h);x.lineWidth=1.6;[[3,2],[5,4],[4,3]].forEach(([a,b],k)=>{x.strokeStyle=mix(k/2,.75);x.beginPath();for(let s=0;s<=6.3;s+=.01){const X=w/2+Math.sin(a*s+t*(.4+k*.15))*w*.36,Yp=h/2+Math.sin(b*s)*h*.38;s?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke()});
  const s=t*1.2;x.fillStyle=FG;x.beginPath();x.arc(w/2+Math.sin(3*s+t*.4)*w*.36,h/2+Math.sin(2*s)*h*.38,4,0,7);x.fill()},
voronoi(x,w,h,t){const N=14,cs=Math.max(4,h/50),S=Array.from({length:N},(_,i)=>[rnd(i)*w+Math.sin(t*.4+i)*w*.06,rnd(i+50)*h+Math.cos(t*.35+i*1.7)*h*.08]);
  for(let Yp=0;Yp<h;Yp+=cs)for(let X=0;X<w;X+=cs){let d1=1e9,d2=1e9,k=0;for(let i=0;i<N;i++){const d=Math.hypot(X-S[i][0],Yp-S[i][1]);if(d<d1){d2=d1;d1=d;k=i}else if(d<d2)d2=d}
    x.fillStyle=d2-d1<cs*1.3?'rgba(237,239,245,.75)':mix(k/(N-1),.18+.25*(k%3)/2);x.fillRect(X,Yp,cs+.5,cs+.5)}},
magnetic(x,w,h,t){clear(x,w,h);const ax=w/2+Math.cos(t*.9)*w*.3,ay=h/2+Math.sin(t*1.3)*h*.3,R=h*.3,g=Math.max(12,h/14);for(let Yp=g/2;Yp<h;Yp+=g)for(let X=g/2;X<w;X+=g){const dx=ax-X,dy=ay-Yp,f=Math.exp(-(dx*dx+dy*dy)/(R*R));
  x.fillStyle=mix(f,.35+.65*f);x.beginPath();x.arc(X+dx*f*.35,Yp+dy*f*.35,1.5+3.5*f,0,7);x.fill()}},
galaxy(x,w,h,t){clear(x,w,h);const R=Math.min(w,h)*.46,cx=w/2,cy=h/2;const g=x.createRadialGradient(cx,cy,0,cx,cy,R*.35);g.addColorStop(0,'rgba(255,220,180,.8)');g.addColorStop(1,'rgba(255,220,180,0)');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(let i=0;i<700;i++){const r=Math.pow(rnd(i),.7)*R,arm=(i%3)*Math.PI*2/3,a=r*.035+arm+t*.25*(1.2-r/R)+(rnd(i+3)-.5)*.5;x.fillStyle=mix(r/R,.4+.6*rnd(i+7));x.fillRect(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.55,1.6,1.6)}},
matrixrain(x,w,h,t){clear(x,w,h);const C='01アイウエオカキクケコサシスセソ',cs=Math.max(10,h/22),cols=Math.ceil(w/cs);x.font=`600 ${cs}px "JetBrains Mono",monospace`;x.textAlign='center';x.textBaseline='top';
  for(let i=0;i<cols;i++){const sp=.25+rnd(i)*.35,hy=(((t*sp+rnd(i+9))%1.4)*h*1.4)-h*.2,L=8+Math.floor(rnd(i+4)*10);for(let k=0;k<L;k++){const Yp=hy-k*cs;if(Yp<-cs||Yp>h)continue;const ch=C[Math.floor(rnd(i*31+Math.floor(Yp/cs)+Math.floor(t*8)*(k<2?1:0))*C.length)];
    x.fillStyle=k==0?FG:rgb(k<3?A:B,1-k/L);x.fillText(ch,i*cs+cs/2,Yp)}}},
bokeh(x,w,h,t){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#141833');g.addColorStop(1,'#0B0D16');x.fillStyle=g;x.fillRect(0,0,w,h);x.save();x.globalCompositeOperation='lighter';
  for(let i=0;i<34;i++){const r=h*(.03+.09*rnd(i)),X=((rnd(i+1)*w+t*w*.02*(rnd(i+2)-.5)*4)%w+w)%w,Yp=rnd(i+3)*h+Math.sin(t*.5+i)*h*.03,al=.12+.25*rnd(i+4)*(.6+.4*Math.sin(t+i));const rg=x.createRadialGradient(X,Yp,r*.6,X,Yp,r);
    const c=[A,B,[255,200,87]][i%3];rg.addColorStop(0,rgb(c,al));rg.addColorStop(1,rgb(c,0));x.fillStyle=rg;x.beginPath();x.arc(X,Yp,r,0,7);x.fill()}x.restore()},
snow(x,w,h,t){const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1A2240');g.addColorStop(1,'#2E3B66');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.9)';
  for(let i=0;i<160;i++){const z=.3+.7*rnd(i),Yp=((rnd(i+1)*h+t*h*.12*z)%(h+10))-5,X=rnd(i+2)*w+Math.sin(t*z*1.5+i)*12*z;x.globalAlpha=.3+.7*z;x.beginPath();x.arc(X,Yp,1+2.2*z,0,7);x.fill()}x.globalAlpha=1},
halftone(x,w,h,t){x.fillStyle='#F2EFE8';x.fillRect(0,0,w,h);const cs=Math.max(8,h/22),lx=w/2+Math.cos(t*.7)*w*.3,ly=h/2+Math.sin(t*.9)*h*.3;x.fillStyle=rgb(A);
  for(let Yp=cs/2;Yp<h;Yp+=cs)for(let X=cs/2+((Yp/cs|0)%2)*cs/2;X<w;X+=cs){const d=Math.hypot(X-lx,Yp-ly)/Math.hypot(w,h),r=cs*.5*cl(1-d*1.8)*(.75+.25*Math.sin(d*30-t*3));if(r>.4){x.beginPath();x.arc(X,Yp,r,0,7);x.fill()}}},
kaleido(x,w,h,t){clear(x,w,h);const R=Math.min(w,h)*.48;x.save();x.translate(w/2,h/2);for(let k=0;k<12;k++){x.save();x.rotate(k*Math.PI/6);if(k%2)x.scale(1,-1);x.beginPath();x.moveTo(0,0);x.arc(0,0,R,0,Math.PI/6);x.closePath();x.clip();
  for(let i=0;i<5;i++){const r=R*(.2+.16*i+.06*Math.sin(t+i)),a=.26+.2*Math.sin(t*.7+i*1.3);x.fillStyle=mix(i/4,.75);x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,R*(.05+.03*Math.sin(t*1.3+i)),0,7);x.fill()}x.restore()}x.restore()},
splitflap(x,w,h,t){clear(x,w,h);const L=['NOW','BOARDING'],CH='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',tt=t%5,cw=Math.min(w*.095,h*.2),chh=cw*1.35;x.font=`700 ${chh*.68}px "JetBrains Mono",monospace`;x.textAlign='center';x.textBaseline='middle';
  L.forEach((s,r)=>{const x0=w/2-s.length*cw*1.08/2,Yp=h*.32+r*chh*1.25;for(let i=0;i<s.length;i++){const X=x0+i*cw*1.08,land=.3+(r*3+i)*.09,ch=tt<land?CH[Math.floor(rnd(i*13+r*7+Math.floor(tt*20))*CH.length)]:s[i];
    x.fillStyle='#232937';rr(x,X,Yp,cw,chh,4);x.fillStyle=tt<land?'rgba(237,239,245,.6)':(r?rgb(A):FG);x.fillText(ch,X+cw/2,Yp+chh/2);x.fillStyle=BG;x.fillRect(X,Yp+chh/2-1,cw,2)}})},
flip3d(x,w,h,t){clear(x,w,h);const s='立體翻轉登場',tt=t%4,n=s.length,fs=Math.min(h*.18,w*.8/n);x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';const sw=fs*1.05,x0=w/2-sw*(n-1)/2;
  for(let i=0;i<n;i++){const p=cl((tt-.2-i*.12)/.6),e=eOB(p),sc=Math.cos((1-e)*Math.PI/2),q=cl((tt-3.3)/.5);x.save();x.translate(x0+i*sw,h/2);x.scale(1,Math.max(.02,sc*(1-q)));x.fillStyle=i>3?rgb(A):`rgba(237,239,245,${.5+.5*sc})`;x.fillText(s[i],0,0);x.restore()}},
echo(x,w,h,t){clear(x,w,h);const P=tt=>[w/2+Math.sin(tt*1.1)*w*.25,h/2+Math.sin(tt*1.7)*h*.22];x.font=`700 ${h*.22}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';
  for(let k=8;k>=0;k--){const [X,Yp]=P(t-k*.06);x.fillStyle=k?mix(k/8,.6*(1-k/9)):FG;x.fillText('ECHO',X,Yp)}},
outlinefill(x,w,h,t){clear(x,w,h);const s='FILL UP',fs=Math.min(h*.3,w*.17),tt=t%4,p=eIO(cl((tt-.6)/2.2))*(1-cl((tt-3.5)/.4));x.font=`700 ${fs}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';
  x.lineWidth=2;x.strokeStyle=FG;x.strokeText(s,w/2,h/2);const top=h/2+fs*.45-p*fs*1.0;x.save();x.beginPath();x.moveTo(0,h);for(let X=0;X<=w;X+=6)x.lineTo(X,top+Math.sin(X*.04+t*5)*fs*.05);x.lineTo(w,h);x.closePath();x.clip();x.fillStyle=rgb(A);x.fillText(s,w/2,h/2);x.restore()},
textpath(x,w,h,t){clear(x,w,h);const s='沿著曲線流動的文字 · FLOW ALONG THE PATH · ',fs=h*.075;x.font=`700 ${fs}px "Noto Sans TC",Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';const Yf=X=>h/2+Math.sin(X*.012+t*1.2)*h*.2;
  x.strokeStyle=rgb(B,.35);x.lineWidth=1;x.beginPath();for(let X=0;X<=w;X+=5)X?x.lineTo(X,Yf(X)):x.moveTo(X,Yf(X));x.stroke();let X=(-(t*50)%(fs*12));for(let i=0;X<w+fs;i++){const ch=s[i%s.length],cw=x.measureText(ch).width,m=X+cw/2,a=Math.atan2(Yf(m+1)-Yf(m-1),2);
    x.save();x.translate(m,Yf(m)-fs*.4);x.rotate(a);x.fillStyle=mix((m/w+1)%1);x.fillText(ch,0,0);x.restore();X+=cw}},
treemap(x,w,h,t){clear(x,w,h);const L=[[0,0,.5,1,'影音 42%',A],[.5,0,.5,.55,'新聞 26%',B],[.5,.55,.25,.45,'社群 19%',[255,200,87]],[.75,.55,.25,.25,'Podcast 8%',[123,216,143]],[.75,.8,.25,.2,'其他 5%',[154,161,179]]],tt=t%4.5,m=w*.04;
  L.forEach(([a,b,c_,d_,l,col],i)=>{const p=eOB(cl((tt-i*.25)/.5)),X=m+a*(w-2*m),Yp=m+b*(h-2*m),W_=c_*(w-2*m),H_=d_*(h-2*m);if(p<=0)return;x.save();x.translate(X+W_/2,Yp+H_/2);x.scale(p,p);x.fillStyle=rgb(col,.9);rr(x,-W_/2+2,-H_/2+2,W_-4,H_-4,6);
    x.fillStyle=BG;x.font=`700 ${Math.min(H_*.18,W_*.12)}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='top';x.fillText(l,-W_/2+10,-H_/2+8);x.restore()})},
heatmap(x,w,h,t){clear(x,w,h);const C=26,R=7,g=Math.min(w*.9/C,h*.7/R),x0=(w-C*g)/2,y0=(h-R*g)/2,n=Math.floor(cl((t%5)/3.5)*C);for(let i=0;i<C;i++)for(let j=0;j<R;j++){const v=rnd(i*7+j),on=i<=n;
  x.fillStyle=on?(v<.25?'#2A3040':v<.5?rgb(A,.35):v<.75?rgb(A,.65):rgb(A)):'#1E2330';rr(x,x0+i*g+1,y0+j*g+1,g-2,g-2,2)}x.fillStyle=FG;x.font=`600 ${h*.06}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='bottom';x.fillText('半年更新紀錄',x0,y0-6)},
funnel(x,w,h,t){clear(x,w,h);const S=[['曝光',10000],['點擊',3200],['加入購物車',900],['下單',240]],tt=t%5,sh=h*.19,top=h*.1;S.forEach(([l,v],i)=>{const p=eOC(cl((tt-i*.4)/.5)),w0=w*(.8-i*.17),w1=w*(.8-(i+1)*.17),Yp=top+i*sh*1.08;if(p<=0)return;
  x.globalAlpha=p;x.fillStyle=mix(1-i/3);x.beginPath();x.moveTo(w/2-w0/2,Yp);x.lineTo(w/2+w0/2,Yp);x.lineTo(w/2+w1/2,Yp+sh);x.lineTo(w/2-w1/2,Yp+sh);x.closePath();x.fill();x.fillStyle=BG;x.font=`700 ${sh*.36}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';
  x.fillText(l+' '+Math.round(v*p).toLocaleString(),w/2,Yp+sh/2);x.globalAlpha=1})},
ecg(x,w,h,t){clear(x,w,h);x.strokeStyle='rgba(111,139,255,.12)';x.lineWidth=1;x.beginPath();for(let X=0;X<w;X+=20){x.moveTo(X,0);x.lineTo(X,h)}for(let Yp=0;Yp<h;Yp+=20){x.moveTo(0,Yp);x.lineTo(w,Yp)}x.stroke();
  const f=u=>{const q=((u%1)+1)%1;return q<.1?Math.sin(q/.1*Math.PI)*.08:q<.14?-(q-.1)/.04*.15:q<.18?-.15+(q-.14)/.04*1.15:q<.22?1-(q-.18)/.04*1.3:q<.26?-.3+(q-.22)/.04*.3:q<.4?0:q<.5?Math.sin((q-.4)/.1*Math.PI)*.18:0},head=(t*.3%1)*w;
  x.strokeStyle=rgb(A);x.lineWidth=2.5;x.shadowColor=rgb(A);x.shadowBlur=10;x.beginPath();for(let X=0;X<=head;X+=2){const Yp=h*.55-f(X/w*3-t*0)*h*.35;X?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke();x.shadowBlur=0;
  x.fillStyle=FG;x.beginPath();x.arc(head,h*.55-f(head/w*3)*h*.35,4,0,7);x.fill();x.font=`700 ${h*.1}px Unbounded,sans-serif`;x.textAlign='right';x.textBaseline='top';x.fillText('72 BPM',w*.95,h*.06)},
oscillo(x,w,h,t){clear(x,w,h);[[A,1,0],[B,.7,1.7],[[255,200,87],.45,3.1]].forEach(([c,amp,ph])=>{x.strokeStyle=rgb(c,.85);x.lineWidth=2;x.beginPath();for(let X=0;X<=w;X+=3){const u=X/w,env=Math.sin(u*Math.PI),Yp=h/2+Math.sin(u*14+t*4+ph)*Math.sin(u*5-t*1.3+ph)*h*.32*amp*env*(.6+.4*Math.sin(t*2+ph));X?x.lineTo(X,Yp):x.moveTo(X,Yp)}x.stroke()})},
speedlines(x,w,h,t){x.fillStyle='#F2EFE8';x.fillRect(0,0,w,h);const k=Math.floor(t*12);x.fillStyle='#161922';for(let i=0;i<70;i++){const a=rnd(i+k*.37)*Math.PI*2,r0=Math.min(w,h)*(.18+.15*rnd(i+k)),r1=Math.hypot(w,h);
  x.beginPath();x.moveTo(w/2+Math.cos(a-.012)*r0,h/2+Math.sin(a-.012)*r0);x.lineTo(w/2+Math.cos(a)*r1,h/2+Math.sin(a)*r1);x.lineTo(w/2+Math.cos(a+.012)*r0,h/2+Math.sin(a+.012)*r0);x.fill()}
  const p=(t%1.6)/1.6,s=1+.5*Math.pow(1-cl(p/.2),3);x.save();x.translate(w/2,h/2);x.scale(s,s);x.rotate(-.06);x.font=`900 ${h*.24}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.lineWidth=h*.03;x.strokeStyle='#161922';x.strokeText('爆！',0,0);x.fillStyle=rgb(A);x.fillText('爆！',0,0);x.restore()},
fireworks(x,w,h,t){x.fillStyle='rgba(10,12,22,1)';x.fillRect(0,0,w,h);for(let b=0;b<4;b++){const T=1.8,tt=(t+b*.45)%T,cyc=Math.floor((t+b*.45)/T),s=cyc*10+b,cx=w*(.2+.6*rnd(s)),cy=h*(.25+.3*rnd(s+1)),col=[A,B,[255,200,87],[123,216,143]][s%4];
  if(tt<.35){x.fillStyle=rgb(col);x.fillRect(cx-1,h-(h-cy)*tt/.35,2,8)}else{const u=tt-.35;for(let i=0;i<40;i++){const a=i/40*Math.PI*2,v=h*.35*(.7+.3*rnd(s*40+i)),X=cx+Math.cos(a)*v*eOC(cl(u/1)),Yp=cy+Math.sin(a)*v*eOC(cl(u/1))+u*u*h*.12;
    x.fillStyle=rgb(col,cl(1-u/1.4));x.beginPath();x.arc(X,Yp,1.8,0,7);x.fill()}}}},
sticker(x,w,h,t){clear(x,w,h);const tt=t%3,p=cl(tt/.6),e=p<1?1+Math.sin(p*Math.PI*3)*Math.exp(-p*4)*.6-.4*(1-p)*(1-p):1,r=Math.min(w,h)*.26;x.save();x.translate(w/2,h/2);x.rotate(-.2+Math.sin(tt*6)*.1*Math.exp(-tt*2));x.scale(e,e);
  x.fillStyle=rgb(A);x.beginPath();for(let i=0;i<24;i++){const a=i/24*Math.PI*2,rr_=i%2?r:r*1.12;x.lineTo(Math.cos(a)*rr_,Math.sin(a)*rr_)}x.closePath();x.fill();x.lineWidth=4;x.strokeStyle=FG;x.stroke();
  x.fillStyle=FG;x.font=`900 ${r*.48}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.fillText('NEW!',0,0);x.restore();for(let i=0;i<6;i++){const a=i/6*Math.PI*2+t,d=r*1.5,q=Math.sin(t*4+i)*.5+.5;x.fillStyle=`rgba(255,200,87,${q})`;x.beginPath();x.arc(w/2+Math.cos(a)*d,h/2+Math.sin(a)*d,3,0,7);x.fill()}},
arrow(x,w,h,t){scene(x,w,h,'#1B2233','rgba(237,239,245,.12)','');const tt=t%4,p=eOC(cl((tt-.3)/1)),bx=w*.68,by=h*.5,bw=w*.2,bh=h*.22;x.fillStyle='#2A3040';rr(x,bx-bw/2,by-bh/2,bw,bh,8);x.fillStyle=FG;x.font=`700 ${bh*.3}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillText('點這裡',bx,by);
  const P=u=>[w*.15+(bx-bw*.6-w*.15)*u,h*.78-Math.sin(u*Math.PI)*h*.4+(by-h*.78)*u*u];x.strokeStyle=rgb(A);x.lineWidth=4;x.lineCap='round';x.beginPath();for(let u=0;u<=p;u+=.02){const q=P(u);u?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke();
  if(p>.98){const a=P(1),b=P(.95),ang=Math.atan2(a[1]-b[1],a[0]-b[0]);x.beginPath();x.moveTo(a[0]-Math.cos(ang-.5)*16,a[1]-Math.sin(ang-.5)*16);x.lineTo(a[0],a[1]);x.lineTo(a[0]-Math.cos(ang+.5)*16,a[1]-Math.sin(ang+.5)*16);x.stroke();
    const q=cl((tt-1.4)/.6);x.globalAlpha=1-q;x.beginPath();x.ellipse(bx,by,bw*.6*(1+q*.3),bh*.75*(1+q*.3),0,0,7);x.stroke();x.globalAlpha=1}x.lineCap='butt'},
cursor(x,w,h,t){scene(x,w,h,'#F2EFE8','rgba(22,25,34,.06)','');const tt=t%4,bx=w*.62,by=h*.58,bw=w*.28,bh=h*.16,clicked=tt>1.6,p=eIO(cl(tt/1.4)),cx=w*.15+(bx-w*.15)*p,cy=h*.2+(by-h*.2)*p;
  x.fillStyle=clicked?'#2A3040':rgb(A);rr(x,bx-bw/2,by-bh/2+(tt>1.5&&tt<1.7?2:0),bw,bh,bh/2);x.fillStyle='#fff';x.font=`700 ${bh*.38}px "Noto Sans TC"`;x.textAlign='center';x.textBaseline='middle';x.fillText(clicked?'已訂閱 ✓':'訂閱',bx,by);
  const q=cl((tt-1.5)/.5);if(q>0&&q<1){x.strokeStyle=rgb(A,1-q);x.lineWidth=3;x.beginPath();x.arc(cx,cy,10+q*30,0,7);x.stroke()}x.save();x.translate(cx,cy);x.fillStyle='#161922';x.strokeStyle='#fff';x.lineWidth=1.5;x.beginPath();x.moveTo(0,0);x.lineTo(0,22);x.lineTo(6,17);x.lineTo(10,26);x.lineTo(14,24);x.lineTo(10,15);x.lineTo(17,15);x.closePath();x.fill();x.stroke();x.restore()},
pricetag(x,w,h,t){clear(x,w,h);const tt=t%4.5,fs=h*.14;x.textAlign='center';x.textBaseline='middle';x.font=`500 ${fs}px Unbounded,sans-serif`;x.fillStyle='rgba(237,239,245,.6)';x.fillText('$2,980',w*.4,h*.38);
  const p=eOC(cl((tt-.5)/.4)),tw=x.measureText('$2,980').width;x.strokeStyle=rgb(A);x.lineWidth=4;x.beginPath();x.moveTo(w*.4-tw/2-6,h*.38);x.lineTo(w*.4-tw/2-6+(tw+12)*p,h*.38);x.stroke();
  const q=eOB(cl((tt-1.1)/.5));x.save();x.translate(w*.4,h*.62);x.scale(q,q);x.font=`700 ${fs*1.5}px Unbounded,sans-serif`;x.fillStyle=Y;x.fillText('$1,780',0,0);x.restore();
  const sw=Math.sin(tt*5)*Math.exp(-Math.max(0,tt-1.6)*1.5)*.4,r=cl((tt-1.6)/.3);if(r>0){x.save();x.translate(w*.78,h*.18);x.rotate(.3+sw);x.globalAlpha=r;x.strokeStyle=FG;x.lineWidth=1.5;x.beginPath();x.moveTo(0,-h*.12);x.lineTo(0,0);x.stroke();x.fillStyle=rgb(A);rr(x,-w*.09,0,w*.18,h*.22,8);x.fillStyle=FG;x.font=`900 ${h*.07}px Unbounded,sans-serif`;x.fillText('SALE',0,h*.07);x.fillText('-40%',0,h*.15);x.restore()}},
quote(x,w,h,t){clear(x,w,h);const tt=t%5,p=eOB(cl(tt/.5));x.save();x.translate(w*.14,h*.3);x.scale(p,p);x.fillStyle=rgb(A);x.font=`900 ${h*.45}px Georgia,serif`;x.textAlign='left';x.textBaseline='middle';x.fillText('“',-w*.03,0);x.restore();
  const L=['好的設計是','讓人看不見設計'],fs=h*.11;L.forEach((s,i)=>{const q=eOC(cl((tt-.5-i*.4)/.6));x.save();x.beginPath();x.rect(0,h*.38+i*fs*1.4-fs*.7,w,fs*1.4);x.clip();x.fillStyle=FG;x.font=`900 ${fs}px "Noto Sans TC"`;x.textAlign='left';x.textBaseline='middle';x.fillText(s,w*.2,h*.38+i*fs*1.4+(1-q)*fs*1.3);x.restore()});
  const r=cl((tt-1.6)/.5);x.globalAlpha=r;x.fillStyle=rgb(A);x.fillRect(w*.2,h*.8,w*.06*r,2);x.fillStyle='rgba(237,239,245,.7)';x.font=`500 ${fs*.45}px "Noto Sans TC"`;x.fillText('— 設計師 迪特・拉姆斯',w*.28,h*.8);x.globalAlpha=1},
letterbox(x,w,h,t){const tt=t%5,s=1.02+.04*(tt/5);x.save();x.translate(w/2,h/2);x.scale(s,s);x.translate(-w/2,-h/2);DRAW.parallax(x,w,h,t);x.restore();const bar=h*.5*(1-1/2.39*w/h)*0+h*.13*eIO(cl(tt/.8));x.fillStyle='#000';x.fillRect(0,0,w,bar);x.fillRect(0,h-bar,w,bar);
  const q=cl((tt-1)/.8)*(1-cl((tt-4.3)/.5));x.globalAlpha=q;x.fillStyle=FG;x.font=`500 ${h*.06}px Unbounded,sans-serif`;x.textAlign='center';x.textBaseline='middle';x.letterSpacing&&(x.letterSpacing='6px');x.fillText('A FILM BY YOU',w/2,h-bar/2);x.letterSpacing&&(x.letterSpacing='0px');x.globalAlpha=1},
laserwipe(x,w,h,t){const p=eIO(cl(((t%2.6)-.5)/1.4)),Yp=p*h;scene(x,w,h,BG,FG,'SCENE 1');x.save();x.beginPath();x.rect(0,0,w,Yp);x.clip();scene(x,w,h,rgb(A),BG,'SCENE 2');x.restore();
  if(p>0&&p<1){const g=x.createLinearGradient(0,Yp-24,0,Yp+24);g.addColorStop(0,'rgba(111,139,255,0)');g.addColorStop(.5,'rgba(200,220,255,.9)');g.addColorStop(1,'rgba(111,139,255,0)');x.fillStyle=g;x.fillRect(0,Yp-24,w,48);x.fillStyle='#fff';x.fillRect(0,Yp-1,w,2)}},
pageturn(x,w,h,t){const p=eIO(cl(((t%2.6)-.5)/1.4)),fx=w*(1-p);scene(x,w,h,rgb(A),BG,'SCENE 2');x.save();x.beginPath();x.rect(0,0,fx,h);x.clip();scene(x,w,h,BG,FG,'SCENE 1');x.restore();
  if(p>0&&p<1){const fw=Math.min(w-fx,fx)*.5+w*.05*(1-p);const g=x.createLinearGradient(fx-fw,0,fx,0);g.addColorStop(0,'#C9CCD6');g.addColorStop(1,'#F5F6FA');x.fillStyle=g;x.fillRect(fx-fw,0,fw,h);
    const sh=x.createLinearGradient(fx,0,fx+30,0);sh.addColorStop(0,'rgba(0,0,0,.45)');sh.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=sh;x.fillRect(fx,0,30,h)}},
/* 1. 火花漣漪：一點火花脹成光球，下方水面橢圓漣漪一圈圈擴散。循環 6 秒 */
sparkring(x,w,h,t){clear(x,w,h);const tt=t%6,cx=w/2,cy=h*.44,m=Math.min(w,h),R=m*.045,
  ig=eOB(cl((tt-.25)/.9)),a=1-cl((tt-5.3)/.6),gy=cy+R*2.6;
  const pool=x.createRadialGradient(0,0,0,0,0,m*.55);pool.addColorStop(0,rgb(A,.28*ig*a));pool.addColorStop(1,rgb(A,0));
  x.save();x.translate(cx,gy);x.scale(1,.26);x.fillStyle=pool;x.beginPath();x.arc(0,0,m*.55,0,7);x.fill();x.restore();
  for(let i=0;i<6;i++){const p=(tt-1.1-i*.55)/3.4;if(p<=0||p>=1)continue;const rx=m*(.07+.46*eOC(p)),al=(1-p)*(1-p)*a;
    x.strokeStyle=mix(.35+.6*(1-p),al*.95);x.lineWidth=.8+2.2*(1-p);x.beginPath();x.ellipse(cx,gy,rx,rx*.26,0,0,7);x.stroke()}
  for(let k=0;k<12;k++){const u=(tt*.45+k/12)%1,sx=cx+(rnd(k*3.7)-.5)*R*7*u,sy=cy-R*.6-u*h*.13;
    x.fillStyle=`rgba(255,226,190,${(1-u)*ig*a*.9})`;x.beginPath();x.arc(sx,sy,1.2+rnd(k)*1.8,0,7);x.fill()}
  const r=R*ig*(1+.06*Math.sin(tt*6)),g=x.createRadialGradient(cx,cy,0,cx,cy,Math.max(1,r*5));
  g.addColorStop(0,`rgba(255,220,180,${.95*ig*a})`);g.addColorStop(.3,rgb(A,.38*ig*a));g.addColorStop(1,rgb(A,0));
  x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle=`rgba(255,246,230,${ig*a})`;x.beginPath();x.arc(cx,cy,Math.max(.1,r*.55),0,7);x.fill();
  const tx=cl((tt-1.2)/.5)*(1-cl((tt-5.2)/.5));x.globalAlpha=tx;x.fillStyle=FG;x.font=`500 ${m*.042}px "Noto Sans TC",sans-serif`;
  x.textAlign='center';x.textBaseline='middle';x.fillText('先有一點火花',cx,h*.7);x.globalAlpha=1},

/* 2. 發光卡片倒影：漸層細條展開成卡片，下方有淡出的倒影。循環 6 秒 */
glowcard(x,w,h,t){clear(x,w,h);const tt=t%6,m=Math.min(w,h),cw=Math.min(w*.82,m*1.5),chF=Math.min(h*.2,cw*.42),cx=w/2,cyTop=h*.38;
  const pw=eOB(cl((tt-.2)/.7)),ph=eOB(cl((tt-.7)/.8)),ct=cl((tt-1.5)/.5),out=1-eIO(cl((tt-5.1)/.7)),fl=Math.sin(tt*2.2)*h*.006;
  const bw=cw*cl(pw),bh=Math.max(chF*.07,chF*cl(ph))*out+0.01,top=cyTop+fl+(chF-bh)/2;
  const draw=(ref)=>{const g=x.createLinearGradient(cx-bw/2,0,cx+bw/2,0);g.addColorStop(0,'#FF5E7A');g.addColorStop(.55,'#FF7A55');g.addColorStop(1,'#FFA84C');
    x.fillStyle=g;rr(x,cx-bw/2,top,bw,bh,Math.min(bh/2,chF*.28));
    if(bh>chF*.4){x.save();x.globalAlpha=ct*out;const ic=bh*.15,ix=cx-bw/2+chF*.34,iy=top+bh/2;x.strokeStyle='#fff';x.lineWidth=ic*.34;x.lineCap='round';
      for(let k=0;k<3;k++){const an=k*Math.PI/3;x.beginPath();x.moveTo(ix-Math.cos(an)*ic,iy-Math.sin(an)*ic);x.lineTo(ix+Math.cos(an)*ic,iy+Math.sin(an)*ic);x.stroke()}
      x.fillStyle='#fff';x.textAlign='left';x.textBaseline='middle';x.font=`700 ${bh*.25}px "Noto Sans TC",sans-serif`;x.fillText('功能詳情',ix+ic*2,top+bh*.4);
      x.fillStyle='rgba(255,255,255,.75)';x.font=`400 ${bh*.15}px "Noto Sans TC",sans-serif`;x.fillText('重點一眼看懂',ix+ic*2,top+bh*.66);x.restore()}
    if(!ref&&bh>chF*.3){x.save();x.globalAlpha=.55*out;x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=1.4;x.beginPath();
      x.roundRect?x.roundRect(cx-bw/2+.7,top+.7,bw-1.4,bh-1.4,Math.min(bh/2,chF*.28)):x.rect(cx-bw/2,top,bw,bh);x.stroke();x.restore()}};
  x.save();x.shadowColor=rgb(A,.55*out);x.shadowBlur=h*.05*(.8+.2*Math.sin(tt*3));draw(false);x.restore();
  const base=top+bh;x.save();x.beginPath();x.rect(0,base+h*.012,w,h);x.clip();x.translate(0,(base+h*.012)*2-0);x.scale(1,-1);x.globalAlpha=.5;draw(true);x.restore();
  const fy=base+h*.012,fg=x.createLinearGradient(0,fy,0,fy+chF*.75);fg.addColorStop(0,rgb([18,21,29],.2));fg.addColorStop(1,rgb([18,21,29],1));
  x.fillStyle=fg;x.fillRect(0,fy,w,chF*.8)},

/* 3. 膠囊串連：米白底，黑色膠囊節點用一條垂掛細線依序串起。循環 7.5 秒 */
pillchain(x,w,h,t){const tt=t%7.5,m=Math.min(w,h),CR='#F6EFE6',INK='#1C1814',out=1-cl((tt-6.7)/.6);
  x.fillStyle=CR;x.fillRect(0,0,w,h);const gl=x.createRadialGradient(w/2,h*.95,0,w/2,h*.95,h*.55);gl.addColorStop(0,'rgba(255,196,150,.55)');gl.addColorStop(1,'rgba(255,196,150,0)');x.fillStyle=gl;x.fillRect(0,0,w,h);
  const N=[['先想',.32,.3],['再做',.68,.5],['上線',.36,.7]],fs=Math.min(h*.03,w*.062),ph=fs*2.5;x.font=`700 ${fs}px "Noto Sans TC",sans-serif`;
  const P=N.map((n,i)=>({s:n[0],x:w*n[1],y:h*n[2]+Math.sin(tt*1.6+i*2)*h*.004,w:x.measureText(n[0]).width+fs*3.1,p:eOB(cl((tt-.3-i*1.5)/.55))*out}));
  x.globalAlpha=out;
  for(let i=0;i<2;i++){const a=P[i],b=P[i+1],dr=cl((tt-.8-i*1.5)/.8),sw=Math.sin(tt*1.4+i)*w*.02,
    X0=a.x,Y0=a.y+ph/2,X1=b.x,Y1=b.y-ph/2,c1x=X0+sw,c1y=Y0+(Y1-Y0)*.7,c2x=X1-sw,c2y=Y1-(Y1-Y0)*.7,bz=u=>{const v=1-u;return[v*v*v*X0+3*v*v*u*c1x+3*v*u*u*c2x+u*u*u*X1,v*v*v*Y0+3*v*v*u*c1y+3*v*u*u*c2y+u*u*u*Y1]};
    if(dr<=0)continue;x.strokeStyle=INK;x.lineWidth=2;x.lineCap='round';x.beginPath();for(let u=0;u<=dr+1e-6;u+=.02){const q=bz(Math.min(u,dr));u?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1])}x.stroke();
    if(dr<1){const q=bz(dr);x.fillStyle=rgb(A);x.beginPath();x.arc(q[0],q[1],4.5,0,7);x.fill()}}
  P.forEach((q,i)=>{if(q.p<=0)return;const last=i===2;x.save();x.translate(q.x,q.y);x.scale(q.p,q.p);x.fillStyle=last?rgb(A):INK;rr(x,-q.w/2,-ph/2,q.w,ph,ph/2);
    x.fillStyle=last?'#fff':rgb(A);x.beginPath();x.arc(-q.w/2+ph*.5,0,ph*.15,0,7);x.fill();
    x.fillStyle=last?'#fff':CR;x.font=`700 ${fs}px "Noto Sans TC",sans-serif`;x.textAlign='left';x.textBaseline='middle';x.fillText(q.s,-q.w/2+ph*.85,1);x.restore()});
  x.globalAlpha=1},
cmb_launch(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','starfield',d,1,'source-over');LY(x,w,h,t,st,'b','perspgrid',d,.55);LY(x,w,h,t,st,'c','scramble',d,1);GRV(x,w,h,t,.05,.5)},
cmb_platform(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','perspgrid',d,.5,'source-over');LY(x,w,h,t,st,'b','carousel',d,.85);LY(x,w,h,t,st,'c','beatslam',d,1);GRV(x,w,h,t,.04,.45)},
cmb_globe(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','aurora',d,.55,'source-over');LY(x,w,h,t,st,'b','sphere',d,.45);LY(x,w,h,t,st,'c','wireglobe',d,1);GRV(x,w,h,t,.03,.5)},
cmb_ai(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','neural',d,.55,'source-over');LY(x,w,h,t,st,'b','ascii',d,.35);LY(x,w,h,t,st,'c','typewriter',d,1)},
cmb_milestone(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','grid',d,.3,'source-over');LY(x,w,h,t,st,'b','burst',d,.55);LY(x,w,h,t,st,'c','odometer',d,1);GRV(x,w,h,t,.03,.4)},
cmb_podcast(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','aurora',d,.5,'source-over');LY(x,w,h,t,st,'b','audio',d,.6);LY(x,w,h,t,st,'c','karaoke',d,1)},
cmb_luxury(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','blob',d,.35,'source-over');LY(x,w,h,t,st,'b','maskrise',d,1);LY(x,w,h,t,st,'c','bokeh',d,.45,'screen');GRV(x,w,h,t,.05,.6)},
cmb_social(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','plexus',d,.4,'source-over');LY(x,w,h,t,st,'b','heroorbit',d,1);LY(x,w,h,t,st,'c','notify',d,.55,'lighten')},
cmb_retro(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','perspgrid',d,1,'source-over');LY(x,w,h,t,st,'b','glitch',d,.95);GRV(x,w,h,t,.08,.6);x.fillStyle='rgba(0,0,0,.18)';for(let Yp=0;Yp<h;Yp+=3)x.fillRect(0,Yp,w,1)},
cmb_finance(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','plexus',d,.3,'source-over');LY(x,w,h,t,st,'b','candle',d,1);LY(x,w,h,t,st,'c','hud',d,.6)},
cmb_journey(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','ripple',d,.35,'source-over');LY(x,w,h,t,st,'b','routemap',d,1);LY(x,w,h,t,st,'c','bokeh',d,.3,'screen')},
cmb_recap(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','mosaic',d,1,'source-over');LY(x,w,h,t,st,'b','confetti',d,.9);GRV(x,w,h,t,.03,.4)},
cmb_hook(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','tunnel',d,.7,'source-over');LY(x,w,h,t,st,'b','speedlines',d,.18,'screen');LY(x,w,h,t,st,'c','camshake',d,1)},
cmb_cozy(x,w,h,t,st,c,d){LY(x,w,h,t,st,'a','kenburns',d,1,'source-over');LY(x,w,h,t,st,'b','snow',d,.5,'screen');LY(x,w,h,t,st,'c','bokeh',d,.3,'screen');GRV(x,w,h,t,.05,.5)},
kpitrend(x,w,h,t){uiBg(x,w,h);const tt=t%5,cw=w*.62,ch=h*.78,X=w/2-cw/2,Yp=h*.11;uiCard(x,X,Yp,cw,ch,16);uiText(x,'Weekly sign-ups',X+cw*.07,Yp+ch*.1,h*.05,'#5B6274',600,'left');
  const v=Math.round(200*eOC(cl(tt/1.8)));x.fillStyle='#DDF5E6';rr(x,X+cw*.07,Yp+ch*.18,cw*.42,ch*.16,ch*.08);uiText(x,'+'+v+'%',X+cw*.28,Yp+ch*.26,ch*.11,'#167A3E',800);
  const n=7,bx=X+cw*.07,bw=cw*.86/n,base=Yp+ch*.9,mh=ch*.46;for(let i=0;i<n;i++){const p=eOB(cl((tt-.3-i*.12)/.6)),hh=mh*(.2+.8*i/(n-1))*p,g=x.createLinearGradient(0,base-hh,0,base);g.addColorStop(0,'#5B8CFF');g.addColorStop(1,UI_B);x.fillStyle=g;rr(x,bx+i*bw+bw*.12,base-hh,bw*.76,hh,5)}
  const lp=cl((tt-1.2)/1.2);x.strokeStyle=UI_G;x.lineWidth=3;x.lineCap='round';x.beginPath();for(let i=0;i<n;i++){if(i/(n-1)>lp)break;const px=bx+i*bw+bw/2,py=base-mh*(.2+.8*i/(n-1))-9;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.lineCap='butt'},
pricetoggle(x,w,h,t){uiBg(x,w,h);const tt=t%5,sw=eIO(cl((tt-1.2)/.5))-eIO(cl((tt-3.6)/.5)),cw=w*.5,ch=h*.74,X=w/2-cw/2,Yp=h*.13;uiCard(x,X,Yp,cw,ch,18);
  const tw=cw*.72,tx=w/2-tw/2,ty=Yp+ch*.1,th=ch*.13;x.fillStyle='#E6E9F2';rr(x,tx,ty,tw,th,th/2);x.save();x.shadowColor='rgba(0,0,0,.2)';x.shadowBlur=6;x.fillStyle='#fff';rr(x,tx+3+(tw/2-3)*sw,ty+3,tw/2-3,th-6,(th-6)/2);x.restore();
  uiText(x,'Monthly',tx+tw*.25,ty+th/2,th*.4,sw<.5?UI_INK:'#8A91A4',700);uiText(x,'Yearly',tx+tw*.75,ty+th/2,th*.4,sw>.5?UI_INK:'#8A91A4',700);
  uiText(x,'Pro',w/2,Yp+ch*.42,h*.055,'#5B6274',700);uiText(x,'$'+Math.round(29+261*sw),w/2,Yp+ch*.64,h*.17,UI_INK,800);
  x.globalAlpha=cl(sw);x.fillStyle='#DDF5E6';rr(x,w/2-cw*.26,Yp+ch*.8,cw*.52,ch*.11,ch*.055);uiText(x,'2 months free',w/2,Yp+ch*.855,ch*.055,'#167A3E',700);x.globalAlpha=1},
island(x,w,h,t){uiBg(x,w,h);const pw=w*.34,ph=h*.92,X=w/2-pw/2,Yp=h*.04;x.fillStyle='#D9DDE8';rr(x,X,Yp,pw,ph,pw*.14);const g=x.createLinearGradient(X,Yp,X+pw,Yp+ph);g.addColorStop(0,'#FFD9C9');g.addColorStop(.5,'#E4D8FF');g.addColorStop(1,'#CFE0FF');x.fillStyle=g;rr(x,X+4,Yp+4,pw-8,ph-8,pw*.12);
  const tt=t%5,e=Math.max(0,eOB(cl((tt-.6)/.6))-eIO(cl((tt-3.6)/.5))),iw=pw*(.28+.5*e),ih=ph*(.045+.12*e),ix=w/2-iw/2,iy=Yp+ph*.03;x.fillStyle='#000';rr(x,ix,iy,iw,ih,Math.min(iw,ih)/2);
  if(e>.6){x.globalAlpha=cl((e-.6)/.4);x.fillStyle='#FF3B30';x.beginPath();x.arc(ix+iw*.13,iy+ih*.36,ih*.09*(1+.3*Math.sin(t*8)),0,7);x.fill();uiText(x,'LIVE',w/2,iy+ih*.36,ih*.3,'#fff',800);uiText(x,'Webinar starts now',w/2,iy+ih*.74,ih*.12,'rgba(255,255,255,.7)',500);x.globalAlpha=1}
  [UI_B,'#2A2F3B','#FFC857','#FF6A4D'].forEach((c,k)=>{x.fillStyle=c;rr(x,X+pw*(.1+k*.22),Yp+ph*.84,pw*.18,pw*.18,pw*.045)})},
particlefunnel(x,w,h,t){uiBg(x,w,h);const cx=w/2,top=h*.1,neck=h*.5,bot=h*.64,fw=w*.34,nw=w*.035,tt=t%5;x.fillStyle='rgba(59,107,255,.10)';x.beginPath();x.moveTo(cx-fw,top);x.lineTo(cx+fw,top);x.lineTo(cx+nw,neck);x.lineTo(cx+nw,bot);x.lineTo(cx-nw,bot);x.lineTo(cx-nw,neck);x.closePath();x.fill();
  for(let i=0;i<110;i++){const ph=(t*.45+rnd(i))%1,yy=top+(bot-top)*ph,u=cl((yy-top)/(neck-top)),half=fw*(1-u)+nw*u,xx=cx+(rnd(i+9)-.5)*1.9*half;x.fillStyle=UI_B;x.globalAlpha=.35+.65*rnd(i+5);x.beginPath();x.arc(xx,yy,1.4+1.4*rnd(i+3),0,7);x.fill()}x.globalAlpha=1;
  const v=Math.round(600*eOC(cl(tt/3.5)));uiCard(x,cx-w*.15,h*.72,w*.3,h*.2,12);uiText(x,String(v),cx-w*.035,h*.82,h*.1,UI_INK,800);uiText(x,'sales',cx+w*.085,h*.84,h*.045,'#8A91A4',600)},
buttondone(x,w,h,t){uiBg(x,w,h);const tt=t%4,s=h/190,H0=h*.2,W0=w*.34,p=eIO(cl((tt-1.25)/.45))*(1-eIO(cl((tt-3.4)/.4))),bw=W0+(H0*1.05-W0)*p,press=(tt>1.05&&tt<1.3)?.94:1;
  x.save();x.translate(w/2,h/2);x.scale(press,press);x.shadowColor=p>.5?'rgba(45,190,96,.45)':'rgba(59,107,255,.45)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle=p>.5?UI_G:UI_B;rr(x,-bw/2,-H0/2,bw,H0,H0/2);x.restore();
  if(p<.5){x.globalAlpha=1-p*2;uiText(x,'Publish',w/2,h/2,H0*.4,'#fff',700);x.globalAlpha=1}else{const c=cl((tt-1.6)/.4),X=w/2-H0*.2;x.strokeStyle='#fff';x.lineWidth=H0*.09;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(X,h/2);x.lineTo(X+H0*.14*Math.min(1,c*2),h/2+H0*.14*Math.min(1,c*2));if(c>.5)x.lineTo(X+H0*.14+H0*.3*(c-.5)*2,h/2+H0*.14-H0*.34*(c-.5)*2);x.stroke();x.lineCap='butt'}
  const q=cl((tt-1.7)/.8);if(q>0&&q<1){x.strokeStyle=`rgba(45,190,96,${1-q})`;x.lineWidth=3;x.beginPath();x.arc(w/2,h/2,H0*.55+q*H0*.8,0,7);x.stroke()}
  const cp=eIO(cl(tt/1.0));if(tt<2.4)uiCursor(x,w*.78+(w/2+W0*.2-w*.78)*cp,h*.85+(h/2+H0*.15-h*.85)*cp,s)},
paybutton(x,w,h,t){uiBg(x,w,h);const tt=t%5,H0=h*.2,W0=w*.42,a=eIO(cl((tt-1.3)/.4)),b=eIO(cl((tt-2.7)/.4)),k=a-b,bw=W0+(H0-W0)*k,al=Math.min(cl(tt/.3),1-cl((tt-4.4)/.3)),press=(tt>1.1&&tt<1.35)?.95:1;
  x.globalAlpha=al;x.save();x.translate(w/2,h/2);x.scale(press,press);x.shadowColor='rgba(80,70,220,.4)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle=b>.5?UI_G:'#5B4BFF';rr(x,-bw/2,-H0/2,bw,H0,H0/2);x.restore();
  if(k<.25&&b<.5){x.globalAlpha=al*(1-k*4);uiText(x,'Pay $48.00',w/2,h/2,H0*.36,'#fff',700);x.globalAlpha=al}else if(tt<2.7&&k>.75){x.strokeStyle='#fff';x.lineWidth=H0*.08;x.lineCap='round';x.beginPath();x.arc(w/2,h/2,H0*.25,t*7,t*7+4.2);x.stroke();x.lineCap='butt'}
  if(b>.5){const c=cl((tt-3.0)/.4),X=w/2-W0*.2;x.strokeStyle='#fff';x.lineWidth=H0*.08;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(X,h/2);x.lineTo(X+H0*.12*Math.min(1,c*2),h/2+H0*.12*Math.min(1,c*2));if(c>.5)x.lineTo(X+H0*.12+H0*.26*(c-.5)*2,h/2+H0*.12-H0*.3*(c-.5)*2);x.stroke();x.lineCap='butt';uiText(x,'Paid',w/2+W0*.08,h/2,H0*.4,'#fff',700)}
  if(tt<1.3){const q=eIO(cl(tt/1));uiCursor(x,w*.75+(w*.55-w*.75)*q,h*.85+(h*.55-h*.85)*q,h/190)}x.globalAlpha=1},
sketchapp(x,w,h,t){uiBg(x,w,h);const tt=t%6,p=eIO(cl((tt-.9)/1.6))*(1-eIO(cl((tt-4.8)/.8))),pw=w*.34,ph=h*.9,X=w/2-pw/2,Yp=h*.05,R=pw*.27,cx=w/2,cy=Yp+ph*.4;
  const sr=(a,b,c,d,r)=>{x.beginPath();x.roundRect?x.roundRect(a,b,c,d,r):x.rect(a,b,c,d);x.stroke()};
  x.save();x.globalAlpha=Math.max(0,1-p*.9);x.strokeStyle='#8A91A4';x.lineWidth=1.4;x.setLineDash([5,4]);sr(X,Yp,pw,ph,pw*.12);sr(X+pw*.1,Yp+ph*.07,pw*.5,ph*.04,3);x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();sr(X+pw*.1,Yp+ph*.66,pw*.38,ph*.2,8);sr(X+pw*.52,Yp+ph*.66,pw*.38,ph*.2,8);x.restore();
  x.save();x.globalAlpha=p;uiCard(x,X,Yp,pw,ph,pw*.12);uiText(x,'Daily Focus',X+pw*.1,Yp+ph*.09,ph*.045,UI_INK,700,'left');x.lineWidth=R*.18;x.strokeStyle='#E3E8F5';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();x.strokeStyle=UI_B;x.lineCap='round';x.beginPath();x.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*.86*p);x.stroke();x.lineCap='butt';uiText(x,Math.round(86*p)+'%',cx,cy,R*.5,UI_INK,800);
  [['Sleep','3h 40m'],['Streak','12']].forEach(([a,b],i)=>{const bx=X+pw*(.1+i*.42),by=Yp+ph*.66;x.fillStyle='#F2F4FA';rr(x,bx,by,pw*.38,ph*.2,8);uiText(x,a,bx+pw*.04,by+ph*.06,ph*.032,'#8A91A4',600,'left');uiText(x,b,bx+pw*.04,by+ph*.14,ph*.065,UI_INK,800,'left')});x.restore()},
calendardrag(x,w,h,t){uiBg(x,w,h);const tt=t%6,cw=w*.62,ch=h*.84,X=w/2-cw/2,Yp=h*.08;uiCard(x,X,Yp,cw,ch,14);const c0=X+cw*.18,colw=cw*.38;
  uiText(x,'Mon',c0+colw*.05,Yp+ch*.1,ch*.045,'#8A91A4',600,'left');uiText(x,'16',c0+colw*.3,Yp+ch*.1,ch*.09,UI_INK,800,'left');uiText(x,'Tue',c0+colw+colw*.05,Yp+ch*.1,ch*.045,'#8A91A4',600,'left');uiText(x,'17',c0+colw+colw*.3,Yp+ch*.1,ch*.09,'#8A91A4',800,'left');
  x.strokeStyle='#E6E9F2';x.lineWidth=1;for(let i=0;i<5;i++){const yy=Yp+ch*(.24+i*.15);x.beginPath();x.moveTo(X+cw*.05,yy);x.lineTo(X+cw*.95,yy);x.stroke();uiText(x,(9+i)+':00',X+cw*.05,yy+ch*.035,ch*.035,'#A0A7BA',500,'left')}
  const d=eIO(cl((tt-1.3)/1.2))*(1-eIO(cl((tt-4.8)/.8))),bw=colw*.9,bh=ch*.13,bx=c0+colw*.02+colw*d,by=Yp+ch*(.27+.3*d),booked=tt>2.6&&tt<4.9,mv=d>0&&d<1;
  x.save();x.shadowColor='rgba(120,80,220,.35)';x.shadowBlur=mv?14:6;x.shadowOffsetY=mv?8:2;x.fillStyle=booked?UI_G:'#8B5CF6';rr(x,bx,by,bw,bh,8);x.restore();uiText(x,booked?'Booked ✓':'Call with Sam',bx+bw*.08,by+bh/2,bh*.36,'#fff',700,'left');
  if(tt<3.2){const q=eIO(cl(tt/1.3)),px=tt<1.3?w*.9+(c0+colw*.5-w*.9)*q:bx+bw*.5,py=tt<1.3?h*.95+(Yp+ch*.33-h*.95)*q:by+bh*.5;uiCursor(x,px,py,h/190)}},
ringclose(x,w,h,t){uiBg(x,w,h);const tt=t%5,cx=w/2,cy=h/2,R=h*.3,p=eOC(cl((tt-.3)/2.2)),done=cl((tt-2.5)/.4),Lw=R*.28;x.lineWidth=Lw;x.strokeStyle='#D8F0E0';x.beginPath();x.arc(cx,cy,R,0,7);x.stroke();
  x.strokeStyle=UI_G;x.lineCap='round';x.beginPath();x.arc(cx,cy,R,-Math.PI/2,-Math.PI/2+Math.PI*2*p);x.stroke();x.lineCap='butt';
  if(done>0){const e=eOB(done),f=Math.min(1,e);x.fillStyle=UI_G;x.beginPath();x.arc(cx,cy,(R-Lw*.5)*f,0,7);x.fill();uiText(x,'Goal',cx,cy-R*.14,R*.34*f,'#fff',800);uiText(x,'hit',cx,cy+R*.22,R*.34*f,'#fff',800);
    const q=eOC(cl((tt-2.5)/1));for(let i=0;i<10;i++){const a=i/10*Math.PI*2,dd=R*(1.25+.5*q);x.fillStyle=`rgba(45,190,96,${1-q})`;x.beginPath();x.arc(cx+Math.cos(a)*dd,cy+Math.sin(a)*dd,3*(1-q)+1,0,7);x.fill()}}else uiText(x,Math.round(p*100)+'%',cx,cy,R*.5,UI_INK,800)},
dockmagnify(x,w,h,t){uiBg(x,w,h);const tt=t%6,n=7,s0=h*.1,gap=s0*.28,mx=w*(.5+.27*Math.sin(t*.9)),C=['#FF6A4D','#2A2F3B','#FFC857','#3B6BFF','#2DBE60','#8B5CF6','#E1306C'],base=[];let acc=0;for(let i=0;i<n;i++){base.push(acc+s0/2);acc+=s0+gap}
  const tot0=acc-gap,bx0=w/2-tot0/2,sizes=base.map(b=>s0*(1+.85*Math.exp(-Math.pow((bx0+b-mx)/(w*.08),2)))),tot=sizes.reduce((a,b)=>a+b+gap,-gap),by=h*.9;let X=w/2-tot/2;
  x.save();x.shadowColor='rgba(40,50,90,.2)';x.shadowBlur=18;x.fillStyle='rgba(255,255,255,.78)';rr(x,w/2-tot/2-10,by-s0*1.9-6,tot+20,s0*1.9+16,14);x.restore();
  sizes.forEach((sz,i)=>{const bn=(i===3&&tt>2.2&&tt<3.2)?-Math.abs(Math.sin((tt-2.2)*Math.PI*2))*s0*.6:0;x.fillStyle=C[i];rr(x,X,by-sz+bn,sz,sz,sz*.25);x.fillStyle='rgba(255,255,255,.85)';x.beginPath();x.arc(X+sz/2,by-sz/2+bn,sz*.18,0,7);x.fill();X+=sz+gap});
  const wp=Math.max(0,eOB(cl((tt-3.2)/.5))-eIO(cl((tt-5.3)/.5)));if(wp>.02){const ww=w*.4,wh=h*.42,wx=w/2,wy=h*.12;x.save();x.translate(wx,h*.82);x.scale(wp,wp);x.translate(-wx,-h*.82);uiCard(x,wx-ww/2,wy,ww,wh,12);uiText(x,'Campaign report',wx-ww*.44,wy+wh*.14,wh*.08,'#5B6274',700,'left');uiText(x,'+37%',wx-ww*.44,wy+wh*.42,wh*.22,UI_G,800,'left');x.restore()}},
product360(x,w,h,t){uiBg(x,w,h);const tt=t%6,cx=w*.35,cy=h*.5,R=h*.26,a=t*1.1,c=Math.cos(a),s=Math.sin(a);x.fillStyle='rgba(40,50,90,.12)';x.beginPath();x.ellipse(cx,cy+R*1.15,R*(.6+.3*Math.abs(c)),R*.12,0,0,7);x.fill();
  x.strokeStyle=UI_B;x.lineWidth=R*.14;x.lineCap='round';x.beginPath();x.ellipse(cx,cy-R*.1,Math.max(.5,R*Math.abs(c)*.95),R*.9,0,Math.PI,Math.PI*2);x.stroke();x.lineCap='butt';
  const cup=(X,fr)=>{const wd=R*(.2+.32*Math.abs(s)),hh=R*.72;x.fillStyle=fr?'#2F5BFF':'#7E9BFF';rr(x,X-wd/2,cy-hh*.1,wd,hh,wd*.5);x.fillStyle='rgba(255,255,255,.25)';rr(x,X-wd*.3,cy+hh*.05,wd*.35,hh*.5,wd*.15)},X1=cx-R*c*.95,X2=cx+R*c*.95;if(s>0){cup(X1,false);cup(X2,true)}else{cup(X2,false);cup(X1,true)}
  ['主動降噪','40 小時續航','空間音訊'].forEach((s_,i)=>{const p=eOC(cl((tt-1-i*.7)/.5));if(p<=0)return;const X=w*.62+(1-p)*20,Yp=h*.32+i*h*.17;x.globalAlpha=p;uiCard(x,X,Yp-h*.06,w*.32,h*.12,10);x.fillStyle=UI_G;x.beginPath();x.arc(X+w*.03,Yp,h*.03,0,7);x.fill();uiText(x,'✓',X+w*.03,Yp,h*.035,'#fff',800);uiText(x,s_,X+w*.065,Yp,h*.045,UI_INK,700,'left');x.globalAlpha=1});
  uiText(x,'$129',cx,h*.9,h*.07,UI_INK,800)},
buttonplayer(x,w,h,t){x.fillStyle='#F2EFE8';x.fillRect(0,0,w,h);const tt=t%5,m=Math.max(0,Math.min(1.08,eOB(cl((tt-1)/.6))-eIO(cl((tt-4.1)/.5)))),W0=w*.22,H0=h*.14,W1=w*.62,H1=h*.46,bw=W0+(W1-W0)*m,bh=H0+(H1-H0)*m,X=w/2-bw/2,Yp=h/2-bh/2;
  x.save();x.shadowColor='rgba(0,0,0,.25)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle='#161922';rr(x,X,Yp,bw,bh,Math.min(bh/2,H0/2+(14-H0/2)*m));x.restore();
  if(m<.35){x.globalAlpha=1-m*2.8;x.fillStyle='#fff';x.beginPath();x.moveTo(X+bw*.2,h/2-H0*.22);x.lineTo(X+bw*.2,h/2+H0*.22);x.lineTo(X+bw*.2+H0*.38,h/2);x.fill();uiText(x,'Preview',X+bw*.42,h/2,H0*.34,'#fff',700,'left');x.globalAlpha=1}
  else{const a=cl((m-.45)/.5),pr=cl((tt-1.8)/2.2);x.globalAlpha=a;uiText(x,'Summer reel',X+bw*.06,Yp+bh*.16,bh*.09,'#fff',700,'left');for(let i=0;i<32;i++){const bx=X+bw*.06+i*bw*.88/32,amp=(.25+.75*Math.abs(Math.sin(i*.8+t*4)))*bh*.2;x.fillStyle=i/32<pr?rgb(A):'rgba(255,255,255,.28)';x.fillRect(bx,Yp+bh*.52-amp/2,bw*.015,amp)}
    x.fillStyle='rgba(255,255,255,.2)';rr(x,X+bw*.06,Yp+bh*.8,bw*.88,4,2);x.fillStyle=rgb(A);rr(x,X+bw*.06,Yp+bh*.8,bw*.88*pr,4,2);x.fillStyle='#fff';x.beginPath();x.arc(X+bw*.06+bw*.88*pr,Yp+bh*.8+2,6,0,7);x.fill();x.globalAlpha=1}},
cardexpand(x,w,h,t){uiBg(x,w,h);const tt=t%5,e=eIO(cl((tt-1)/.8))-eIO(cl((tt-4)/.7)),W0=w*.2,H0=h*.22,W1=w*.8,H1=h*.82,bw=W0+(W1-W0)*e,bh=H0+(H1-H0)*e,X=w/2-bw/2,Yp=h/2-bh/2;uiCard(x,X,Yp,bw,bh,10+8*e);
  if(e<.25){x.globalAlpha=1-e*4;uiText(x,'Q3 brief',X+bw*.12,Yp+bh*.35,bh*.2,UI_INK,700,'left');x.fillStyle='#E6E9F2';rr(x,X+bw*.12,Yp+bh*.6,bw*.6,bh*.07,3);x.globalAlpha=1}
  else{const a=cl((e-.5)/.5);x.globalAlpha=a;x.fillStyle='#F2F4FA';rr(x,X+4,Yp+4,bw*.2,bh-8,12);for(let i=0;i<4;i++){x.fillStyle=i==0?UI_B:'#D5DAE8';rr(x,X+bw*.04,Yp+bh*(.12+i*.1),bw*.12,bh*.045,4)}
    uiText(x,'Q3 brief',X+bw*.26,Yp+bh*.12,bh*.07,UI_INK,800,'left');for(let i=0;i<5;i++){x.fillStyle='#E6E9F2';rr(x,X+bw*.26,Yp+bh*(.24+i*.09),bw*(.62-.08*(i%3)),bh*.04,3)}x.fillStyle=UI_B;rr(x,X+bw*.26,Yp+bh*.74,bw*.18,bh*.09,8);uiText(x,'Open',X+bw*.35,Yp+bh*.785,bh*.04,'#fff',700);x.globalAlpha=1}},
tabspanels(x,w,h,t){uiBg(x,w,h);const T=1.8,k=Math.floor(t/T),i0=k%3,i1=(k+1)%3,p=eIO(cl((t%T-1.1)/.5)),cw=w*.64,ch=h*.84,X=w/2-cw/2,Yp=h*.08;uiCard(x,X,Yp,cw,ch,14);const tabs=['Reels','Posts','Email'],tw=cw*.26,tx=X+cw*.05,ty=Yp+ch*.07,th=ch*.1,ai=i0+(i1-i0)*p;
  x.fillStyle='#F0F2F8';rr(x,tx,ty,tw*3+8,th,th/2);x.fillStyle='#161922';rr(x,tx+tw*ai+2,ty+2,tw,th-4,(th-4)/2);tabs.forEach((s,i)=>uiText(x,s,tx+tw*i+tw/2+2,ty+th/2,th*.38,Math.abs(i-ai)<.5?'#fff':'#5B6274',700));
  const N=[['Launch teaser','Spring kit','Welcome mail'],['Studio tour','Studio shoot','Weekly digest'],['Tool tip','Behind scenes','Promo blast']],V=['21k','14k','9.6k'],CL=['#9DD7FF','#FF9D88','#161922'];
  [[i0,1-p,-1],[i1,p,1]].forEach(([ti,al,sg])=>{if(al<=.01)return;x.save();x.globalAlpha=al;x.translate(sg*(1-al)*cw*.08,0);for(let r=0;r<3;r++){const ry=Yp+ch*(.28+r*.22);x.fillStyle=CL[r];rr(x,X+cw*.07,ry,ch*.14,ch*.14,6);uiText(x,N[r][ti],X+cw*.07+ch*.2,ry+ch*.04,ch*.055,UI_INK,700,'left');uiText(x,V[r],X+cw*.93,ry+ch*.07,ch*.055,'#8A91A4',700,'right')}x.restore()})},
chartmorph(x,w,h,t){uiBg(x,w,h);const tt=t%5.2,m=eIO(cl((tt-1.1)/1.1))-eIO(cl((tt-3.6)/1.1)),cw=w*.7,ch=h*.78,X=w/2-cw/2,Yp=h*.11;uiCard(x,X,Yp,cw,ch,14);uiText(x,'Weekly reach',X+cw*.06,Yp+ch*.1,ch*.055,'#5B6274',700,'left');
  const V=[.35,.5,.42,.68,.6,.82,.95],n=7,bx=X+cw*.08,bw=cw*.84/n,base=Yp+ch*.86,mh=ch*.55,P=V.map((v,i)=>[bx+i*bw+bw/2,base-v*mh]);
  if(m>.02){x.save();x.globalAlpha=m;const g=x.createLinearGradient(0,Yp+ch*.3,0,base);g.addColorStop(0,'rgba(59,107,255,.28)');g.addColorStop(1,'rgba(59,107,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(P[0][0],base);P.forEach(p=>x.lineTo(p[0],p[1]));x.lineTo(P[n-1][0],base);x.closePath();x.fill();x.strokeStyle=UI_B;x.lineWidth=3;x.lineJoin='round';x.beginPath();P.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();x.restore()}
  const r=5;for(let i=0;i<n;i++){const wd=bw*.62*(1-m)+2*r*m,hh=(base-P[i][1])*(1-m)+2*r*m,ty=P[i][1]-r*m;x.fillStyle=i===n-1?rgb(A):UI_B;rr(x,P[i][0]-wd/2,ty,wd,hh,wd/2*m+4*(1-m))}},
dashzoom(x,w,h,t){uiBg(x,w,h);const tt=t%6,z=eIO(cl((tt-1)/.9))-eIO(cl((tt-3.8)/.9)),s=1+1.35*z,T4=[['Open rate','48%'],['Click rate','6.2%'],['Replies','31'],['Revenue','$4.2k']],tw=w*.3,th=h*.3,gx=w*.03,gy=h*.04,X0=w/2-tw-gx/2,Y0=h/2-th-gy/2,fi=1,fx=X0+(fi%2)*(tw+gx)+tw/2,fy=Y0+Math.floor(fi/2)*(th+gy)+th/2,qx=w/2+(fx-w/2)*z,qy=h/2+(fy-h/2)*z;
  x.save();x.translate(w/2-s*qx,h/2-s*qy);x.scale(s,s);T4.forEach(([a,b],i)=>{const X=X0+(i%2)*(tw+gx),Yp=Y0+Math.floor(i/2)*(th+gy),hl=i===fi;x.globalAlpha=hl?1:1-.55*z;uiCard(x,X,Yp,tw,th,10);uiText(x,a,X+tw*.08,Yp+th*.25,th*.13,'#8A91A4',600,'left');uiText(x,b,X+tw*.08,Yp+th*.62,th*.3,hl&&z>.5?UI_G:UI_INK,800,'left');
    if(hl&&z>.3){x.strokeStyle=`rgba(59,107,255,${z})`;x.lineWidth=2/s;x.beginPath();x.roundRect?x.roundRect(X,Yp,tw,th,10):x.rect(X,Yp,tw,th);x.stroke()}});x.globalAlpha=1;x.restore()},
springstack(x,w,h,t){uiBg(x,w,h);const tt=t%5,cw=w*.26,ch=h*.5,C=['#FFD9C9','#CFE0FF','#fff'],ang=[-.22,.18,-.02],dx=[-w*.2,w*.2,0];
  [0,1,2].forEach(i=>{const p=eOB(cl((tt-.5-i*.18)/.7))-eIO(cl((tt-3.8-(2-i)*.1)/.6)),px=w/2+dx[i]*p,py=h/2,a=ang[i]*p;x.save();x.translate(px,py);x.rotate(a);x.shadowColor='rgba(40,50,90,.22)';x.shadowBlur=18;x.shadowOffsetY=8;x.fillStyle=C[i];rr(x,-cw/2,-ch/2,cw,ch,14);x.restore();
    if(i===2){x.save();x.translate(px,py);x.rotate(a);x.fillStyle=rgb(A);x.beginPath();x.arc(0,-ch*.12,cw*.26,0,7);x.fill();uiText(x,'Summer kit',0,ch*.2,ch*.07,UI_INK,800);uiText(x,'$24',-cw*.2,ch*.35,ch*.09,UI_INK,800);x.fillStyle=UI_INK;x.beginPath();x.arc(cw*.28,ch*.35,ch*.065,0,7);x.fill();uiText(x,'✓',cw*.28,ch*.35,ch*.07,'#fff',800);x.restore()}})},
elastictype(x,w,h,t){clear(x,w,h);const k=.5+.5*Math.sin(t*1.1-1.2),sx=.7+.9*k,S_='STRETCH',n=S_.length,fs=Math.min(h*.3,w*.1),wt=[300,400,500,600,700,800,900][Math.round(k*6)];x.textBaseline='middle';x.textAlign='center';x.font=`${wt} ${fs}px Unbounded,sans-serif`;
  let tw=0;const ws=[];for(let i=0;i<n;i++){const cw=x.measureText(S_[i]).width*sx;ws.push(cw);tw+=cw}let X=(w-tw)/2;for(let i=0;i<n;i++){x.save();x.translate(X+ws[i]/2,h*.42);x.scale(sx,1);x.fillStyle=i===2?rgb(A):FG;x.fillText(S_[i],0,0);x.restore();X+=ws[i]}
  const tx=w*.2,tw2=w*.6,ty=h*.78;x.fillStyle='#2A3040';rr(x,tx,ty-2,tw2,4,2);x.fillStyle=rgb(A);rr(x,tx,ty-2,tw2*k,4,2);x.fillStyle='#fff';x.beginPath();x.arc(tx+tw2*k,ty,9,0,7);x.fill();uiText(x,'wdth '+Math.round(70+90*k)+'  wght '+wt,w/2,h*.9,h*.05,'rgba(237,239,245,.7)',500)},
textlayout(x,w,h,t){uiBg(x,w,h);const tt=t%5.5,W_=['Design','that','moves','people'],e=eIO(cl((tt-1.4)/1.1))-eIO(cl((tt-4.3)/.9)),fs=h*.095,S=[[w*.19,h*.5],[w*.4,h*.5],[w*.59,h*.5],[w*.82,h*.5]],E=[[w*.2,h*.2],[w*.21,h*.56],[w*.5,h*.56],[w*.79,h*.56]];
  x.globalAlpha=e;uiCard(x,w*.08,h*.1,w*.84,h*.2,12);for(let i=0;i<3;i++){uiCard(x,w*.08+i*w*.29,h*.4,w*.26,h*.5,12);x.fillStyle='#E6E9F2';rr(x,w*.1+i*w*.29,h*.66,w*.2,h*.03,3);rr(x,w*.1+i*w*.29,h*.73,w*.14,h*.03,3)}x.globalAlpha=1;
  W_.forEach((s,i)=>{const p=cl(e*1.2-i*.05),X=S[i][0]+(E[i][0]-S[i][0])*p,Yp=S[i][1]+(E[i][1]-S[i][1])*p;uiText(x,s,X,Yp,fs*(1-.3*p),i===2?'#E2492F':UI_INK,800)})},
curtainreveal(x,w,h,t,st,c,d){const o=off(st,w,h,d),g=o.createLinearGradient(0,0,0,h);g.addColorStop(0,'#F6B26B');g.addColorStop(.55,'#C0577A');g.addColorStop(1,'#2B1E3F');o.fillStyle=g;o.fillRect(0,0,w,h);o.fillStyle='rgba(255,236,190,.95)';o.beginPath();o.arc(w*.5,h*.45,h*.16,0,7);o.fill();
  [['#3A2850',.64],['#22183A',.78],['#120C22',.9]].forEach(([col,b],k)=>{o.fillStyle=col;o.beginPath();o.moveTo(0,h);for(let X=0;X<=w;X+=8)o.lineTo(X,h*b-Math.sin(X*.02+k*2)*h*.05-Math.sin(X*.007+k)*h*.07);o.lineTo(w,h);o.fill()});
  clear(x,w,h);const tt=t%5,N=12,cw=w/N;for(let i=0;i<N;i++){const p=eOC(cl((tt-.3-i*.07)/.7))*(1-eIO(cl((tt-4-i*.04)/.6)));x.fillStyle='#1B2030';x.fillRect(i*cw,0,cw-1,h);if(p>0){x.save();x.beginPath();x.rect(i*cw,0,cw-1,h*p);x.clip();x.drawImage(st.o,0,0,w,h);x.restore()}}},
perspshift(x,w,h,t){uiBg(x,w,h);const tt=t%5,sp=eIO(cl((tt-.8)/.9))-eIO(cl((tt-3.4)/.9)),cw=w*.34,F=['#fff','#EAF0FF','#FFE7DF'],K=[UI_B,'#8B5CF6',rgb(A)];
  for(let i=2;i>=0;i--){const z=(i-1)*h*.16*(.35+sp*.9);x.save();x.translate(w/2,h*.52-z);x.transform(.9,.38,-.9,.38,0,0);x.shadowColor='rgba(40,50,90,.18)';x.shadowBlur=14;x.shadowOffsetY=10;x.fillStyle=F[i];rr(x,-cw/2,-cw*.375,cw,cw*.75,12);x.restore();
    x.save();x.translate(w/2,h*.52-z);x.transform(.9,.38,-.9,.38,0,0);x.fillStyle=K[i];rr(x,-cw*.4,-cw*.3,cw*.35,cw*.07,3);x.fillStyle='#D5DAE8';rr(x,-cw*.4,-cw*.15,cw*.7,cw*.05,3);rr(x,-cw*.4,-cw*.04,cw*.55,cw*.05,3);x.restore()}},
glassfocus(x,w,h,t){uiBg(x,w,h);const T=2,k=Math.floor(t/T)%4,p=eIO(cl((t%T-1.2)/.6)),nx=(k+1)%4,pos=k+(nx-k)*p,cw=w*.62,ch=h*.8,X=w/2-cw/2,Yp=h*.1,R=[['Open rate','48%'],['Click rate','6.2%'],['Replies','31'],['Revenue','$4.2k']];
  uiCard(x,X,Yp,cw,ch,14);uiText(x,'Campaign report',X+cw*.06,Yp+ch*.1,ch*.06,UI_INK,800,'left');const rh=ch*.17,y0=Yp+ch*.22;
  R.forEach(([a,b],i)=>{const f=cl(1-Math.abs(i-pos));x.globalAlpha=.4+.6*f;uiText(x,a,X+cw*.08,y0+i*rh+rh/2,rh*.34,UI_INK,600,'left');uiText(x,b,X+cw*.92,y0+i*rh+rh/2,rh*(.34+.14*f),UI_INK,800,'right')});x.globalAlpha=1;
  const gy=y0+pos*rh;x.save();x.shadowColor='rgba(59,107,255,.25)';x.shadowBlur=14;x.fillStyle='rgba(255,255,255,.55)';rr(x,X+cw*.03,gy+2,cw*.94,rh-4,10);x.restore();x.strokeStyle='rgba(59,107,255,.55)';x.lineWidth=1.5;x.beginPath();x.roundRect?x.roundRect(X+cw*.03,gy+2,cw*.94,rh-4,10):x.rect(X+cw*.03,gy+2,cw*.94,rh-4);x.stroke()},
gradientwave(x,w,h,t){x.fillStyle='#F7F3FF';x.fillRect(0,0,w,h);const L=[['#FFB36B','#FF6A8A',.3,1.0],['#FF6A8A','#B65BFF',.4,1.3],['#B65BFF','#5B8CFF',.5,.8],['#5B8CFF','#6FE0FF',.6,1.1]];
  L.forEach(([c1,c2,b,sp],i)=>{const g=x.createLinearGradient(0,0,w,0);g.addColorStop(0,c1);g.addColorStop(1,c2);x.fillStyle=g;x.globalAlpha=.92;x.beginPath();x.moveTo(0,h);for(let X=0;X<=w;X+=4){const u=X/w;x.lineTo(X,h*(b+.05*i)+Math.sin(u*5+t*sp+i*1.7)*h*.09+Math.sin(u*9-t*sp*1.3+i)*h*.035)}x.lineTo(w,h);x.closePath();x.fill()});x.globalAlpha=1;uiText(x,'Flow',w*.07,h*.1,h*.07,UI_INK,800,'left')},
glasstilt(x,w,h,t){const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#1B2160');g.addColorStop(1,'#3A1E6B');x.fillStyle=g;x.fillRect(0,0,w,h);[[rgb(A,.6),.25,.3],[rgb(B,.6),.78,.72]].forEach(([c,px,py])=>{const rg=x.createRadialGradient(w*px,h*py,0,w*px,h*py,h*.55);rg.addColorStop(0,c);rg.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=rg;x.fillRect(0,0,w,h)});
  const a=.45*Math.sin(t*.9),cw=w*.46,ch=cw*.62;x.save();x.translate(w/2,h/2);x.transform(Math.cos(a*.6),Math.sin(a)*.12,0,1,0,0);x.save();x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=24;x.shadowOffsetY=14;x.fillStyle='rgba(255,255,255,.14)';rr(x,-cw/2,-ch/2,cw,ch,16);x.restore();
  x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=1.2;x.beginPath();x.roundRect?x.roundRect(-cw/2,-ch/2,cw,ch,16):x.rect(-cw/2,-ch/2,cw,ch);x.stroke();x.save();x.beginPath();x.roundRect?x.roundRect(-cw/2,-ch/2,cw,ch,16):x.rect(-cw/2,-ch/2,cw,ch);x.clip();
  const gx=-cw/2+cw*(.5+a*1.2),gl=x.createLinearGradient(gx,-ch/2,gx+cw*.35,ch/2);gl.addColorStop(0,'rgba(255,255,255,0)');gl.addColorStop(.5,'rgba(255,255,255,.35)');gl.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gl;x.fillRect(-cw/2,-ch/2,cw,ch);x.restore();
  x.fillStyle='rgba(255,236,190,.9)';rr(x,-cw*.4,-ch*.3,cw*.16,ch*.2,4);uiText(x,'4242  4242  4242  4242',-cw*.4,ch*.2,ch*.09,'#fff',600,'left');uiText(x,'Alex Chen',-cw*.4,ch*.36,ch*.07,'rgba(255,255,255,.75)',500,'left');x.restore()},
dotmesh(x,w,h,t){x.fillStyle='#F6F3FA';x.fillRect(0,0,w,h);const NX=48,NY=22;for(let j=0;j<NY;j++){const gy=j/(NY-1);for(let i=0;i<NX;i++){const gx=i/(NX-1),z=Math.sin(gx*9+t*1.6)*Math.cos(gy*7-t*1.2)*.5+Math.sin(gx*4-gy*3+t)*.3,px=w/2+(gx-.5)*w*(.5+gy*.75),py=h*.3+gy*h*.62-z*h*(.07+gy*.16),r=.8+gy*1.8+z;x.fillStyle=mix(.5+.5*z,.35+.55*gy);x.beginPath();x.arc(px,py,Math.max(.4,r),0,7);x.fill()}}},
cardshuffle(x,w,h,t){uiBg(x,w,h);const T=1.3,k=Math.floor(t/T),p=eIO(cl((t%T-.3)/.8)),cw=w*.3,ch=h*.5,G=[['#FF9A6B','#FF5E8A'],['#8B5CF6','#5B8CFF'],['#34D399','#3B82F6'],['#FBBF24','#F97316']];
  const I=[0,1,2,3].map(j=>({id:(k+j)%4,r:j===0?3*p:j-p,sd:j===0?Math.sin(p*Math.PI)*w*.2:0})).sort((a,b)=>b.r-a.r);
  I.forEach(o=>{const X=w/2-w*.1+o.r*w*.06+o.sd,Yp=h/2+h*.02-o.r*h*.035,s=1-o.r*.05,g=x.createLinearGradient(X-cw/2,Yp-ch/2,X+cw/2,Yp+ch/2);g.addColorStop(0,G[o.id][0]);g.addColorStop(1,G[o.id][1]);x.save();x.translate(X,Yp);x.scale(s,s);x.shadowColor='rgba(40,50,90,.25)';x.shadowBlur=16;x.shadowOffsetY=8;x.fillStyle=g;rr(x,-cw/2,-ch/2,cw,ch,14);x.restore();x.save();x.translate(X,Yp);x.scale(s,s);uiText(x,'0'+(o.id+1),-cw*.28,-ch*.3,ch*.14,'rgba(255,255,255,.9)',800,'left');x.restore()})},
ribbontwist(x,w,h,t){clear(x,w,h);const N=90,P=[];for(let i=0;i<=N;i++){const u=i/N,X=w*.06+u*w*.88,Y=h/2+Math.sin(u*Math.PI*2.2-t*1.1)*h*.22,tw=u*9-t*1.6,hw=h*.17*Math.cos(tw)*(.35+.65*Math.sin(u*Math.PI));P.push([X,Y,hw,Math.cos(tw),u])}
  for(let i=0;i<N;i++){const a=P[i],b=P[i+1];x.fillStyle=mix(a[4],.55+.45*Math.abs(a[3]));x.strokeStyle=x.fillStyle;x.lineWidth=.6;x.beginPath();x.moveTo(a[0],a[1]-a[2]);x.lineTo(b[0],b[1]-b[2]);x.lineTo(b[0],b[1]+b[2]);x.lineTo(a[0],a[1]+a[2]);x.closePath();x.fill();x.stroke()}},
metaball3d(x,w,h,t){uiBg(x,w,h);const P=[0,1,2].map(i=>{const a=t*(.9+.3*i)+i*2.1;return[w/2+Math.cos(a)*w*.13*(i?1:.2),h*.48+Math.sin(a*1.2)*h*.1*(i?1:.2),h*(i?.1+.015*i:.17)]});
  x.fillStyle='rgba(40,50,90,.12)';x.beginPath();x.ellipse(w/2,h*.86,w*.22,h*.04,0,0,7);x.fill();const col='#8B5CF6';x.fillStyle=col;P.forEach(p=>{x.beginPath();x.arc(p[0],p[1],p[2],0,7);x.fill()});
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){const a=P[i],b=P[j],dd=Math.hypot(a[0]-b[0],a[1]-b[1]),th=(a[2]+b[2])*1.6;if(dd<th){const q=1-dd/th;x.strokeStyle=col;x.lineCap='round';x.lineWidth=Math.min(a[2],b[2])*1.6*q;x.beginPath();x.moveTo(a[0],a[1]);x.lineTo(b[0],b[1]);x.stroke()}}x.lineCap='butt';
  P.forEach(p=>{const g=x.createRadialGradient(p[0]-p[2]*.35,p[1]-p[2]*.4,p[2]*.05,p[0],p[1],p[2]);g.addColorStop(0,'rgba(255,255,255,.75)');g.addColorStop(.35,'rgba(200,170,255,.25)');g.addColorStop(1,'rgba(60,20,140,.45)');x.fillStyle=g;x.beginPath();x.arc(p[0],p[1],p[2],0,7);x.fill()})},
phoneexplode(x,w,h,t){uiBg(x,w,h);const tt=t%6,sp=eIO(cl((tt-.9)/1))-eIO(cl((tt-3.9)/.9)),cw=w*.2,ch=cw*1.9,L=[['#2A2F3B','Case'],['#1B6B52','Board'],['#fff','Display'],['rgba(160,200,255,.45)','Glass']];
  for(let i=0;i<4;i++){const z=(i-1.5)*h*.17*sp,Y=h*.52-z;x.save();x.translate(w*.42,Y);x.transform(.9,.38,-.9,.38,0,0);x.shadowColor='rgba(40,50,90,.2)';x.shadowBlur=10;x.shadowOffsetY=8;x.fillStyle=L[i][0];rr(x,-cw/2,-ch/2,cw,ch,cw*.12);x.restore();
    x.save();x.translate(w*.42,Y);x.transform(.9,.38,-.9,.38,0,0);if(i===2){x.fillStyle='#E6EEFF';rr(x,-cw*.4,-ch*.4,cw*.8,ch*.25,5);x.fillStyle=UI_B;rr(x,-cw*.4,-ch*.08,cw*.35,ch*.2,5);x.fillStyle='#FFD9C9';rr(x,cw*.02,-ch*.08,cw*.38,ch*.2,5)}
    if(i===1){x.fillStyle='#7BD88F';[[-.25,-.3],[.1,-.3],[-.25,.05]].forEach(([a,b])=>rr(x,cw*a,ch*b,cw*.3,ch*.2,3))}x.restore();x.save();x.globalAlpha=sp;uiText(x,L[i][1],w*.42+cw*1.1+10,Y,h*.05,'#5B6274',700,'left');x.restore()}},
};

