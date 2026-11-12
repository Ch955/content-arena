"""What-if #1 'redo one day' soundtrack, all synthesized here (original, no film music): a soft piano + strings bed
(A minor at night -> a single piano note at the turn -> sparse notes in the flashback -> warm C major strings for the
replay -> a gentle piano bed for the share/close), a ticking clock synced to the corner countdown (and a louder
tick-tock for the 5 s comment countdown), notification pings (open + loop), our own marimba ringtone for the phone,
and paper SFX synced to ep.html (calendar flips, coin clinks, stamp, pops, whooshes, taps).
Reads timeline.json + beats.json (node render.js --beats); voices on top with ducking -> mix.wav."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); b = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
rng = np.random.default_rng(13)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n: dst[s:e] += sig[: e - s] * gain
def env_x(d): return np.arange(int(d * SR)) / SR
def piano(m, d=2.5, vel=1.0):
    x = env_x(d); f = midi(m); out = np.zeros_like(x)
    for k in range(1, 7):
        fk = f * k * (1 + 0.0004 * k * k)
        out += np.sin(2 * np.pi * fk * x) / k ** 1.4 * np.exp(-x * (1.6 + 0.9 * k))
    out *= np.minimum(1, x / 0.004) * vel
    return out
def strings(m, d, att=0.6, rel=0.8):
    x = env_x(d); f = midi(m); out = np.zeros_like(x)
    for det in (-0.003, 0, 0.0035):
        for k in range(1, 6):
            out += np.sin(2 * np.pi * f * (1 + det) * k * x + k * det * 50) / k ** 1.6
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * x)
    return out * np.minimum(1, x / att) * np.minimum(1, np.maximum(0, (d - x) / rel)) * vib / 4
def mallet(m, d=0.35):
    x = env_x(d); f = midi(m)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
def tone(f, d, decay=8):
    x = env_x(d); return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def noise(d, decay): x = env_x(d); return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = env_x(d); f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def add(*sigs):  # sum signals of different lengths
    o = np.zeros(max(len(x) for x in sigs))
    for x in sigs: o[:len(x)] += x
    return o
def smooth(sig, k=8):  # cheap low-pass (moving average)
    return np.convolve(sig, np.ones(k) / k, mode="same")

music = np.zeros(n)
AM, F, C, G = [57, 60, 64], [53, 57, 60], [48, 55, 64], [55, 59, 62]
# 1) night bed: piano arpeggios + quiet strings, Am F C G (76 bpm), from the open to the comment countdown
beat = 60 / 76
def arp_bed(t0, t1, prog, g=1.0, octave=12):
    k = 0
    while t0 + k * beat / 2 < t1 - 0.2:
        at = t0 + k * beat / 2; ch = prog[(k // 8) % len(prog)]
        if k % 8 == 0:
            put(music, piano(ch[0] - 12, 3.0, 0.9), at, 0.30 * g)
            put(music, strings(ch[0], min(beat * 4 + 0.3, t1 - at), 0.5, 0.6), at, 0.10 * g)
            put(music, strings(ch[2], min(beat * 4 + 0.3, t1 - at), 0.5, 0.6), at, 0.07 * g)
        put(music, piano(ch[k % 3] + octave, 1.4, 0.8 if k % 2 else 1.0), at, 0.11 * g)
        k += 1
arp_bed(0.15, b["CD0"], [AM, F, C, G])
# 2) the 5 s countdown: held Am strings + a heartbeat (no voice)
CD0, CD1 = b["CD0"], b["CD1"]
for m, g in ((45, 0.13), (57, 0.09), (64, 0.06)): put(music, strings(m, CD1 - CD0 + 0.4, 0.3, 0.5), CD0, g)
for k in range(int(round(CD1 - CD0))):
    for j, dt in enumerate((0, 0.17)): put(music, tone(52, 0.2, 16), CD0 + k + 0.35 + dt, 0.45 - 0.15 * j)
# 3) the turn: music drops to a single soft piano note; sparse notes through the flashback and the "later" line
put(music, piano(45, 4.5, 1.0), b["turn"] + 0.05, 0.35); put(music, piano(57, 4.5, 0.7), b["turn"] + 0.05, 0.18)
for at, m in ((b["tTime"], 64), (b["fb0"] + 0.3, 69), (b["fb0"] + 1.8, 67), (b["tCut"] + 0.35, 64),
              (b["back8"] + 0.2, 60), (b["back8"] + 1.4, 59), (b["tLater"], 57), (b["tStill"], 52)):
    put(music, piano(m, 3.0, 0.8), at, 0.16)
put(music, strings(45, b["rp0"] - b["back8"] + 0.3, 0.8, 0.4), b["back8"], 0.08)
# 4) the replay: a shimmer swell, then warm C major strings + a gentle piano melody
RP = b["rp0"]
for j, m in enumerate((60, 64, 67, 72, 76, 79)): put(music, piano(m, 2.0, 0.6), RP - 0.05 + j * 0.05, 0.10)
t_end_rp = b["sh0"] + 0.4
for j, ch in enumerate([C, F, C, G, C]):
    seg = (t_end_rp - RP) / 5; at = RP + j * seg
    for m, g in zip(ch, (0.12, 0.09, 0.07)): put(music, strings(m, seg + 0.6, 0.45, 0.6), at, g)
for at, m in ((b["conn"] + 0.2, 72), (b["conn"] + 0.9, 76), (S(10) + 0.1, 79), (b["tAnnam"], 77), (b["tAnnam"] + 0.7, 76), (E(10), 72)):
    put(music, piano(m, 2.2, 0.8), at, 0.12)
# 5) share + close: soft piano bed in C (C G Am F) to the end card; it thins out for the loop
arp_bed(b["sh0"] + 0.1, b["tAdigo"], [C, G, AM, F], g=0.85)
put(music, strings(57, DUR - b["tAdigo"] + 0.3, 0.2, 0.4), b["tAdigo"], 0.07)

sfx = np.zeros(n)
def ping(at, g=0.3):   # notification ping (two soft bell tones)
    for j, (m, dt) in enumerate(((88, 0), (93, 0.11))):
        put(sfx, add(tone(midi(m), 0.7, 7), 0.3 * tone(midi(m) * 2.01, 0.4, 12)), at + dt, g * (1 - 0.2 * j))
def tick(at, g=0.18, hi=True):
    put(sfx, add(smooth(noise(0.02, 220), 3) * 0.7, tone(3200 if hi else 2400, 0.02, 160)), at, g)
def flip(at, g=0.35):   # paper page flip
    put(sfx, smooth(noise(0.16, 18), 6) * np.linspace(0.3, 1, int(0.16 * SR)), at, g)
def pop_(at, g=0.18, f0=400, f1=1100): put(sfx, sweep(f0, f1, 0.12, 14), at, g)
def whoosh(at, d=0.4, g=0.3): x = env_x(d); put(sfx, smooth(noise(d, 1), 30) * np.sin(np.pi * x / d), at, g)
RING = [76, 79, 84, 79, 76, 72]   # our own marimba ringtone motif
def ringtone(t0, t1, g=0.22):
    k = 0
    while t0 + k * 0.14 < t1:
        put(sfx, mallet(RING[k % 6] + (0 if (k // 6) % 2 == 0 else 2), 0.3), t0 + k * 0.14, g); k += 1
        if k % 6 == 0: k += 2
ping(b["ping0"], 0.32); ping(b["ping1"], 0.32)
# corner clock ticks (each time the countdown chip changes), quiet; loud tick-tock in the comment countdown
tStill = b["tStill"]
for v in range(1, 59):
    at = v / 58 * tStill
    if at < 0.3 or (CD0 - 0.1 < at < CD1 + 0.1): continue
    tick(at, 0.11 if at < b["turn"] else 0.07)
for k in range(int(round((CD1 - CD0) * 2))): tick(CD0 + k * 0.5, 0.32 if k % 2 == 0 else 0.2, k % 2 == 0)
for k in range(4): tick(b["ping1"] + 0.5 + k * 0.6, 0.1)
pop_(b["titleIn"], 0.22); pop_(b["tOffer"] - 0.1, 0.16, 500, 1300); pop_(b["tHold"] - 0.05, 0.2, 300, 800)
for t0 in (b["narIn2"], b["narIn4"], S(11) - 0.15): pop_(t0, 0.15, 600, 1400)
for j, m in enumerate((84, 88)): put(sfx, tone(midi(m), 0.25, 14), b["tWink"] + j * 0.07, 0.10)   # wink ting
for t0 in (b["cal0"], b["f1"], b["f2"], b["f3"], b["f4"], b["f5"]): flip(t0)
for i in range(7):
    at = b["tEsop"] + (b["tCrore"] - b["tEsop"]) * i / 6
    put(sfx, add(tone(2600 + i * 120, 0.08, 40), 0.5 * tone(3900 + i * 160, 0.05, 60)), at, 0.10)   # coin clinks
put(sfx, add(smooth(noise(0.12, 30), 4), tone(110, 0.2, 18)), b["tStamp"], 0.35)                       # MISSED stamp
put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), b["tFol"], 0.35)                         # follow tap
for i in range(4): pop_(b["fan0"] + 0.15 + i * 0.18, 0.13, 350 + i * 80, 900 + i * 80)
for t0 in b["cb"]: pop_(t0, 0.12, 700, 1500)
whoosh(b["sweep"], 0.45, 0.3); flip(b["tFlip"], 0.4)
whoosh(b["fb0"] - 0.15, 0.4, 0.22); whoosh(b["back8"] - 0.1, 0.35, 0.18)
# flashback: the phone rings -> cut (red) -> missed call
ringtone(b["fb0"] + 0.15, b["tCut"], 0.2)
put(sfx, sweep(700, 220, 0.25, 8), b["tCut"], 0.3)
put(sfx, tone(midi(64), 0.6, 6), b["tMiss"], 0.12); put(sfx, tone(midi(60), 0.8, 5), b["tMiss"] + 0.12, 0.12)
# replay: reverse swell, laptop lid closes, ring, green tap -> connected chirp
x = env_x(0.5); put(sfx, smooth(noise(0.5, 0), 20) * (x / 0.5) ** 2, RP - 0.5, 0.25)
put(sfx, add(tone(140, 0.15, 20), smooth(noise(0.05, 60), 4) * 0.5), b["lidC"] + 0.26, 0.35)
ringtone(b["ring1"], b["swipe"], 0.2)
put(sfx, sweep(500, 1300, 0.18, 10), b["swipe"], 0.25)
for j, m in enumerate((79, 84)): put(sfx, tone(midi(m), 0.4, 8), b["tAnnam"] + 0.05 + j * 0.1, 0.07)  # heart
# share: two sends + "sent" pops, end card tap
for t0 in (b["tNan"], b["tFr"]): whoosh(t0 - 0.1, 0.35, 0.2); pop_(t0 + 0.25, 0.14, 800, 1600)
put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), b["tEF"], 0.32)

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)

act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.05, (DUR - tt) / 0.15))
mix = (music * duck * 0.9 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
