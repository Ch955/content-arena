"""Moral dilemma 'Amma's chain' soundtrack: a soft 8-bit / chiptune score (triangle bass + low-passed pulse arpeggios, no
drums) and gentle 8-bit SFX: coin clinks (tokens, the chain), menu blips (the cursor), soft countdown ticks, the SAVE FILE
drain, flashback warbles, a soft 8-bit phone ring. Built on the QC-fixed 24 Nov mix.py: the DSP helpers, the phone-band cue
levelling (VP90), the 4x-oversampled look-ahead true-peak limiter with the smoothed gain ramp and the -3.5 dBTP master
ceiling (AAC adds ~3 dB on hits, so the mp4 must measure <= -1 dBTP), nothing above 16 kHz. No harsh hits: every cue is
'low' or 'soft'. EVERYTHING is synthesized in this file (no downloaded or copied SFX, no film or game music). The silent
loop (last 1.5 s) is digital zero. Writes mix.wav, mix_levels.json."""
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

# ---------------- gentle 8-bit SFX builders (all synthesized here) ----------------
def pulse(f, d, duty=0.25):
    x = env_x(d); ph = np.cumsum(np.broadcast_to(f, x.shape) / SR) % 1; return np.where(ph < duty, 1.0, -1.0)
def tri(f, d):
    x = env_x(d); ph = np.cumsum(np.broadcast_to(f, x.shape) / SR) % 1; return 4 * np.abs(ph - 0.5) - 1
def soften(x, hi=4200): return fft_filter(x, None, hi, 2)
def blip(m=84, d=0.07, duty=0.25):   # one soft square blip (menu cursor)
    return soften(fades(pulse(midi(m), d, duty) * expdec(d, 18), 0.002, 0.02), 3800)
def arp(ms, step=0.055, d=0.12, duty=0.25):
    o = np.zeros(int((step * (len(ms) - 1) + d) * SR) + 10)
    for k, m in enumerate(ms): s = int(k * step * SR); b = blip(m, d, duty); o[s:s + len(b)] += b
    return o
def coin(f=1900, d=0.32):   # a soft coin clink (inharmonic, low-passed)
    e = expdec(d, 16) * np.minimum(1, env_x(d) / 0.0015)
    return fft_filter((sine(f, d) + 0.5 * sine(f * 2.71, d) * expdec(d, 9) + 0.25 * sine(f * 4.9, d) * expdec(d, 20)) * e, None, 6500, 2)
def jingle(n=5, f0=2300):   # chain links: a few tiny clinks
    o = np.zeros(int(0.5 * SR))
    for k in range(n): s = int((0.03 + k * 0.075 + rng.uniform(0, 0.02)) * SR); c = coin(f0 * rng.uniform(0.9, 1.15), 0.18) * rng.uniform(0.5, 1); o[s:s + len(c)] += c[: len(o) - s]
    return o
def scrape(d=0.6):   # the tray sliding on the glass: soft filtered noise
    x = env_x(d); return fft_filter(noise(d), 300, 1800, 2) * np.sin(np.pi * x / d) ** 1.5 * 0.7
def whoosh(d=0.3, f0=600, f1=2400, q=1.2):
    x = env_x(d); fc = f0 * (f1 / f0) ** (x / d); return tv_band(noise(d), fc, q) * np.sin(np.pi * x / d) ** 1.5
def knock(f=180):   # soft hand pat on the steel bureau
    d = 0.18; x = env_x(d); return fft_filter(sine(f, d) * np.exp(-x * 30) + 0.4 * noise(d) * np.exp(-x * 60), None, 1500, 2)
def tick():
    o = blip(96, 0.05, 0.5) * 0.8; c = fft_filter(noise(0.03), 1500, 4000) * expdec(0.03, 140) * 0.3; o[:len(c)] += c; return o
def plip(): return arp([86, 91], 0.045, 0.08)
def warble(up=True):   # flashback: a soft pitch-bent 8-bit swoop
    d = 0.45; x = env_x(d); f = midi(72) * 2 ** ((x / d if up else 1 - x / d) * 1.0 - 0.5) * (1 + 0.02 * np.sin(2 * np.pi * 14 * x))
    return soften(tri(f, d) * np.sin(np.pi * x / d), 3000)
def ring8(): # a soft 8-bit phone ring (two short trills)
    o = []
    for r in range(2):
        for k in range(6): o.append(blip(88 if k % 2 == 0 else 84, 0.05, 0.5) * 0.8)
        o.append(np.zeros(int(0.12 * SR)))
    return np.concatenate(o)
