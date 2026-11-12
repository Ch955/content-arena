"""Micro-doc 'Ronald Ross, Begumpet, 1897' soundtrack, all synthesized here (original, no film or library music):
a retro chiptune mystery theme (square-wave lead in A minor over a triangle bass and noise hi-hats) for the pixel
"case file" scenes, a softer music-box/pad version under the paper-style 1897 lab scenes, and SFX synced to ep.html via
beats.json (`node render.js --beats`): rubber-stamp thump, a subtle mosquito buzz in the lab, pin drop, typewriter
clicks + carriage bell, microscope zoom whoosh, sparkle chime on the parasite, train chug + whistle, sparrow chirps,
Nobel fanfare, ID-card slide, slam hit, follow/subscribe taps, quiz sting, 8-bit countdown ticks + comment pops,
answer jingle + confetti, sticker stamp, share whoosh. Voices on top with ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); B = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
rng = np.random.default_rng(7)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n and e > s: dst[s:e] += sig[: e - s] * gain
def env_ad(x, a, d): return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x * d)
def tone(f, d, decay=8):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * decay) * np.minimum(1, x / 0.004)
def square(f, d, duty=0.5, decay=3, rel=0.03):
    x = np.arange(int(d * SR)) / SR
    w = np.where((x * f) % 1 < duty, 1.0, -1.0)
    return w * np.minimum(1, x / 0.003) * np.exp(-x * decay) * np.clip((d - x) / rel, 0, 1)
def tri(f, d, decay=1.5, rel=0.03):
    x = np.arange(int(d * SR)) / SR
    w = 2 * np.abs(2 * ((x * f) % 1) - 1) - 1
    return w * np.minimum(1, x / 0.003) * np.exp(-x * decay) * np.clip((d - x) / rel, 0, 1)
def celesta(f, d=0.9):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 6) + 0.15 * np.sin(2 * np.pi * 5.4 * f * x) * np.exp(-x * 14)) \
        * np.exp(-x * 4.5) * np.minimum(1, x / 0.003)
def bell(f, d=1.6):
    x = np.arange(int(d * SR)) / SR; out = np.zeros_like(x)
    for r, a, dc in ((1, 1, 2.2), (2.76, .5, 3.5), (5.4, .3, 6), (8.9, .15, 9)): out += a * np.sin(2 * np.pi * f * r * x) * np.exp(-x * dc)
    return out * np.minimum(1, x / 0.002)
def pad(freqs, d, att=0.6):
    x = np.arange(int(d * SR)) / SR
    env = np.minimum(1, x / att) * np.clip((d - x) / att, 0, 1)
    return sum(np.sin(2 * np.pi * f * x + np.sin(2 * np.pi * 0.3 * x) * 0.4) + 0.3 * np.sin(2 * np.pi * f * 2.003 * x) for f in freqs) * env / len(freqs)
def noise(d, decay): x = np.arange(int(d * SR)) / SR; return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = np.arange(int(d * SR)) / SR; f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def sqsweep(f0, f1, d, decay=3):
    x = np.arange(int(d * SR)) / SR; f = f0 * (f1 / f0) ** (x / d)
    return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.exp(-x * decay) * np.minimum(1, x / 0.005)
def band(sig, lo, hi):
    F = np.fft.rfft(sig); f = np.fft.rfftfreq(len(sig), 1 / SR)
    g = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    return np.fft.irfft(F * g, len(sig))
def whoosh(d, lo=300, hi=3000):
    x = np.arange(int(d * SR)) / SR
    return band(rng.standard_normal(len(x)), lo, hi) * np.sin(np.pi * np.clip(x / d, 0, 1)) ** 1.5
def add(*sigs):
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs: out[:len(x)] += x
    return out

# ---------------- music ----------------
music = np.zeros(n)
BPM = 108; beat = 60 / BPM; st = beat / 2
# A minor mystery: Am - F - Dm - E (original)
ROOTS = [45, 41, 38, 40]
CHORDS = {45: (57, 60, 64), 41: (53, 57, 60), 38: (50, 53, 57), 40: (52, 56, 59)}
LEAD = [(69, 1), (72, 1), (71, .5), (69, .5), (68, 1), (64, 2), (None, 1), (65, 1), (69, 1), (72, .5), (74, .5), (71, 2), (None, 2),
        (76, 1), (74, .5), (72, .5), (71, 1), (69, 1), (68, 1), (71, 1), (69, 2), (None, 2)]
def chip(t0, t1, g=1.0, lead=True):
    """pixel scenes: triangle bass, 16th arpeggio (12.5% square), noise hats, square lead"""
    bar = 4 * beat; k = 0
    while t0 + k * bar < t1 - 0.05:
        at = t0 + k * bar; r = ROOTS[k % 4]; ch = CHORDS[r]
        for j in range(8):
            a2 = at + j * st
            if a2 >= t1: break
            put(music, tri(midi(r - 12 + (12 if j % 4 == 2 else 0)), st * 0.95, 2), a2, 0.20 * g)
            put(music, band(noise(0.04, 90), 6000, 14000), a2, (0.05 if j % 2 else 0.03) * g)
            if j in (2, 6): put(music, band(noise(0.08, 35), 1500, 6000), a2, 0.06 * g)      # snare-ish
        for j in range(16):
            a2 = at + j * st / 2
            if a2 >= t1: break
            put(music, square(midi(ch[j % 3] + 12), st / 2 * 0.9, 0.125, 6), a2, 0.022 * g)
        k += 1
    if lead:
        tm, i = t0, 0
        while tm < t1 - 0.1:
            m, d = LEAD[i % len(LEAD)]; dd = min(d * beat, t1 - tm)
            if m: put(music, square(midi(m), dd * 0.92, 0.25, 1.2), tm, 0.045 * g)
            tm += d * beat; i += 1
def lab(t0, t1, g=1.0):
    """paper scenes (1897 lab): low pad + a slow music-box motif"""
    bar = 4 * beat; k = 0
    while t0 + k * bar < t1 - 0.05:
        at = t0 + k * bar; r = ROOTS[k % 4]; d = min(bar + 0.3, t1 - at + 0.3)
        put(music, pad([midi(r), midi(r + 7), midi(r + 12 + (3 if r != 40 else 4))], d, 0.4), at, 0.10 * g)
        for j, m in enumerate((r + 24, r + 31, r + 27 + (1 if r == 40 else 0), r + 31)):
            if at + j * beat < t1: put(music, celesta(midi(m + 12), 0.9), at + j * beat, 0.035 * g)
        k += 1
SEG = [("lab", 0.0, B["T1"]), ("chip", B["T1"], B["T3"]), ("lab", B["T3"], B["T6"]), ("chip", B["T6"], B["CD0"] - 0.1),
       ("chip", B["CD1"] + 0.2, B["tLoop"]), ("lab", B["tLoop"], DUR)]
for kind, a, b in SEG:
    (lab if kind == "lab" else chip)(a, b, 1.0)
# countdown: 8-bit ticks every half second, heartbeat, rising square arpeggio
CD0, CD1 = B["CD0"], B["CD1"]
for k in range(int(CDN * 2)):
    put(music, square(1760 if k % 2 == 0 else 1320, 0.04, 0.5, 40), CD0 + k * 0.5, 0.10 if k % 2 == 0 else 0.06)
for k in range(int(CDN)):
    for j, dt in enumerate((0, 0.16)): put(music, tone(55, 0.18, 18), CD0 + k + 0.3 + dt, 0.45 - 0.15 * j)
    put(music, square(midi(57 + k * 2), 0.12, 0.5, 10), CD0 + k, 0.05)
for j, m in enumerate([69, 72, 76, 81]): put(music, square(midi(m), 0.12, 0.25, 6), CD1 + j * 0.07, 0.07)

# ---------------- SFX ----------------
sfx = np.zeros(n)
def pop_(at, g=0.2, f0=300, f1=900): put(sfx, sweep(f0, f1, 0.16, 10), at, g)
def click(at, g=0.3): put(sfx, add(noise(0.015, 300), tone(2600, 0.02, 200)), at, g)
def thump(at, g=0.45): put(sfx, add(band(noise(0.1, 30), 60, 900), tone(80, 0.25, 14)), at, g)
def blip(at, f0=600, f1=1400, g=0.08): put(sfx, sqsweep(f0, f1, 0.1, 8), at, g)
def chime(at, notes=(81, 85, 88, 93), g=0.09, gap=0.07): [put(sfx, bell(midi(m), 1.4), at + j * gap, g) for j, m in enumerate(notes)]
def buzz(t0, d, g=0.025):   # subtle mosquito whine: a thin, wobbling saw-ish tone
    x = np.arange(int(d * SR)) / SR; f = 560 + 40 * np.sin(2 * np.pi * 3.1 * x) + 25 * np.sin(2 * np.pi * 7.3 * x)
    ph = np.cumsum(f) / SR; w = (ph % 1) * 2 - 1
    amp = (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * x)) * np.minimum(1, x / 0.3) * np.clip((d - x) / 0.3, 0, 1)
    put(sfx, band(w, 400, 5000) * amp, t0, g)

pop_(B["tTitle"], 0.2)                                                       # title
thump(B["tStamp"], 0.5)                                                      # 20 AUG 1897 stamp
buzz(0.15, B["T1"] - 0.2, 0.02)                                              # the two mosquitoes (subtle)
blip(B["tTwo"], 400, 900, 0.06); put(sfx, whoosh(0.35, 600, 4000), B["tTwo"] - 0.15, 0.12)   # punch-in on the tubes
put(sfx, whoosh(0.3, 800, 6000), B["T1"] - 0.1, 0.2)                       # cut to the pixel map
put(sfx, sqsweep(1400, 300, 0.35, 3), B["tPin"], 0.05); thump(B["tPin"] + 0.35, 0.35)   # pin drop
blip(B["tBld"], 500, 1200, 0.07)
thump(B["tAns"], 0.3); blip(B["tAns"] + 0.05, 900, 1800, 0.06)              # ANSWER AT THE END stamp
put(sfx, whoosh(0.3, 800, 5000), B["tName"] - 0.1, 0.15); blip(B["tName"], 700, 1400, 0.06)
for k in range(6): put(sfx, band(noise(0.05, 60), 2000, 8000), B["tWriter"] + k * 0.18, 0.05)   # quill scratches
put(sfx, whoosh(0.5, 200, 1800), B["tDad"] - 0.1, 0.2); thump(B["tDad"] + 0.45, 0.4)     # the book slams down
pop_(B["tRel"], 0.15, 500, 1300)
put(sfx, whoosh(0.3, 800, 6000), B["T3"] - 0.1, 0.18)
for k in range(4): click(B["tRew"] + k * 0.15, 0.22)                        # calendar rewinds 20 -> 16
buzz(B["T3"], B["T4"] - B["T3"], 0.018)
pop_(B["tDrop"], 0.15, 300, 700)
put(sfx, add(whoosh(0.55, 300, 7000), sweep(200, 1600, 0.55, 1.5) * 0.3), B["T4"] - 0.05, 0.35)   # microscope zoom
put(sfx, band(noise(0.6, 4), 3000, 12000), B["tZoom1"], 0.06)
for j, tg in enumerate(B["glow"]): put(sfx, bell(midi(88 + j * 3), 1.0), tg, 0.06)
chime(B["tPara"], (81, 85, 88, 93, 97), 0.10)                                # discovery sparkle
k = 0; t0, t1 = B["tType0"], B["tType1"]
while t0 + k * 0.105 < t1 - 0.05:
    put(sfx, add(band(noise(0.025, 220), 1500, 7000), tone(1800 + 300 * (k % 3), 0.015, 300)), t0 + k * 0.105 + 0.02 * np.sin(k * 7), 0.18); k += 1
put(sfx, bell(midi(96), 0.8), t1 + 0.05, 0.08)                               # carriage bell
put(sfx, whoosh(0.3, 800, 6000), B["T6"] - 0.1, 0.18)
for k in range(int((B["tCage"] - B["T6"]) / 0.18)): put(sfx, band(noise(0.06, 50), 150, 1500), B["T6"] + k * 0.18, 0.12 if k % 2 else 0.18)   # chug
put(sfx, add(square(midi(79), 0.35, 0.5, 2), square(midi(83), 0.35, 0.5, 2)), B["T6"] + 0.2, 0.03)   # 8-bit whistle
for k in range(5): put(sfx, sweep(3200, 4200, 0.06, 20), B["tCage"] + 0.15 + k * 0.17, 0.05)   # sparrow chirps
thump(B["tProof"], 0.3); blip(B["tProof"], 800, 1600, 0.06)
put(sfx, whoosh(0.5, 400, 5000), B["tMedal"], 0.18)
for j, m in enumerate([69, 73, 76, 81]): put(sfx, square(midi(m), 0.16, 0.25, 4), B["tNobel"] + j * 0.09, 0.07)
chime(B["tNobel"] + 0.35, (88, 93, 97), 0.08)
put(sfx, whoosh(0.4, 500, 4000), B["T7"], 0.18); thump(B["T7"] + 0.35, 0.25)  # ID card slides in
blip(B["tBrit"], 600, 1300, 0.06); blip(B["tBorn"], 700, 1500, 0.06)
put(sfx, sqsweep(1400, 300, 0.3, 3), B["tAlm"] - 0.05, 0.05); thump(B["tAlm"] + 0.3, 0.3)
for k in range(11): blip(B["tTag"] + k * ((B["tEleven"] + 0.35 - B["tTag"]) / 11), 500 + k * 60, 800 + k * 80, 0.035)   # +1 ... +11
put(sfx, add(band(noise(0.2, 12), 60, 2000), tone(60, 0.35, 8)), B["tEleven"], 0.55)   # SLAM
put(sfx, whoosh(0.3, 800, 6000), B["T9"] - 0.1, 0.15)
for tx in (B["tTapF"], B["tTapS"]): click(tx); [put(sfx, square(midi(m), 0.09, 0.25, 8), tx + 0.04 + j * 0.07, 0.06) for j, m in enumerate((84, 88))]
put(sfx, add(*[bell(f, 0.6) for f in (1800, 2300)]), B["tTapS"] + 0.1, 0.06)   # bell wiggle
put(sfx, whoosh(0.3, 800, 6000), B["T10"] - 0.1, 0.15)
for j, m in enumerate([57, 60, 63, 66]): put(sfx, square(midi(m), 0.1, 0.5, 6), B["T10"] + 0.1 + j * 0.08, 0.05)   # quiz sting
pop_(B["tCm"], 0.15, 600, 1400)
for j, tb in enumerate(B["cb"]): put(sfx, sweep(500 + 40 * j, 1200 + 60 * j, 0.12, 14), tb, 0.12)
for j, m in enumerate([69, 72, 76, 81, 84, 88]): put(sfx, square(midi(m), 0.14, 0.25, 4), B["tRev"] + j * 0.07, 0.07)   # answer jingle
chime(B["tRev"] + 0.4, (88, 93, 97, 100), 0.08)
for k in range(10): put(sfx, band(noise(0.03, 120), 3000, 9000), B["tRev"] + 0.1 + k * 0.12, 0.05)   # confetti
thump(B["tTick"] + 0.05, 0.4); put(sfx, tone(2637, 0.3, 10), B["tTick"] + 0.1, 0.08)   # ✅ sticker
put(sfx, whoosh(0.3, 800, 6000), B["T12"] - 0.1, 0.15)
put(sfx, band(noise(0.6, 4), 2000, 10000), B["tMorph"], 0.08); chime(B["tMorph"] + 0.1, (76, 81, 85), 0.06)   # the building resolves
chime(B["tSign"], (81, 85, 88, 93), 0.08); blip(B["tYrs"], 700, 1500, 0.06)
put(sfx, whoosh(0.35, 800, 6000), B["T13"] - 0.05, 0.2); click(B["tShTap"])
put(sfx, whoosh(0.3, 1000, 7000), B["tShTap"] + 0.05, 0.15)
for j in (0.4, 0.75): pop_(B["tShTap"] + j, 0.12, 600, 1400)
pop_(B["tEnd"], 0.15, 400, 1000); pop_(B["tEnd"] + 0.15, 0.12, 500, 1200); pop_(B["tEnd"] + 0.3, 0.12, 600, 1400)
put(sfx, whoosh(0.3, 600, 5000), B["tLoop"] - 0.05, 0.15)
buzz(B["tLoop"], DUR - B["tLoop"], 0.025)                                    # back to the tubes
chime(B["tLoop"] + 0.3, (81, 88), 0.05, 0.12)

# ---------------- voices + mix ----------------
voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.03, (DUR - tt) / 0.35))
mix = (music * duck * 0.85 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
