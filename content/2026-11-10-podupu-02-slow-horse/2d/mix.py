"""Podupu Katha #2 (2D animated) soundtrack, all synthesized here (original): playful marimba-ish bed for the
hook/story, a ticking-clock tension bed for the 5 s countdown (rising drone + heartbeat), a ta-da at the reveal,
a brighter bed for the answer/CTA, and SFX synced to ep.html (pops, a whinny, slow plods + slide whistle for the
crawl, a whisper, dust poof + gallops, button taps, buzzer, swap whoosh, trophy fanfare, sticker stamp, claps,
share whooshes, sparkles). Voices on top with ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]

D = lambda i: L[i]["dur"]
def segs_of(i):  # same phrase finder as ep.html
    l = L[i]; e = l["env"] + [0] * 6; segs = []; on = None; low = 0
    for f, v in enumerate(e):
        if v > 0.1:
            if on is None: on = f
            low = 0
        else:
            low += 1
            if on is not None and low >= 5: segs.append((l["start"] + on / 30, l["start"] + (f - low + 1) / 30)); on = None
    return segs
def ph(i, frac):  # phrase start nearest to `frac` of the line (same as ep.html)
    est = S(i) + D(i) * frac
    if frac <= 0: return S(i)
    best, bd = est, 0.45
    for a_, _ in segs_of(i):
        if abs(a_ - est) < bd: best, bd = a_, abs(a_ - est)
    return best

sh2, sh3, sh4 = S(2) - 0.35, S(7) - 0.3, S(8) - 0.45
CD0 = E(9) + 0.35; CD1 = CD0 + CDN; sh7 = S(14) - 0.3
tKid, tFlag, tBub, tGrain, s4, e4 = ph(2, 0.3), S(3) + 0.25 * D(3), S(3) + 0.1, ph(3, 0.6), S(4) - 0.1, S(5) - 0.15
tGFb, tR, eR = ph(5, 0.45), ph(6, 0.42), E(6) + 0.15
tTapF, tTapS = S(7) + D(7) * 0.45, S(7) + D(7) * 0.86
tSw = ph(10, 0.45); tJ0 = tSw + 0.35; tP2 = ph(11, 0.5)
r0, tW, tL2, eL = S(12) - 0.05, S(12) + 0.5 * D(12), ph(12, 0.55), E(12) - 0.05
tTick, tShTap, tFol = ph(14, 0.45), S(15) + 0.35, ph(15, 0.6)
a9 = S(9)
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
def pop_(at, g=0.2, f0=300, f1=900): put(sfx, sweep(f0, f1, 0.16, 10), at, g)
def hoof(at, g=0.3): put(sfx, add(lp(noise(0.05, 70), 0.25), tone(140, 0.07, 40)), at, g)
def whinny(at, g=0.16):   # FM "neigh": rising then falling with a fast vibrato
    d = 0.75; x = np.arange(int(d * SR)) / SR
    f = 700 + 700 * np.sin(np.pi * x / d) ** 0.7 - 250 * x / d + 60 * np.sin(2 * np.pi * 24 * x)
    sig = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.03) * np.exp(-x * 1.8)
    put(sfx, sig + 0.3 * np.sin(2 * np.pi * np.cumsum(2 * f) / SR) * np.exp(-x * 3), at, g)
pop_(0.15, 0.25)                                                       # title pop
put(sfx, sweep(600, 1400, 0.2, 8), S(1) - 0.1, 0.22)                   # ANSWER AT THE END sticker
put(sfx, lp(noise(0.45, 5), 0.15), sh2 - 0.1, 0.45)                    # whoosh to the board
pop_(S(2) - 0.05, 0.2, 250, 700)                                       # the elder pops in
pop_(tKid, 0.18, 400, 1000); pop_(tKid + 0.15, 0.18, 450, 1100)        # the two sons
pop_(S(3) - 0.05, 0.15, 300, 800); whinny(S(3) + 0.05)                 # horses + whinny
for j in range(2): put(sfx, sweep(500 + j * 200, 1200 + j * 200, 0.14, 12), S(3) + 0.3 + j * 0.12, 0.14)  # they hop on
put(sfx, lp(noise(0.35, 6), 0.4) * np.sin(np.linspace(0, 60, int(0.35 * SR))), tFlag, 0.12)               # flag flutter
pop_(tBub, 0.18, 500, 1100); put(sfx, tone(1760, 0.2, 12), tGrain, 0.12)                                 # bubble + 🌾 ding
x = np.arange(int(1.2 * SR)) / SR                                       # comic slide whistle down for the crawl
put(sfx, np.sin(2 * np.pi * np.cumsum(1400 - 900 * x / 1.2) / SR) * np.minimum(1, x / 0.05) * np.exp(-x * 1.2), s4 + 0.1, 0.1)
k = 0
while s4 + 0.2 + k * 0.55 < e4: hoof(s4 + 0.2 + k * 0.55, 0.18); k += 1  # slow plods
pop_(S(5) - 0.05, 0.16, 250, 650)                                       # grandfather
put(sfx, lp(noise(0.7, 3), 0.5) * np.minimum(1, np.arange(int(0.7 * SR)) / SR / 0.1), tGFb - 0.05, 0.1)  # "psst" whisper
pop_(tGFb, 0.15, 500, 1100)
for j in range(2): put(sfx, sweep(300, 1000, 0.25, 6), S(6) - 0.05 + j * 0.08, 0.16)   # sons jump
put(sfx, lp(noise(0.5, 5), 0.2), S(6) + 0.1, 0.5)                       # dust poof
put(sfx, lp(noise(0.6, 3), 0.3), tR - 0.05, 0.3)                        # zoom whoosh
k = 0
while tR + k * 0.085 < eR: hoof(tR + k * 0.085, 0.22 if k % 3 == 0 else 0.13); k += 1   # gallop
put(sfx, sweep(250, 900, 0.3, 6), sh3 + 0.05, 0.2)                      # buttons pop in
for tt_ in (tTapF, tTapS):                                              # tap click + confirm ding
    put(sfx, add(noise(0.015, 300), tone(2600, 0.02, 200)), tt_, 0.35)
    for j, m in enumerate((84, 88)): put(sfx, tone(midi(m), 0.25, 10), tt_ + 0.05 + j * 0.08, 0.12)
put(sfx, sweep(250, 900, 0.3, 6), sh4, 0.25)                            # Pinky pops in
for j in range(2):                                                      # wrong buzzer
    x = np.arange(int(0.22 * SR)) / SR
    put(sfx, np.sign(np.sin(2 * np.pi * (150 - j * 25) * x)) * np.exp(-x * 4) * 0.5, a9 + j * 0.24, 0.22)
put(sfx, lp(noise(0.5, 5), 0.25), tSw - 0.05, 0.4)                      # swap whoosh
for j in range(2): put(sfx, sweep(300, 1100, 0.3, 6), tJ0 + j * 0.08, 0.18)   # swap jumps
for tt_ in (S(11), tP2):                                                # highlight sparkles
    for j in range(3): put(sfx, tone(2093 + j * 300, 0.18, 14), tt_ + j * 0.05, 0.08)
whinny(r0 + 0.05, 0.12)
k = 0
while r0 + 0.1 + k * 0.09 < eL: hoof(r0 + 0.1 + k * 0.09, 0.2 if k % 3 == 0 else 0.12); k += 1
put(sfx, tone(1568, 0.3, 8), tW, 0.1)                                   # first horse in
for j, m in enumerate([67, 72, 76, 79]): put(sfx, mallet(midi(m + 5), 0.5), eL + 0.15 + j * 0.09, 0.2)   # trophy fanfare
t = S(13) - 0.15                                                         # claps: hands meet when sin(15t)=0
c0 = np.ceil(t * 15 / np.pi) * np.pi / 15
while c0 < E(13) + 0.3:
    put(sfx, lp(noise(0.06, 60), 0.6), c0, 0.5); c0 += np.pi / 15
put(sfx, add(lp(noise(0.08, 40), 0.3), tone(110, 0.15, 25)), tTick + 0.2, 0.45)   # ✅ sticker stamp
put(sfx, tone(2637, 0.3, 10), tTick + 0.25, 0.1)
put(sfx, add(noise(0.015, 300), tone(2600, 0.02, 200)), tShTap, 0.35)   # share tap
for i in range(3): put(sfx, sweep(900, 1800, 0.35, 5), tShTap + 0.15 + i * 0.18, 0.1)   # paper planes
for i in range(3): put(sfx, tone(1760 + i * 220, 0.15, 14), tShTap + 0.65 + i * 0.18, 0.1)   # brain pops
for j in range(4): put(sfx, tone(1568 + j * 330, 0.3, 10), tFol - 0.1 + j * 0.07, 0.12)  # end-card sparkle

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
