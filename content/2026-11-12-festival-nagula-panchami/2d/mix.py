"""Nagula Chavithi & Nagula Panchami festival reel (FLAT 2D) soundtrack, all synthesized here (original, no film music):
a playful festive tune (bansuri-like flute melody over a bouncy bass, light dholak-style percussion and handclaps),
stopped by a record scratch on the rope twist and during the 3 s countdown (ticks, heartbeat, riser), then a brighter
reprise, and soft bells + a warm swell for the 5 s greeting card. Comedic SFX synced to ep.html via beats.json
(`node render.js --beats`): scream stings, speed whooshes, a slide whistle on the leap, record scratch, alarm ring,
snooze smack, blanket whoosh, snake peek pop + boing, tail-wave sparkle, a slide whistle as it slithers off, tap clicks,
comment pops, countdown ticks, wrong-answer boing, rat squeak + scurry, answer chime, sticker stamp, share whooshes.
Voices on top with ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); B = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
rng = np.random.default_rng(4)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n: dst[s:e] += sig[: e - s] * gain
def tone(f, d, decay=8):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * decay) * np.minimum(1, x / 0.004)
def celesta(f, d=0.9):   # music-box / celesta: bright fundamental + octave + soft inharmonic shimmer
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 6) + 0.15 * np.sin(2 * np.pi * 5.4 * f * x) * np.exp(-x * 14)) \
        * np.exp(-x * 4.5) * np.minimum(1, x / 0.003)
def bell(f, d=1.6):      # glassy bell (inharmonic partials)
    x = np.arange(int(d * SR)) / SR; out = np.zeros_like(x)
    for r, a, dc in ((1, 1, 2.2), (2.76, .5, 3.5), (5.4, .3, 6), (8.9, .15, 9)): out += a * np.sin(2 * np.pi * f * r * x) * np.exp(-x * dc)
    return out * np.minimum(1, x / 0.002)
def pad(freqs, d, att=0.8):
    x = np.arange(int(d * SR)) / SR
    env = np.minimum(1, x / att) * np.minimum(1, (d - x) / att)
    return sum(np.sin(2 * np.pi * f * x + np.sin(2 * np.pi * 0.3 * x) * 0.4) + 0.3 * np.sin(2 * np.pi * f * 2.002 * x) for f in freqs) * env / len(freqs)
def noise(d, decay): x = np.arange(int(d * SR)) / SR; return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = np.arange(int(d * SR)) / SR; f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def band(sig, lo, hi):  # FFT band-pass (soft edges)
    F = np.fft.rfft(sig); f = np.fft.rfftfreq(len(sig), 1 / SR)
    g = 1 / (1 + (lo / np.maximum(f, 1)) ** 4) / (1 + (f / hi) ** 4)
    return np.fft.irfft(F * g, len(sig))
def whoosh(d, lo=300, hi=3000, peak=0.5):   # air swish: band noise with a swelling envelope
    x = np.arange(int(d * SR)) / SR
    env = np.sin(np.pi * np.clip(x / d, 0, 1)) ** 1.5 * (x / d < peak * 2 + 1)
    return band(rng.standard_normal(len(x)), lo, hi) * env
def add(*sigs):
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs: out[:len(x)] += x
    return out

# ---------------- music ----------------
music = np.zeros(n)
BPM = 118; beat = 60 / BPM
def flute(f, d, vib=5.5):
    x = np.arange(int(d * SR)) / SR
    ph = 2 * np.pi * f * x + 0.012 * f / vib * np.sin(2 * np.pi * vib * x) * np.minimum(1, x / 0.25)
    env = np.minimum(1, x / 0.03) * np.minimum(1, (d - x) / 0.06).clip(0) * (0.85 + 0.15 * np.exp(-x * 6))
    breath = band(rng.standard_normal(len(x)), 1500, 6000) * 0.03 * env
    return (np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.08 * np.sin(3 * ph)) * env + breath
def pluck(f, d=0.35):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.5 * np.sin(4 * np.pi * f * x) * np.exp(-x * 12)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
def dhol(at, low=True, g=0.5):
    x = np.arange(int(0.25 * SR)) / SR
    if low: sig = np.sin(2 * np.pi * (110 * np.exp(-x * 9) + 55) * x) * np.exp(-x * 14)
    else: sig = np.sin(2 * np.pi * 420 * x) * np.exp(-x * 30) + band(noise(0.25, 40), 800, 4000) * 0.4
    put(music, sig, at, g)
def clap(at, g=0.12): put(music, band(noise(0.08, 45), 900, 5000), at, g)
# D major, a cheerful folk-pop tune (original)
MEL = [(74, 1), (76, .5), (78, .5), (81, 1), (78, .5), (76, .5), (74, .5), (76, .5), (78, 1), (76, 1),
       (78, 1), (81, .5), (83, .5), (81, 1), (78, .5), (76, .5), (74, .5), (71, .5), (74, 1), (74, 1)]
CHORD = [50, 47, 43, 45]   # D Bm G A (bass roots)
def festive(t0, t1, g=1.0, bright=0):
    bar = 4 * beat; k = 0
    while t0 + k * bar < t1 - 0.05:
        at = t0 + k * bar; root = CHORD[k % 4]
        for j in range(4):
            a2 = at + j * beat
            if a2 >= t1: break
            put(music, pluck(midi(root - 12 + (7 if j % 2 else 0)), 0.4), a2, 0.22 * g)                 # bouncy bass
            dhol(a2, low=(j % 2 == 0), g=0.32 * g); dhol(a2 + beat / 2, low=False, g=0.12 * g)
            if j % 2 == 1: clap(a2, 0.10 * g)
            for m in (root + 12, root + 16 if root in (50, 43) else root + 15, root + 19):              # off-beat chord chops
                put(music, pluck(midi(m), 0.18), a2 + beat / 2, 0.035 * g)
        k += 1
    tm, i = t0, 0
    while tm < t1 - 0.1:
        m, d = MEL[i % len(MEL)]; dd = min(d * beat, t1 - tm)
        put(music, flute(midi(m + bright), dd * 0.95), tm, 0.10 * g); tm += d * beat; i += 1
CD0, CD1 = B["CD0"], B["CD1"]
festive(0.0, B["frz"], g=0.75)                       # under the screams (cut by the record scratch)
festive(S(2) - 0.1, CD0 - 0.15, g=0.9)
festive(CD1 + 0.15, B["card0"], g=0.9, bright=2)     # brighter reprise
# countdown: ticks, heartbeat, riser
for k in range(int(CDN * 2)):
    put(music, noise(0.03, 160) * 0.6 + tone(2400 if k % 2 == 0 else 1800, 0.03, 120), CD0 + k * 0.5, 0.35 if k % 2 == 0 else 0.22)
for k in range(int(CDN)):
    for j, dt in enumerate((0, 0.16)): put(music, tone(55, 0.18, 18), CD0 + k + 0.3 + dt, 0.5 - 0.15 * j)
put(music, band(rng.standard_normal(int(CDN * SR)), 200, 1500) * np.linspace(0.0, 1.0, int(CDN * SR)) ** 2, CD0, 0.3)
for j, m in enumerate([74, 78, 81, 86]): put(music, celesta(midi(m), 0.8), CD1 + j * 0.06, 0.2)       # time-up ta-da
# greeting card: warm pad swell, soft temple-free bells (glassy chimes), slow flute
C0 = B["card0"]; CD = DUR - C0
put(music, pad([midi(50), midi(57), midi(62), midi(66)], CD + 0.3, 0.8), C0, 0.22)
for j in range(int(CD / 0.6)):
    put(music, bell(midi([86, 90, 93, 98, 93, 90][j % 6]), 1.8), C0 + 0.1 + j * 0.6, 0.05)
for j, (m, d) in enumerate([(81, 1.5), (78, 1), (76, 1), (74, 3)]):
    put(music, flute(midi(m), d * beat * 1.4), C0 + 0.4 + sum(x[1] for x in [(81, 1.5), (78, 1), (76, 1), (74, 3)][:j]) * beat * 1.4, 0.08)

# ---------------- SFX ----------------
sfx = np.zeros(n)
def pop_(at, g=0.2, f0=300, f1=900): put(sfx, sweep(f0, f1, 0.16, 10), at, g)
def click(at, g=0.35): put(sfx, add(noise(0.015, 300), tone(2600, 0.02, 200)), at, g)
def boing(at, g=0.25, f0=180, f1=520, d=0.45):
    x = np.arange(int(d * SR)) / SR; f = f0 + (f1 - f0) * (1 - np.exp(-x * 9)); f = f * (1 + 0.18 * np.sin(2 * np.pi * 14 * x) * np.exp(-x * 4))
    put(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 5), at, g)
def slide(at, f0, f1, d, g=0.12):
    x = np.arange(int(d * SR)) / SR; f = f0 * (f1 / f0) ** (x / d) * (1 + 0.01 * np.sin(2 * np.pi * 6 * x))
    put(sfx, (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.2 * band(rng.standard_normal(len(x)), 1000, 5000) * 0.2) * np.minimum(1, x / 0.03) * np.minimum(1, (d - x) / 0.05), at, g)
def sting(at, g=0.16):   # comic panic stab (dissonant brass-ish chord)
    x = np.arange(int(0.5 * SR)) / SR; sig = np.zeros_like(x)
    for f in (midi(62), midi(65), midi(68), midi(71)):
        sig += np.sign(np.sin(2 * np.pi * f * x)) * 0.25 + np.sin(2 * np.pi * f * 2 * x) * 0.2
    put(sfx, band(sig, 200, 4000) * np.exp(-x * 5) * np.minimum(1, x / 0.01), at, g)
def scratch(at, g=0.4):   # record scratch: band noise with a fast pitch wobble
    d = 0.45; x = np.arange(int(d * SR)) / SR; nz = rng.standard_normal(len(x))
    s1 = band(nz, 600, 3500) * (np.abs(np.sin(2 * np.pi * 3.2 * x)) ** 0.5)
    s2 = np.sin(2 * np.pi * np.cumsum(300 + 900 * np.abs(np.sin(2 * np.pi * 2.6 * x))) / SR) * 0.35
    put(sfx, (s1 * 0.6 + s2) * np.exp(-x * 2.5), at, g)
def ring(t0, t1, g=0.06):
    k = 0
    while t0 + k * 0.07 < t1:
        put(sfx, bell(2200 if k % 2 else 2500, 0.12), t0 + k * 0.07, g); k += 1
def fly(t0, t1, g=0.3, lo=400, hi=4000): put(sfx, whoosh(max(0.2, t1 - t0), lo, hi), t0, g)

pop_(0.1, 0.25)                                                        # title pop
for s in B["sc"]: sting(s, 0.14); fly(s - 0.05, s + 0.3, 0.22, 800, 6000)   # each "పాము!"
slide(B["leap0"], 400, 1600, 0.4, 0.13)                                # the leap onto the cot
put(sfx, add(band(noise(0.12, 25), 80, 600), tone(70, 0.2, 14)), B["leap1"] - 0.03, 0.4)   # thud on the cot
scratch(B["frz"], 0.45)                                                # record scratch (music stops)
pop_(B["tTaadu"], 0.2, 500, 1300); boing(B["tTaadu"] + 0.05, 0.12)
pop_(B["tCal1"], 0.15, 400, 900); put(sfx, whoosh(0.2, 2000, 8000), B["tCal1"], 0.15)      # calendar flips
pop_(B["tCal2"], 0.15, 500, 1100); put(sfx, whoosh(0.2, 2000, 8000), B["tCal2"], 0.15)
pop_(B["tGreet"] - 0.05, 0.2, 600, 1500); [put(sfx, celesta(midi(m), 0.5), B["tGreet"] + j * 0.07, 0.07) for j, m in enumerate((86, 90, 93))]
fly(B["dawn"] - 0.15, B["dawn"] + 0.25, 0.3, 500, 6000)                # scene swipe
ring(B["tRing"], B["tSnooze"], 0.05)                                   # alarm clock rings...
put(sfx, add(band(noise(0.06, 50), 100, 2000), tone(160, 0.1, 30)), B["tSnooze"], 0.45)    # ...SMACK, snooze
for j in range(3): put(sfx, tone(midi(70 - j * 3), 0.25, 8), B["tSnooze"] + 0.15 + j * 0.16, 0.05)   # sleepy descending notes
sting(B["tPop"], 0.16); put(sfx, whoosh(0.5, 300, 3000), B["tPop"] + 0.05, 0.3)            # eyes pop, blanket flies
pop_(B["peek"] + 0.1, 0.2, 300, 800); boing(B["peek"] + 0.2, 0.15, 220, 600)               # the snake peeks
sting(B["shriek"], 0.18); slide(B["jump0"], 500, 2000, 0.3, 0.1); slide(B["jump0"] + 0.3, 2000, 500, 0.25, 0.08)
put(sfx, add(band(noise(0.12, 25), 80, 600), tone(70, 0.2, 14)), B["jump0"] + 0.55, 0.35)
fly(B["snOut0"], B["snOut1"], 0.12, 300, 2000)                         # slithers out
for j in range(5): put(sfx, tone(midi(91 + j * 2), 0.3, 9), B["snOut1"] + 0.05 + j * 0.09, 0.06)   # tail wave sparkle
pop_(B["snOut1"] + 0.2, 0.15, 700, 1600)                               # "byee"
slide(B["snGo"], 1400, 300, 1.1, 0.09)                                 # slide whistle as it slithers off
pop_(B["tBrave"] - 0.1, 0.2, 500, 1300); [put(sfx, bell(midi(m), 1.0), B["tBrave"] + j * 0.08, 0.06) for j, m in enumerate((84, 88, 91))]
put(sfx, sweep(250, 900, 0.3, 6), S(7) - 0.1, 0.2)
for tx in (B["tTapF"], B["tTapS"]):
    click(tx); [put(sfx, tone(midi(m), 0.25, 10), tx + 0.05 + j * 0.08, 0.12) for j, m in enumerate((84, 88))]
fly(B["cut8"] - 0.15, B["cut8"] + 0.25, 0.35, 500, 7000)               # swipe to the field
pop_(B["tQuiz"] - 0.05, 0.22, 400, 1200); boing(B["tWhy"], 0.1, 300, 700)
pop_(B["tCm"], 0.15, 600, 1400)
for j, tb in enumerate(B["cb"]): put(sfx, sweep(500 + 40 * j, 1200 + 60 * j, 0.12, 14), tb, 0.12)
pop_(B["tGuess"] - 0.05, 0.18, 500, 1200)
put(sfx, add(band(noise(0.08, 40), 200, 3000), tone(120, 0.12, 20)), B["tX"], 0.35); boing(B["tX"] + 0.05, 0.28, 300, 120, 0.6)   # wrong!
k = 0
while B["amIn0"] + k * 0.24 < B["amIn1"]: put(sfx, band(noise(0.05, 60), 200, 2000), B["amIn0"] + k * 0.24, 0.1); k += 1
for j, m in enumerate([74, 78, 81, 86, 90]): put(sfx, celesta(midi(m), 0.7), B["tBan"] + j * 0.07, 0.13)   # answer fanfare
fly(B["snIn0"], B["snIn1"], 0.12, 300, 2500)                           # the snake glides in
put(sfx, sweep(1800, 3200, 0.12, 8), B["ratRun"], 0.12); put(sfx, sweep(2600, 3600, 0.1, 8), B["ratRun"] + 0.14, 0.1)   # squeak!
for j in range(10): put(sfx, band(noise(0.03, 120), 1500, 6000), B["ratRun"] + 0.25 + j * 0.06, 0.08)   # scurry
put(sfx, whoosh(0.4, 1000, 7000), B["ratRun"] + 0.25, 0.2)
for j, m in enumerate([78, 81, 86, 90]): put(sfx, bell(midi(m), 1.4), B["tSafe"] + j * 0.06, 0.06)    # the crop stands up
pop_(B["tResp"] - 0.05, 0.18, 500, 1200)
put(sfx, add(band(noise(0.08, 40), 200, 3000), tone(110, 0.15, 25)), B["tTick"] + 0.1, 0.45); put(sfx, tone(2637, 0.3, 10), B["tTick"] + 0.15, 0.1)   # ✅ stamp
put(sfx, whoosh(0.35, 800, 6000), B["sh0"], 0.25); pop_(B["sh0"] + 0.1, 0.15, 500, 1200)
click(B["tStTap"]); [put(sfx, tone(midi(m), 0.25, 10), B["tStTap"] + 0.05 + j * 0.08, 0.12) for j, m in enumerate((84, 88, 91))]
slide(B["tFam"] - 0.25, 600, 1500, 0.35, 0.07); pop_(B["tFam"], 0.15, 600, 1500)
put(sfx, band(noise(1.2, 3), 3000, 14000), B["card0"], 0.15)           # card shimmer
for j, m in enumerate([86, 90, 93, 98]): put(sfx, bell(midi(m), 2.0), B["card0"] + 0.15 + j * 0.12, 0.07)

# ---------------- voices + mix ----------------
voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.05, (DUR - tt) / 1.0))
mix = (music * duck * 0.8 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
