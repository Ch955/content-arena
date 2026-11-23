"""Twist story 'the mystery tiffin' soundtrack: a soft, warm synthesized score (felt-piano + pad, no drums) with gentle
SFX: the steel-lid clinks, the tea-trolley wheels, the tadka sizzle, soft countdown ticks, a soft (filtered, bell-like)
tiffin clang in the memory, the video-call ring. Built on the QC-fixed 23 Nov mix.py: the DSP helpers, the phone-band
cue levelling (VP90), the 4x-oversampled look-ahead true-peak limiter with the smoothed gain ramp and the -3.5 dBTP master
ceiling (AAC adds ~3 dB on hits, so the mp4 must measure <= -1 dBTP), nothing above 16 kHz. NO 'max'/'high' hits here:
every cue is 'low' or 'mid' (a warm emotional story). EVERYTHING is synthesized in this file (no downloaded or copied
SFX, no film music). The silent loop (last 1.5 s) is digital zero. Writes mix.wav, mix_levels.json."""
import json, os, subprocess, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); B = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR)
LI = {l["i"]: l for l in L}; S = lambda i: LI[i]["start"]; E = lambda i: LI[i]["start"] + LI[i]["dur"]
rng = np.random.default_rng(24)
db = lambda x: 10 ** (x / 20)

# ---------------- DSP helpers (23 Nov) ----------------
def env_x(d): return np.arange(int(d * SR)) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def fades(x, a=0.003, r=0.01):
    k = len(x); e = np.ones(k); na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, 1, na)
    if nr: e[-nr:] = np.minimum(e[-nr:], np.linspace(1, 0, nr))
    return x * e
def fft_filter(x, lo=None, hi=None, order=2):
    N = len(x); X = np.fft.rfft(x, 2 * N); f = np.fft.rfftfreq(2 * N, 1 / SR); g = np.ones_like(f)
    if hi: g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo: g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X * g)[:N]
