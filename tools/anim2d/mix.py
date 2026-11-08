"""Podupu Katha #1 (2D animated) soundtrack, all synthesized here (original): playful marimba-ish bed for the
hook/riddle, a ticking-clock tension bed for the 5 s countdown (rising drone + heartbeat), a ta-da at the reveal,
a brighter bed for the answer/CTA, and SFX synced to ep.html (seed sprinkles, mouth pops, wrong buzzer, chalk puffs,
pencil scribble, claps, sparkles). Voices on top with ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]

def seg(i, k, cnt):  # same phrase finder as ep.html
    l = L[i]; e = l["env"] + [0] * 6; segs = []; on = None; low = 0
    for f, v in enumerate(e):
        if v > 0.1:
            if on is None: on = f
            low = 0
        else:
            low += 1
            if on is not None and low >= 5: segs.append((l["start"] + on / 30, l["start"] + (f - low + 1) / 30)); on = None
    if len(segs) != cnt: segs = [(l["start"] + l["dur"] * j / cnt, l["start"] + l["dur"] * (j + 1) / cnt) for j in range(cnt)]
    return segs[k]

sh2, sh3, CD0 = S(1) - 0.35, S(3) - 0.45, E(4) + 0.35
CD1, sh6 = CD0 + CDN, S(9) - 0.3
a2, b2 = seg(2, 0, 3); a2b, b2b = seg(2, 1, 3); a2c = seg(2, 2, 3)[0]
a4 = seg(4, 0, 2)[0]; a7, b7 = seg(7, 0, 2); a9c = seg(9, 2, 3)[0]
d6 = L[6]["dur"]; M0 = S(6); M1 = S(6) + 0.42 * d6
LT = lambda i: M1 + 0.1 + i * ((E(6) + 0.25 - M1) / 5)
rng = np.random.default_rng(11)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR); e = min(n, s + len(sig))
    if 0 <= s < n: dst[s:e] += sig[: e - s] * gain
def tone(f, d, decay=8):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def mallet(f, d=0.4):   # marimba-ish: fundamental + 4th partial, fast decay
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
def add(*sigs):  # sum signals of different lengths
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs: out[:len(x)] += x
    return out
def noise(d, decay): x = np.arange(int(d * SR)) / SR; return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = np.arange(int(d * SR)) / SR; f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def lp(sig, a):  # one-pole low-pass
    out = np.empty_like(sig); acc = 0.0
    for i, v in enumerate(sig): acc += a * (v - acc); out[i] = acc
    return out

music = np.zeros(n)
# playful bed, 112 bpm swing-ish (C Am F G), hook + riddle until the countdown
beat = 60 / 112; prog = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
def bed(t0, t1, up=0, g=1.0):
    k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if k % 2 == 0: put(music, tone(midi(ch[0] - 24 + up), 0.4, 7), at, 0.32 * g)              # bass
        put(music, mallet(midi(ch[(k * 2) % 3] + 12 + up)), at + (0.04 if k % 2 else 0), (0.13 if k % 2 else 0.17) * g)
        if k % 4 == 2: put(music, noise(0.05, 80), at, 0.05 * g)                                   # shaker
        k += 1
bed(0.1, CD0 - 0.1)
# countdown: tick-tock, rising drone, heartbeat
for k in range(int(CDN * 2)):
    at = CD0 + k * 0.5
    put(music, noise(0.03, 160) * 0.6 + tone(2400 if k % 2 == 0 else 1800, 0.03, 120), at, 0.35 if k % 2 == 0 else 0.22)
x = tt[(tt >= CD0) & (tt < CD1)] - CD0
drone = (np.sin(2 * np.pi * midi(45) * (1 + 0.06 * x / CDN) * x) + 0.5 * np.sin(2 * np.pi * midi(52) * (1 + 0.06 * x / CDN) * x)) * np.minimum(1, x / 0.6) * (0.08 + 0.08 * x / CDN)
put(music, drone, CD0)
put(music, lp(rng.standard_normal(int(CDN * SR)), 0.05) * np.linspace(0.0, 1.0, int(CDN * SR)) ** 2, CD0, 0.5)   # riser
for k in range(int(CDN)):
    for j, dt in enumerate((0, 0.16)): put(music, tone(55, 0.18, 18), CD0 + k + 0.3 + dt, 0.5 - 0.15 * j)            # heartbeat
# reveal: ta-da (C major arpeggio + chord) + cymbal, then a brighter bed through the CTA
for j, m in enumerate([72, 76, 79, 84]): put(music, mallet(midi(m), 0.6), CD1 + j * 0.06, 0.22)
for m in (60, 64, 67, 72): put(music, tone(midi(m), 1.4, 2.2), CD1 + 0.25, 0.10)
put(music, noise(1.4, 3) * 0.5, CD1, 0.35)
bed(CD1 + 1.2, DUR - 0.3, up=0, g=0.85)

sfx = np.zeros(n)
put(sfx, sweep(300, 900, 0.18, 10), 0.15, 0.25)                         # title pop
put(sfx, lp(noise(0.45, 5), 0.15), sh2 - 0.1, 0.45)                     # whoosh to the board
put(sfx, sweep(500, 1200, 0.12, 14), S(1) + 0.0, 0.15)                  # field pops in
for j in range(3): put(sfx, tone(1500 + j * 200, 0.06, 50), seg(1, 1, 2)[0] + j * 0.2, 0.18)  # first seeds pop
for i, (sx, sy) in enumerate([(-60, 40), (20, -90), (110, 35), (-180, 88), (-20, 104), (150, 100), (-122, 4), (-28, -14), (78, 8)]):  # sown seeds land
    tr = a2 + (b2 - a2) * min(1, max(0, (sx + 205) / 420)) * 0.9
    put(sfx, add(noise(0.02, 200), tone(2200 + i * 90, 0.03, 90)), tr + 0.38, 0.12)
for sx in (-122, -28, 78):                                              # mouth pecks the seeds
    tp = a2b + (b2b - a2b + 0.1) * min(1, max(0, (sx + 215) / 430)) - 0.05
    put(sfx, sweep(900, 300, 0.07, 30), tp + 0.08, 0.3)
put(sfx, sweep(200, 600, 0.35, 5) * (1 + 0.5 * np.sin(np.arange(int(0.35 * SR)) / SR * 2 * np.pi * 18)), a2c, 0.22)   # "?" boing
put(sfx, sweep(250, 900, 0.3, 6), sh3, 0.25)                            # Pinky pops in
for j in range(2):                                                      # wrong buzzer
    x = np.arange(int(0.22 * SR)) / SR
    put(sfx, np.sign(np.sin(2 * np.pi * (150 - j * 25) * x)) * np.exp(-x * 4) * 0.5, a4 + j * 0.24, 0.22)
for i in range(5): put(sfx, add(lp(noise(0.12, 25), 0.3), tone(1800 + i * 150, 0.08, 40) * 0.5), LT(i), 0.25)   # chalk puff per letter
k = 0
while a7 + k * 0.09 < b7:                                               # pencil scribble
    put(sfx, lp(noise(0.07, 30), 0.5), a7 + k * 0.09, 0.12); k += 1
t = S(8) - 0.15                                                          # claps: hands meet when sin(15t)=0
c0 = np.ceil(t * 15 / np.pi) * np.pi / 15
while c0 < E(8) + 0.3:
    put(sfx, lp(noise(0.06, 60), 0.6), c0, 0.5); c0 += np.pi / 15
for j in range(4): put(sfx, tone(1568 + j * 330, 0.3, 10), a9c - 0.1 + j * 0.07, 0.12)  # end-card sparkle

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)

act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.65 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.3, (DUR - tt) / 1.2))
mix = (music * duck * 0.8 + sfx + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
