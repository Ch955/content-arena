"""Podupu Katha #3 (rain riddle, 2D animated) soundtrack, all synthesized here (original): steady rain ambience +
a thunder clap on the hook, a light marimba-ish bed for the hook/story, a ticking-clock tension bed for the 5 s
countdown (rising drone + heartbeat), a ta-da at time-up, a brighter bed for the answer/CTA, and SFX synced to
ep.html (puddle splashes on every step, "no" buzzes for umbrella/cap/raincoat, drips, "?" boing, button taps,
wrong buzzer, tilt-up whoosh, answer fanfare, head-shine tings, sticker stamp, share whooshes, sparkles).
Voices on top with ducking."""
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

# same beat times as ep.html render(t)
sh2, sh3, sh4 = S(2) - 0.35, S(5) - 0.3, S(6) - 0.45
CD0 = E(7) + 0.35; CD1 = CD0 + CDN; sh7 = S(11) - 0.3
tW0, tW1 = sh2 - 0.2, E(3) + 0.15
tN = [ph(3, 0), ph(3, 0.35), ph(3, 0.68)]
tClue = ph(4, 0.4)
tTapF, tTapS = S(5) + D(5) * 0.45, S(5) + D(5) * 0.86
a7, tCm = S(7), ph(7, 0.5)
tTurn, tBan = ph(8, 0.5), S(8) + D(8) * 0.78
tWhy = ph(9, 0.4)
tTick, tShTap, tFol = ph(11, 0.45), S(12) + 0.35, ph(12, 0.6)
rng = np.random.default_rng(13)

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
def add(*sigs):
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs: out[:len(x)] += x
    return out
def noise(d, decay): x = np.arange(int(d * SR)) / SR; return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = np.arange(int(d * SR)) / SR; f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def band(sig, lo, hi):  # FFT band-pass (soft edges)
    F = np.fft.rfft(sig); f = np.fft.rfftfreq(len(sig), 1 / SR)
    g = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    return np.fft.irfft(F * g, len(sig))
def lp(sig, a):  # one-pole low-pass
    out = np.empty_like(sig); acc = 0.0
    for i, v in enumerate(sig): acc += a * (v - acc); out[i] = acc
    return out

music = np.zeros(n)
beat = 60 / 108; prog = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
def bed(t0, t1, up=0, g=1.0):
    k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if k % 2 == 0: put(music, tone(midi(ch[0] - 24 + up), 0.4, 7), at, 0.30 * g)
        put(music, mallet(midi(ch[(k * 2) % 3] + 12 + up)), at + (0.04 if k % 2 else 0), (0.12 if k % 2 else 0.16) * g)
        if k % 4 == 2: put(music, noise(0.05, 80), at, 0.04 * g)
        k += 1
bed(1.0, CD0 - 0.1, g=0.85)
# countdown: tick-tock, rising drone, heartbeat
for k in range(int(CDN * 2)):
    at = CD0 + k * 0.5
    put(music, noise(0.03, 160) * 0.6 + tone(2400 if k % 2 == 0 else 1800, 0.03, 120), at, 0.35 if k % 2 == 0 else 0.22)
x = tt[(tt >= CD0) & (tt < CD1)] - CD0
drone = (np.sin(2 * np.pi * midi(45) * (1 + 0.06 * x / CDN) * x) + 0.5 * np.sin(2 * np.pi * midi(52) * (1 + 0.06 * x / CDN) * x)) * np.minimum(1, x / 0.6) * (0.08 + 0.08 * x / CDN)
put(music, drone, CD0)
put(music, band(rng.standard_normal(int(CDN * SR)), 200, 1500) * np.linspace(0.0, 1.0, int(CDN * SR)) ** 2, CD0, 0.4)   # riser
for k in range(int(CDN)):
    for j, dt in enumerate((0, 0.16)): put(music, tone(55, 0.18, 18), CD0 + k + 0.3 + dt, 0.5 - 0.15 * j)
# time-up: ta-da + cymbal, then a brighter bed through the answer and CTA
for j, m in enumerate([72, 76, 79, 84]): put(music, mallet(midi(m), 0.6), CD1 + j * 0.06, 0.22)
for m in (60, 64, 67, 72): put(music, tone(midi(m), 1.4, 2.2), CD1 + 0.25, 0.10)
put(music, band(noise(1.4, 3), 3000, 14000), CD1, 0.35)
bed(CD1 + 1.2, DUR - 0.3, up=2, g=0.8)

# rain: steady hiss + patter, a touch louder outside the shop awnings (story/reveal)
rain = band(rng.standard_normal(n), 500, 7000) * 0.5 + band(rng.standard_normal(n), 120, 600) * 0.35
pat = np.zeros(n)
for at in np.sort(rng.uniform(0, DUR, int(DUR * 22))):
    put(pat, band(noise(0.02, 220), 1500, 9000)[: int(0.02 * SR)], at, rng.uniform(0.2, 0.6))
