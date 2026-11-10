"""Book story #2 'Panchatantra: the monkey and the crocodile' (2D animated) soundtrack, all synthesized here (original):
a playful marimba bed for the host scenes, a gentle storybook flute + pizzicato bed on the river, a sly minor drone for
the crocodile's wife, an adventurous bed for the ride, a dramatic sting at "నీ గుండె కావాలి!", the ticking-clock
countdown, a ta-da at the reveal, a triumphant bed for the escape, and SFX synced to ep.html (page flutter + shimmer as
the book opens, river ambience, monkey chatter, fruit whoosh + gulp, slurp, whip-pan whooshes, hop boing, splashes,
wind, button taps, slap, wah-wah, claps, chalk pop, sticker pop, sparkles). Voices on top with ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
W_ = lambda s: sum(4 if c == "…" else 1 for c in s)
def atx(i, sub):  # same as ep.html: time a phrase of line i is spoken
    l = L[i]; k = l["text"].find(sub)
    return l["start"] + l["dur"] * (0 if k < 0 else W_(l["text"][:k]) / W_(l["text"]))

# key times (same names as ep.html)
tOkka, tMata = atx(0, "ఒక్క మాటతో"), atx(1, "చివర్లో")
tOpen, tNadi, tKoti = S(2) - 0.1, atx(2, "నది"), atx(2, "ఒక కోతి")
tRoju, tFruit = S(3), atx(3, "తియ్యటి")
tWife, tAndi, tGunde4, tSweet = S(4), atx(4, "అంది"), atx(4, "గుండె"), atx(4, "తియ్యగా")
tBack = atx(5, "వీపు"); tNijam, tWant = atx(6, "నిజం"), atx(6, "నీ గుండె")
tFol, tSub = atx(7, "follow"), atx(7, "YouTube")
CD0 = E(9) + 0.35; CD1 = CD0 + CDN
tAyyo10, tChettu = atx(10, "అయ్యో"), atx(10, "చెట్టు")
tNammi, tKoti11 = S(11), atx(11, "కోతి చెట్టెక్కి")
tClap, tNeeti, tApada = S(12), S(13), atx(13, "ఆపదలో")
tTick, tShare, tFollow = atx(14, "Comment"), atx(15, "share"), atx(15, "Follow")
T8, T12, w0 = S(8) - 0.3, S(12) - 0.3, tNadi - 0.35
rng = np.random.default_rng(7)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR); e = min(n, s + len(sig))
    if s < 0: sig = sig[-s:]; s = 0
    if s < n and e > s: dst[s:e] += sig[: e - s] * gain
def tone(f, d, decay=8):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def mallet(f, d=0.4):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
def pluck(f, d=0.35):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(4 * np.pi * f * x)) * np.exp(-x * 11) * np.minimum(1, x / 0.002)
def flute(f, d):
    x = np.arange(int(d * SR)) / SR
    vib = 1 + 0.006 * np.sin(2 * np.pi * 5.2 * x) * np.minimum(1, x / 0.25)
    ph = 2 * np.pi * np.cumsum(f * vib) / SR
    env = np.minimum(1, x / 0.06) * np.minimum(1, (d - x) / 0.12)
    return (np.sin(ph) + 0.18 * np.sin(2 * ph) + 0.05 * np.sin(3 * ph)) * env
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
def whoosh(d=0.45, g=1.0):
    x = np.arange(int(d * SR)) / SR
    return lp(rng.standard_normal(len(x)), 0.12) * np.sin(np.pi * x / d) ** 2 * g
def saw_chord(ms, d, decay=1.5):
    x = np.arange(int(d * SR)) / SR; out = np.zeros(len(x))
    for m in ms:
        f = midi(m); out += 2 * ((x * f) % 1) - 1
    return lp(out / len(ms) * np.exp(-x * decay) * np.minimum(1, x / 0.01), 0.08)

music = np.zeros(n)
prog = [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]]
def bed(t0, t1, bpm=112, up=0, g=1.0):        # playful marimba bed
    beat = 60 / bpm; k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if k % 2 == 0: put(music, tone(midi(ch[0] - 24 + up), 0.4, 7), at, 0.32 * g)
        put(music, mallet(midi(ch[(k * 2) % 3] + 12 + up)), at + (0.04 if k % 2 else 0), (0.13 if k % 2 else 0.17) * g)
        if k % 4 == 2: put(music, noise(0.05, 80), at, 0.05 * g)
        k += 1
MEL = [76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 76, 74, 72, 69, 72, None]   # pentatonic storybook tune
def story_bed(t0, t1, g=1.0):                  # flute + pizzicato, 92 bpm
    beat = 60 / 92; k = 0
    while t0 + k * beat < t1 - 0.2:
        at = t0 + k * beat; ch = prog[(k // 4) % 4]
        put(music, pluck(midi(ch[0] - 12)), at, 0.22 * g)
        put(music, pluck(midi(ch[1])), at + beat / 2, 0.10 * g); put(music, pluck(midi(ch[2])), at + beat * 0.75, 0.08 * g)
        m = MEL[k % len(MEL)]
        if m: put(music, flute(midi(m), beat * 0.95), at, 0.085 * g)
        k += 1
def drone(t0, t1, ms, g):
    x = tt[(tt >= t0) & (tt < t1)] - t0; d = t1 - t0; out = np.zeros(len(x))
    for j, m in enumerate(ms): out += np.sin(2 * np.pi * midi(m) * x + j) * (1 + 0.3 * np.sin(2 * np.pi * 0.5 * x + j))
    put(music, out / len(ms) * np.minimum(1, x / 0.4) * np.minimum(1, (d - x) / 0.4) * g, t0)

bed(0.1, w0 + 0.2)                                                       # host: hook
story_bed(w0 + 0.3, tAndi - 0.1)                                         # the river, the friendship
drone(tAndi - 0.2, S(5) - 0.2, [45, 48, 51, 57], 0.11)                   # the wife's sly plan (dim chord)
for k in range(6): put(music, pluck(midi([57, 60, 63, 60, 56, 57][k] - 12), 0.5), tAndi + k * 0.5, 0.18)
bed(S(5) - 0.2, S(6) - 0.15, bpm=132, up=2, g=0.8)                       # the ride
drone(S(6) - 0.15, T8 + 0.2, [40, 43, 46], 0.12)                          # mid-river: danger
put(music, saw_chord([40, 47, 52, 55], 2.2, 1.2), tWant - 0.05, 0.5)     # sting: "నీ గుండె కావాలి!"
put(music, tone(41, 1.6, 2.5), tWant - 0.05, 0.6); put(music, noise(1.2, 3), tWant - 0.05, 0.12)
bed(T8 + 0.1, CD0 - 0.1, g=0.6)                                          # host: worry + comment call
for k in range(int(CDN * 2)):                                            # countdown: tick-tock, drone, riser, heartbeat
    at = CD0 + k * 0.5
    put(music, noise(0.03, 160) * 0.6 + tone(2400 if k % 2 == 0 else 1800, 0.03, 120), at, 0.35 if k % 2 == 0 else 0.22)
x = tt[(tt >= CD0) & (tt < CD1)] - CD0
put(music, (np.sin(2 * np.pi * midi(45) * (1 + 0.06 * x / CDN) * x) + 0.5 * np.sin(2 * np.pi * midi(52) * (1 + 0.06 * x / CDN) * x)) * np.minimum(1, x / 0.6) * (0.08 + 0.08 * x / CDN), CD0)
put(music, lp(rng.standard_normal(int(CDN * SR)), 0.05) * np.linspace(0.0, 1.0, int(CDN * SR)) ** 2, CD0, 0.5)
for k in range(int(CDN)):
    for j, dt in enumerate((0, 0.16)): put(music, tone(55, 0.18, 18), CD0 + k + 0.3 + dt, 0.5 - 0.15 * j)
drone(CD1, tAyyo10, [57, 64], 0.05)                                       # hush before the clever line
for j, m in enumerate([72, 76, 79, 84]): put(music, mallet(midi(m), 0.6), tAyyo10 + j * 0.06, 0.22)   # ta-da at the answer
for m in (60, 64, 67, 72): put(music, tone(midi(m), 1.4, 2.2), tAyyo10 + 0.25, 0.10)
put(music, noise(1.4, 3) * 0.5, tAyyo10, 0.3)
bed(tNammi - 0.1, T12 + 0.1, bpm=126, up=2, g=0.75)                       # the escape
bed(T12 + 0.2, DUR - 0.3, g=0.8)                                         # host: moral + CTA

sfx = np.zeros(n)
put(sfx, sweep(300, 900, 0.18, 10), 0.15, 0.25)                           # title pop
put(sfx, add(tone(1568, 0.5, 6), tone(2093, 0.5, 6) * 0.6), tOkka, 0.12)  # "one word" ding
put(sfx, sweep(500, 1200, 0.12, 14), tMata - 0.1, 0.15)                   # hold tag pops
for j in range(6): put(sfx, lp(noise(0.06, 40), 0.35), tOpen + j * 0.07, 0.25)   # page flutter
for j, m in enumerate([72, 76, 79, 83, 86, 88, 91]): put(sfx, tone(midi(m), 0.5, 7), tOpen + 0.25 + j * 0.06, 0.07)   # shimmer
put(sfx, whoosh(0.7), w0, 0.35)                                           # into the story
riv = lp(rng.standard_normal(n), 0.03); riv *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.23 * tt)   # river ambience
amb = ((tt > w0) & (tt < T8 + 0.3)) | ((tt > CD0 - 0.3) & (tt < T12 + 0.3))
sfx += riv * np.convolve(amb.astype(float), np.ones(8820) / 8820, mode="same") * 0.35
for j in range(2): put(sfx, sweep(650, 950, 0.14, 8) * (1 + 0.4 * np.sin(np.arange(int(0.14 * SR)) / SR * 2 * np.pi * 30)), tKoti + j * 0.18, 0.13)   # monkey "ooh-ooh"
span = E(3) - tRoju
for j in range(3):                                                        # fruit toss + gulp
    ft = tRoju + 0.1 + j * span / 3
    put(sfx, whoosh(0.3), ft, 0.15)
    put(sfx, add(sweep(420, 140, 0.16, 12), lp(noise(0.08, 40), 0.3) * 0.5), ft + 0.72, 0.3)
    for q in range(3): put(sfx, lp(noise(0.04, 80), 0.4), ft + 0.82 + q * 0.09, 0.15)   # munch
for j in range(4): put(sfx, tone(1760 + j * 220, 0.4, 7), tFruit + j * 0.12, 0.06)     # friendship chimes
put(sfx, whoosh(0.55), tWife - 0.2, 0.4)                                  # whip pan to the wife
for k in range(3): put(sfx, add(tone(60, 0.18, 16), tone(48, 0.2, 14)), tGunde4 + k * 0.42, 0.35)   # heart thumps
put(sfx, add(sweep(250, 650, 0.3, 5), lp(noise(0.3, 8), 0.2) * 0.4), tSweet + 0.15, 0.18)        # slurp
put(sfx, whoosh(0.5), S(5) - 0.3, 0.4)                                    # pan back to the tree
put(sfx, sweep(300, 820, 0.3, 6), tBack - 0.1, 0.25)                      # hop on the back
put(sfx, lp(noise(0.25, 10), 0.25), tBack + 0.45, 0.35)                   # lands with a splash
for k in range(8): put(sfx, lp(noise(0.12, 18), 0.18), tBack + 0.5 + k * 0.38, 0.18)   # paddling
x = np.arange(int(2.6 * SR)) / SR
put(sfx, lp(rng.standard_normal(len(x)), 0.06) * np.sin(np.pi * x / 2.6) * (0.7 + 0.3 * np.sin(2 * np.pi * 1.3 * x)), tBack + 0.5, 0.25)   # wind
put(sfx, add(sweep(160, 90, 0.25, 6), lp(noise(0.1, 30), 0.3)), tWant + 0.05, 0.3)   # jaw snap
for tp in (tFol, tSub): put(sfx, add(sweep(1200, 600, 0.06, 40), noise(0.02, 200) * 0.4), tp, 0.3)   # button taps
put(sfx, whoosh(0.4), T8 - 0.1, 0.3)                                      # back to the host
put(sfx, sweep(250, 900, 0.3, 6), T8, 0.22)                               # Pinky pops in
put(sfx, whoosh(0.5), CD0 - 0.35, 0.3)                                    # back to the river
put(sfx, lp(noise(0.12, 30), 0.5), tAyyo10 + 0.05, 0.55)                  # forehead slap
for j in range(3): put(sfx, tone(1300 + j * 300, 0.15, 20), tAyyo10 + 0.1 + j * 0.05, 0.1)
put(sfx, sweep(500, 250, 0.4, 3) * (1 + 0.5 * np.sin(np.arange(int(0.4 * SR)) / SR * 2 * np.pi * 14)), tChettu + 0.3, 0.12)   # croc "huh?"
put(sfx, sweep(260, 1000, 0.4, 4), tKoti11, 0.25)                         # the leap
put(sfx, lp(noise(0.3, 9), 0.3), tKoti11 + 0.02, 0.35)                    # splash
put(sfx, add(tone(140, 0.15, 20), lp(noise(0.06, 50), 0.4)), tKoti11 + 0.6, 0.35)   # lands on the branch
for j, f0 in enumerate([392, 370, 349, 311]):                            # wah-wah: the fooled croc
    x = np.arange(int(0.34 * SR)) / SR; f = f0 * (1 - 0.03 * x / 0.34)
    s_ = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 6 * x)) * np.minimum(1, x / 0.02) * np.exp(-x * 2)
    put(sfx, lp(s_, 0.1), tKoti11 + 0.75 + j * 0.36, 0.25)
c0 = np.ceil(tClap * 15 / np.pi) * np.pi / 15                             # claps: hands meet when sin(15t)=0
while c0 < tNeeti - 0.05:
    put(sfx, lp(noise(0.06, 60), 0.6), c0, 0.5); c0 += np.pi / 15
put(sfx, add(sweep(400, 900, 0.15, 10), tone(1568, 0.6, 5) * 0.5), tApada - 0.2, 0.2)   # moral card
put(sfx, sweep(900, 1800, 0.1, 18), tTick - 0.1, 0.25)                    # sticker
put(sfx, whoosh(0.4), tShare + 0.1, 0.25); put(sfx, sweep(500, 1100, 0.12, 14), tShare + 0.45, 0.18)
for j in range(4): put(sfx, tone(1568 + j * 330, 0.3, 10), tFollow - 0.1 + j * 0.07, 0.12)   # end-card sparkle

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
