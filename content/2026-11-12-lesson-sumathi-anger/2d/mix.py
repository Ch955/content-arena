"""Life lesson 'Sumathi Satakam: anger' (2D animated, clay) soundtrack, all synthesized here (original): a gentle warm
marimba theme, a soft drone + plucked pentatonic melody under the padyam, a ticking tension bed for the 5 s countdown,
a chime at the answer, a brighter bed for the close. SFX synced to ep.html: pops, whip-whoosh, toy-phone crack,
steam hiss, button clicks, the 'whoom' of the breathing circle, balloon pops, sticker slap, share whoosh. Voices on top
with ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
W_ = lambda s_: sum(4 if c == "…" else 1 for c in s_)
def atx(i, sub):  # same as ep.html: when a word of line i is spoken
    t_ = L[i]["text"]; k = t_.find(sub); return S(i) + L[i]["dur"] * (0 if k < 0 else W_(t_[:k]) / W_(t_))
tWho, tWatch = atx(0, "…మీతోనే"), atx(1, "చివరి వరకు")
tDrop = S(2) - 0.3; tLand = tDrop + 0.38; tBroke = atx(2, "పగలగొట్టేసింది")
tScroll = atx(3, "సుమతీ"); T_POEM0, T_POEM1 = S(4) - 0.3, S(6) - 0.3
tShield, tDaya, tSwarg, tNarak = atx(4, "శాంతమె"), atx(4, "దయ"), atx(5, "స్వర్గము"), atx(5, "దుఃఖమె")
tKopam, tRaksha, tFol, tSub = atx(6, "మన కోపమే"), atx(7, "రక్ష"), atx(8, "follow"), atx(8, "subscribe")
tA, tShout, tB, tBreath, tAorB = atx(9, "A —"), atx(9, "వెంటనే"), S(10), atx(10, "10 సెకన్లు"), atx(11, "A or B")
CD0 = E(11) + 0.3; CD1 = CD0 + CDN
tSlam, tLoud, tAns, tBB = atx(12, "A!"), atx(12, "గట్టిగా"), atx(13, "Answer"), atx(13, "B!")
tBurn, tCalm, tTick, tShare, tFollow, tRepu = atx(14, "మనల్నే"), atx(14, "శాంతం"), atx(15, "Comment"), atx(16, "share"), atx(16, "Follow"), atx(16, "రేపు")
rng = np.random.default_rng(12)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR); e = min(n, s + len(sig))
    if 0 <= s < n: dst[s:e] += sig[: e - s] * gain
def tone(f, d, decay=8):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def mallet(f, d=0.45):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 7) * np.minimum(1, x / 0.003)
def add(*sigs):
    out = np.zeros(max(len(x) for x in sigs))
    for x in sigs: out[:len(x)] += x
    return out
def noise(d, decay): x = np.arange(int(d * SR)) / SR; return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = np.arange(int(d * SR)) / SR; f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def lp(sig, a):
    out = np.empty_like(sig); acc = 0.0
    for i, v in enumerate(sig): acc += a * (v - acc); out[i] = acc
    return out
def hp(sig, a=0.2): return sig - lp(sig, a)
def pluck(f, d=1.6):
    x = np.arange(int(d * SR)) / SR
    return sum(np.sin(2 * np.pi * f * h * x) * np.exp(-x * (2.5 + 3 * h)) / h for h in (1, 2, 3, 4)) * np.minimum(1, x / 0.004)

music = np.zeros(n)
beat = 60 / 96; prog = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]   # gentle, warm (slower than the riddle reels)
def bed(t0, t1, up=0, g=1.0, minor=False):
    k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if minor: ch = [ch[0], ch[1] - (1 if (ch[1] - ch[0]) == 4 else 0), ch[2]]
        if k % 2 == 0: put(music, tone(midi(ch[0] - 24 + up), 0.5, 5), at, 0.30 * g)
        put(music, mallet(midi(ch[(k * 2) % 3] + 12 + up)), at + (0.03 if k % 2 else 0), (0.10 if k % 2 else 0.14) * g)
        if k % 4 == 2: put(music, noise(0.04, 90), at, 0.03 * g)
        k += 1
bed(0.1, tDrop - 0.05, g=0.9)
bed(tLand + 0.4, T_POEM0, up=-2, g=0.55, minor=True)            # the upset bit: softer, minor
x = tt[(tt >= T_POEM0) & (tt < T_POEM1)] - T_POEM0; dd = T_POEM1 - T_POEM0
env = np.minimum(1, x / 1.0) * np.minimum(1, (dd - x) / 0.8)
drone = (np.sin(2 * np.pi * midi(48) * x) + 0.6 * np.sin(2 * np.pi * midi(55) * x) + 0.4 * np.sin(2 * np.pi * midi(60) * x) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.5 * x)))
put(music, drone * env * 0.07, T_POEM0)
mel = [72, 74, 76, 79, 76, 74, 72, 69, 67, 69, 72, 74, 76, 74, 72, 72]
k = 0; step = 60 / 66
while T_POEM0 + 0.4 + k * step < T_POEM1 - 0.6:
    put(music, pluck(midi(mel[k % len(mel)])), T_POEM0 + 0.4 + k * step, 0.09)
    if k % 2 == 0: put(music, pluck(midi(mel[k % len(mel)] - 12), 2.2), T_POEM0 + 0.4 + k * step, 0.05)
    k += 1
bed(T_POEM1 + 0.1, CD0 - 0.1, up=2, g=0.7)
for k in range(int(CDN * 2)):                                    # countdown ticks
    at = CD0 + k * 0.5
    put(music, noise(0.03, 160) * 0.6 + tone(2400 if k % 2 == 0 else 1800, 0.03, 120), at, 0.35 if k % 2 == 0 else 0.22)
x = tt[(tt >= CD0) & (tt < CD1)] - CD0
drone = (np.sin(2 * np.pi * midi(45) * (1 + 0.06 * x / CDN) * x) + 0.5 * np.sin(2 * np.pi * midi(52) * (1 + 0.06 * x / CDN) * x)) * np.minimum(1, x / 0.6) * (0.07 + 0.07 * x / CDN)
put(music, drone, CD0)
put(music, lp(rng.standard_normal(int(CDN * SR)), 0.05) * np.linspace(0.0, 1.0, int(CDN * SR)) ** 2, CD0, 0.4)
for k in range(int(CDN)):
    for j, dt in enumerate((0, 0.16)): put(music, tone(55, 0.18, 18), CD0 + k + 0.3 + dt, 0.45 - 0.15 * j)
bed(CD1 + 0.15, tAns - 0.05, up=-3, g=0.4)
for j, m in enumerate([72, 76, 79, 84]): put(music, mallet(midi(m), 0.7), tAns + j * 0.06, 0.2)   # answer chime
for m in (60, 64, 67, 72): put(music, tone(midi(m), 1.6, 2.0), tAns + 0.25, 0.09)
put(music, noise(1.2, 3.5) * 0.4, tAns, 0.25)
bed(tAns + 1.2, DUR - 0.3, up=0, g=0.8)

sfx = np.zeros(n)
def pop(at, g=0.2, f0=300, f1=900): put(sfx, sweep(f0, f1, 0.16, 12), at, g)
def whoosh(at, g=0.4, d=0.45): put(sfx, lp(noise(d, 5), 0.15), at, g)
def chime(at, g=0.14):
    for j, m in enumerate((84, 88, 91)): put(sfx, tone(midi(m), 0.6, 5), at + j * 0.07, g)
def click(at, g=0.32): put(sfx, add(noise(0.012, 400), tone(1800, 0.03, 90), tone(140, 0.08, 40)), at, g)
def hiss(at, d=0.9, g=0.12):   # steam: band-passed noise with a soft attack
    x = np.arange(int(d * SR)) / SR; sig = hp(lp(rng.standard_normal(len(x)), 0.5), 0.25) * np.minimum(1, x / 0.08) * np.exp(-x * 2.2)
    put(sfx, sig, at, g)
def crack(at, g=0.6):          # toy phone: thud + sharp crackles
    put(sfx, add(tone(110, 0.2, 18), lp(noise(0.08, 40), 0.5)), at, g)
    for j in range(6): put(sfx, hp(noise(0.02, 200), 0.6), at + 0.015 + j * 0.022 + 0.01 * np.sin(j * 3), g * (0.9 - j * 0.1))
def whoom(at, d=1.4, g=0.22, up=True):   # breathing circle: soft filtered swell
    x = np.arange(int(d * SR)) / SR; e = np.sin(np.pi * x / d) ** 2
    f = 140 + (60 if up else -30) * x / d
    put(sfx, (np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.6 + lp(rng.standard_normal(len(x)), 0.03) * 2.5) * e, at, g)
pop(0.15, 0.25); pop(0.5, 0.2, 400, 1000)                       # title, poster
whoosh(tWho - 0.12, 0.5, 0.4); put(sfx, tone(98, 0.6, 4), tWho, 0.35)   # whip + low 'dun'
pop(tWatch - 0.1, 0.22, 400, 1000)                              # ANSWER AT THE END
for j in range(2): put(sfx, noise(0.03, 100), S(1) + 0.1 + j * 0.25, 0.08)   # footsteps
crack(tLand); put(sfx, sweep(900, 300, 0.3, 6), tDrop, 0.1)       # falls, cracks
pop(tLand + 0.05, 0.18, 600, 1300)                              # KRAK!
for j in range(3): hiss(tLand + 0.4 + j * 1.0, 0.8, 0.07 + 0.03 * j)   # steam builds
put(sfx, sweep(300, 700, 0.5, 3), tLand + 0.1, 0.08)             # meter rises
whoosh(tScroll - 0.2, 0.35, 0.7)                                # scroll unrolls
chime(tShield, 0.10); chime(tDaya + 0.4, 0.08); chime(tSwarg, 0.07)
for j in range(3): put(sfx, lp(noise(0.06, 30), 0.3), tNarak + 0.2 + j * 0.18, 0.1)   # raindrops
pop(S(6) - 0.2, 0.18); put(sfx, hp(noise(0.12, 30), 0.5), tKopam, 0.2)   # card, mirror crack
pop(S(7) - 0.15, 0.18); chime(tRaksha, 0.10)
pop(S(8) - 0.2, 0.2)
for at in (tFol, tSub): click(at); put(sfx, tone(1320, 0.25, 12), at + 0.05, 0.12)
pop(tA - 0.1, 0.22, 300, 800); click(tShout, 0.4); whoosh(tShout + 0.02, 0.35, 0.3)
put(sfx, sweep(500, 1500, 0.25, 5) * np.sign(np.sin(np.arange(int(0.25 * SR)) / SR * 2 * np.pi * 60)), tShout + 0.05, 0.06)   # shout zap
put(sfx, hp(noise(0.3, 10), 0.5), tShout + 0.1, 0.12)            # ground crack
hiss(tShout + 0.1, 0.9, 0.1)
pop(tB - 0.05, 0.22, 350, 900); click(tBreath, 0.35)
b = tBreath
while b < E(10) - 0.3: whoom(b, 1.4, 0.2); b += 1.4                # breathing circle
pop(tAorB, 0.15, 500, 1000); pop(tAorB + 0.35, 0.15, 600, 1100)
whoosh(CD0 - 0.05, 0.3)
for j, t0 in enumerate([0.15, 0.75, 1.35, 1.95, 2.55, 3.15]):     # comment balloons pop up
    pop(CD0 + t0 + 0.1, 0.12, 500 + 60 * j, 1000 + 80 * j); put(sfx, noise(0.03, 120), CD0 + t0 + 2.3, 0.1)
whoosh(CD1 - 0.05, 0.4)
put(sfx, add(tone(80, 0.3, 12), lp(noise(0.1, 30), 0.4)), tSlam, 0.6); click(tSlam, 0.4)   # slam!
put(sfx, sweep(400, 1400, 0.2, 6), tSlam + 0.05, 0.12)            # meter jumps
hiss(tLoud - 0.2, 1.2, 0.22)                                       # steam blows back
for j in range(2): put(sfx, lp(noise(0.12, 25), 0.4), tLoud + 0.5 + j * 0.3, 0.2)   # cough cough
chime(tAns + 0.3, 0.1); click(tAns, 0.3)
hiss(tBurn, 1.0, 0.12); put(sfx, lp(noise(0.25, 10), 0.3), tBurn + 0.3, 0.1)   # singe
whoom(tCalm, 1.3, 0.2); whoom(tCalm + 1.3, 1.3, 0.16)
put(sfx, sweep(900, 300, 0.8, 2), tCalm + 0.2, 0.06)              # meter drops
chime(S(15) + 0.4, 0.08)                                          # hug
put(sfx, add(tone(90, 0.25, 14), lp(noise(0.12, 30), 0.4)), tTick - 0.02, 0.5)   # sticker slap
click(tShare); whoosh(tShare + 0.2, 0.35, 0.6); pop(tShare + 0.5, 0.2, 500, 1200)
for j in range(4): put(sfx, tone(1568 + j * 330, 0.3, 10), tFollow - 0.1 + j * 0.07, 0.12)
pop(tRepu - 0.1, 0.15, 600, 1300)

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.65 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.3, (DUR - tt) / 1.2))
mix = (music * duck * 0.8 + sfx + voice) * fade
mix /= np.abs(mix).max() / 0.84
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
