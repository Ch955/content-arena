"""Podupu Katha #4 (tailless bird = letter, NEON 2D) soundtrack, all synthesized here (original, no film music):
a soft twinkly night theme (music-box arpeggios over a warm pad + stray star twinkles) for the hook/story/clues,
a ticking tension bed for the 5 s countdown (ticks, heartbeat, riser), a ta-da at time-up, a brighter twinkly bed for the
answer and CTA, and SFX synced to ep.html via beats.json (written by `node render.js --beats`): bird whooshes, neon
flicker buzz, milestone dings, word plucks, "?" boing, tap clicks, wrong buzzers, a cycle bell, comment pops, the
envelope morph chime + burst, card flip, letter twinkles, wink ting, claps, sticker stamp, share whooshes.
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
beat = 60 / 84
CH = [[57, 60, 64, 69], [53, 57, 60, 65], [48, 52, 55, 60], [55, 59, 62, 67]]   # Am F C G (soft, night-time)
def night_bed(t0, t1, up=0, g=1.0, bright=False):
    bar = 4 * beat; k = 0
    while t0 + k * bar < t1 - 0.2:
        at = t0 + k * bar; ch = CH[k % 4]; d = min(bar, t1 - at)
        put(music, pad([midi(m + up - 12) for m in ch[:3]], d + 0.4, 0.6), at, 0.10 * g)     # warm pad
        put(music, tone(midi(ch[0] + up - 24), 1.2, 2.5), at, 0.16 * g)                         # soft bass
        arp = [ch[0], ch[2], ch[3], ch[1] + 12, ch[3], ch[2] + 12, ch[1] + 12, ch[3] + 12] if not bright else \
              [ch[0] + 12, ch[1] + 12, ch[2] + 12, ch[3] + 12, ch[2] + 12, ch[3] + 12, ch[1] + 24, ch[3] + 12]
        for j, m in enumerate(arp):
            a2 = at + j * beat / 2
            if a2 < t1 - 0.1: put(music, celesta(midi(m + up + 12)), a2, (0.07 if j % 2 else 0.09) * g)
        k += 1
night_bed(0.6, B["CD0"] - 0.1, g=1.0)
for at in np.sort(rng.uniform(0.5, DUR - 1, int(DUR * 0.9))):          # stray star twinkles
    put(music, tone(midi(rng.choice([88, 91, 93, 96, 98])), 0.5, 7), at, 0.025)
# countdown: tick-tock, rising drone, heartbeat, riser
CD0, CD1 = B["CD0"], B["CD1"]
for k in range(int(CDN * 2)):
    at = CD0 + k * 0.5
    put(music, noise(0.03, 160) * 0.6 + tone(2400 if k % 2 == 0 else 1800, 0.03, 120), at, 0.35 if k % 2 == 0 else 0.22)
x = tt[(tt >= CD0) & (tt < CD1)] - CD0
drone = (np.sin(2 * np.pi * midi(45) * (1 + 0.06 * x / CDN) * x) + 0.5 * np.sin(2 * np.pi * midi(52) * (1 + 0.06 * x / CDN) * x)) * np.minimum(1, x / 0.6) * (0.08 + 0.08 * x / CDN)
put(music, drone, CD0)
put(music, band(rng.standard_normal(int(CDN * SR)), 200, 1500) * np.linspace(0.0, 1.0, int(CDN * SR)) ** 2, CD0, 0.35)
for k in range(int(CDN)):
    for j, dt in enumerate((0, 0.16)): put(music, tone(55, 0.18, 18), CD0 + k + 0.3 + dt, 0.5 - 0.15 * j)
for j, m in enumerate([72, 76, 79, 84]): put(music, celesta(midi(m), 0.8), CD1 + j * 0.06, 0.2)   # time-up ta-da
put(music, band(noise(1.4, 3), 3000, 14000), CD1, 0.3)
# Pinky begs: a small playful music-box figure; then the brighter twinkly bed through the answer + CTA
for j, m in enumerate([76, 74, 72, 74, 76, 76, 76]): put(music, celesta(midi(m + 12), 0.5), S(11) + 0.1 + j * 0.24, 0.06)
night_bed(B["tBan"] + 0.6, DUR - 0.3, up=3, g=0.85, bright=True)

# ---------------- SFX ----------------
sfx = np.zeros(n)
def pop_(at, g=0.2, f0=300, f1=900): put(sfx, sweep(f0, f1, 0.16, 10), at, g)
def click(at, g=0.35): put(sfx, add(noise(0.015, 300), tone(2600, 0.02, 200)), at, g)
def buzz(at, g=0.2, f=150, d=0.22):
    x = np.arange(int(d * SR)) / SR
    put(sfx, np.sign(np.sin(2 * np.pi * f * x)) * np.exp(-x * 4) * 0.5, at, g)
def ding(at, f, g=0.12): put(sfx, bell(f, 1.0), at, g)
def fly(t0, t1, g=0.3, lo=400, hi=4000): put(sfx, whoosh(max(0.2, t1 - t0), lo, hi), t0, g)

pop_(0.15, 0.25)                                                       # title pop
fly(B["zip1"][0] - 0.05, B["zip1"][1], 0.45, 600, 5000)                # bird zips across
for j in range(4): put(sfx, tone(midi(96 + j * 2), 0.25, 12), B["zip1"][0] + 0.1 + j * 0.2, 0.05)
fly(B["back0"], B["back1"], 0.3, 500, 4000)                            # it swoops back
for tx in (B["tTail"], B["tWing"]):                                    # ghost tail / wings: shimmer, then a soft "nope"
    put(sfx, sweep(900, 1500, 0.25, 8), tx - 0.02, 0.08); buzz(tx + 0.3, 0.12, 130, 0.16)
fly(B["tGo"], B["tGo1"], 0.4, 700, 6000)                               # crosses the towns
put(sfx, sweep(1800, 300, 0.9, 3), B["tGo"] + 0.1, 0.06)
# ANSWER AT THE END: neon flicker buzz
for j, on in enumerate([1, 0, 1, 0, 1, 0, 1]):
    if on: put(sfx, band(noise(0.06, 30), 80, 900) + 0.4 * np.sign(np.sin(2 * np.pi * 120 * np.arange(int(0.06 * SR)) / SR)) * 0.3, S(1) - 0.1 + j * 0.07, 0.12)
pop_(S(1) - 0.1 + 0.42, 0.18, 600, 1400)
# story: the old village draws itself on (rising celesta shimmer)
for j, m in enumerate([69, 72, 76, 79, 81, 84, 88]): put(sfx, celesta(midi(m + 12), 0.7), B["sh2"] + 0.1 + j * 0.2, 0.045)
pop_(B["tVil"] + 0.5, 0.15, 500, 1200)                                 # the bird appears in the village
# riddle: words pluck in, the bird flies the road, milestones ding, "?" boing
for j, tw in enumerate(B["rid"]): put(sfx, celesta(midi([76, 79, 81, 84, 83, 88][j]), 0.6), tw - 0.03, 0.05)
fly(B["fly0"], B["fly1"] + 0.2, 0.32, 500, 4500)
for j, tm in enumerate(B["mile"]): ding(tm, midi([84, 86, 88, 91][j]), 0.10 if j < 3 else 0.16)
put(sfx, bell(midi(79), 1.6), B["mile"][3] + 0.05, 0.08)
put(sfx, sweep(200, 600, 0.35, 5) * (1 + 0.5 * np.sin(np.arange(int(0.35 * SR)) / SR * 2 * np.pi * 18)), B["rid"][5] + 0.05, 0.2)   # "?" boing
# aside: zoom-out whoosh, tag pop, the long arrow
fly(B["sh4"], B["sh4"] + 0.8, 0.22, 200, 1500)
pop_(B["tAm"] - 0.05, 0.18, 500, 1200)
put(sfx, sweep(400, 1600, 0.6, 2.5), B["tFar"] - 0.1, 0.1); pop_(B["tFar"] + 0.2, 0.15, 400, 1000)
# clue 1: tag pop, the bird passes the sleeping house, speech-bubble bloops
pop_(B["c1"] - 0.1, 0.2, 500, 1100)
fly(B["c1"] + 0.1, E(5) + 0.1, 0.22, 400, 3500)
for j in range(8): put(sfx, sweep(700 + 60 * j, 1300 + 60 * j, 0.08, 20), B["tCarry"] - 0.2 + j * 0.17, 0.07)
# guess: Pinky + poll pop in, the bird hovers, tap!
put(sfx, sweep(250, 900, 0.3, 6), B["sh6"], 0.22)
fly(B["sh6"] + 0.15, B["sh6"] + 0.7, 0.2, 300, 2500)
click(B["tTap"]); [put(sfx, tone(midi(m), 0.25, 10), B["tTap"] + 0.05 + j * 0.08, 0.12) for j, m in enumerate((84, 88))]
for j in range(2): buzz(B["tNo"] + j * 0.24, 0.22, 150 - j * 25)       # wrong buzzer on "కాదు!"
ding(B["tTail1"] + 0.05, midi(86), 0.09)                               # the plane's tail lights up
buzz(B["tPig"], 0.18, 140); ding(B["tPig"] + 0.3, midi(86), 0.09)      # the pigeon's tail too
put(sfx, sweep(600, 1800, 0.5, 4), B["tPig"] + 0.55, 0.06)             # only "?" is left glowing
# clue 2: tag pop, the post box lights up, cycle bell "tring tring"
pop_(B["c2"] - 0.1, 0.2, 500, 1100)
put(sfx, sweep(200, 500, 0.6, 3), B["tPost"], 0.12); put(sfx, pad([midi(57), midi(64)], 0.9, 0.2), B["tPost"], 0.05)
def cycle_bell(at, g=0.12):
    for r in range(2):
        x = np.arange(int(0.32 * SR)) / SR; vib = 1 + 0.004 * np.sin(2 * np.pi * 30 * x)
        sig = sum(a * np.sin(2 * np.pi * f * vib * x) for f, a in ((2950, 1), (4120, .6), (6300, .3))) * np.exp(-x * 9)
        put(sfx, sig, at + r * 0.2, g)
cycle_bell(B["tBell"]); cycle_bell(B["tBell"] + 0.55, 0.1)
# follow / subscribe taps
put(sfx, sweep(250, 900, 0.3, 6), B["sh9"] + 0.05, 0.2)
for tx in (B["tTapF"], B["tTapS"]):
    click(tx); [put(sfx, tone(midi(m), 0.25, 10), tx + 0.05 + j * 0.08, 0.12) for j, m in enumerate((84, 88))]
# countdown comment bubbles pop
for j, tb in enumerate(B["cb"]): put(sfx, sweep(500 + 40 * j, 1200 + 60 * j, 0.12, 14), tb, 0.12)
# Pinky hurries over (footsteps), tugs the sleeve (rustle)
k = 0
while B["walk0"] + k * 0.22 < B["walk1"]: put(sfx, band(noise(0.05, 60), 200, 2000), B["walk0"] + k * 0.22, 0.12); k += 1
for j in range(3): put(sfx, band(noise(0.12, 20), 1500, 6000), S(11) + 0.05 + j * 0.25, 0.05)
# reveal: the bird swoops in and stops, morphs into the envelope (chime + burst), fanfare, card flip
fly(B["shR"], B["tStop"], 0.35, 500, 5000)
put(sfx, sweep(1200, 500, 0.15, 12), B["tStop"], 0.08)
for j, m in enumerate([72, 76, 79, 84, 88]): put(sfx, bell(midi(m), 1.8), B["tM"] + j * 0.05, 0.07)   # morph chime
put(sfx, band(noise(0.9, 4), 2000, 12000), B["tM"] + 0.1, 0.25)                                     # burst shimmer
put(sfx, add(band(noise(0.25, 14), 60, 400), tone(70, 0.3, 9)), B["tM"] + 0.1, 0.35)                 # soft boom
for j, m in enumerate([67, 72, 76, 79, 84]): put(sfx, celesta(midi(m + 5), 0.7), B["tBan"] + j * 0.07, 0.14)   # answer fanfare
put(sfx, whoosh(0.3, 1500, 7000), B["tFlip"] - 0.05, 0.25); ding(B["tFlip"] + 0.2, midi(91), 0.12)            # "?" card flips to ✉️
# why: the envelope flies across town and drops in the window, letters twinkle out
fly(B["why2"], B["tDrop"], 0.3, 400, 4000)
put(sfx, add(sweep(900, 300, 0.2, 10), band(noise(0.08, 40), 300, 2000)), B["tDrop"] + 0.1, 0.15)
for j in range(6): put(sfx, celesta(midi([84, 88, 91, 93, 96, 91][j]), 0.6), B["tDrop"] + 0.15 + j * 0.13, 0.06)
# twist: cut swoosh, label pops, the envelope winks
put(sfx, whoosh(0.35, 800, 6000), B["shT"] - 0.1, 0.3)
pop_(B["tNow"] - 0.05, 0.16, 500, 1200); pop_(B["tThen"] - 0.05, 0.16, 600, 1400)
put(sfx, tone(midi(96), 0.4, 8), B["tWink"] + 0.05, 0.12); put(sfx, tone(midi(100), 0.4, 8), B["tWink"] + 0.13, 0.1)
# react: sparkles + Pinky's claps (her hands meet every ~0.21 s)
put(sfx, whoosh(0.3, 800, 6000), B["shK"] - 0.1, 0.2)
for j in range(6): put(sfx, tone(midi(93 + j * 2), 0.3, 10), B["shK"] + 0.2 + j * 0.15, 0.05)
t0 = np.ceil((S(15) + 0.05) * 15 / np.pi) * np.pi / 15
while t0 < E(15) + 0.2:
    put(sfx, band(noise(0.04, 90), 700, 4000), t0, 0.16); t0 += np.pi / 15
# check / share / close
put(sfx, add(band(noise(0.08, 40), 200, 3000), tone(110, 0.15, 25)), B["tTick"] + 0.1, 0.45)       # ✅ sticker stamp
put(sfx, tone(2637, 0.3, 10), B["tTick"] + 0.15, 0.1)
click(B["tShTap"])
for i in range(3): put(sfx, sweep(900, 1800, 0.35, 5), B["tShTap"] + 0.15 + i * 0.18, 0.1)        # mini envelopes fly
for i in range(3): put(sfx, tone(1760 + i * 220, 0.15, 14), B["tShTap"] + 0.65 + i * 0.18, 0.1)   # friends light up
for j in range(4): put(sfx, tone(1568 + j * 330, 0.3, 10), B["tFol"] - 0.1 + j * 0.07, 0.12)       # end-card sparkle

# ---------------- voices + mix ----------------
voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.65 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.3, (DUR - tt) / 1.2))
mix = (music * duck * 0.8 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
