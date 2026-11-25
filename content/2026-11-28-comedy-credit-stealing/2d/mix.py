"""Office comedy Ep 4 'మీటింగ్‌లో మేనేజర్ మాయ!' soundtrack: Ep 2's QC-fixed mix.py (phone-band levels max +7 / high +1.5 / mid -5 /
low -14 dB vs voice p90; -3 dB voice duck on max hits; -3.5 dBTP master ceiling) with the Ep 4 cue table and the new synths
(limp claps, keyboard clatter, vacuum SHLOOP, three phone rings, whoosh + speed-dial beeps, cash-register KA-CHING, count dings,
the three card stamps) + the boss's telephone band-pass (300-3400 Hz) + Ramesh's non-verbal laugh-cry (vo/react.wav) in the
reaction. The FAAAH is tools/anim2d/sfx/faaah.wav as-is (shout 0.4 s in). Ep 2 notes:
Office comedy Ep 2 'Operation Manager Mind Game' soundtrack: Ep 1's mix.py (below) with the Ep 2 cue table, the new synths
(game-show ta-daa, quiz ding, gulp, plip, crickets, fwip, shuffle, glass BOINNG, birds, buzzer, stopwatch, victory brass), the
FAAAH reused as-is, and a -3.5 dBTP master ceiling. Ep 1 notes:
Office comedy Ep 1 'Operation Red Flower' soundtrack (built on the QC-fixed 20 Nov mix.py: tv_band fix, phone-band
levels, crack layers on the max hits, -3 dB voice duck round max hits). Below: the 20 Nov notes.
Office comedy 'పది నిమిషాల లేట్!' soundtrack. EVERYTHING here is synthesized in this file (sine/saw/FM/noise, envelopes,
FFT filters, a synthetic room reverb), except the voices and the crowd vocal takes, which are our own Gemini TTS takes
(crowd.py: 8 voices). No downloaded or copied SFX, no TV laugh track, no film music.

Owner, 19 Nov 2026: "When there are like laughing, fear, or heavy sounds... it should be highlighted, not just a human
voice." So all 33 cues of the brief's table are built and placed on their beats (beats.json from the page, the same
numbers the picture uses), at the brief's levels (peak, before the master gain):
  low  = -24 dBFS (bed level, under the voice)      mid = -14 dBFS (clearly heard, under the voice peaks)
  high = -8 dBFS (louder than the voice, in a gap)   max = -3 dBFS (the scene's hit; music cut or ducked -15 dB)
Voice lines are normalized to -9 dBFS peak. The music bed is an original bouncy office-comedy groove (pizzicato +
a bassoon-like reed synth, 120 bpm; +8% after the record scratch), ducked under the voice and CUT on the DHOOM, the
dun-DUNN, the STAMP + sad trombone, DHAN-DHAN-DHAAN, the record scratch (off through 'నీ దుంప తెగ!') and the 0.4 s
TOTAL silence before the punch (every bus muted, digital zero). After the laugh: a short upbeat tag to the end card.
Master: gain to ~-15 LUFS (capped), then a 4x-oversampled look-ahead true-peak limiter at -1.7 dBTP (-1.0 or lower after AAC) -> mix.wav (stereo).
Writes mix_levels.json (peak of every cue in the final mix, voice peaks, bed level)."""
import json, os, subprocess, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); b = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
LI = {l["i"]: l for l in L}; S = lambda i: LI[i]["start"]; E = lambda i: LI[i]["start"] + LI[i]["dur"]
rng = np.random.default_rng(20)
LV = {"low": -24, "mid": -14, "high": -8, "max": -3}
db = lambda x: 10 ** (x / 20)

# ---------------- DSP helpers ----------------
def env_x(d): return np.arange(int(d * SR)) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def norm(x, peak_db):
    m = np.abs(x).max() or 1; return x / m * db(peak_db)
def fades(x, a=0.003, r=0.01):
    k = len(x); e = np.ones(k); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr))
    return x * e
def fft_filter(x, lo=None, hi=None, order=2):
    """zero-phase band filter in the frequency domain (smooth Butterworth-like magnitude)."""
    N = len(x); X = np.fft.rfft(x, 2 * N); f = np.fft.rfftfreq(2 * N, 1 / SR); g = np.ones_like(f)
    if hi: g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo: g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X * g)[:N]
def tv_band(x, fc, q=2.0, hop=256, nfft=1024):
    """time-varying band-pass (STFT): fc = array of centre frequencies per sample."""
    win = np.hanning(nfft); out = np.zeros(len(x) + nfft); f = np.fft.rfftfreq(nfft, 1 / SR); wsum = np.zeros(len(x) + nfft)
    xp = np.concatenate([x, np.zeros(nfft)])
    for s in range(0, len(x), hop):
        fr = xp[s:s + nfft] * win; c = fc[min(len(fc) - 1, s + nfft // 2)]
        g = 1 / (1 + (q * (f / c - c / np.maximum(f, 1))) ** 2)   # (bracket fixed 19 Nov, QC)
        out[s:s + nfft] += np.fft.irfft(np.fft.rfft(fr) * g) * win; wsum[s:s + nfft] += win ** 2
    return (out / np.maximum(wsum, 1e-6))[:len(x)]
def tv_lowpass(x, fc, hop=256, nfft=1024):
    win = np.hanning(nfft); out = np.zeros(len(x) + nfft); f = np.fft.rfftfreq(nfft, 1 / SR); wsum = np.zeros(len(x) + nfft)
    xp = np.concatenate([x, np.zeros(nfft)])
    for s in range(0, len(x), hop):
        fr = xp[s:s + nfft] * win; c = fc[min(len(fc) - 1, s + nfft // 2)]
        g = 1 / np.sqrt(1 + (f / c) ** 4)
        out[s:s + nfft] += np.fft.irfft(np.fft.rfft(fr) * g) * win; wsum[s:s + nfft] += win ** 2
    return (out / np.maximum(wsum, 1e-6))[:len(x)]
def conv(x, ir):
    N = len(x) + len(ir); X = np.fft.rfft(x, N); H = np.fft.rfft(ir, N); return np.fft.irfft(X * H)[:N]
def room_ir(rt=0.7, pre=0.012, seed=5, bright=6000):
    r = np.random.default_rng(seed); d = rt * 1.2; x = env_x(d)
    ir = r.standard_normal(len(x)) * np.exp(-6.9 * x / rt); ir = fft_filter(ir, 150, bright)
    ir[: int(pre * SR)] = 0
    for t0, g in ((0.007, 0.5), (0.013, 0.35), (0.021, 0.3), (0.029, 0.22)): ir[int(t0 * SR)] += g * 4
    return ir / np.abs(ir).max()
def saw(f, d, phase=0.0):
    x = env_x(d); ph = np.cumsum(np.broadcast_to(f, x.shape) / SR) + phase
    return 2 * (ph % 1) - 1
def sine(f, d):
    x = env_x(d); return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, x.shape) / SR))
def noise(d, r=rng): return r.standard_normal(int(d * SR))
def adsr(d, a=0.005, dec=0.1, sus=0.6, rel=0.1):
    x = env_x(d); e = np.where(x < a, x / a, sus + (1 - sus) * np.exp(-(x - a) / max(dec, 1e-4)))
    return e * np.minimum(1, np.maximum(0, (d - x) / rel))
def expdec(d, k): return np.exp(-env_x(d) * k)
def pitch(x, semis):   # resample (changes length; fine for short crowd takes)
    r = 2 ** (semis / 12); idx = np.arange(0, len(x) - 1, r); return np.interp(idx, np.arange(len(x)), x)
def rd(p):
    with wave.open(p) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768; sr = w.getframerate()
    if sr != SR: a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a)
    return a

