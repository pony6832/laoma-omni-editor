// 移植自圖鑑 filmfx（底片顆粒暗角）。原版：緩慢推近 4%、暗角、每秒 24 格變化的白色顆粒。
// 原版為了展示會先畫一張「CINEMA」示範畫面；用在版面上請設 scene:false，只剩暗角與顆粒（疊在其他畫面上）。
// 參數：scene 是否畫示範畫面、sceneText 示範文字、zoomSpan 推近 4% 所花秒數、grain 顆粒數、vignette 暗角強度、numFont 示範文字字型
fxDefine("filmfx", {
  dur: 6,
  defaults: { scene: true, sceneText: "CINEMA", zoomSpan: 6, grain: 900, vignette: 0.75, numFont: "Unbounded,sans-serif" },
  draw(x, w, h, tt, P, C) {
    const { FG, rnd } = C;
    if (P.scene) {
      const s = 1 + 0.04 * (tt / P.zoomSpan);
      x.save(); x.translate(w / 2, h / 2); x.scale(s, s); x.translate(-w / 2, -h / 2); C.scene(x, w, h, "#1B2233", FG, P.sceneText, P.numFont); x.restore();
    }
    const v = x.createRadialGradient(w / 2, h / 2, h * 0.3, w / 2, h / 2, w * 0.7);
    v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, `rgba(0,0,0,${P.vignette})`); x.fillStyle = v; x.fillRect(0, 0, w, h);
    const f = Math.floor(tt * 24);
    for (let i = 0; i < P.grain; i++) { x.fillStyle = `rgba(255,255,255,${rnd(f * 1000 + i) * 0.14})`; x.fillRect(rnd(f * 7 + i * 3.1) * w, rnd(f * 13 + i * 1.7) * h, 1.5, 1.5); }
  },
});