def rustle(d=0.3): x = env_x(d); return fft_filter(noise(d), 1500, 6000) * np.sin(np.pi * x / d) ** 2 * (0.6 + 0.4 * np.abs(np.sin(2 * np.pi * 9 * x)))
def creak(d=0.4): x = env_x(d); return soften(tri(220 + 60 * np.sin(2 * np.pi * 3 * x), d) * np.sin(np.pi * x / d) * 0.6, 1500)
def drain(d=0.8):   # SAVE FILE draining: a soft descending 8-bit run
    return arp([84, 81, 79, 76, 74, 72, 69, 67, 64, 62], d / 10, 0.1, 0.5)

# ---------------- place the cues (beats.json = the picture's numbers) ----------------
C("token slide on the glass", "low", scrape(0.55), B["tok0"], -0.3)
C("token coin clink", "soft", coin(2100), B["tok1"] - 0.05, -0.3)
C("tray slides in", "low", scrape(0.65), B["tray0"], 0.4)
C("tray stops: clink", "low", coin(1700, 0.25), B["tray1"] - 0.05, 0.3)
C("punch-in: chain jingle", "soft", jingle(4), B["punch"], 0.2)
C("title blip", "low", arp([72, 76, 79, 84], 0.05), B["titleIn"], 0.0)
C("ledger taps", "low", np.concatenate([knock(240), knock(240)]), B["vaddi"], 0.4)
C("interest meter up", "low", arp([79, 83, 86], 0.05), B["int0"] + 0.1, 0.5)
C("answer-at-the-end chip", "low", blip(88, 0.1), B["ans0"], 0.0)
C("cut home: whoosh", "low", whoosh(0.3), B["home"] - 0.12, 0.0)
C("locker pat 1", "low", knock(170), B["pat"], -0.3)
C("locker pat 2", "low", knock(170), B["pat"] + 0.17, -0.3)
C("Keerthi freezes: low blip", "low", blip(60, 0.25, 0.5), B["frz"], 0.4)
C("game boot", "soft", arp([60, 64, 67, 72, 76, 79, 84], 0.045, 0.1), B["game0"], 0.0)
C("cursor A", "low", blip(84), B["curA"], -0.2)
C("cursor B", "low", blip(84), B["curB"], -0.2)
for k, h in enumerate(B["hops"]): C(f"cursor hop {k+1}", "low", blip(84, 0.06), h, -0.2, -5)
C("follow tap", "soft", np.concatenate([blip(91, 0.06), np.zeros(int(0.03 * SR)), blip(96, 0.12)]), B["tFol"] - 0.02, 0.1)
for k in range(5): C(f"countdown tick {5-k}", "low", tick(), B["CD0"] + k, 0.0)
for k, t0 in enumerate(B["cb"]): C(f"comment plip {k+1}", "low", plip(), t0, -0.5 if k % 2 == 0 else 0.5)
C("B selected jingle", "soft", arp([72, 76, 79, 84, 88], 0.06, 0.14), B["pick"], 0.0)
C("cut: next morning", "low", whoosh(0.3), B["shop2"] - 0.12, 0.0)
C("SAVE FILE drain", "low", drain(0.8), B["drain0"], 0.2)
C("chain lifted: jingle", "soft", jingle(5), B["lift"], 0.3)
C("chain handed over", "low", jingle(3, 2000), B["hand"] - 0.1, -0.2)
C("cut: corridor", "low", whoosh(0.3), B["corr"] - 0.12, 0.0)
C("receipt rustle", "low", rustle(0.35), B["rc0"], 0.4)
C("flashback in (ward)", "soft", warble(True), B["fbA"] - 0.15, 0.0)
C("8-bit phone ring", "low", ring8(), B["fbB"] + 0.05, -0.3)
C("flashback out", "low", warble(False), B["now1"] - 0.15, 0.0)
C("match: 14 AUG ding", "soft", arp([84, 91], 0.08, 0.25), B["mK"] + 0.2, 0.0)
C("flashback in (locker)", "low", warble(True), B["fbC"] - 0.15, 0.0)
C("locker creak", "low", creak(0.4), B["fbC"] + 0.05, -0.3)
C("flashback out 2", "low", warble(False), B["now2"] - 0.15, 0.0)
C("cut: dining", "low", whoosh(0.3), B["dine"] - 0.12, 0.0)
C("chain laid on the table", "low", jingle(3, 1800), B["lay"] + 0.35, -0.1)
C("house rule banner", "low", arp([67, 72, 76, 79], 0.06, 0.12), B["rule"], 0.0)
C("wrist tap 1", "low", knock(300), B["tapW"] + 0.28, 0.2)
C("wrist tap 2", "low", knock(300), B["tapW"] + 0.5, 0.2)
C("02 SEP inset ding", "soft", arp([79, 86], 0.08, 0.25), B["inset0"], 0.0)
C("laugh sparkle", "low", arp([84, 88, 91, 96], 0.05, 0.1), B["laugh"], 0.2)
C("comment check blip", "low", blip(91, 0.12), B["ck0"], 0.0)
C("tag ding", "soft", arp([88, 93], 0.07, 0.3), B["tTag"] + 0.1, 0.2)
C("end-card follow tap", "low", np.concatenate([blip(91, 0.06), blip(96, 0.12)]), B["tEF"], 0.0)