def tv_band(x, fc, q=2.0, hop=256, nfft=1024):
    win = np.hanning(nfft); out = np.zeros(len(x) + nfft); f = np.fft.rfftfreq(nfft, 1 / SR); wsum = np.zeros(len(x) + nfft)
    xp = np.concatenate([x, np.zeros(nfft)])
    for s in range(0, len(x), hop):
        fr = xp[s:s + nfft] * win; c = fc[min(len(fc) - 1, s + nfft // 2)]
        g = 1 / (1 + (q * (f / c - c / np.maximum(f, 1))) ** 2)
        out[s:s + nfft] += np.fft.irfft(np.fft.rfft(fr) * g) * win; wsum[s:s + nfft] += win ** 2
    return (out / np.maximum(wsum, 1e-6))[:len(x)]
def conv(x, ir):
    N = len(x) + len(ir); X = np.fft.rfft(x, N); H = np.fft.rfft(ir, N); return np.fft.irfft(X * H)[:N]
def room_ir(rt=1.4, pre=0.015, seed=5, bright=5000):
    r = np.random.default_rng(seed); d = rt * 1.2; x = env_x(d)
    ir = r.standard_normal(len(x)) * np.exp(-6.9 * x / rt); ir = fft_filter(ir, 150, bright); ir[: int(pre * SR)] = 0
    return ir / np.abs(ir).max()
def sine(f, d):
    x = env_x(d); return np.sin(2 * np.pi * np.cumsum(np.broadcast_to(f, x.shape) / SR))
def saw(f, d, phase=0.0):
    x = env_x(d); ph = np.cumsum(np.broadcast_to(f, x.shape) / SR) + phase; return 2 * (ph % 1) - 1
def noise(d, r=rng): return r.standard_normal(int(d * SR))
def expdec(d, k): return np.exp(-env_x(d) * k)
def rd(p):
    with wave.open(p) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768; sr = w.getframerate()
    if sr != SR: a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a)
    return a

music = np.zeros((n, 2)); sfx = np.zeros((n, 2)); voice = np.zeros(n); CUES = []
def put(bus, sig, at, pan=0.0):
    sig = np.asarray(sig, float)
    if sig.ndim == 1: sig = np.stack([sig * np.sqrt((1 - pan) / 2) * 1.414, sig * np.sqrt((1 + pan) / 2) * 1.414], 1)
    s = int(round(at * SR))
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n: bus[s:e] += sig[: e - s]
# phone-band levelling (23 Nov): a cue's loudest 50 ms RMS above 250 Hz vs the voice's p90; gentle story -> low/mid only
PH = {"low": -14.0, "soft": -9.0, "mid": -5.0}
def hp250(x): return fft_filter(x, 250, None, 2)
def ph_max(x):
    m = hp250(x if x.ndim == 1 else x.mean(1)); w = int(0.05 * SR); h = int(0.01 * SR)
    if len(m) <= w: return 20 * np.log10(np.sqrt((m ** 2).mean()) + 1e-12)
    c = np.cumsum(np.concatenate([[0], m ** 2])); k = (len(m) - w) // h + 1; r = (c[w::h][:k] - c[: len(m) - w + 1:h][:k]) / w
    return 10 * np.log10(r.max() + 1e-12)
def C(name, level, sig, at, pan=0.0, extra=0.0):
    sig = np.asarray(sig, float); x = sig * db(VP90 + PH[level] + extra - ph_max(sig)); put(sfx, x, at, pan)
    CUES.append((name, level, at, len(x) / SR, 20 * np.log10(np.abs(x).max() + 1e-12)))

# ---------------- voices first (every cue is levelled against them) ----------------
VPK = -9
for l in L:
    a = rd(f"vo/L{l['i']}.wav"); a = a / (np.abs(a).max() or 1) * db(VPK); s = int(l["start"] * SR); e = min(n, s + len(a)); voice[s:e] += a[: e - s]
_vh = hp250(voice); _w = int(0.05 * SR)
_vr = np.array([20 * np.log10(np.sqrt((_vh[int(t * SR):int(t * SR) + _w] ** 2).mean()) + 1e-12) for l in L for t in np.arange(l["start"], l["start"] + l["dur"] - 0.05, 0.05)])
VP90 = float(np.percentile(_vr[_vr > -60], 90)); print(f"voice phone-band p90: {VP90:.1f} dBFS")

# ---------------- gentle SFX builders ----------------
def clink(f=2400, d=0.35, k=14):   # small steel-lid clink (inharmonic partials, soft attack)
    e = expdec(d, k) * np.minimum(1, env_x(d) / 0.0015)
    return fft_filter((sine(f, d) + 0.6 * sine(f * 2.76, d) * expdec(d, 10) + 0.35 * sine(f * 5.4, d) * expdec(d, 22)) * e, None, 7000, 2)
def wheels(d):   # trolley wheels: a soft low rumble with a slow wobble + little ticks
    x = env_x(d); r = fft_filter(noise(d), 60, 420, 2) * (0.7 + 0.3 * np.sin(2 * np.pi * 5.5 * x))
    for t0 in np.arange(0.05, d - 0.05, 0.19): s = int(t0 * SR); c = fft_filter(noise(0.02), 900, 2500) * expdec(0.02, 200) * 0.6; r[s:s + len(c)] += c[: len(r) - s]
    return r * np.minimum(1, x / 0.15) * np.minimum(1, (d - x) / 0.6)
def sizzle(d):   # tadka: filtered hiss + crackles (mustard seeds popping)
    x = env_x(d); h = fft_filter(noise(d), 2500, 7000, 2) * 0.5 * (0.8 + 0.2 * np.sin(2 * np.pi * 0.7 * x))
    for t0 in rng.uniform(0, d - 0.03, int(d * 22)):
        s = int(t0 * SR); c = fft_filter(noise(0.012), 1500, 6000) * expdec(0.012, 300) * rng.uniform(0.6, 1.6); h[s:s + len(c)] += c[: len(h) - s]
    return h * np.minimum(1, x / 0.3) * np.minimum(1, (d - x) / 0.4)
def whoosh(d=0.35, f0=500, f1=2400, q=1.2):
    x = env_x(d); fc = f0 * (f1 / f0) ** (x / d); return tv_band(noise(d), fc, q) * np.sin(np.pi * x / d) ** 1.5
def pluck(f, d=0.3):
    x = env_x(d); return (sine(f, d) + 0.3 * sine(2 * f, d) * np.exp(-x * 20)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
def pop_(f0=500, f1=1100, d=0.12): x = env_x(d); return sine(f0 + (f1 - f0) * x / d, d) * np.sin(np.pi * x / d)
def puff(d=0.4): x = env_x(d); return fft_filter(noise(d), 300, 2500) * np.exp(-x * 9) * np.minimum(1, x / 0.01)
def tick(): c = fft_filter(noise(0.04), 700, 2200) * expdec(0.04, 120); return c + 0.5 * sine(1100, 0.04) * expdec(0.04, 90)   # soft wood-block
def chime(fs=(76, 83, 88), d=1.4):
    o = np.zeros(int(d * SR))
    for k, m in enumerate(fs): s = int(k * 0.07 * SR); x = sine(midi(m), d) * expdec(d, 3.2) + 0.3 * sine(midi(m) * 2.01, d) * expdec(d, 6); o[s:] += x[: len(o) - s]
    return o
def steps(d, rate=2.6):
    o = np.zeros(int(d * SR))
    for t0 in np.arange(0, d - 0.08, 1 / rate): s = int(t0 * SR); c = fft_filter(noise(0.07), 120, 900) * expdec(0.07, 55); o[s:s + len(c)] += c[: len(o) - s]
    return o
def soft_clang():   # the tiffin hitting the floor in the memory: a bell-like steel ring, low-passed, no hard transient
    d = 1.3; x = env_x(d); a = np.minimum(1, x / 0.004)
    r = sum(g * sine(f, d) * np.exp(-x * k) for f, g, k in ((523, 1.0, 3.5), (1243, 0.6, 5), (1890, 0.4, 7), (2710, 0.25, 9)))
    return fft_filter((r + fft_filter(noise(d), 200, 900) * np.exp(-x * 30) * 0.4) * a, None, 4000, 2)
def plane(d=1.6): x = env_x(d); return fft_filter(noise(d), 150, 1200, 2) * np.sin(np.pi * x / d) ** 2
def ring2():   # a gentle two-tone marimba ring
    o = []
    for m in (79, 74, 79, 74):
        d = 0.16; x = env_x(d); o.append((sine(midi(m), d) + 0.25 * sine(midi(m) * 4, d) * np.exp(-x * 40)) * np.exp(-x * 14))
    return np.concatenate(o + [np.zeros(int(0.05 * SR))])
def blip(): return np.concatenate([pluck(midi(84), 0.1), pluck(midi(91), 0.2)])
def chair(d=0.45): x = env_x(d); return fft_filter(noise(d), 90, 600) * np.sin(np.pi * x / d) * (0.8 + 0.2 * np.sin(2 * np.pi * 14 * x))
def rustle(d=0.35): x = env_x(d); return fft_filter(noise(d), 1500, 6000) * np.sin(np.pi * x / d) ** 2 * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 9 * x)))