# ---------------- buses (stereo) ----------------
music = np.zeros((n, 2)); sfx = np.zeros((n, 2)); crowd = np.zeros((n, 2)); voice = np.zeros(n)
CUES = []   # (name, level, t0, dur, bus) for the level report
def put(bus, sig, at, pan=0.0):
    sig = np.asarray(sig, float)
    if sig.ndim == 1: sig = np.stack([sig * np.sqrt((1 - pan) / 2) * 1.414, sig * np.sqrt((1 + pan) / 2) * 1.414], 1)
    s = int(round(at * SR))
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n: bus[s:e] += sig[: e - s]
# Levels on PHONES (QC, 19 Nov): a cue is set by its loudest 50 ms RMS above 250 Hz (what a phone speaker plays),
# relative to the voice's loud moments (p90 of the voice's 50 ms RMS above 250 Hz): max +7, high +1.5, mid -5, low -14 dB.
# 'max' hits are also soft-saturated first (tanh) so their energy is dense, not one spike for the limiter to shave off.
PH = {"low": -14.0, "mid": -5.0, "high": 1.5, "max": 7.0}
PH_PRE = {"max": 9.5, "high": 2.5}   # Ep 1: placed this much hotter, so that AFTER the master gain + limiter the hits measure ~ +7 / +1.5 (phone_check.py)
def hp250(x): return fft_filter(x, 250, None, 2)
def ph_max(x, a=0.0, b_=None):
    m = x if x.ndim == 1 else x.mean(1); m = hp250(m); s0 = int(a * SR); m = m[s0:] if b_ is None else m[s0:int(b_ * SR)]
    w = int(0.05 * SR); h = int(0.01 * SR)
    if len(m) <= w: return 20 * np.log10(np.sqrt((m ** 2).mean()) + 1e-12)
    c = np.cumsum(np.concatenate([[0], m ** 2])); r = (c[w::h][: (len(m) - w) // h + 1] - c[: len(m) - w + 1:h][: (len(m) - w) // h + 1]) / w
    return 10 * np.log10(r.max() + 1e-12)
def sat(x, drive=3.0): m = np.abs(x).max() or 1; return np.tanh(drive * x / m) / np.tanh(drive)
def at_phone(sig, level, win=None, extra=0.0):
    sig = np.asarray(sig, float)
    if level == "max": sig = sat(sig, 4.0); sig = fft_filter(sig, None, 8000, 4)   # Ep 2: the saturated hits' fizz above 8 kHz made the AAC encode overshoot (+3.5 dB)
    cur = ph_max(sig, *(win or (0.0, None))); return sig * db(VP90 + PH_PRE.get(level, PH[level]) + extra - cur)
def cue(name, level, sig, at, pan=0.0, bus=None, peak=None, extra=0.0):
    """place a cue at the brief's level, measured on phones (see PH)."""
    x = at_phone(sig, level, extra=extra)
    put(sfx if bus is None else bus, x, at, pan); CUES.append((name, level, at, len(x) / SR, 20 * np.log10(np.abs(x).max() + 1e-12)))

# ---------------- SFX builders ----------------
def tick(hi=True):
    c = noise(0.03) * expdec(0.03, 260); c = fft_filter(c, 2200 if hi else 1500, 4200 if hi else 3000)
    return c + 0.6 * sine(3100 if hi else 2100, 0.03) * expdec(0.03, 200) + 0.3 * sine(900 if hi else 700, 0.03) * expdec(0.03, 120)
def ting(scale=1.0):
    d = 0.6; e = expdec(d, 7) * np.minimum(1, env_x(d) / 0.002)
    return (sine(2600 * scale, d) + 0.55 * sine(5200 * scale, d) * expdec(d, 4) + 0.25 * sine(7810 * scale, d) * expdec(d, 9)) * e
def pluck(f, d=0.12):
    x = env_x(d); return (sine(f, d) + 0.4 * sine(2 * f, d) * np.exp(-x * 30)) * np.exp(-x * 30) * np.minimum(1, x / 0.002)
def whoosh(d=0.3, f0=400, f1=3000, q=1.2):
    x = env_x(d); fc = f0 * (f1 / f0) ** (x / d); return tv_band(noise(d), fc, q) * np.sin(np.pi * x / d) ** 1.5
def dhoom():
    """DHOOM: sub sweep 90->35 Hz + a low-passed thump + a cymbal crash, PLUS the phone layers (QC): a big snare/clap crack
    (200 Hz-4 kHz), a distorted copy of the boom (its harmonics 150-1500 Hz are what a phone plays) and a low brass stab."""
    d = 1.1; x = env_x(d); f = 35 + 55 * np.exp(-x * 4)
    boom = sine(f, d) * np.exp(-x * 2.6) * np.minimum(1, x / 0.004)
    boom += 0.5 * sine(2 * f, d) * np.exp(-x * 5)
    thump = fft_filter(noise(0.25), None, 180) * expdec(0.25, 18)
    crash = fft_filter(noise(d), 4500, None) * np.exp(-x * 3.2) * np.minimum(1, x / 0.01)
    dist = fft_filter(np.tanh(5 * (boom + 0.2 * sine(3 * f, d))), 150, 1600) * np.exp(-x * 3.5)
    crack = fft_filter(noise(0.16), 200, 4000) * expdec(0.16, 22) + 0.8 * sine(190 + 60 * np.exp(-env_x(0.16) * 30), 0.16) * expdec(0.16, 16)
    stab_ = sum(saw(midi(m), 0.5) for m in (36, 43, 48)) / 3; stab_ = fft_filter(stab_, 120, 2500) * expdec(0.5, 6) * np.minimum(1, env_x(0.5) / 0.004)
    o = boom * 0.9; o[: len(thump)] += thump * 1.2; o += crash * 0.25 + dist * 0.8; o[: len(crack)] += crack * 1.4; o[: len(stab_)] += stab_ * 0.7
    return o

def bloop(): x = env_x(0.2); return sine(300 + 400 * x / 0.2, 0.2) * np.sin(np.pi * x / 0.2)
def slurp(d=0.4):
    x = env_x(d); fc = 1200 * (2500 / 1200) ** (x / d); s = tv_band(noise(d), fc, 3.0)
    trem = 0.5 + 0.5 * np.sin(2 * np.pi * 30 * x) ** 2; gurgle = sine(180 + 90 * np.sin(2 * np.pi * 9 * x), d) * 0.25
    return (s * trem + gurgle * (0.5 + 0.5 * np.sin(2 * np.pi * 14 * x))) * np.sin(np.pi * x / d) ** 0.6
def stab(f, d, lp=600):
    x = env_x(d); s = saw(f, d) + saw(f * 1.006, d) + 0.7 * saw(f * 2, d)
    s = tv_lowpass(s, lp * np.ones(len(x))) + 0.8 * sine(f, d)
    return s * adsr(d, 0.004, 0.25, 0.55, 0.12)
def dun_dunn():
    a = stab(midi(28), 0.32); bb = stab(midi(29), 0.75)                                 # E1 -> F1, the second longer
    a2 = stab(midi(40), 0.32, 900) * 0.6; b2 = stab(midi(41), 0.75, 900) * 0.6          # octave double (audible on phones)
    o = np.zeros(int(1.1 * SR)); o[: len(a)] += a + a2; s = int(0.30 * SR); o[s:s + len(bb)] += bb + b2; return o
def flips():
    o = whoosh(0.4, 600, 2500) * 0.8
    for k in range(6):
        c = fft_filter(noise(0.025), 1500, 7000) * expdec(0.025, 140); s = int((0.05 + k * 0.05) * SR); o[s:s + len(c)] += c * 1.2
    return o
def drumroll(d):
    x = env_x(d); o = np.zeros(len(x)); k = 0; t0 = 0.0
    while t0 < d - 0.03:
        c = fft_filter(noise(0.03), 1500, 5000) * expdec(0.03, 90) * (0.75 + 0.25 * rng.random()); s = int(t0 * SR); o[s:s + len(c)] += c[: len(o) - s]
        t0 += 1 / 30 + rng.normal(0, 0.002); k += 1
    return o * (db(-24 + 10 * (x / d)) / db(-14))        # low -> mid ramp (normalized to mid at the end)
def stamp():
    """STAMP: 60 Hz thump + a broadband paper slap, PLUS a wooden 'whack' body (220 Hz + 3 kHz crack) for phones."""
    d = 0.4; x = env_x(d)
    th = sine(60 + 50 * np.exp(-x * 30), d) * np.exp(-x * 14) + 0.6 * sine(150, d) * np.exp(-x * 22)
    slap = fft_filter(noise(0.08), 300, 9000) * expdec(0.08, 45)
    whack = fft_filter(noise(0.12), 250, 3500) * expdec(0.12, 30) + 0.9 * sine(220 + 80 * np.exp(-env_x(0.12) * 40), 0.12) * expdec(0.12, 22)
    o = th * 0.8; o[: len(slap)] += slap * 1.4; o[: len(whack)] += whack * 1.5; return o * np.minimum(1, x / 0.001)

def sad_trombone(total=1.0):
    notes = [(midi(55), 0.2), (midi(54), 0.2), (midi(53), 0.2), (midi(52), total - 0.6)]   # G3 F#3 F3 E3
    o = []
    for k, (f, d) in enumerate(notes):
        x = env_x(d); vib = 1 + (0.025 * np.sin(2 * np.pi * 6 * x) * np.minimum(1, x / 0.15) if k == 3 else 0)
        s = saw(f * vib, d) + 0.5 * saw(f * 1.003 * vib, d)
        wah = 350 + 1400 * (0.5 - 0.5 * np.cos(2 * np.pi * x / min(d, 0.22) * (0.5 if k < 3 else 1.5)))   # 'wah' per note
        s = tv_lowpass(s, wah) * adsr(d, 0.02, 0.15, 0.85, 0.06 if k < 3 else 0.2)
        o.append(s)
    return np.concatenate(o)
def popsweep(f0=500, f1=1200, d=0.2):
    x = env_x(d); return sine(f0 + (f1 - f0) * np.minimum(1, x / 0.08), d) * np.exp(-x * 16) * np.minimum(1, x / 0.003)
def tap_ding():
    c = fft_filter(noise(0.03), 800, 6000) * expdec(0.03, 120); d = 0.45; x = env_x(d)
    bell = (sine(1600, d) + 0.4 * sine(1600 * 2.76, d) * np.exp(-x * 10)) * np.exp(-x * 7)
    o = np.zeros(int(0.5 * SR)); o[: len(c)] += c * 1.3; s = int(0.03 * SR); o[s:s + len(bell)] += bell; return o
def stomps_door():
    o = np.zeros(int(0.85 * SR))
    for k in range(3):
        d = 0.22; x = env_x(d); th = sine(80 + 60 * np.exp(-x * 25), d) * np.exp(-x * 16) + fft_filter(noise(d), 100, 900) * np.exp(-x * 40) * 0.5
        s = int(k * 0.18 * SR); o[s:s + len(th)] += th * (0.85 + 0.15 * k)
    d = 0.4; x = env_x(d); s = int(0.53 * SR)
    bang = sine(110, d) * np.exp(-x * 14) * 1.2 + fft_filter(noise(d), 1200, 9000) * np.exp(-x * 18) * 0.6
    for f, kk in ((2310, 9), (3170, 11), (4420, 8), (5830, 13), (2730, 10)): bang += sine(f, d) * np.exp(-x * kk) * 0.25 * (1 + 0.5 * np.sin(2 * np.pi * 37 * x))   # glassy rattle
    o[s:s + len(bang)] += bang[: len(o) - s]; return o
def orch_hit(d, f=midi(36)):
    """TV-serial orchestra hit: a low saw chord + noise + a 50 Hz thump, PLUS a brass stab an octave up and a
    timpani/snare crack (200 Hz-3 kHz) so the hit is loud on phones."""
    x = env_x(d); ch = sum(saw(f * r, d) for r in (1, 1.5, 2, 2.378, 3)) / 3
    ch = tv_lowpass(ch, 3000 * np.exp(-x * 4) + 400) * np.exp(-x * (3.5 if d > 0.4 else 7))
    br = sum(saw(f * 2 * r, d) + saw(f * 2 * r * 1.005, d) for r in (1, 1.189, 1.5)) / 6
    br = fft_filter(br, 200, 3000) * np.exp(-x * (3 if d > 0.4 else 6)) * np.minimum(1, x / 0.006)
    thump = sine(50 + 40 * np.exp(-x * 30), d) * np.exp(-x * 10); nz = fft_filter(noise(d), 600, 8000) * np.exp(-x * 25) * 0.6
    crack = fft_filter(noise(min(d, 0.12)), 200, 3000) * expdec(min(d, 0.12), 25)
    o = ch + thump * 0.9 + nz + br * 1.2; o[: len(crack)] += crack * 1.2
    return o * np.minimum(1, x / 0.003)

def scratch(d=0.38):
    x = env_x(d); u = x / d
    fc = np.where(u < 0.45, 2000 - 1600 * (np.clip(u, 0, 0.45) / 0.45) ** 0.7, 400 + 1100 * (np.clip(u - 0.45, 0, 1) / 0.55) ** 1.3)   # 2 kHz -> 400 -> 1.5 kHz
    nz = tv_band(noise(d), fc, 2.5); tone_ = 0.5 * saw(fc / 4, d) * 0.6
    e = np.minimum(1, x / 0.005) * np.minimum(1, (d - x) / 0.03)
    return (nz + fft_filter(tone_, 200, 4000)) * e
def brass(d=1.0):
    seq = [(midi(60), 0.18), (midi(67), 0.18), (midi(72), d - 0.36)]; o = []
    for f, dd in seq:
        x = env_x(dd); s = saw(f, dd) + saw(f * 1.004, dd) + 0.6 * saw(f * 0.5, dd)
        s = tv_lowpass(s, 600 + 3000 * np.minimum(1, x / 0.06) * (0.7 + 0.3 * np.exp(-x * 3))) * adsr(dd, 0.02, 0.2, 0.8, 0.05 if dd < 0.3 else 0.25)
        o.append(s * (1 + 0.01 * np.sin(2 * np.pi * 5.5 * x)))
    return np.concatenate(o)
def sparkle_ding():
    o = np.zeros(int(0.5 * SR))
    for k, f in enumerate((1600, 2100, 2600)):
        d = 0.35; x = env_x(d); s = (sine(f, d) + 0.3 * sine(f * 2.01, d)) * np.exp(-x * 9); st = int(k * 0.05 * SR); o[st:st + len(s)] += s
    return o
def donk():
    d = 0.55; x = env_x(d)
    wood = (sine(900, 0.04) + 0.7 * sine(2300, 0.04)) * expdec(0.04, 60)
    hollow = (sine(220, d) * np.exp(-x * 9) + 0.6 * sine(587, d) * np.exp(-x * 11) + 0.25 * sine(1340, d) * np.exp(-x * 20))
    o = hollow.copy(); o[: len(wood)] += wood * 1.6
    D = int(SR / 220 * 2); comb = o.copy()                                                # coconut ring
    for k in range(1, 6): comb[k * D:] += o[: len(o) - k * D] * (0.5 ** k)
    return comb * np.minimum(1, x / 0.0008)
def rimshot():
    o = np.zeros(int(0.75 * SR))
    for k, f in enumerate((150, 110)):
        d = 0.25; x = env_x(d); s = sine(f + 50 * np.exp(-x * 30), d) * np.exp(-x * 12) + fft_filter(noise(d), 200, 2000) * np.exp(-x * 30) * 0.3
        st = int(k * 0.15 * SR); o[st:st + len(s)] += s
    d = 0.4; x = env_x(d); tss = fft_filter(noise(d), 6000, None) * np.exp(-x * 7) * 1.1
    st = int(0.30 * SR); o[st:st + len(tss)] += tss
    sn = fft_filter(noise(0.12), 900, 6000) * expdec(0.12, 30) * 0.8; o[st:st + len(sn)] += sn
    return o
def bubbles():
    o = np.zeros(int(0.5 * SR))
    for k in range(3):
        d = 0.12; x = env_x(d); s = sine(900 - 600 * np.minimum(1, x / 0.1), d) * np.exp(-x * 18); st = int(k * 0.1 * SR); o[st:st + len(s)] += s
    return o
def end_sting():
    o = np.zeros(int(1.1 * SR))
    for k, m in enumerate((72, 76, 79, 84)):
        d = 0.8 - k * 0.1; x = env_x(d); s = (sine(midi(m), d) + 0.35 * sine(midi(m) * 3.0, d) * np.exp(-x * 8)) * np.exp(-x * 4.5); st = int(k * 0.07 * SR); o[st:st + len(s)] += s
    sp = fft_filter(noise(0.8), 7000, None) * expdec(0.8, 5) * np.abs(np.sin(2 * np.pi * 11 * env_x(0.8))) * 0.25; o[: len(sp)] += sp
    return o

# ---------------- crowd (8 in-house Gemini voices: crowd.py) ----------------
POOL = {   # takes the listener classified (crowd/check.json)
    "ooh": ["c1_00", "c1_01", "c2_00", "c2_01", "c3_01", "ooh_0a", "gasp_0a", "c1_03"],
    "gasp": ["c1_02", "c2_03", "c2_04", "gasp_3a", "c2_02", "c1_02", "c2_03", "gasp_3a"],
    "laugh": ["laugh_0a", "laugh_0b", "c1_04", "c1_05", "c2_05", "c2_06", "c3_04", "c3_05"],
    "cheer": ["hooray_0a", "hooray_0b", "c1_06", "c1_07", "c2_07", "c2_09", "c3_06", "c3_07"],
}
def trim_sil(a, th=0.03):
    m = np.abs(a).max() or 1; v = np.flatnonzero(np.abs(a) > th * m); return a[v[0]:v[-1] + 1] if len(v) else a
IR = room_ir(0.75)
def crowd_layer(kind, d, seed, swell=None, spread=0.85, stagger=(0.03, 0.15), semis=2.0, murmur=0.12, copies=1):
    """8 takes (8 voices) layered; copies=2 adds a second, quieter, decorrelated copy of each (another pitch, a later
    start point inside the take, a later offset) -> 16 layers for the laugh track."""
    r = np.random.default_rng(seed); out = np.zeros((int((d + 1.0) * SR), 2)); names = POOL[kind]
    jobs = [(j, nm, c) for c in range(copies) for j, nm in enumerate(names)]
    for j, nm, c in jobs:
        a = trim_sil(rd(f"crowd/{nm}.wav"))
        if c: a = a[int(r.uniform(0.08, 0.35) * SR):]
        a = pitch(a, r.uniform(-semis, semis) if not c else r.choice([-1, 1]) * r.uniform(1.0, 3.0)); a = a / (np.abs(a).max() or 1)
        a = fades(a, 0.01 if not c else 0.08, 0.06) * (r.uniform(0.6, 1.0) if not c else r.uniform(0.35, 0.6))
        off = r.uniform(*stagger) * (j > 0 or c > 0) + (0 if j < 4 else r.uniform(0.02, 0.12)) + (r.uniform(0.1, 0.4) if c else 0); pan = r.uniform(-spread, spread)
        s = int(off * SR); seg = a[: len(out) - s]
        out[s:s + len(seg), 0] += seg * np.sqrt((1 - pan) / 2) * 1.414; out[s:s + len(seg), 1] += seg * np.sqrt((1 + pan) / 2) * 1.414
    # pink-ish murmur bed shaped by the crowd envelope
    m = r.standard_normal(len(out)); m = fft_filter(m, 250, 2500); envl = np.abs(out).sum(1); envl = np.convolve(envl, np.ones(4410) / 4410, "same")
    m *= envl / (envl.max() or 1) * murmur
    out += np.stack([m, np.roll(m, 300)], 1)
    wet = np.stack([conv(out[:, 0], IR)[: len(out)], conv(out[:, 1], room_ir(0.75, seed=9))[: len(out)]], 1)
    out = out * 0.75 + wet * 0.35 / (np.abs(wet).max() / (np.abs(out).max() or 1) or 1)
    k = int(d * SR); x = np.arange(len(out)) / SR
    g = np.ones(len(out)) if swell is None else swell(x)
    g *= np.minimum(1, np.maximum(0, (d + 0.25 - x) / 0.35))
    return (out * g[:, None])[: int((d + 0.3) * SR)]
def applause(d, seed=3, rate=40):
    r = np.random.default_rng(seed); out = np.zeros((int(d * SR), 2)); x = np.arange(len(out)) / SR
    t0 = 0.0
    while t0 < d:
        ln = int(r.uniform(0.003, 0.008) * SR) + 80; cl = fft_filter(r.standard_normal(ln), 1000, 4000) * np.exp(-np.arange(ln) / SR * r.uniform(300, 700))
        pan = r.uniform(-0.9, 0.9); s = int(t0 * SR); seg = cl[: len(out) - s] * r.uniform(0.4, 1.0)
        out[s:s + len(seg), 0] += seg * np.sqrt((1 - pan) / 2); out[s:s + len(seg), 1] += seg * np.sqrt((1 + pan) / 2)
        t0 += r.exponential(1 / rate)
    sw = np.minimum(1, x / 0.35) * np.minimum(1, np.maximum(0, (d - x) / (d * 0.55)))
    wet = np.stack([conv(out[:, 0], IR)[: len(out)], conv(out[:, 1], room_ir(0.75, seed=9))[: len(out)]], 1)
    return (out + wet * 0.25) * sw[:, None]

# ---------------- music bed (original: pizzicato + bassoon-like reed, 120 bpm) ----------------
def reed(f, d):
    x = env_x(d); s = saw(f, d) * 0.6 + np.sign(np.sin(2 * np.pi * np.cumsum(np.full(len(x), f * 0.5)) / SR)) * 0.0
    s = tv_lowpass(s, (900 + 500 * np.exp(-x * 12)) * np.ones(len(x))) * adsr(d, 0.012, 0.08, 0.7, 0.04)
    return s * (1 + 0.02 * np.sin(2 * np.pi * 5 * x))
def pizz(f, d=0.25):
    x = env_x(d); return (sine(f, d) + 0.5 * sine(2 * f, d) * np.exp(-x * 25) + 0.2 * sine(3 * f, d) * np.exp(-x * 40)) * np.exp(-x * 16) * np.minimum(1, x / 0.002)
PROG = [(48, [60, 64, 67]), (45, [60, 64, 69]), (41, [60, 65, 69]), (43, [59, 62, 67])]     # C  Am  F  G
BASS = [0, 7, 12, 7]                                                                         # root, fifth, octave, fifth (staccato)
_cache = {}
def bed(t0, t1, bpm=120.0, g=1.0, bright=False, start_grid=None):
    """the groove between t0 and t1 on a beat grid starting at start_grid (default 0)."""
    beat = 60 / bpm; g0 = start_grid if start_grid is not None else 0.0
    k = int(np.ceil((t0 - g0) / (beat / 2) - 1e-6))
    while g0 + k * beat / 2 < t1 - 0.02:
        at_ = g0 + k * beat / 2; bar = (k // 8) % 4; root, ch = PROG[bar]; pos = k % 8
        if pos % 2 == 0:   # beats: reed bass, staccato
            key = ("r", root + BASS[(pos // 2) % 4], round(beat * 0.42, 3))
            if key not in _cache: _cache[key] = reed(midi(key[1]), key[2])
            put(music, _cache[key] * 0.55 * g, at_, -0.15)
        else:              # off-beats: pizzicato chord stabs
            for j, m in enumerate(ch):
                mm = m + (12 if bright else 0); key = ("p", mm)
                if key not in _cache: _cache[key] = pizz(midi(mm))
                put(music, _cache[key] * 0.22 * g, at_ + j * 0.008, 0.25 - 0.2 * j)
        if pos in (3, 7):   # a little 'tick' (woodblock) on 2 and 4
            key = ("w",)
            if key not in _cache: _cache[key] = (sine(1250, 0.05) + 0.5 * sine(3100, 0.05)) * expdec(0.05, 90)
            put(music, _cache[key] * 0.10 * g, at_ + beat / 2 - 0.001, 0.4)
        if bright and pos == 0:
            key = ("c",)
            if key not in _cache: _cache[key] = fft_filter(noise(0.12), 1000, 5000) * expdec(0.12, 35)
            put(music, _cache[key] * 0.12 * g, at_ + beat, 0.0)   # a clap on 2
        k += 1

# ---------------- Ep 1 synths (new: sleigh bells, calliope, spy bed, bottle spin, harp, tuba sting, ...) ----------------
def jingle(d=0.8, rate=14, seed=4):
    """sleigh bells: bright noise bursts through a 6-9 kHz band + little 2 kHz / 3.1 kHz jingles (phone-audible)."""
    r = np.random.default_rng(seed); o = np.zeros(int(d * SR)); t0 = 0.0
    while t0 < d - 0.05:
        b_ = fft_filter(r.standard_normal(int(0.06 * SR)), 6000, 9000) * expdec(0.06, 55)
        j = (sine(2000 * r.uniform(0.97, 1.03), 0.08) + 0.6 * sine(3150 * r.uniform(0.97, 1.03), 0.08)) * expdec(0.08, 40) * 0.5
        s = int(t0 * SR); o[s:s + len(b_)] += b_[: len(o) - s] * r.uniform(0.6, 1.0); o[s:s + len(j)] += j[: len(o) - s]
        t0 += 1 / rate * r.uniform(0.8, 1.2)
    return o * np.minimum(1, env_x(d) / 0.02) * np.minimum(1, (d - env_x(d)) / 0.15)
def villain_entry(d=0.9):
    """the cabin door BLASTS open (thump + crack), two slow-mo heavy steps, a low villain brass swell."""
    o = np.zeros(int(d * SR)); x = env_x(d)
    bang = sine(70 + 50 * np.exp(-env_x(0.3) * 20), 0.3) * expdec(0.3, 12) + fft_filter(noise(0.3), 300, 4000) * expdec(0.3, 25) * 1.2
    o[: len(bang)] += bang
    for t0 in (0.35, 0.68):
        st_ = sine(60 + 30 * np.exp(-env_x(0.2) * 25), 0.2) * expdec(0.2, 14) + fft_filter(noise(0.2), 150, 1200) * expdec(0.2, 30) * 0.5
        s = int(t0 * SR); o[s:s + len(st_)] += st_[: len(o) - s] * 0.8
    sw = sum(saw(midi(m), d) for m in (31, 38, 43)) / 3; sw = tv_lowpass(sw, 300 + 1800 * (x / d) ** 2) * (x / d) ** 1.5 * 0.9
    return o + sw
def calliope(d=0.85, bpm=150):
    """the musical-chairs tune: square-wave melody in 8ths at 150 BPM + an oom-pah bass (original)."""
    mel = [72, 76, 79, 76, 77, 81, 79, 76, 72, 76, 79, 84]; st8 = 60 / bpm / 2; o = np.zeros(int(d * SR))
    for k, m in enumerate(mel):
        t0 = k * st8
        if t0 >= d: break
        dd = st8 * 0.9; x = env_x(dd); sq = np.sign(np.sin(2 * np.pi * np.cumsum(np.full(len(x), midi(m))) / SR)) * 0.5 + 0.3 * sine(midi(m) * 2, dd)
        sq = fft_filter(sq, None, 4500) * adsr(dd, 0.004, 0.05, 0.7, 0.03); s = int(t0 * SR); o[s:s + len(sq)] += sq[: len(o) - s]
        bm = [48, 55][k % 2]; bs = (sine(midi(bm), st8 * 0.7) + 0.4 * saw(midi(bm), st8 * 0.7)) * expdec(st8 * 0.7, 10) * 0.6; o[s:s + len(bs)] += bs[: len(o) - s]
    return o
def needle_stop(d=0.22):
    x = env_x(d); f = 900 * np.exp(-x * 14) + 80; return (tv_band(noise(d), f * 2, 2.0) + 0.5 * saw(f, d)) * np.minimum(1, (d - x) / 0.03) * np.minimum(1, x / 0.003)
def scramble():
    o = np.zeros(int(0.42 * SR))
    for k in range(4): w = whoosh(0.12, 500 + k * 200, 3500); s = int(k * 0.09 * SR); o[s:s + len(w)] += w[: len(o) - s]
    return o
def floor_thud():
    """heavy butt-thud on the floor + chair-leg squeak; a 200 Hz-3 kHz crack so phones hear the hit."""
    d = 0.45; x = env_x(d)
    th = sine(75 + 60 * np.exp(-x * 25), d) * np.exp(-x * 10) + 0.6 * sine(150, d) * np.exp(-x * 16)
    crack = fft_filter(noise(0.14), 200, 3000) * expdec(0.14, 26) + 0.8 * sine(210 + 70 * np.exp(-env_x(0.14) * 30), 0.14) * expdec(0.14, 18)
    sq = sine(1700 + 300 * np.sin(2 * np.pi * 18 * env_x(0.18)), 0.18) * np.sin(np.pi * env_x(0.18) / 0.18) * 0.3
    o = th.copy(); o[: len(crack)] += crack * 1.4; s = int(0.12 * SR); o[s:s + len(sq)] += sq; return o * np.minimum(1, x / 0.001)
def spy_bed(d):
    """sneaky heist pizzicato (minor) + a walking bass, 100 BPM (original)."""
    o = np.zeros(int(d * SR)); bt = 0.6; seq = [45, 48, 52, 51, 50, 48, 47, 44]; k = 0; t0 = 0.0
    while t0 < d - 0.05:
        b_ = (sine(midi(seq[k % 8] - 12), 0.4) + 0.3 * sine(midi(seq[k % 8]), 0.4)) * expdec(0.4, 7) * np.minimum(1, env_x(0.4) / 0.006)
        s = int(t0 * SR); o[s:s + len(b_)] += b_[: len(o) - s]
        if k % 2 == 1:
            for j, m in enumerate((69, 72, 76)): p_ = pizz(midi(m), 0.18) * 0.35; s2 = s + int(j * 0.012 * SR); o[s2:s2 + len(p_)] += p_[: len(o) - s2]
        t0 += bt / 2; k += 1
    return o * np.minimum(1, env_x(d) / 0.15) * np.minimum(1, (d - env_x(d)) / 0.25)
def kettle():
    c = fft_filter(noise(0.02), 1500, 6000) * expdec(0.02, 200); o = np.zeros(int(0.45 * SR)); o[: len(c)] += c * 1.5
    r = np.random.default_rng(8)
    for k in range(9): f = r.uniform(400, 900); bb = sine(f * (1 + 0.6 * env_x(0.04) / 0.04), 0.04) * np.sin(np.pi * env_x(0.04) / 0.04); s = int((0.08 + k * 0.035) * SR); o[s:s + len(bb)] += bb[: len(o) - s] * 0.5
    return o
def heist_sting():
    o = np.zeros(int(0.85 * SR))
    sn = fft_filter(noise(0.03), 2000, 6000) * expdec(0.03, 150); o[: len(sn)] += sn * 1.5             # finger snap
    st_ = stab(midi(38), 0.6, 1200) + stab(midi(45), 0.6, 1400) * 0.7; s = int(0.06 * SR); o[s:s + len(st_)] += st_ * 0.7
    bh = sine(55, 0.5) * expdec(0.5, 6); o[s:s + len(bh)] += bh
    return o
def hands_in():
    o = np.zeros(int(0.45 * SR))
    for k in range(3): c = fft_filter(noise(0.05), 600, 5000) * expdec(0.05, 60); s = int(k * 0.025 * SR); o[s:s + len(c)] += c
    return o
def bottle_spin(d=0.7):
    x = env_x(d); rate = 26 * (1 - x / d) ** 1.2 + 3; ph = np.cumsum(rate) / SR
    s = tv_band(noise(d), 900 + 1300 * (1 - x / d), 1.5) * (0.55 + 0.45 * np.sin(2 * np.pi * ph))
    tock = (sine(1100, 0.06) + 0.6 * sine(2400, 0.06)) * expdec(0.06, 70); o = s * np.minimum(1, (d - 0.05 - x) / 0.05).clip(0, 1)
    o[-len(tock):] += tock * 2; return o
def spotlight():
    o = np.zeros(int(0.35 * SR))
    for t0, f in ((0.0, 1400), (0.07, 900)):
        c = fft_filter(noise(0.05), 300, 5000) * expdec(0.05, 90) + sine(f, 0.05) * expdec(0.05, 60) * 0.6; s = int(t0 * SR); o[s:s + len(c)] += c
    th = sine(90, 0.25) * expdec(0.25, 14); s = int(0.07 * SR); o[s:s + len(th)] += th * 0.8; return o
def harp_gliss(d=0.6):
    o = np.zeros(int((d + 0.4) * SR)); notes = [72, 74, 76, 79, 81, 84, 86, 88, 91, 93, 96]
    for k, m in enumerate(notes): p_ = pluck(midi(m), 0.4); s = int(k * d / len(notes) * SR); o[s:s + len(p_)] += p_ * (0.6 + 0.04 * k)
    return o
def boings():
    o = np.zeros(int(0.62 * SR))
    for k in range(3): d = 0.15; x = env_x(d); bb = sine(500 + 260 * np.sin(2 * np.pi * 14 * x) * np.exp(-x * 10), d) * np.exp(-x * 14); s = int(k * 0.2 * SR); o[s:s + len(bb)] += bb
    return o
def tension_tick(d):
    o = np.zeros(int(d * SR))
    for k in range(int(d / 0.25) + 1):
        c = tick(k % 2 == 0); s = int(k * 0.25 * SR); o[s:s + len(c)] += c[: len(o) - s] if s < len(o) else 0
    return o
def garland_drop():
    o = np.zeros(int(0.65 * SR)); w = whoosh(0.16, 2500, 500); o[: len(w)] += w
    th = sine(70 + 40 * np.exp(-env_x(0.3) * 20), 0.3) * expdec(0.3, 12) + fft_filter(noise(0.3), 250, 2500) * expdec(0.3, 22) * 0.9   # THWUMP
    s = int(0.15 * SR); o[s:s + len(th)] += th
    fw = fft_filter(noise(0.12), 400, 3000) * expdec(0.12, 30) * 0.6 + sine(160, 0.12) * expdec(0.12, 25) * 0.4; s = int(0.32 * SR); o[s:s + len(fw)] += fw   # fwump (hat)
    return o
def music_box(d=1.8):
    o = np.zeros(int((d + 0.5) * SR)); mel = [84, 88, 91, 88, 86, 84, 79, 84]; st_ = d / len(mel)
    for k, m in enumerate(mel):
        dd = 0.5; x = env_x(dd); p_ = (sine(midi(m), dd) + 0.4 * sine(midi(m) * 2.98, dd) * np.exp(-x * 9)) * np.exp(-x * 6) * np.minimum(1, x / 0.002)
        s = int(k * st_ * SR); o[s:s + len(p_)] += p_
    return o
def poppers():
    o = np.zeros(int(0.5 * SR))
    for t0 in (0.0, 0.11, 0.2): c = fft_filter(noise(0.06), 400, 7000) * expdec(0.06, 45) + sine(260, 0.06) * expdec(0.06, 40) * 0.5; s = int(t0 * SR); o[s:s + len(c)] += c
    return o
def tuba_sting():
    """'bom-bom-ba-BOM' on a low tuba-ish saw + sleigh bells (original; the series' sting, reused in Ep 2)."""
    seq = [(43, 0.16), (43, 0.16), (45, 0.12), (36, 0.55)]; o = np.zeros(int(1.35 * SR)); t0 = 0.0
    for k, (m, dd) in enumerate(seq):
        x = env_x(dd); s_ = saw(midi(m), dd) + 0.6 * saw(midi(m) * 1.004, dd) + 0.8 * sine(midi(m), dd)
        s_ = tv_lowpass(s_, (500 + 900 * np.exp(-x * 12)) * np.ones(len(x))) * adsr(dd, 0.01, 0.1, 0.75, 0.05 if k < 3 else 0.25)
        s = int(t0 * SR); o[s:s + len(s_)] += s_; t0 += dd + 0.04
    jj = jingle(0.9, 16, 9) * 0.35; s = int(0.5 * SR); o[s:s + len(jj)] += jj[: len(o) - s]
    return o
def flash_pop():
    return fft_filter(noise(0.08), 3000, None) * expdec(0.08, 40) + sine(3000, 0.08) * expdec(0.08, 60) * 0.3
def door_creak(d=0.45):
    x = env_x(d); f = 450 + 300 * np.sin(np.pi * x / d); return tv_band(saw(f, d) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * x)), f * 2, 3.0) * np.sin(np.pi * x / d)

# ---------------- Ep 2 synths (new: game-show ta-daa + quiz ding, gulp, sweat plip, crickets, cloth fwip, shuffle, glass BOINNG,
# cartoon birds, wrong-answer buzzer, stopwatch ticks, victory brass); everything else is Ep 1's ----------------
def tada(d=0.6):
    seq = [(midi(67), 0.09), (midi(72), 0.09), (midi(79), d - 0.18)]; o = []
    for f, dd in seq:
        x = env_x(dd); s = saw(f, dd) + saw(f * 1.005, dd) + 0.5 * saw(f * 1.5, dd)
        o.append(tv_lowpass(s, 900 + 3500 * np.minimum(1, x / 0.03) * np.ones(len(x))) * adsr(dd, 0.008, 0.12, 0.75, 0.04 if dd < 0.2 else 0.2))
    o = np.concatenate(o); sp = sparkle_ding()[: len(o)]; o[: len(sp)] += sp * 0.5; return o
def quiz_ding():
    d = 0.5; x = env_x(d); return (sine(1320, d) + 0.5 * sine(1320 * 2.0, d) * np.exp(-x * 8) + 0.3 * sine(1980, d)) * np.exp(-x * 6) * np.minimum(1, x / 0.002)
def card_whoosh():
    o = np.zeros(int(0.55 * SR)); w = whoosh(0.3, 500, 3500); o[: len(w)] += w; dg = quiz_ding(); s = int(0.22 * SR); o[s:s + len(dg)] += dg[: len(o) - s] * 0.8; return o
def gulp():
    d = 0.3; x = env_x(d); f = 420 * np.exp(-x * 7) + 110
    g_ = sine(f, d) * np.sin(np.pi * np.minimum(1, x / 0.22)) ** 0.7; c = tv_band(noise(d), f * 3, 3.0) * np.exp(-x * 14) * 0.6
    return (g_ + c) * np.minimum(1, x / 0.004)
def plip():
    d = 0.14; x = env_x(d); return sine(900 + 2200 * np.minimum(1, x / 0.05), d) * np.exp(-x * 30) * np.minimum(1, x / 0.002)
def crickets(d=0.7):
    o = np.zeros(int(d * SR))
    for t0 in np.arange(0.0, d - 0.15, 0.32):
        for k in range(3):   # a chirp = 3 fast pulses of a 4.5 kHz tone
            dd = 0.025; c = sine(4500, dd) * np.sin(np.pi * env_x(dd) / dd); s = int((t0 + k * 0.035) * SR); o[s:s + len(c)] += c[: len(o) - s]
    return o
def fwip():
    d = 0.22; x = env_x(d); fc = 900 * (4000 / 900) ** (x / d); return tv_band(noise(d), fc, 1.5) * np.sin(np.pi * x / d) ** 2
def shuffle(d):
    r = np.random.default_rng(12); o = np.zeros(int(d * SR)); t0 = 0.0
    while t0 < d - 0.2:
        dd = 0.16; c = fft_filter(r.standard_normal(int(dd * SR)), 300, 2500) * np.sin(np.pi * env_x(dd) / dd) ** 2
        s = int(t0 * SR); o[s:s + len(c)] += c[: len(o) - s] * r.uniform(0.6, 1.0); t0 += r.uniform(0.3, 0.4)
    return o
def boinng():
    """glass BOINNG: a thud + a struck-glass ring (1.1 kHz + 2.8 kHz) with a fast wobble, PLUS a 'boing' spring (phone band)."""
    d = 0.75; x = env_x(d)
    th = sine(90 + 60 * np.exp(-x * 25), d) * np.exp(-x * 12) + fft_filter(noise(d), 200, 3000) * np.exp(-x * 30) * 0.9
    wob = 1 + 0.035 * np.sin(2 * np.pi * 14 * x) * np.exp(-x * 2)
    ring = (sine(1100 * wob, d) + 0.7 * sine(2800 * wob, d) * np.exp(-x * 3) + 0.3 * sine(4150 * wob, d) * np.exp(-x * 6)) * np.exp(-x * 4.5) * (0.75 + 0.25 * np.sin(2 * np.pi * 9 * x))
    boing = sine(260 + 180 * np.sin(2 * np.pi * 11 * x) * np.exp(-x * 4), d) * np.exp(-x * 5) * 0.8
    o = th * 1.1 + ring * 0.7 + boing; return o * np.minimum(1, x / 0.001)
def birds(d=0.8):
    o = np.zeros(int(d * SR))
    for k, t0 in enumerate(np.arange(0.0, d - 0.12, 0.2)):
        dd = 0.12; x = env_x(dd); f = 2000 + 2000 * np.sin(np.pi * x / dd) * (1 if k % 2 else 0.8)
        c = sine(f, dd) * np.sin(np.pi * x / dd); s = int(t0 * SR); o[s:s + len(c)] += c[: len(o) - s]
    return o
def buzzer(d=0.4):
    x = env_x(d); sq = np.sign(np.sin(2 * np.pi * 110 * x)) + np.sign(np.sin(2 * np.pi * 117 * x))
    return fft_filter(sq, None, 3000) * np.minimum(1, x / 0.005) * np.minimum(1, (d - x) / 0.03)
def sw_tick():
    c = fft_filter(noise(0.025), 2500, 7000) * expdec(0.025, 200); return c + 0.7 * sine(2600, 0.025) * expdec(0.025, 160)
def victory_brass(d=0.65):
    seq = [(midi(72), 0.1), (midi(72), 0.1), (midi(72), 0.1), (midi(79), d - 0.3)]; o = []
    for f, dd in seq:
        x = env_x(dd); s = saw(f, dd) + saw(f * 1.004, dd) + 0.6 * saw(f * 0.5, dd)
        o.append(tv_lowpass(s, 800 + 3000 * np.minimum(1, x / 0.04) * np.ones(len(x))) * adsr(dd, 0.01, 0.1, 0.8, 0.03 if dd < 0.2 else 0.15))
    return np.concatenate(o)

# ---------------- voices (first: every cue is levelled against them) ----------------
VPK = -9
def phone_eq(x):
    """the boss on speakerphone: telephone band 300-3400 Hz (steep), a touch of saturation, a small-speaker resonance at 1.8 kHz."""
    y = fft_filter(x, 300, 3400, 4); y = np.tanh(2.2 * y / (np.abs(y).max() or 1))
    return y + 0.25 * fft_filter(y, 1500, 2200, 2)
for l in L:
    a = rd(f"vo/L{l['i']}.wav")
    if l["who"] == "boss": a = phone_eq(a)
    voice_line = norm(a, VPK); s = int(l["start"] * SR); e = min(n, s + len(voice_line)); voice[s:e] += voice_line[: e - s]
_vh = hp250(voice); _w = int(0.05 * SR)
_vr = [20 * np.log10(np.sqrt((_vh[int(t * SR):int(t * SR) + _w] ** 2).mean()) + 1e-12) for l in L for t in np.arange(l["start"], l["start"] + l["dur"] - 0.05, 0.05)]
_vr = np.array(_vr); VP90 = float(np.percentile(_vr[_vr > -60], 90)); print(f"voice phone-band 50 ms RMS p90 (pre-master): {VP90:.1f} dBFS")

# ======================= PLACE EVERYTHING (brief's SFX table, beats.json = the picture's numbers) =======================
B = b
def stereo_rd(p):
    with wave.open(p) as w: a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float).reshape(-1, w.getnchannels()) / 32768
    return a if a.shape[1] == 2 else np.repeat(a, 2, 1)
FAAAH = stereo_rd("/home/user/content-arena/tools/anim2d/sfx/faaah.wav"); FA_ON = json.load(open("faaah/faaah.json"))["onset_s"]   # reused as-is (0.4 s)
WIN = []   # (name, level, measure from, measure to) for phone_check.py
def C(name, level, sig, at, pan=0.0, win=None, bus=None, extra=0.0):
    cue(name, level, sig, at, pan, bus=bus, extra=extra); d = len(sig) / SR
    WIN.append((name, level, at + (win[0] if win else 0.0), at + (win[1] if win else min(d, 1.0))))
def crowd_cue(name, level, x, at, win=(0.0, 0.6), extra=0.0):
    x = at_phone(x, level, win, extra); put(crowd, x, at); CUES.append((name, level, at, len(x) / SR, 20 * np.log10(np.abs(x).max() + 1e-12))); WIN.append((name, level, at + win[0], at + win[1]))
def faaah(name, onset, extra=0.0):
    x = FAAAH.copy(); cur = ph_max(x, FA_ON, FA_ON + 1.0); x = x * db(VP90 + PH_PRE["max"] + extra - cur)      # no extra saturation: the file is built hot
    put(sfx, x, onset - FA_ON); CUES.append((name, "max", onset, 1.2, 20 * np.log10(np.abs(x).max() + 1e-12))); WIN.append((name, "max", onset, onset + 1.0))
X = json.load(open("mix_extra.json")) if os.path.exists("mix_extra.json") else {}   # per-cue trims (dB) found with phone_check.py
x_ = lambda k: X.get(k, 0.0)
# Ramesh's laugh-cry (the owner's 😭😂): a non-verbal take on the voice bus, from the reaction cut (after the 0.3 s silence)
_rc = norm(rd("vo/react.wav"), VPK); _rc = fades(_rc, 0.005, 0.15); _s = int(B["react"] * SR); voice[_s:_s + len(_rc)] += _rc[: n - _s]
# ---- Ep 4 synths ----
def clap1(r_):
    d = 0.09; c = fft_filter(r_.standard_normal(int(d * SR)), 700, 3500) * expdec(d, 55); return c + 0.4 * sine(1100, d) * expdec(d, 80)
def limp_claps():
    """three limp, flat claps from the team + Suresh's eager fast ones on top."""
    r_ = np.random.default_rng(31); o = np.zeros(int(0.75 * SR))
    for t0 in (0.0, 0.24, 0.5):
        for j in range(3): c = clap1(r_) * r_.uniform(0.35, 0.55); s_ = int((t0 + j * 0.012) * SR); o[s_:s_ + len(c)] += c[: len(o) - s_]
    for t0 in np.arange(0.03, 0.65, 0.085): c = clap1(r_) * 0.9; s_ = int(t0 * SR); o[s_:s_ + len(c)] += c[: len(o) - s_]   # Suresh
    return o
def keyboard(d):
    r_ = np.random.default_rng(14); o = np.zeros(int(d * SR)); t0 = 0.0
    while t0 < d - 0.03:
        c = fft_filter(r_.standard_normal(int(0.02 * SR)), 1500, 6000) * expdec(0.02, 220) + 0.5 * sine(r_.uniform(1800, 2600), 0.02) * expdec(0.02, 260)
        s_ = int(t0 * SR); o[s_:s_ + len(c)] += c[: len(o) - s_] * r_.uniform(0.5, 1.0); t0 += r_.uniform(0.035, 0.08)
    return o * np.minimum(1, (d - env_x(d)) / 0.1)
def shloop(d=0.5):
    """vacuum SHLOOP: a hollow band sweeping down fast with a slurp tremolo, then a cork 'pop'."""
    x = env_x(d); fc = 3200 * (300 / 3200) ** (x / d) ** 0.7; s_ = tv_band(noise(d), fc, 2.5) * (0.6 + 0.4 * np.sin(2 * np.pi * 26 * x) ** 2)
    s_ += 0.5 * sine(900 * (200 / 900) ** (x / d), d); s_ *= np.sin(np.pi * np.minimum(1, x / (d * 0.85))) ** 0.5
    p_ = popsweep(400, 1300, 0.12); st_ = int((d - 0.12) * SR); s_[st_:st_ + len(p_)] += p_[: len(s_) - st_] * 1.2; return s_
def phone_rings(d=1.0):
    """three overlapping phone rings (two-tone trills at three pitches)."""
    o = np.zeros(int(d * SR)); x = env_x(d)
    for k, (f, off) in enumerate(((1250, 0.0), (1480, 0.12), (1700, 0.25))):
        tr = (sine(f, d) + 0.7 * sine(f * 1.26, d)) * (np.sin(2 * np.pi * 18 * x) > 0) * 0.5
        e = ((x - off) % 0.5 < 0.32) * (x >= off); o += tr * e * (1 - 0.15 * k)
    return fft_filter(o, None, 6000) * np.minimum(1, (d - x) / 0.05)
def dial(d=0.65):
    o = np.zeros(int(d * SR)); w = whoosh(0.3, 3000, 400); o[: len(w)] += w * 0.8
    for k, (f1, f2) in enumerate(((697, 1209), (770, 1336), (852, 1477), (941, 1336))):
        b_ = (sine(f1, 0.07) + sine(f2, 0.07)) * 0.5 * np.minimum(1, (0.07 - env_x(0.07)) / 0.01); s_ = int((0.3 + k * 0.085) * SR); o[s_:s_ + len(b_)] += b_[: len(o) - s_]
    return o
def kaching():
    """cash register: a drawer CLUNK + two bell strikes + coin shimmer."""
    o = np.zeros(int(0.7 * SR))
    cl = sine(120, 0.12) * expdec(0.12, 30); nz_ = fft_filter(noise(0.08), 300, 3000) * expdec(0.08, 50); cl[: len(nz_)] += nz_; o[: len(cl)] += cl
    for t0, f in ((0.08, 2093), (0.2, 2637)):
        d = 0.45; x = env_x(d); bell = (sine(f, d) + 0.6 * sine(f * 2.76, d) * np.exp(-x * 9) + 0.3 * sine(f * 5.4, d) * np.exp(-x * 14)) * np.exp(-x * 6)
        s_ = int(t0 * SR); o[s_:s_ + len(bell)] += bell[: len(o) - s_]
    j = jingle(0.4, 22, 5) * 0.4; s_ = int(0.25 * SR); o[s_:s_ + len(j)] += j[: len(o) - s_]; return o
def count_ding(semis=0):
    d = 0.45; x = env_x(d); f = 1568 * 2 ** (semis / 12); return (sine(f, d) + 0.5 * sine(2 * f, d) * np.exp(-x * 8)) * np.exp(-x * 7) * np.minimum(1, x / 0.002)
def card_stamps():
    o = np.zeros(int(1.6 * SR)); w = whoosh(0.25, 600, 3500); o[: len(w)] += w * 0.7
    for k, t0 in enumerate((B["stamp1"], B["stamp2"], B["stamp3"])):
        st_ = stamp() * (1.0 if k < 2 else 1.25); s_ = int((t0 - B["stamp1"] + 0.05) * SR); o[s_:s_ + len(st_)] += st_[: len(o) - s_]
    return o
# ---- the cue table (brief) ----
# L1 (hook)
C("villain entry (slow steps + brass)", "high", fades(villain_entry(0.9)[int(0.25 * SR):int(0.83 * SR)], 0.02, 0.1), 0.0, 0.1, win=(0.0, 0.5), extra=x_("entry"))
C("DHOOM (గైస్!)", "max", dhoom(), B["dhoom"] - 0.01, win=(0.0, 0.45), extra=x_("dhoom"))
C("limp claps (Suresh hardest)", "mid", limp_claps(), B["clap"], -0.2, win=(0.0, 0.7))
# L2-L5
C("keyboard clatter (2 AM flashback)", "low", keyboard(1.0), B["keys"], 0.3, win=(0.0, 1.0))
C("vacuum SHLOOP (టీమ్‌వర్క్)", "mid", shloop(0.5), B["shloop"] - 0.05, 0.2)
C("three phone rings (night calls)", "low", phone_rings(1.0), B["rings"], 0.3, win=(0.0, 1.0))
C("heroic brass + bulb ding (విజన్ నాది!)", "mid", np.concatenate([ting()[: int(0.12 * SR)] * 0.8, brass(0.9)]), B["bulb"], -0.1)
oo = crowd_layer("ooh", 0.6, 11, swell=lambda x: np.minimum(1, 0.35 + 0.65 * x / 0.3) * np.maximum(0.15, 1 - np.maximum(0, x - 0.4) * 2.5))
crowd_cue("team 'ooooh?!'", "high", oo, B["ooh"], (0.0, 0.35))
C("follow pop", "mid", popsweep(500, 1200), B["fol0"] + 0.02)
C("whoosh to the cabin + speed-dial beeps", "low", dial(0.65), B["wh0"], 0.2, win=(0.0, 0.65), extra=3.0)
C("follow tap + ding", "mid", tap_ding(), B["tFol"])
# L6-L7
faaah("FAAAH (I delivered... successfully!)", B["faaah"], x_("faaah"))
C("cash-register KA-CHING (Well done!)", "mid", kaching(), B["kaching"], 0.2, win=(0.0, 0.5))
# L8-L10
C("bloop (డౌట్.)", "low", bloop(), B["bloop"])
C("count ding 1 (చేశాను)", "mid", count_ding(0), B["k1"])
C("count ding 2 (తీసుకున్నారు)", "mid", count_ding(4), B["k2"])
C("snare drumroll (ఎవరికొస్తుంది సార్?)", "low", drumroll(B["roll1"] - B["roll0"]), B["roll0"], extra=6.0, win=(B["roll1"] - B["roll0"] - 0.4, B["roll1"] - B["roll0"]))
# L11 punch block
C("FREEZE: record scratch + flash pop", "max", scratch(0.3) + np.pad(flash_pop(), (0, int(0.3 * SR) - len(flash_pop()))), B["frz"] - 0.02, win=(0.0, 0.3), extra=1.2 + x_("frz"))
C("sad trombone wah-wah-waaah (laugh-cry)", "high", sad_trombone(1.3), B["trombone"] + 0.05, -0.15, win=(0.0, 1.0), extra=x_("trombone"))
C("comedy sting: tuba bom-bom-ba-BOM (series)", "high", tuba_sting(), B["sting"], 0.15, win=(0.0, 1.0), extra=x_("sting"))
lt3 = crowd_layer("laugh", 1.9, 35, swell=lambda x: np.where(x < 0.7, 1.0, np.maximum(db(-12), 1 - (x - 0.7) * 0.8)), stagger=(0.0, 0.08), semis=2.5, murmur=0.15, copies=2)
crowd_cue("laugh track (reaction)", "high", lt3, B["laugh"], (0.0, 0.6), extra=x_("laugh"))
C("ending card: whoosh + 3 STAMPS", "high", card_stamps(), B["stamp1"] - 0.05, win=(0.0, 1.4), extra=x_("stamps"))
# L12 CTA + end card
C("comment-bubble pops", "mid", bubbles(), B["tCm"])
C("end-card sting", "mid", end_sting(), B["endSting"])

# ---------------- music: the bouncy office bed (series groove); cut on each max ----------------
bed(B["dhoom"] + 0.5, B["ooh"], 120, g=0.8)                                    # the meeting
bed(B["m6"] - 0.3, B["faaah"], 120, g=0.75, start_grid=B["m6"] - 0.3)          # the cabin (cut dead on the FAAAH)
bed(B["boss"] + 0.1, B["roll0"], 120, g=0.7, start_grid=B["boss"] + 0.1)       # after the FAAAH, under the doubt (dies for the drumroll)
bed(B["card0"] + 1.4, DUR, 120 * 1.08, g=0.85, bright=True, start_grid=B["card0"] + 1.4)   # upbeat tag from the last stamp to the end card
gate = np.ones(n)
def cut(t0, t1, fade=0.012):
    a, b_ = int(t0 * SR), int(t1 * SR); gate[a:b_] = 0
    f = int(fade * SR); gate[max(0, a - f):a] = np.minimum(gate[max(0, a - f):a], np.linspace(1, 0, a - max(0, a - f)))
    gate[b_:b_ + f] = np.minimum(gate[b_:b_ + f], np.linspace(0, 1, len(gate[b_:b_ + f])))
music *= gate[:, None]

# voice -3 dB around every max hit that touches a word (QC): 20 ms ramps
vd = np.ones(n)
for name, lev, t0, d, pk in CUES:
    if lev == "max": vd[int((t0 - 0.02) * SR):int((t0 + 0.45) * SR)] = db(-3)
vd = np.convolve(vd, np.ones(882) / 882, "same"); voice *= vd
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
vact = np.clip(act * 3, 0, 1)
music_duck = 1 - (1 - db(-9)) * vact                           # bed -9 dB under the voice
# music -15 dB around every max hit (where it isn't already cut)
hit = np.zeros(n)
for name, lev, t0, d, bus in CUES:
    if lev == "max": a, b_ = int(t0 * SR), int(min(DUR, t0 + min(d, 1.0)) * SR); hit[a:b_] = 1
hit = np.convolve(hit, np.ones(441) / 441, "same"); music_duck *= 1 - (1 - db(-15)) * np.clip(hit, 0, 1)
MUS_PK = -16                                                    # the bed's own peak (un-ducked)
music = music / (np.abs(music).max() or 1) * db(MUS_PK)
mix = music * music_duck[:, None] + sfx + crowd + np.stack([voice, voice], 1)
# the 0.4 s TOTAL silence before the punch (every bus; digital zero) + the hard ends
a, b_ = int(B["sil0"] * SR), int(B["sil1"] * SR); f = int(0.01 * SR)
mix[a - f:a] *= np.linspace(1, 0, f)[:, None]; mix[a:b_] = 0
mix[-int(0.03 * SR):] *= np.linspace(1, 0, int(0.03 * SR))[:, None]

# ---------------- master: loudness gain + true-peak limiter ----------------
def write(p, x):
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    with wave.open(p, "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
def measure(p):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True).stderr
    tail = r[r.rfind("Summary:"):]; I = float(tail.split("I:")[1].split("LUFS")[0]); tp = float(tail.split("Peak:")[1].split("dBFS")[0])
    lra = float(tail.split("LRA:")[1].split("LU")[0]); return I, tp, lra
def upsample4(x):
    N = len(x); X = np.fft.rfft(x); Y = np.zeros(4 * N // 2 + 1, complex); Y[: len(X)] = X; return np.fft.irfft(Y, 4 * N) * 4
def tp_limiter(x, ceil_db=-1.2, look=0.005, rel=0.08):
    ceil = db(ceil_db); pk = np.zeros(len(x))
    for c in range(2):
        u = upsample4(x[:, c]); pk = np.maximum(pk, np.abs(u).reshape(-1, 4).max(1)[: len(x)])
    need = np.minimum(1, ceil / np.maximum(pk, 1e-9))
    la = int(look * SR); g = np.minimum.accumulate(np.concatenate([need, np.ones(la)])[::-1])[::-1] if False else need.copy()
    # Ep 2 (AAC overshoot fix): a centred min over +-la, then a centred moving average over la -> the gain ramps down over
    # ~2.5 ms instead of stepping (a step = a broadband click that the AAC encoder turned into +3.5 dB overs); still <= need
    from numpy.lib.stride_tricks import sliding_window_view
    padded = np.concatenate([np.ones(la), need, np.ones(la)]); g1 = sliding_window_view(padded, 2 * la + 1).min(1)[: len(x)]
    h_ = la // 2; c_ = np.cumsum(np.concatenate([np.ones(h_ + 1), g1, np.ones(h_)])); g = (c_[2 * h_ + 1:] - c_[:-2 * h_ - 1])[: len(x)] / (2 * h_ + 1)
    g = np.minimum(g, g1)
    out_g = np.empty_like(g); cur = 1.0; rc = np.exp(-1 / (rel * SR)); ac = np.exp(-1 / (0.0015 * SR))
    for i in range(len(g)):
        tgt = g[i]; cur = tgt if tgt < cur else tgt + (cur - tgt) * rc
        out_g[i] = cur
    out_g = np.minimum(out_g, g)
    return x * out_g[:, None], out_g
write("mix_pre.wav", mix)
I0, tp0, _ = measure("mix_pre.wav")
TARGET = -15.0
CEIL = -3.5                                                     # Ep 2 (QC, 21 Nov): AAC added ~2.8 dB on low punchy hits -> ceiling -3.5 dBTP so the mp4 stays <= -1 dBTP
gain_db = min(TARGET - I0, 6.0)                                 # cap: never push the hits more than ~6 dB into the limiter
mix = np.stack([fft_filter(mix[:, c], None, 16000, 4) for c in range(2)], 1)   # Ep 2: nothing above 16 kHz (AAC drops it anyway)
y, gl = tp_limiter(mix * db(gain_db), CEIL)
a0, b0 = int(B["sil0"] * SR), int(B["sil1"] * SR); y[a0:b0] = 0
write("mix.wav", y)
if os.environ.get("STEMS"):   # SFX + crowd only (same master gain + limiter gain), for the per-cue phone check
    write("stem_fx.wav", (sfx + crowd) * db(gain_db) * gl[:, None])
I1, tp1, lra = measure("mix.wav")
print(f"pre: I={I0:.1f} LUFS TP={tp0:.1f} dBTP | gain {gain_db:+.1f} dB | final: I={I1:.1f} LUFS TP={tp1:.1f} dBTP LRA={lra:.1f} | max limiter GR {20*np.log10(gl.min()):.1f} dB")

# ---------------- level report (final mix peaks) ----------------
G = db(gain_db)
rep = {"integrated_lufs": I1, "true_peak_dbtp": tp1, "lra": lra, "master_gain_db": round(gain_db, 2), "max_gr_db": round(float(20 * np.log10(gl.min())), 2), "cues": [], "voices": []}
for name, lev, t0, d, bus in CUES:
    a, b_ = int(t0 * SR), int(min(DUR, t0 + d) * SR)
    if b_ <= a: continue
    own = bus + gain_db + 20 * np.log10(gl[a:b_].min())   # (bus = the cue's placed peak, dBFS)          # the cue's own peak in the final mix (after master gain + limiter)
    mixpk = 20 * np.log10(np.abs(y[a:b_]).max() + 1e-9)              # everything in that window (voice included)
    rep["cues"].append({"cue": name, "level": lev, "t": round(t0, 2), "dur": round(d, 2), "cue_peak_dbfs": round(float(own), 1), "mix_peak_in_window_dbfs": round(float(mixpk), 1)})
for l in L:
    a, b_ = int(l["start"] * SR), int((l["start"] + l["dur"]) * SR); v = voice[a:b_] * G * gl[a:b_]
    rep["voices"].append({"line": l["i"], "who": l["who"], "final_peak_dbfs": round(float(20 * np.log10(np.abs(v).max() + 1e-9)), 1)})
bm = music * music_duck[:, None] * G * gl[:, None]
rep["music_bed_peak_under_voice_dbfs"] = round(float(20 * np.log10(np.abs(bm[(vact > 0.9)]).max() + 1e-9)), 1)
rep["music_bed_peak_open_dbfs"] = round(float(20 * np.log10(np.abs(bm).max() + 1e-9)), 1)
s0, s1 = int(B["sil0"] * SR), int(B["sil1"] * SR); rep["silence_before_punch_s"] = round((s1 - s0) / SR, 3); rep["silence_max_abs"] = float(np.abs(y[s0:s1]).max())
json.dump(rep, open("mix_levels.json", "w"), indent=1, ensure_ascii=False)
for c in rep["cues"]: print(f"  {c['t']:6.2f}  {c['level']:4s} {c['cue_peak_dbfs']:6.1f}  {c['cue']}")
print("voice peaks:", [v["final_peak_dbfs"] for v in rep["voices"]], "| bed under voice", rep["music_bed_peak_under_voice_dbfs"], "open", rep["music_bed_peak_open_dbfs"])
print("silence", rep["silence_before_punch_s"], "s, max", rep["silence_max_abs"])
os.remove("mix_pre.wav")
json.dump(WIN, open("cues.json", "w"), indent=0, ensure_ascii=False)
print("mix ok", DUR)
