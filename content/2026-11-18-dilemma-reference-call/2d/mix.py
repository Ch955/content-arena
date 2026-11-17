"""Moral dilemma #2 'the reference call' soundtrack, all synthesized here (original; no film music, no real song): an
office bed for Tower B (soft AC hum, distant keyboard clicks, a muted pensive groove: felt-piano + pizzicato, A minor),
a low synth stab under the mute, a sepia flashback (tape-wobble music box + a projector whir, applause swell on the
all-hands, a dull paper 'thud' when the appraisal card lands), a dark pulse under 'revenge', a stamp for the hold tag,
a soft heartbeat under Ananya's line, UI pops/taps (follow, A/B taps, comments, tiles, tag, end card), a held pad +
ticks for the 5-s countdown, a paper rip for the panels sliding apart + a warm swell for the reveal, the call-ended
blip, a clock-wipe whoosh with fast ticks, the chai stall at dusk (traffic hum, a kettle hiss, warm guitar-like plucks),
ONE soft note under 'Chai చల్లారిపోతుంది… తాగు' (the bed drops out), and at the loop cut the office bed restarts exactly as at
t=0. Reads timeline.json + beats.json (node render.js --beats); voices on top with ducking -> mix.wav."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); b = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
rng = np.random.default_rng(17)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n: dst[s:e] += sig[: e - s] * gain
def env_x(d): return np.arange(int(d * SR)) / SR
def piano(m, d=2.5, vel=1.0):
    x = env_x(d); f = midi(m); o = np.zeros_like(x)
    for k in range(1, 7): o += np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * x) / k ** 1.4 * np.exp(-x * (1.6 + 0.9 * k))
    return o * np.minimum(1, x / 0.004) * vel
def strings(m, d, att=0.6, rel=0.8):
    x = env_x(d); f = midi(m); o = np.zeros_like(x)
    for det in (-0.003, 0, 0.0035):
        for k in range(1, 6): o += np.sin(2 * np.pi * f * (1 + det) * k * x + k * det * 50) / k ** 1.6
    return o * np.minimum(1, x / att) * np.minimum(1, np.maximum(0, (d - x) / rel)) * (1 + 0.004 * np.sin(2 * np.pi * 5.2 * x)) / 4
def pluck(m, d=0.5):
    x = env_x(d); f = midi(m)
    return (np.sin(2 * np.pi * f * x) + 0.4 * np.sin(2 * np.pi * 2 * f * x) * np.exp(-x * 20)) * np.exp(-x * 7) * np.minimum(1, x / 0.002)
def tone(f, d, decay=8): x = env_x(d); return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def noise(d, decay): x = env_x(d); return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = env_x(d); f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def add(*sigs):
    o = np.zeros(max(len(x) for x in sigs))
    for x in sigs: o[:len(x)] += x
    return o
def smooth(sig, k=8): return np.convolve(sig, np.ones(k) / k, mode="same")
def win(d, a=0.3, r=0.4): x = env_x(d); return np.minimum(1, np.minimum(x / a, np.maximum(0, d - x) / r))
def drum(lo=True):   # hand drum: low 'dhum' or high 'ta'
    x = env_x(0.35 if lo else 0.15)
    if lo: return np.sin(2 * np.pi * np.cumsum(110 * np.exp(-x * 9) + 70) / SR) * np.exp(-x * 11)
    return (np.sin(2 * np.pi * 520 * x) * 0.6 + smooth(rng.standard_normal(len(x)), 2) * 0.5) * np.exp(-x * 38)

music = np.zeros(n); sfx = np.zeros(n); amb = np.zeros(n)
def office(t0, t1, g=1.0, seed=3):
    """AC hum + far keyboard clicks + the pensive groove (A minor, 92 bpm): felt piano arps + pizzicato bass."""
    r = np.random.default_rng(seed); d = t1 - t0; x = env_x(d)
    hum = smooth(r.standard_normal(len(x)), 60) - smooth(r.standard_normal(len(x)), 600)
    put(amb, hum * win(d, 0.02, 0.1) * 2.5, t0, 0.035 * g)
    k = 0
    while k < d * 6:
        at_ = t0 + k / 6 + r.random() * 0.1
        if r.random() < 0.45 and at_ < t1 - 0.05: put(amb, add(smooth(noise(0.02, 200), 2), tone(1800 + r.random() * 600, 0.015, 200) * 0.3), at_, 0.03 * g)
        k += 1
    beat = 60 / 92; k = 0; prog = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
    while t0 + k * beat / 2 < t1 - 0.05:
        at_ = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if k % 8 == 0: put(music, strings(ch[0] - 12, min(beat * 4 + 0.2, t1 - at_), 0.3, 0.3), at_, 0.035 * g)
        if k % 2 == 0: put(music, piano(ch[(k // 2) % 3] + 12, 1.2, 0.8), at_, 0.05 * g)
        if k % 4 == 0: put(music, pluck(ch[0] - 12, 0.4), at_, 0.07 * g)
        k += 1
def street(t0, t1, g=1.0, seed=9):
    r = np.random.default_rng(seed); d = t1 - t0; x = env_x(d)
    traffic = smooth(r.standard_normal(len(x)), 120) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * x))
    put(amb, traffic * win(d, 0.05, 0.2) * 3, t0, 0.05 * g)
    hiss = smooth(r.standard_normal(len(x)), 2) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * x))
    put(amb, hiss * win(d, 0.3, 0.3), t0, 0.006 * g)
    for k, at_ in enumerate(np.arange(t0 + 0.8, t1 - 0.3, 2.3)): put(amb, add(tone(midi(80 + (k % 2) * 3), 0.25, 9) * 0.5, tone(midi(84), 0.2, 12) * 0.3), at_, 0.02 * g)   # far horns, soft
OPEN_END = b["fb0"] - 0.05
office(0, b["fb0"]); office(b["fb1"], b["ab0"], 0.9, seed=4)
# mute: a low synth stab
put(sfx, add(tone(midi(45), 0.5, 4), tone(midi(52), 0.4, 6) * 0.5), b["mute"], 0.16); put(sfx, sweep(900, 300, 0.12, 12), b["mute"], 0.10)
# flashback: tape-wobble music box, projector whir, applause swell, appraisal thud
fb0, fb1 = b["fb0"], b["fb1"]
for k, m in enumerate((81, 76, 72, 76, 79, 74, 71, 74, 72, 69)):
    at_ = fb0 + 0.1 + k * 0.3
    if at_ < fb1 - 0.1:
        x = env_x(0.9); f = midi(m) * (1 + 0.006 * np.sin(2 * np.pi * 5 * x)); put(music, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 5), at_, 0.06)
x = env_x(fb1 - fb0); put(amb, smooth(rng.standard_normal(len(x)), 4) * (0.5 + 0.5 * np.sin(2 * np.pi * 24 * x)) * win(fb1 - fb0, 0.2, 0.2), fb0, 0.012)
d = b["fbC"] - b["fbB"]; x = env_x(d + 0.3); clap = np.zeros(len(x))
for k in range(int(d * 22)): s_ = int((k / 22 + rng.random() * 0.04) * SR); c = smooth(noise(0.03, 120), 2); clap[s_:s_ + len(c)] += c[: max(0, len(clap) - s_)]
put(amb, clap * win(d + 0.3, 0.3, 0.3), b["fbB"], 0.10)
put(sfx, add(smooth(noise(0.1, 40), 6), tone(110, 0.2, 18)), b["fbC"] + 0.32, 0.22)
put(music, strings(57, 1.2, 0.05, 0.8), b["fbC"] + 0.3, 0.07); put(music, strings(60, 1.2, 0.05, 0.8), b["fbC"] + 0.3, 0.05)
def whoosh(at_, d=0.35, g=0.25): x = env_x(d); put(sfx, smooth(noise(d, 1), 30) * np.sin(np.pi * x / d), at_, g)
def pop_(at_, g=0.18, f0=400, f1=1100): put(sfx, sweep(f0, f1, 0.12, 14), at_, g)
def tap(at_, g=0.35): put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), at_, g)
def ding(at_, g=0.25, m=88):
    for j, dt in enumerate((0, 0.09)): put(sfx, add(tone(midi(m + 4 * j), 0.9, 5), 0.3 * tone(midi(m + 4 * j) * 2.01, 0.5, 9)), at_ + dt, g * (1 - 0.25 * j))
def stamp(at_, g=0.25): put(sfx, add(smooth(noise(0.12, 30), 4), tone(140, 0.15, 25)), at_, g)
def tick(at_, g=0.18, hi=True): put(sfx, add(smooth(noise(0.02, 220), 3) * 0.7, tone(3200 if hi else 2400, 0.02, 160)), at_, g)
whoosh(fb0 - 0.05, 0.3, 0.14); whoosh(fb1 - 0.15, 0.3, 0.12)
pop_(b["titleIn"], 0.16); pop_(b["tOffer"], 0.10, 600, 1300)
# 'revenge': a dark pulse + the button pop; the hold tag stamps on
for k in range(3): put(sfx, tone(midi(38), 0.35, 6), b["tRev"] + k * 0.33, 0.14 - k * 0.03)
pop_(b["tRev"], 0.12, 300, 700); stamp(b["tHold"])
# Ananya: a soft heartbeat under 'dialysis'
for k in range(2):
    for j, dt in enumerate((0, 0.16)): put(sfx, tone(55, 0.18, 14), b["tAmma"] + k * 0.75 + dt, 0.18 - 0.06 * j)
pop_(b["tAmma"], 0.10, 500, 1000)
# follow
pop_(b["fol0"] + 0.05, 0.15); tap(b["tFol"], 0.35); put(sfx, tone(midi(84), 0.2, 12), b["clk41"] + 0.05, 0.06)
# A/B: split, taps on A and B, the comment pill, countdown (pad + ticks), comment pops
whoosh(b["ab0"] - 0.05, 0.3, 0.2); tap(b["tA"] + 0.05, 0.3); tap(b["tB"] + 0.05, 0.3); pop_(b["tCm"], 0.14)
CD0, CD1 = b["CD0"], b["CD1"]
for m, g in ((45, 0.08), (52, 0.06), (57, 0.04), (60, 0.03)): put(music, strings(m, CD1 - CD0 + 0.2, 0.3, 0.3), b["ab0"], g * 0.6)
for m, g in ((45, 0.08), (52, 0.06), (57, 0.04), (60, 0.03)): put(music, strings(m, CD1 - CD0 + 0.2, 0.3, 0.3), CD0, g)
for k in range(int(round((CD1 - CD0) * 2))): tick(CD0 + k * 0.5, 0.34 if k % 2 == 0 else 0.22, k % 2 == 0)
for t0 in b["cb"]: pop_(t0, 0.12, 700, 1500)
x = env_x(0.5); put(sfx, smooth(rng.standard_normal(len(x)), 3) * np.exp(-x * 5) * (0.6 + 0.4 * np.sin(2 * np.pi * 60 * x)), CD1 - 0.2, 0.08)   # the offer card tearing
# reveal: paper slide-apart + warm swell; the cards; the call ends
whoosh(b["rev"], 0.45, 0.2)
for m, g in ((69, 0.06), (72, 0.05), (76, 0.05), (81, 0.03)): put(music, strings(m, b["wipe0"] - b["rev"] + 0.2, 0.2, 0.6), b["rev"], g)
office(b["rev"] + 0.4, b["wipe0"], 0.5, seed=5)
put(sfx, sweep(500, 900, 0.1, 10), b["rev"] + 0.25, 0.10)          # unmute
ding(b["tDel"], 0.14, 88); pop_(b["tBias"], 0.12, 400, 900)
for j, m in enumerate((76, 72)): put(sfx, tone(midi(m), 0.18, 12), b["callEnd"] + j * 0.13, 0.12)   # call ended
# clock wipe: whoosh + fast ticks
whoosh(b["wipe0"], 0.4, 0.2)
for k in range(8): tick(b["wipe0"] + k * 0.07, 0.10, k % 2 == 0)
# chai stall: street + warm plucks; music drops to ONE soft note under 'Chai చల్లారిపోతుంది… తాగు'
street(b["stall"], b["loop0"])
k = 0
while b["stall"] + k * 0.6 < b["tSlide"] - 0.3:
    put(music, pluck([57, 64, 60, 67][k % 4], 0.8), b["stall"] + k * 0.6, 0.05); k += 1
put(music, strings(45, b["tSlide"] - b["stall"], 0.4, 0.4), b["stall"], 0.05)
put(music, strings(64, b["tTake"] - b["tSlide"] + 1.2, 0.5, 0.9), b["tSlide"] - 0.1, 0.07)          # the one note
put(sfx, add(smooth(noise(0.35, 6), 8) * 0.6, tone(300, 0.3, 10) * 0.2), b["tSlide"], 0.10)            # glass sliding on the wood
put(sfx, add(tone(midi(96), 0.4, 12), tone(midi(103), 0.3, 14) * 0.5), b["tSlide1"] + 0.05, 0.05)      # glass clink
# A/B/C tiles, comment pops, share, end card
for m, g in ((57, 0.05), (64, 0.04), (69, 0.03)): put(music, strings(m, b["loop0"] - b["abc0"], 0.4, 0.3), b["abc0"], g)
k = 0
while b["abc0"] + k * 0.33 < b["loop0"] - 0.1:
    put(music, pluck([69, 72, 76, 74][k % 4], 0.5), b["abc0"] + k * 0.33, 0.045); k += 1
pop_(b["abc0"], 0.14); pop_(b["abc0"] + 0.1, 0.12, 500, 1000); pop_(b["abc0"] + 0.28, 0.12, 550, 1100); ding(b["tC"] + 0.05, 0.16, 91)
for i in range(3): pop_(b["tCm2"] + 0.05 + i * 0.22, 0.10, 700, 1400)
whoosh(b["sh0"], 0.35, 0.16)
for i in range(3): pop_(b["tAt"] + 0.1 + i * 0.08, 0.09, 700, 1400)
tap(b["tTag"], 0.3); ding(b["tTag"] + 0.12, 0.10, 93)
pop_(b["end0"], 0.14); tap(b["tEF"], 0.32)
# hard cut to frame 1: everything stops on the cut; the office bed restarts exactly as at t=0
cut = (tt >= b["loop0"]).astype(float)
music *= 1 - cut; amb *= 1 - cut; sfx *= 1 - cut
m_s, a_s = music, amb; music, amb = np.zeros(n), np.zeros(n)
office(b["loop0"], DUR); m2, a2 = music, amb; music, amb = m_s + m2 * cut, a_s + a2 * cut

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, (DUR - tt) / 0.03)
mix = (music * duck * 0.9 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + amb * (1 - 0.4 * np.clip(act * 3, 0, 1)) + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
