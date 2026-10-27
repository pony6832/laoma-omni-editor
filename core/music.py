"""程式合成背景音樂＋音效，並依口播音量做閃避（ducking）。自製音源，無版權疑慮。"""
import subprocess
import numpy as np

SR = 44100


def voice_env(mp4, n):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp4, "-vn", "-ac", "1", "-ar", "8000", "-f", "f32le", "-"],
                         capture_output=True, check=True).stdout
    v = np.abs(np.frombuffer(raw, dtype=np.float32))
    win = 800  # 0.1s
    e = np.convolve(v, np.ones(win) / win, mode="same")
    e = np.clip(e / (np.percentile(e, 95) + 1e-9), 0, 1)
    e = np.convolve(e, np.ones(1200) / 1200, mode="same")  # 平滑，避免抽動
    return np.interp(np.linspace(0, len(e) - 1, n), np.arange(len(e)), e)


def pad(freqs, n, rng):
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f in freqs:
        for d, a in ((0.997, 0.5), (1.003, 0.5)):
            y += a * (np.sin(2 * np.pi * f * d * t) + 0.35 * np.sin(2 * np.pi * 2 * f * d * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t))
    return y / len(freqs)


def pluck(f, dur, amp=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    return amp * np.sin(2 * np.pi * f * t) * np.exp(-t * 7) * (1 - np.exp(-t * 400))


def add(buf, snd, at):
    i = int(at * SR)
    if i < 0 or i >= len(buf):
        return
    j = min(len(buf), i + len(snd))
    buf[i:j] += snd[: j - i]


def whoosh(dur=0.8, amp=0.5, up=True, seed=1):
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    x = r.standard_normal(n)
    a = np.linspace(0.02, 0.5, n) if up else np.linspace(0.5, 0.02, n)
    y = np.zeros(n)
    p = 0.0
    for i in range(n):
        p += a[i] * (x[i] - p)
        y[i] = p
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.5
    y = y * env
    return amp * y / (np.abs(y).max() + 1e-9)


def hit(amp=0.8):
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 120 * np.exp(-t * 9) + 45
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 8)
    r = np.random.default_rng(3)
    y += 0.4 * r.standard_normal(n) * np.exp(-t * 40)
    return amp * y / np.abs(y).max()


def pop(amp=0.35):
    n = int(0.14 * SR)
    t = np.arange(n) / SR
    f = 700 + 900 * t / 0.14
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)


def riser(dur=1.7, amp=0.6):
    n = int(dur * SR); t = np.arange(n) / SR
    r = np.random.default_rng(5); x = r.standard_normal(n)
    a = np.linspace(0.01, 0.7, n) ** 1.5; y = np.zeros(n); p = 0.0
    for i in range(n):
        p += a[i] * (x[i] - p); y[i] = p
    f = 180 + 2200 * (t / dur) ** 2
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.35
    env = (t / dur) ** 2
    z = (y / (np.abs(y).max() + 1e-9) * 0.7 + tone) * env
    return amp * z / (np.abs(z).max() + 1e-9)


def boom(amp=0.95):
    n = int(1.4 * SR); t = np.arange(n) / SR
    low = np.sin(2 * np.pi * np.cumsum(60 * np.exp(-t * 2.5) + 38) / SR) * np.exp(-t * 2.2)
    return amp * (0.7 * low + 0.5 * hit(1.0)[: n] if len(hit(1.0)) >= n else 0.7 * low) / 1.0


def make(mp4, total, dur, cues, out_wav, bpm=92, voff=None, vdur=None):
    n = int(total * SR)
    r = np.random.default_rng(11)
    beat = 60 / bpm
    bar = 4 * beat
    chords = [([220, 261.63, 329.63], 110), ([174.61, 220, 261.63], 87.31), ([261.63, 329.63, 392], 130.81), ([196, 246.94, 293.66], 98)]
    mus = np.zeros(n)
    nbars = int(total / bar) + 2
    for b in range(nbars):
        fr, root = chords[b % 4]
        seg_n = int((bar + 1.0) * SR)
        seg = pad(fr, seg_n, r)
        w = np.minimum(1, np.arange(seg_n) / (0.8 * SR)) * np.minimum(1, (seg_n - np.arange(seg_n)) / (1.0 * SR))
        add(mus, 0.22 * seg * w, b * bar - 0.0)
        for k in (0, 2):
            add(mus, 0.55 * pluck(root, beat * 1.6), b * bar + k * beat)
        for k in range(8):  # 琶音
            f = fr[k % 3] * 2
            add(mus, 0.07 * pluck(f, 0.3), b * bar + k * beat / 2)
        for k in range(4):  # 底鼓
            kick_n = int(0.2 * SR)
            tt = np.arange(kick_n) / SR
            kick = np.sin(2 * np.pi * np.cumsum(95 * np.exp(-tt * 25) + 42) / SR) * np.exp(-tt * 14)
            add(mus, 0.45 * kick, b * bar + k * beat)
            hn = int(0.05 * SR)
            add(mus, 0.05 * r.standard_normal(hn) * np.exp(-np.arange(hn) / SR * 90), b * bar + k * beat + beat / 2)
    if voff is None:
        env = voice_env(mp4, n)
    else:
        nc = int(vdur * SR); ec = voice_env(mp4, nc); env = np.zeros(n); i0 = int(voff * SR); env[i0:i0 + nc] = ec[: max(0, n - i0)]
    mus *= 1 - 0.8 * env  # 口播出現時音樂壓低
    fin = np.minimum(1, np.arange(n) / (0.6 * SR))
    fout = np.minimum(1, (n - np.arange(n)) / (1.6 * SR))
    mus *= fin * fout
    mus = mus / (np.abs(mus).max() + 1e-9) * 0.28

    sfx = np.zeros(n)
    for kind, at in cues:
        if kind == "whoosh":
            add(sfx, whoosh(0.8, 0.5, True, int(at * 10) + 1), at - 0.1)
        elif kind == "swish":
            add(sfx, whoosh(0.35, 0.3, False, int(at * 10) + 2), at - 0.05)
        elif kind == "hit":
            add(sfx, hit(), at)
        elif kind == "pop":
            add(sfx, pop(), at)
        elif kind == "riser":
            add(sfx, riser(), at)
        elif kind == "boom":
            add(sfx, boom(), at)
    mix = mus + sfx * 0.6
    mix = np.tanh(mix * 1.1) * 0.9
    st = np.stack([mix, mix], axis=1)
    pcm = (st * 32767).astype("<i2").tobytes()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", "-c:a", "aac", "-b:a", "192k", out_wav],
                   input=pcm, check=True)