# ---------------- place the cues (beats.json = the picture's numbers) ----------------
C("lid tap 1 (ఆరో)", "mid", clink(2600), B["tap"] + 0.03, 0.1)
C("lid tap 2", "soft", clink(2550), B["tap"] + 0.25, 0.1)
C("trolley wheels rolling out (frame 1)", "low", wheels(2.0), 0.0, -0.6)
C("lid lift clink", "soft", clink(2200, 0.4), B["lid0"] + 0.25, 0.0)
C("steam whoosh", "low", whoosh(0.8, 300, 1500, 0.8), B["lid0"] + 0.35, -0.1)
C("hmm pluck (no name)", "low", pluck(midi(69), 0.4), B["tPeru"], 0.0)
C("heart pop", "low", pop_(600, 1200), B["heart"], -0.2)
C("sticker slap", "soft", fades(puff(0.18) + 0.3 * pluck(midi(81), 0.18)), B["tStk"], -0.3)
C("heart poof", "low", puff(0.4), B["poof"], 0.0)
C("thought bubble pop", "low", pop_(400, 900, 0.14), B["th0"], -0.3)
C("bubble out", "low", pop_(900, 500, 0.1), B["th1"] - 0.05, -0.3)
C("cut whoosh (cafeteria)", "low", whoosh(0.3, 800, 2400), B["caf"] - 0.12, 0.2)
C("tadka sizzle", "low", sizzle(B["fol0"] + 0.4 - B["caf"]), B["caf"], 0.3)
C("tadka splutter (smell cue)", "soft", sizzle(0.8), B["an5"] + 0.1, 0.4)
C("'?' pluck", "low", pluck(midi(76), 0.3), B["tQ"], 0.3)
for k, t0 in enumerate(B["rc"]): C(f"recap swish {k+1}", "low", whoosh(0.22, 700, 2600), t0, -0.4 + 0.4 * k)
C("follow tap", "soft", np.concatenate([tick(), np.zeros(int(0.03 * SR)), pluck(midi(88), 0.35)]), B["tFol"] - 0.02, 0.1)
C("spin whoosh + chime (Tiffin ఎవరిది?)", "soft", whoosh(0.5, 400, 1800) + 0.6 * chime((79, 83, 86), 0.5)[: int(0.5 * SR)], B["q0"], 0.0)
for k in range(5): C(f"countdown tick {5-k}", "low", tick(), B["CD0"] + k, 0.0)
for k, t0 in enumerate(B["cb"]): C(f"comment plip {k+1}", "low", pop_(700, 1300, 0.09), t0, -0.5 if k % 2 == 0 else 0.5)
C("NEXT DAY wipe", "low", whoosh(0.45, 400, 2000), B["rev"], 0.0)
C("footsteps (he walks in)", "low", steps(B["walk1"] - B["walk0"]), B["walk0"], 0.4)
frz = sum(sine(midi(q), 1.6) * expdec(1.6, 2.5) for q in (45, 52, 57)) * 0.5; tk = 0.25 * chime((96, 100), 0.6); frz[:len(tk)] += tk
C("freeze: soft low piano + specs tinkle", "soft", frz, B["frz"], -0.2)
C("memory: paper rustle", "low", rustle(0.35), B["fb0"] - 0.05, -0.2)
C("memory: the soft tiffin clang", "mid", soft_clang(), B["drop"] + 0.32, 0.2)
C("memory: plane far away", "low", plane(1.6), B["fbB"] + 0.1, 0.3)
C("phone card pop", "low", pop_(500, 1000, 0.12), B["fb1"], 0.3)
C("split chime", "low", chime((84, 88), 0.9), B["sp0"], 0.0)
C("chair rolls in", "low", chair(0.45), B["seat0"], -0.3)
C("video-call ring", "soft", ring2(), B["ring0"] + 0.1, 0.3)
C("call connects", "low", blip(), B["conn"], 0.3)
C("tag ding", "soft", pluck(midi(91), 0.45), B["tTag"] + 0.1, 0.2)
C("end-card follow tap", "low", np.concatenate([tick(), pluck(midi(84), 0.3)]), B["tEF"], 0.0)