lvl = 0.05 + 0.02 * ((tt > sh2) & (tt < sh3)) + 0.015 * ((tt > CD1) & (tt < sh7))
rain = (rain + pat * 0.5) * lvl * (0.85 + 0.15 * np.sin(2 * np.pi * 0.13 * tt))

sfx = np.zeros(n)
def pop_(at, g=0.2, f0=300, f1=900): put(sfx, sweep(f0, f1, 0.16, 10), at, g)
def splash(at, g=0.3):  # puddle step: wet slap + droplets
    put(sfx, band(noise(0.12, 30), 300, 4000), at, g)
    for j in range(3): put(sfx, sweep(1200 + 300 * j, 2400 + 200 * j, 0.05, 40), at + 0.03 + 0.03 * j, 0.06)
def nope(at, g=0.16):  # short low "nuh-uh" buzz
    x = np.arange(int(0.18 * SR)) / SR
    put(sfx, np.sign(np.sin(2 * np.pi * 120 * x)) * np.exp(-x * 9) * 0.5, at, g)
def plink(at, g=0.1, f=1800): put(sfx, sweep(f, f * 1.6, 0.06, 35), at, g)
pop_(0.15, 0.25)                                                       # title pop
put(sfx, band(noise(0.25, 12), 2000, 12000), 0.25, 0.5)                # thunder crack
put(sfx, band(noise(2.6, 1.3), 30, 260), 0.3, 1.6)                     # thunder rumble
put(sfx, sweep(600, 1400, 0.2, 8), S(1) - 0.1, 0.22)                   # ANSWER AT THE END sticker
put(sfx, band(noise(0.45, 5), 300, 3000), sh2 - 0.1, 0.4)              # whoosh: cut to the letterboxed street shot
k = 1
while tW0 + k / 1.9 < tW1: splash(tW0 + k / 1.9, 0.28 if k % 2 else 0.22); k += 1   # puddle steps (2 per stride)
for t_ in tN: pop_(t_ - 0.05, 0.2, 400, 1000); nope(t_ + 0.3)          # no umbrella / no cap / no raincoat
for j in range(8): plink(S(4) - 0.1 + j * 0.27 + 0.05 * (j % 3), 0.09, 1500 + 120 * (j % 4))   # clothes dripping
pop_(tClue - 0.05, 0.2, 500, 1100)                                      # clue tag
put(sfx, sweep(200, 600, 0.35, 5) * (1 + 0.5 * np.sin(np.arange(int(0.35 * SR)) / SR * 2 * np.pi * 18)), tClue + 0.25, 0.22)   # "?" boing
put(sfx, sweep(250, 900, 0.3, 6), sh3 + 0.05, 0.2)                      # buttons pop in
for tt_ in (tTapF, tTapS):
    put(sfx, add(noise(0.015, 300), tone(2600, 0.02, 200)), tt_, 0.35)
    for j, m in enumerate((84, 88)): put(sfx, tone(midi(m), 0.25, 10), tt_ + 0.05 + j * 0.08, 0.12)
put(sfx, sweep(250, 900, 0.3, 6), sh4, 0.25)                            # Pinky pops in
for j in range(2):                                                      # wrong buzzer on "ఉహూ!"
    x = np.arange(int(0.22 * SR)) / SR
    put(sfx, np.sign(np.sin(2 * np.pi * (150 - j * 25) * x)) * np.exp(-x * 4) * 0.5, a7 + j * 0.24, 0.22)
put(sfx, band(noise(0.6, 5), 400, 4000), tTurn - 0.1, 0.35)             # camera tilts up: whoosh
put(sfx, sweep(300, 1200, 0.5, 4), tTurn - 0.05, 0.14)                  # rising reveal swish
for j, m in enumerate([67, 72, 76, 79, 84]): put(sfx, mallet(midi(m + 5), 0.5), tBan + j * 0.07, 0.2)   # answer fanfare
put(sfx, band(noise(0.8, 4), 4000, 14000), tBan, 0.25)                  # confetti shimmer
for j in range(3): put(sfx, tone(2637 + j * 420, 0.35, 9), tWhy + j * 0.14, 0.12)   # head-shine tings
for j in range(4): plink(tTurn + 0.6 + j * 0.45, 0.07, 2200)            # drops bouncing off his head
put(sfx, add(band(noise(0.08, 40), 200, 3000), tone(110, 0.15, 25)), tTick + 0.2, 0.45)   # ✅ sticker stamp
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
mix = (music * duck * 0.75 + rain * (1 - 0.35 * np.clip(act * 3, 0, 1)) + sfx + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
