"""Deepam special soundtrack: a soft, reverent synthesized score (D drone + slow pad + soft bell tones, no drums) that
rises to the flame, with gentle SFX: crowd murmur, bus hum, a passing train, counter ticks, soft bell chimes as the rail
lamps light, a diya-lighting whoosh and a soft bell at the flame. Built on the QC-fixed 23 Nov mix.py: the DSP helpers, the phone-band
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
def whoosh(d=0.35, f0=500, f1=2400, q=1.2):
    x = env_x(d); fc = f0 * (f1 / f0) ** (x / d); return tv_band(noise(d), fc, q) * np.sin(np.pi * x / d) ** 1.5
def pluck(f, d=0.3):
    x = env_x(d); return (sine(f, d) + 0.3 * sine(2 * f, d) * np.exp(-x * 20)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
def pop_(f0=500, f1=1100, d=0.12): x = env_x(d); return sine(f0 + (f1 - f0) * x / d, d) * np.sin(np.pi * x / d)
def tick(): c = fft_filter(noise(0.03), 900, 2600) * expdec(0.03, 160); return c + 0.4 * sine(1500, 0.03) * expdec(0.03, 120)   # soft counter tick
def bell(f=660, d=2.6):   # a soft temple-bell-like chime: inharmonic partials, slow decay, low-passed, gentle attack
    x = env_x(d); a = np.minimum(1, x / 0.006)
    r = sum(g * sine(f * h, d) * np.exp(-x * k) for h, g, k in ((1, 1.0, 1.4), (2.0, 0.5, 2.2), (2.76, 0.35, 3.0), (5.4, 0.15, 5.0)))
    return fft_filter(r * a, None, 5000, 2)
def murmur(d, seed=3):   # a distant crowd: band noise with slow syllable-like wobble in a few formant bands
    r = np.random.default_rng(seed); x = env_x(d); o = np.zeros(len(x))
    for fc, g in ((350, 1.0), (800, 0.7), (1600, 0.35)):
        b = fft_filter(r.standard_normal(len(x)), fc * 0.7, fc * 1.4, 2)
        w = np.abs(fft_filter(r.standard_normal(len(x)), None, 6, 2)); w = w / (w.max() or 1)
        o += g * b * (0.35 + 0.65 * w)
    return o * np.minimum(1, x / 0.8) * np.minimum(1, (d - x) / 0.8)
def bus_hum(d):
    x = env_x(d); e = fft_filter(saw(48 + 3 * np.sin(2 * np.pi * 0.3 * x), d), None, 260, 2) + 0.5 * fft_filter(noise(d), 60, 300, 2)
    return e * np.minimum(1, x / 0.5) * np.minimum(1, (d - x) / 0.6)
def train(d):
    x = env_x(d); r = fft_filter(noise(d), 50, 400, 2) * 0.8
    for t0 in np.arange(0.1, d - 0.1, 0.32):
        for dt in (0, 0.09):
            s = int((t0 + dt) * SR); c = fft_filter(noise(0.05), 150, 900) * expdec(0.05, 70); r[s:s + len(c)] += c[: len(r) - s] * 1.4
    return r * np.sin(np.pi * x / d) ** 0.7
def steps(d, rate=2.2):   # soft barefoot steps
    o = np.zeros(int(d * SR))
    for t0 in np.arange(0, d - 0.08, 1 / rate): s = int(t0 * SR); c = fft_filter(noise(0.06), 90, 600) * expdec(0.06, 60); o[s:s + len(c)] += c[: len(o) - s]
    return o
def shimmer(d):
    x = env_x(d); o = sum(sine(midi(m), d) * (0.5 + 0.5 * np.sin(2 * np.pi * (3 + k) * x)) for k, m in enumerate((86, 90, 93, 98)))
    return o * np.sin(np.pi * x / d) ** 2 * 0.25
def diya(d=1.4):   # the lighting: a breathy rising whoosh + a soft flutter of flame
    x = env_x(d); w = tv_band(noise(d), 250 * (8 ** (x / d)), 0.9) * np.sin(np.pi * np.minimum(1, x / 0.9)) ** 1.2
    fl = fft_filter(noise(d), 150, 900) * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * x)) * np.clip((x - 0.5) / 0.4, 0, 1) * np.exp(-np.maximum(0, x - 0.9) * 3)
    return w + 0.5 * fl

# ---------------- place the cues (beats.json = the picture's numbers) ----------------
C("crowd murmur (wide)", "low", murmur(B["fam0"] + 0.3), 0.0, -0.1, -2)
C("crowd murmur (dusk)", "low", murmur(B["loop0"] - B["fam1"] + 0.2, 5), B["fam1"] - 0.1, 0.1, -2)
C("crowd murmur (path)", "low", murmur(B["fam1"] - B["fam0"], 7), B["fam0"], 0.0, -4)
for k, c in enumerate(B["CE"]):
    n_ = max(4, int(c["cnt"] / 0.065))
    tk = np.zeros(int((c["cnt"] + 0.05) * SR))
    for j in range(n_): s = int(j * c["cnt"] / n_ * SR); x_ = tick() * (0.6 + 0.4 * j / n_); tk[s:s + len(x_)] += x_[: len(tk) - s]
    C(f"counter ticks {k+1}", "low", tk, c["t0"], 0.15, -4)
    C(f"counter lands {k+1}", "low", pluck(midi(81), 0.35), c["t0"] + c["cnt"], 0.15)
C("cut back wide whoosh", "low", whoosh(0.3, 700, 2200), B["wide2"] - 0.1, 0.0)
C("pin drop", "low", pop_(900, 450, 0.14), B["pin"] + 0.3, 0.3)
C("rail slides in", "low", whoosh(0.3, 600, 1800), B["rail"], -0.6)
C("bus hum", "low", bus_hum(B["busEnd"] - B["bus0"] + 0.3), B["bus0"], -0.3, -2)
C("train passing", "low", train(3.6), B["train"], 0.4, -1)
cp = np.zeros(int(1.4 * SR))
for j in range(18): s = int((0.1 + j * 0.06) * SR); x_ = pop_(600 + 20 * (j % 6), 1000, 0.06) * 0.5; cp[s:s + len(x_)] += x_[: len(cp) - s]
C("police caps pop in", "low", cp, B["caps"], 0.0)
cc = np.zeros(int(1.6 * SR))
for j in range(4): s = int((0.35 + j * 0.12) * SR); x_ = np.concatenate([pluck(midi(96), 0.08), pluck(midi(96), 0.08)]) * 0.5; cc[s:s + len(x_)] += x_[: len(cc) - s]
C("CCTV poles rise + soft beeps", "low", np.pad(whoosh(0.5, 300, 1400), (0, len(cc) - int(0.5 * SR))) + cc, B["cctv"], 0.0)
C("follow tap", "soft", np.concatenate([tick(), np.zeros(int(0.03 * SR)), pluck(midi(88), 0.35)]), B["tF"] - 0.02, 0.4)
C("subscribe tap", "soft", np.concatenate([tick(), np.zeros(int(0.03 * SR)), pluck(midi(91), 0.35)]), B["tS"] - 0.02, 0.4)
C("the 14-km loop draws", "low", shimmer(B["loop1d"] - B["loop0d"] + 0.3), B["loop0d"], 0.0)
C("cut to the path", "low", whoosh(0.3, 800, 2400), B["fam0"] - 0.12, 0.2)
C("barefoot steps", "low", steps(B["fam1"] - B["fam0"]), B["fam0"], -0.2, -3)
C("cut back to the hill", "low", whoosh(0.3, 2400, 800), B["fam1"] - 0.1, -0.2)
for k, t0 in enumerate(B["lamps"][:5]): C(f"rail lamp {k+1} lights (bell)", "low", bell(midi(76 + [0, 2, 4, 7, 9][k]), 1.8), t0, -0.6)
C("rail lamp 6 lights (bell)", "soft", bell(midi(88), 2.2), B["lamps"][5], -0.6)
C("comment question pop", "low", pop_(500, 1000, 0.12), B["cq"], 0.0)
for k, t0 in enumerate(B["cb"]): C(f"comment plip {k+1}", "low", pop_(700, 1300, 0.09), t0, -0.4 + 0.4 * k)
C("diya-lighting whoosh (the flame)", "soft", diya(1.4), B["fl"] - 0.55, 0.0)
C("the flame: soft bell", "soft", bell(midi(74), 3.2) + 0.6 * bell(midi(81), 3.2), B["fl"] + 0.45, 0.0)
C("share pop", "low", whoosh(0.3, 600, 2000), B["share"], 0.2)
C("share tap", "low", np.concatenate([tick(), pluck(midi(86), 0.3)]), B["tShare"], 0.2)
C("end-card follow tap", "low", np.concatenate([tick(), pluck(midi(84), 0.3)]), B["tEF"], 0.3)

# ---------------- music: a soft reverent drone + pad (no drums), rising to the flame, cut dead at the loop ----------------
IR = room_ir(2.2)
def pad(ms, d, g=1.0, bright=1100):
    x = env_x(d); o = sum(saw(midi(m) * (1 + det), d, ph) for m in ms for det, ph in ((-0.003, 0.1), (0.003, 0.6)))
    o = fft_filter(o, 110, bright, 2); return o * np.minimum(1, x / 1.2) * np.minimum(1, (d - x) / 1.0) * g / len(ms)
def drone(d, g=1.0):   # Sa-Pa drone (D-A) with a slow breathing swell
    x = env_x(d); o = sum(gg * fft_filter(saw(midi(m), d, ph), None, 700, 2) for m, gg, ph in ((38, 1.0, 0.0), (45, 0.7, 0.3), (50, 0.6, 0.7)))
    return o * (0.75 + 0.25 * np.sin(2 * np.pi * 0.12 * x)) * np.minimum(1, x / 1.5) * np.minimum(1, (d - x) / 0.6) * g
FL = B["fl"]; END = B["loop0"]
put(music, drone(END + 0.2, 0.5), 0.0, 0.0)
PROG = [[62, 66, 69], [62, 67, 71], [61, 64, 69], [62, 66, 69]]   # D  G/D  A  D
bar = 3.2; t_ = 0.0; k = 0
while t_ < FL - 0.5:
    lift = 0.6 + 0.6 * min(1, t_ / FL)                               # the bed rises slowly towards the flame
    put(music, pad(PROG[k % 4], min(bar + 1.0, FL - t_ + 0.4), lift, 900 + 900 * t_ / FL), t_, 0.0)
    for j, m in enumerate(PROG[k % 4]): put(music, bell(midi(m + 12), 2.2) * 0.12 * lift, t_ + j * 0.55, -0.3 + 0.3 * j)
    t_ += bar; k += 1
put(music, pad([50, 57, 62, 66, 69, 74], END - FL + 0.9, 1.9, 2600), FL - 0.6, 0.0)   # the flame: a warm full D swell
put(music, pad([74, 78, 81], END - FL + 0.4, 0.8, 3200), FL + 0.2, 0.0)
music = np.stack([conv(music[:, c], IR * 0.22)[:n] + music[:, c] for c in range(2)], 1)

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
