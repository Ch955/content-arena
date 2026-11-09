"""Life lesson #1 'Vemana: salt and camphor' (2D animated) soundtrack, all synthesized here (original): playful
marimba-ish bed for the hook, a soft drone + plucked pentatonic melody under the padyam, a lighter bed for the meaning
and the A/B test, a ticking-clock tension bed for the 5 s countdown, a ta-da at the reveal, a brighter bed for the
close, and SFX synced to ep.html (pops, chalk scratches, magnifier whoosh, heart chime, button taps, slurp/sniff,
sticker slap, share whoosh, sparkles). Voices on top with ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
W_ = lambda s_: sum(4 if c == "…" else 1 for c in s_)
def atx(i, sub):  # same as ep.html: when a word of line i is spoken
    t_ = L[i]["text"]; k = t_.find(sub); return S(i) + L[i]["dur"] * (0 if k < 0 else W_(t_[:k]) / W_(t_))
T1, T2, T3, T4 = S(2) - 0.3, S(5) - 0.35, S(7) - 0.3, S(8) - 0.35
CD0 = E(10) + 0.35; CD1 = CD0 + CDN; T7, T8, T9, T10 = S(12) - 0.2, S(13) - 0.3, S(14) - 0.3, S(15) - 0.3
tSalt, tCamph, tSame, tWatch = atx(0, "ఉప్పు"), atx(0, "కర్పూరం"), atx(0, "రెండూ"), atx(1, "చివరి")
P = [(S(3), atx(3, "చూడ") - 0.15), (atx(3, "చూడ"), E(3)), (S(4), atx(4, "విశ్వదాభిరామ") - 0.15), (atx(4, "విశ్వదాభిరామ"), E(4))]
tLook, tGood, tFol, tSub = atx(6, "దగ్గరగా"), atx(6, "మంచితనం"), atx(7, "follow"), atx(7, "YouTube")
tA, tB, tB2, tCorr = atx(8, "A —"), S(9), atx(9, "అవసరానికి"), S(12)
tSaltR, tTaste, tKnow, tKadu, tPanul = atx(12, "ఉప్పు"), atx(12, "రుచి"), atx(12, "తెలుస్తుంది"), atx(13, "కాదు"), atx(13, "పనులే")
tTick, tShare, tAsk, tFollow = atx(14, "Comment"), atx(15, "share"), atx(15, "వాళ్ళు"), atx(15, "Follow")
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
beat = 60 / 112; prog = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
def bed(t0, t1, up=0, g=1.0):
    k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if k % 2 == 0: put(music, tone(midi(ch[0] - 24 + up), 0.4, 7), at, 0.32 * g)              # bass
        put(music, mallet(midi(ch[(k * 2) % 3] + 12 + up)), at + (0.04 if k % 2 else 0), (0.13 if k % 2 else 0.17) * g)
        if k % 4 == 2: put(music, noise(0.05, 80), at, 0.05 * g)                                   # shaker
        k += 1
def pluck(f, d=1.6):   # soft plucked string: a few harmonics, brighter ones die faster
    x = np.arange(int(d * SR)) / SR
    return sum(np.sin(2 * np.pi * f * h * x) * np.exp(-x * (2.5 + 3 * h)) / h for h in (1, 2, 3, 4)) * np.minimum(1, x / 0.004)
bed(0.1, T1 - 0.1)
# padyam: tanpura-like drone (Sa-Pa) + a slow pentatonic pluck melody (original), soft
x = tt[(tt >= T1) & (tt < T2)] - T1; dd = T2 - T1
env = np.minimum(1, x / 1.0) * np.minimum(1, (dd - x) / 0.8)
drone = (np.sin(2 * np.pi * midi(48) * x) + 0.6 * np.sin(2 * np.pi * midi(55) * x) + 0.4 * np.sin(2 * np.pi * midi(60) * x) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * x)))
put(music, drone * env * 0.07, T1)
mel = [72, 74, 76, 79, 76, 74, 72, 69, 67, 69, 72, 74, 76, 74, 72, 72]
k = 0; step = 60 / 72
while T1 + 0.4 + k * step < T2 - 0.6:
    put(music, pluck(midi(mel[k % len(mel)])), T1 + 0.4 + k * step, 0.10)
    if k % 2 == 0: put(music, pluck(midi(mel[k % len(mel)] - 12), 2.2), T1 + 0.4 + k * step, 0.06)
    k += 1
bed(T2 + 0.1, CD0 - 0.1, up=2, g=0.75)
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
# after the countdown, under Pinky's guess: a soft, curious bed so it isn't silent
bed(CD1 + 0.15, tCorr - 0.05, up=-3, g=0.45)
# reveal: ta-da (C major arpeggio + chord) + cymbal on "Correct!", then a brighter bed through the close
for j, m in enumerate([72, 76, 79, 84]): put(music, mallet(midi(m), 0.6), tCorr + j * 0.06, 0.22)
for m in (60, 64, 67, 72): put(music, tone(midi(m), 1.4, 2.2), tCorr + 0.25, 0.10)
put(music, noise(1.4, 3) * 0.5, tCorr, 0.35)
bed(tCorr + 1.2, DUR - 0.3, up=0, g=0.85)

sfx = np.zeros(n)
def pop(at, g=0.2, f0=300, f1=900): put(sfx, sweep(f0, f1, 0.16, 12), at, g)
def whoosh(at, g=0.4, d=0.45): put(sfx, lp(noise(d, 5), 0.15), at, g)
def chalk(t0, t1, g=0.07):     # chalk on slate: short bright scratches
    k = 0
    while t0 + k * 0.075 < t1:
        put(sfx, lp(noise(0.05, 40), 0.6) - lp(noise(0.05, 40), 0.05), t0 + k * 0.075 + 0.01 * np.sin(k), g); k += 1
def chime(at, g=0.14):
    for j, m in enumerate((84, 88, 91)): put(sfx, tone(midi(m), 0.6, 5), at + j * 0.07, g)
def click(at, g=0.3): put(sfx, add(noise(0.012, 400), tone(1800, 0.03, 90)), at, g)
pop(0.15, 0.25)                                                     # title
pop(tSalt - 0.15, 0.2, 500, 1100); pop(tCamph - 0.15, 0.2, 600, 1300)  # piles
put(sfx, sweep(200, 600, 0.35, 5) * (1 + 0.5 * np.sin(np.arange(int(0.35 * SR)) / SR * 2 * np.pi * 18)), tSame, 0.2)   # "?" boing
pop(tWatch - 0.1, 0.22, 400, 1000)                                  # ANSWER AT THE END tag
whoosh(T1 - 0.1)
for a_, b_ in P: chalk(a_, b_)                                      # padyam chalk-writing
whoosh(T2 - 0.1, 0.35)
for j in range(2): pop(S(5) + 0.15 + j * 0.25, 0.15, 400 + 100 * j, 900 + 100 * j)   # chalk figures
whoosh(tLook - 0.25, 0.3, 0.6); chime(tGood + 0.2)                  # magnifier, heart
whoosh(T3 - 0.1, 0.35); pop(S(7) - 0.2, 0.2)                        # follow buttons
for at in (tFol, tSub): click(at); put(sfx, tone(1320, 0.25, 12), at + 0.05, 0.12)
whoosh(T4 - 0.1, 0.35)
pop(tA - 0.1, 0.22, 300, 800); pop(tB - 0.05, 0.22, 350, 900)       # A, B
for j in range(2): pop(tA + 0.25 + j * 0.35, 0.16, 700, 1400)       # speech bubbles
chime(tB2, 0.08)
whoosh(CD1 - 0.05, 0.4); whoosh(S(11) - 0.4, 0.25, 0.3)            # cut to Pinky, card up
chime(tTaste + 0.3, 0.07)
put(sfx, sweep(900, 250, 0.3, 6), tTaste, 0.18)                     # slurp
for j in range(2): put(sfx, lp(noise(0.18, 12), 0.35), tKnow + j * 0.28, 0.25)   # sniff sniff
chalk(tKadu, tKadu + 0.3, 0.09); chalk(tPanul, tPanul + 0.5, 0.09)  # strike-through, underline
pop(tPanul - 0.15, 0.2)
put(sfx, add(tone(90, 0.25, 14), lp(noise(0.12, 30), 0.4)), tTick - 0.02, 0.5)   # sticker slap
click(tShare); whoosh(tShare + 0.2, 0.35, 0.6); pop(tAsk, 0.2, 500, 1200)
for j in range(4): put(sfx, tone(1568 + j * 330, 0.3, 10), tFollow - 0.1 + j * 0.07, 0.12)   # end-card sparkle

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)

act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.65 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.3, (DUR - tt) / 1.2))
mix = (music * duck * 0.8 + sfx + voice) * fade
mix /= np.abs(mix).max() / 0.84   # headroom for AAC true peak
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