# ---------------- music: felt piano + warm pad (no drums), cut dead at the loop ----------------
IR = room_ir(1.6)
def piano(f, d=1.8, vel=1.0):
    x = env_x(d); e = np.exp(-x * 2.2) * np.minimum(1, x / 0.006)
    s = sum(g * sine(f * h, d) * np.exp(-x * (1.5 + h * 0.9)) for h, g in ((1, 1.0), (2, 0.42), (3, 0.18), (4, 0.08)))
    return fft_filter(s * e * vel, None, 3200, 2)
def pad(ms, d, g=1.0):
    x = env_x(d); o = sum(saw(midi(m) * (1 + det), d, ph) for m in ms for det, ph in ((-0.003, 0.1), (0.003, 0.6)))
    o = fft_filter(o, 120, 1100, 2); return o * np.minimum(1, x / 0.9) * np.minimum(1, (d - x) / 0.9) * g / len(ms)
def score(t0, t1, prog, bpm, patt, vel=0.8, padg=0.6, lift=0):
    beat = 60 / bpm; bar = 4 * beat; t = t0; k = 0
    while t < t1 - 0.2:
        root, chord = prog[k % len(prog)]
        for j, step in enumerate(patt):
            tn = t + j * beat / 2
            if tn >= t1 - 0.1: break
            m = chord[step % len(chord)] + 12 * (step // len(chord)) + lift
            put(music, piano(midi(m), 1.6, vel * (1.0 if j == 0 else 0.75)), tn, -0.25 + 0.5 * (j % 2))
        put(music, piano(midi(root + lift), 2.4, vel * 0.9), t, 0.0)
        put(music, pad([c + lift for c in chord], min(bar + 0.6, t1 - t + 0.3), padg), t, 0.0)
        t += bar; k += 1
AM = [(45, [69, 72, 76]), (41, [65, 69, 72]), (48, [67, 72, 76]), (43, [67, 71, 74])]          # Am F C G  (curious)
WARM = [(41, [65, 69, 72]), (48, [64, 67, 72]), (45, [64, 69, 72]), (43, [62, 67, 71])]        # F C Am G  (tender)
score(0.0, B["fol0"], AM, 92, [0, 1, 2, 1, 3, 2, 1, 2], vel=0.7, padg=0.45)                     # the mystery (desk + cafeteria)
score(B["fol0"], B["q0"], AM[2:] + AM[:2], 92, [0, 2, 1, 2], vel=0.6, padg=0.4)                # follow beat (lighter)
put(music, pad([57, 64, 69], B["rev"] - B["q0"] + 0.3, 0.55), B["q0"], 0.0)                     # countdown: a soft low pad only
score(B["frz"] + 0.2, B["seat0"], WARM, 72, [0, 1, 2, 1, 2, 1], vel=0.75, padg=0.6)            # the twist: tender
score(B["seat0"], B["end0"], WARM[1:] + WARM[:1], 76, [0, 1, 2, 3, 2, 1], vel=0.85, padg=0.75, lift=0)   # the call: warm swell
for m in (48, 64, 67, 72, 76): put(music, piano(midi(m), 1.6, 0.7), B["end0"], 0.0)            # end card: C major
music = np.stack([conv(music[:, c], IR * 0.18)[:n] + music[:, c] for c in range(2)], 1)

# duck the bed under the voice (-8 dB), level it, then the silent loop
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same"); vact = np.clip(act * 3, 0, 1)
duck = 1 - (1 - db(-8)) * vact
MUS_PK = -15
music = music / (np.abs(music).max() or 1) * db(MUS_PK)
mix = music * duck[:, None] + sfx + np.stack([voice, voice], 1)
a0 = int(B["loop0"] * SR); f = int(0.02 * SR); mix[a0 - f:a0] *= np.linspace(1, 0, f)[:, None]; mix[a0:] = 0
mix[:int(0.004 * SR)] *= np.linspace(0, 1, int(0.004 * SR))[:, None]

# ---------------- master: loudness gain + true-peak limiter (23 Nov, QC-fixed) ----------------
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
    need = np.minimum(1, ceil / np.maximum(pk, 1e-9)); la = int(look * SR)
    from numpy.lib.stride_tricks import sliding_window_view
    padded = np.concatenate([np.ones(la), need, np.ones(la)]); g1 = sliding_window_view(padded, 2 * la + 1).min(1)[: len(x)]
    h_ = la // 2; c_ = np.cumsum(np.concatenate([np.ones(h_ + 1), g1, np.ones(h_)])); g = (c_[2 * h_ + 1:] - c_[:-2 * h_ - 1])[: len(x)] / (2 * h_ + 1)
    g = np.minimum(g, g1)
    out_g = np.empty_like(g); cur = 1.0; rc = np.exp(-1 / (rel * SR))
    for i in range(len(g)):
        tgt = g[i]; cur = tgt if tgt < cur else tgt + (cur - tgt) * rc; out_g[i] = cur
    out_g = np.minimum(out_g, g)
    return x * out_g[:, None], out_g
write("mix_pre.wav", mix)
I0, tp0, _ = measure("mix_pre.wav")
TARGET = -15.0
CEIL = -3.5                                                     # 23 Nov QC: AAC adds ~3 dB -> -3.5 dBTP so the mp4 stays <= -1 dBTP
gain_db = min(TARGET - I0, 6.0)
mix = np.stack([fft_filter(mix[:, c], None, 16000, 4) for c in range(2)], 1)
y, gl = tp_limiter(mix * db(gain_db), CEIL)
y[a0:] = 0
write("mix.wav", y)
I1, tp1, lra = measure("mix.wav")
print(f"pre: I={I0:.1f} LUFS TP={tp0:.1f} | gain {gain_db:+.1f} dB | final: I={I1:.1f} LUFS TP={tp1:.1f} dBTP LRA={lra:.1f} | max limiter GR {20*np.log10(gl.min()):.1f} dB")
rep = {"integrated_lufs": I1, "true_peak_dbtp": tp1, "lra": lra, "master_gain_db": round(gain_db, 2), "max_gr_db": round(float(20 * np.log10(gl.min())), 2), "cues": [], "voices": []}
for name, lev, t0, d, pk in CUES:
    a, b_ = int(t0 * SR), int(min(DUR, t0 + d) * SR)
    if b_ <= a: continue
    rep["cues"].append({"cue": name, "level": lev, "t": round(t0, 2), "cue_peak_dbfs": round(float(pk + gain_db + 20 * np.log10(gl[a:b_].min())), 1),
                        "mix_peak_in_window_dbfs": round(float(20 * np.log10(np.abs(y[a:b_]).max() + 1e-9)), 1)})
for l in L:
    a, b_ = int(l["start"] * SR), int((l["start"] + l["dur"]) * SR)
    rep["voices"].append({"line": l["i"], "who": l["who"], "final_peak_dbfs": round(float(20 * np.log10(np.abs(voice[a:b_] * db(gain_db) * gl[a:b_]).max() + 1e-9)), 1)})
bm = music * duck[:, None] * db(gain_db) * gl[:, None]
rep["music_bed_peak_under_voice_dbfs"] = round(float(20 * np.log10(np.abs(bm[(vact > 0.9)]).max() + 1e-9)), 1)
rep["music_bed_peak_open_dbfs"] = round(float(20 * np.log10(np.abs(bm).max() + 1e-9)), 1)
rep["loop_silence_s"] = round(DUR - B["loop0"], 2); rep["loop_max_abs"] = float(np.abs(y[a0:]).max())
json.dump(rep, open("mix_levels.json", "w"), indent=1, ensure_ascii=False)
for c in rep["cues"]: print(f"  {c['t']:6.2f}  {c['level']:4s} {c['cue_peak_dbfs']:6.1f}  {c['cue']}")
print("voice peaks:", [v["final_peak_dbfs"] for v in rep["voices"]], "| bed under voice", rep["music_bed_peak_under_voice_dbfs"], "open", rep["music_bed_peak_open_dbfs"])
os.remove("mix_pre.wav"); print("mix ok", DUR)