# ---------------- music: soft chiptune (triangle bass + low-passed pulse arps, no drums), cut dead at the loop ----------------
IR = room_ir(0.9)
def note(m, d, kind="pulse", vel=1.0, duty=0.25):
    x = env_x(d); f = midi(m)
    w = pulse(f, d, duty) if kind == "pulse" else tri(f, d)
    e = np.minimum(1, x / 0.006) * np.exp(-x * (3.0 if kind == "pulse" else 1.2)) * np.minimum(1, (d - x) / 0.03)
    return soften(w * e * vel, 3200 if kind == "pulse" else 2000)
def chip(t0, t1, prog, bpm, patt, vel=0.8, bassv=1.0, lead=None, octv=12):
    beat = 60 / bpm; bar = 4 * beat; t = t0; k = 0
    while t < t1 - 0.15:
        root, chord = prog[k % len(prog)]
        for j, step in enumerate(patt):
            tn = t + j * beat / 2
            if tn >= t1 - 0.1: break
            m = chord[step % len(chord)] + octv * (step // len(chord))
            put(music, note(m, beat * 0.45, "pulse", vel * (1.0 if j % 4 == 0 else 0.7), 0.125 if j % 2 else 0.25) * 0.5, tn, -0.3 + 0.6 * (j % 2))
        for q in range(2):   # bass on beats 1 and 3
            tb = t + q * 2 * beat
            if tb < t1 - 0.1: put(music, note(root + (7 if q else 0), beat * 1.8, "tri", bassv), tb, 0.0)
        if lead:
            for (off, m, dl) in lead[k % len(lead)]:
                tl = t + off * beat
                if tl < t1 - 0.15: put(music, note(m, dl * beat, "pulse", 0.55, 0.5) * 0.6, tl, 0.15)
        t += bar; k += 1
AMIN = [(45, [69, 72, 76]), (41, [65, 69, 72]), (43, [67, 71, 74]), (40, [64, 68, 71])]        # Am F G E (tense)
MENU = [(48, [72, 76, 79]), (45, [69, 72, 76]), (41, [65, 69, 72]), (43, [67, 71, 74])]        # C Am F G (game menu)
TEND = [(41, [65, 69, 72]), (48, [64, 67, 72]), (45, [64, 69, 72]), (43, [62, 67, 71])]        # F C Am G (tender)
WARM = [(48, [64, 67, 72]), (43, [62, 67, 71]), (45, [64, 69, 72]), (41, [65, 69, 72])]        # C G Am F (warm)
chip(0.0, B["home"], AMIN, 100, [0, 1, 2, 1, 0, 1, 2, 3], vel=0.6)                                  # the counter: tense
chip(B["home"], B["game0"], AMIN[1:] + AMIN[:1], 100, [0, 2, 1, 2], vel=0.45, bassv=0.8)         # home: lighter irony
chip(B["game0"] + 0.35, B["CD0"], MENU, 120, [0, 1, 2, 3, 2, 1, 0, 1], vel=0.5, bassv=0.8)        # the CHOOSE menu theme
for k in range(5): put(music, note(45, 0.9, "tri", 0.9), B["CD0"] + k, 0.0)                       # countdown: only a soft pulse bass
chip(B["corr"], B["dine"], TEND, 80, [0, 1, 2, 1, 2, 1], vel=0.4, bassv=0.75)                     # the twist: tender, sparse
chip(B["dine"], B["laugh"], TEND[2:] + TEND[:2], 84, [0, 2, 1, 2], vel=0.38, bassv=0.7)
chip(B["laugh"], B["end0"], WARM, 104, [0, 1, 2, 3, 2, 1, 2, 1], vel=0.5, bassv=0.85,
     lead=[[(0, 79, 1), (1, 76, 1), (2, 79, 1.5)], [(0, 74, 1), (1, 79, 1), (2, 83, 1.5)], [(0, 76, 1), (1, 72, 1), (2, 76, 1.5)], [(0, 77, 1), (1, 76, 1), (2, 72, 1.5)]])
put(music, arp([72, 76, 79, 84, 88], 0.07, 0.4, 0.25) * 0.6, B["end0"], 0.0)                     # end card: C major jingle
music = np.stack([conv(music[:, c], IR * 0.12)[:n] + music[:, c] for c in range(2)], 1)

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
gain_db = min(TARGET - I0, 7.5)
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
