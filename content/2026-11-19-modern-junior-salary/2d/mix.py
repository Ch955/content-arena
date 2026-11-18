"""Modern dilemma #2 'the junior's salary' soundtrack, all synthesized here (original; no film music, no real song): a
bright cafeteria bed for the Tower B lunch hall (crowd murmur, cutlery clinks, a light D-major marimba groove), a tray
clatter, a 'ka-ching' on eighteen lakhs, a record scratch into the FREEZE frame (the bed stops; a held drone + soft ticks;
a low sting on fourteen), a stamp for the hold tag and MATCHED, a notification blip for the HR mail, the fitness band
buzz, a whoosh as Kiran runs off, two table knocks (Ananya), a sad slide-whistle as the samosa droops, clock ticks,
UI pops/taps (follow, A/B taps, comments, tiles, tag, end card), a held pad + ticks for the 5-s countdown, a whoosh + warm
swell for the reveal, a crunch on the bite, the fist bump, a calendar whoosh + ding, a calm office bed in Hema's cabin
(felt piano), paper card slaps, a card flip, a scribble on the sticky note, the laptop turn, a sepia flashback (paper rip,
tape-wobble music box), ONE warm note under Kiran's flashback line and the look out through the glass, and at the loop
cut the cafeteria bed restarts exactly as at t=0. Reads timeline.json + beats.json (node render.js --beats); voices on
top with ducking -> mix.wav."""
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

def marimba(m, d=0.6):
    x = env_x(d); f = midi(m)
    return (np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * 4 * f * x) * np.exp(-x * 30)) * np.exp(-x * 9) * np.minimum(1, x / 0.002)
def cafe(t0, t1, g=1.0, seed=3, groove=True):
    """crowd murmur + cutlery clinks + a light marimba groove (D major, 104 bpm)."""
    r = np.random.default_rng(seed); d = t1 - t0
    if d <= 0: return
    x = env_x(d)
    mur = smooth(r.standard_normal(len(x)), 40) - smooth(r.standard_normal(len(x)), 400)
    mur *= 0.7 + 0.3 * np.sin(2 * np.pi * 0.37 * x) * np.sin(2 * np.pi * 0.13 * x + 1)
    put(amb, mur * win(d, 0.02, 0.1) * 3, t0, 0.05 * g)
    k = 0
    while k < d * 2.2:
        at_ = t0 + k / 2.2 + r.random() * 0.3
        if r.random() < 0.6 and at_ < t1 - 0.05: put(amb, add(tone(2600 + r.random() * 1800, 0.08, 40), tone(4100 + r.random() * 900, 0.05, 60) * 0.5), at_, 0.02 * g)
        k += 1
    if not groove: return
    beat = 60 / 104; k = 0; prog = [[62, 66, 69], [59, 62, 66], [55, 59, 62], [57, 61, 64]]
    while t0 + k * beat / 2 < t1 - 0.05:
        at_ = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if k % 8 == 0: put(music, strings(ch[0] - 12, min(beat * 4 + 0.2, t1 - at_), 0.2, 0.3), at_, 0.03 * g)
        pat = [0, 2, 1, 2, 0, 1, 2, 1][k % 8]
        put(music, marimba(ch[pat] + 12, 0.5), at_, 0.06 * g)
        if k % 4 == 0: put(music, pluck(ch[0] - 24, 0.4), at_, 0.09 * g)
        if k % 2 == 1: put(music, smooth(noise(0.04, 90), 2), at_, 0.02 * g)   # shaker
        k += 1
def whoosh(at_, d=0.35, g=0.25): x = env_x(d); put(sfx, smooth(noise(d, 1), 30) * np.sin(np.pi * x / d), at_, g)
def pop_(at_, g=0.18, f0=400, f1=1100): put(sfx, sweep(f0, f1, 0.12, 14), at_, g)
def tap(at_, g=0.35): put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), at_, g)
def ding(at_, g=0.25, m=88):
    for j, dt in enumerate((0, 0.09)): put(sfx, add(tone(midi(m + 4 * j), 0.9, 5), 0.3 * tone(midi(m + 4 * j) * 2.01, 0.5, 9)), at_ + dt, g * (1 - 0.25 * j))
def stamp(at_, g=0.25): put(sfx, add(smooth(noise(0.12, 30), 4), tone(140, 0.15, 25)), at_, g)
def tick(at_, g=0.18, hi=True): put(sfx, add(smooth(noise(0.02, 220), 3) * 0.7, tone(3200 if hi else 2400, 0.02, 160)), at_, g)
def slap(at_, g=0.3): put(sfx, add(smooth(noise(0.08, 45), 3), tone(220, 0.06, 40) * 0.4), at_, g)
def knock(at_, g=0.35): put(sfx, add(tone(120, 0.12, 30), smooth(noise(0.03, 120), 6) * 0.6), at_, g)
def blip(at_, g=0.14): put(sfx, tone(midi(83), 0.12, 20), at_, g); put(sfx, tone(midi(90), 0.18, 16), at_ + 0.09, g)

b_ = b
cafe(0, b_["fz0"])
# frame 1: tray lands, the title, ka-ching on eighteen, the punch-in on runbook
put(sfx, add(smooth(noise(0.15, 25), 3), tone(700, 0.2, 20) * 0.3, tone(1150, 0.15, 25) * 0.2), 0.22, 0.22)
pop_(b_["titleIn"], 0.16)
ding(b_["t18"] + 0.05, 0.16, 93); put(sfx, smooth(noise(0.25, 14), 2), b_["t18"] + 0.05, 0.05)
whoosh(b_["tRun"] - 0.05, 0.25, 0.10)
# FREEZE: record scratch, the bed stops; a held drone + soft ticks; a sting on fourteen; the hold stamp
x = env_x(0.32); put(sfx, np.sin(2 * np.pi * np.cumsum(900 * np.exp(-x * 8) + 120) / SR) * np.exp(-x * 4) * 0.6 + smooth(noise(0.32, 6), 3) * 0.5, b_["fz0"], 0.22)
put(music, strings(50, b_["fz1"] - b_["fz0"], 0.4, 0.3), b_["fz0"] + 0.1, 0.05); put(music, strings(57, b_["fz1"] - b_["fz0"], 0.6, 0.3), b_["fz0"] + 0.1, 0.03)
for k in range(int((b_["fz1"] - b_["fz0"]) * 2)): tick(b_["fz0"] + 0.4 + k * 0.5, 0.06, k % 2 == 0)
pop_(b_["t6"] + 0.05, 0.10, 500, 900)
put(sfx, add(tone(midi(38), 0.7, 4), tone(midi(45), 0.6, 5) * 0.5), b_["t14"], 0.20)
stamp(b_["tHold"])
# un-freeze: the bed restarts; offer pop, MATCHED stamp, the HR mail blip, the band buzz, Kiran runs off
cafe(b_["fz1"], b_["ab0"], 0.9, seed=4)
pop_(b_["k0"] + 0.05, 0.12, 500, 1100); stamp(b_["tMatch"], 0.22); blip(b_["tMail"] + 0.05)
for k in range(2):
    x = env_x(0.28); put(sfx, np.sin(2 * np.pi * 175 * x) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 30 * x))) * win(0.28, 0.01, 0.03), b_["buzz"] + k * 0.36, 0.12)
whoosh(b_["up"] + 0.25, 0.4, 0.18); pop_(b_["up"] + 0.15, 0.10, 600, 1300)
for k in range(4): put(sfx, add(tone(90, 0.08, 40), smooth(noise(0.03, 100), 4) * 0.4), b_["up"] + 0.3 + k * 0.18, 0.08 * (1 - k * 0.2))   # footsteps
# Ananya: two table knocks; the door sign shimmer
knock(b_["tImp"]); knock(b_["tImp"] + 0.24)
for j, m in enumerate((88, 93, 97)): put(sfx, tone(midi(m), 0.4, 8), b_["tCab"] - 0.2 + j * 0.06, 0.04)
# Nikhil: the samosa droops (a sad slide), clock ticks
x = env_x(1.3); f = 520 * np.exp(-x * 0.7) * (1 + 0.03 * np.sin(2 * np.pi * 6 * x)); put(sfx, np.sin(2 * np.pi * np.cumsum(f) / SR) * win(1.3, 0.05, 0.3), b_["nk0"] + 0.6, 0.05)
tick(b_["clk15"], 0.12); tick(b_["clk16"], 0.12)
# follow
pop_(b_["fol0"] + 0.05, 0.15); tap(b_["tFol"], 0.35)
# A/B: split, taps on A and B, the angry bubble / invites, countdown (pad + ticks), comment pops
whoosh(b_["ab0"] - 0.05, 0.3, 0.2); tap(b_["tA"] + 0.05, 0.3); tap(b_["tB"] + 0.05, 0.3); pop_(b_["tA"] + 0.1, 0.10, 300, 700); pop_(b_["tB"] + 0.1, 0.10, 600, 1200); pop_(b_["tCm"], 0.14)
CD0, CD1 = b_["CD0"], b_["CD1"]
for m, g in ((50, 0.08), (57, 0.06), (62, 0.04), (66, 0.03)): put(music, strings(m, CD1 - b_["ab0"] + 0.2, 0.3, 0.3), b_["ab0"], g * 0.6)
for m, g in ((50, 0.06), (57, 0.04)): put(music, strings(m, CD1 - CD0 + 0.2, 0.3, 0.3), CD0, g)
for k in range(int(round((CD1 - CD0) * 2))): tick(CD0 + k * 0.5, 0.34 if k % 2 == 0 else 0.22, k % 2 == 0)
for t0 in b_["cb"]: pop_(t0, 0.12, 700, 1500)
# reveal: whoosh + warm swell, the cafeteria again; the bite (bubble pop + crunch), the fist bump
whoosh(b_["rev"], 0.45, 0.2)
for m, g in ((62, 0.06), (66, 0.05), (69, 0.05), (74, 0.03)): put(music, strings(m, b_["wipe0"] - b_["rev"] + 0.2, 0.2, 0.6), b_["rev"], g)
cafe(b_["rev"] + 0.3, b_["wipe0"], 0.6, seed=5, groove=False)
pop_(b_["tBite"] - 0.05, 0.12, 900, 1600); put(sfx, smooth(noise(0.12, 25), 2), b_["tBite"] + 0.05, 0.10)
put(sfx, add(tone(140, 0.15, 22), smooth(noise(0.05, 60), 4)), b_["tCon"], 0.28); pop_(b_["tCon"] + 0.03, 0.10, 500, 1000)
# calendar wipe: whoosh + ding
whoosh(b_["wipe0"], 0.4, 0.2); ding(b_["wipe0"] + 0.25, 0.12, 86)
# Hema's cabin: a calm office bed; card slaps, the flip + slide, the ask, the sticky scribble, the laptop turn
office(b_["cab"], b_["fb0"], 0.7, seed=6)
for k_ in ("tK1", "tK2", "tK3"): slap(b_[k_])
slap(b_["kk0"], 0.18); put(sfx, add(smooth(noise(0.06, 50), 3), tone(600, 0.05, 50) * 0.3), b_["tCmp"], 0.2); put(sfx, smooth(noise(0.35, 8), 10) * 0.6, b_["tCmp"] + 0.15, 0.08)
slap(b_["tMkt"], 0.28)
for k in range(6): put(sfx, smooth(noise(0.05, 60), 2), b_["tDec"] + k * 0.06, 0.05)
slap(b_["tDec"] + 0.35, 0.16)
whoosh(b_["tAsk"], 0.4, 0.14); pop_(b_["tAsk"] + 0.4, 0.12, 400, 900)
for m, g in ((69, 0.04), (72, 0.04), (76, 0.03)): put(music, strings(m, 1.4, 0.2, 0.6), b_["tAsk"] + 0.4, g)
# flashback (sepia): paper rip, tape-wobble music box, the tap on the runbook, the mail blip
fb0, fb1 = b_["fb0"], b_["fb1"]
x = env_x(0.3); put(sfx, smooth(rng.standard_normal(len(x)), 3) * np.exp(-x * 6) * (0.6 + 0.4 * np.sin(2 * np.pi * 70 * x)), fb0 - 0.05, 0.12)
for k, m in enumerate((81, 76, 72, 76, 79, 74, 71, 74, 72)):
    at_ = fb0 + 0.1 + k * 0.32
    if at_ < fb1 - 0.1:
        x = env_x(0.9); f = midi(m) * (1 + 0.006 * np.sin(2 * np.pi * 5 * x)); put(music, np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * 5), at_, 0.05)
tap(b_["tRb"] + 0.15, 0.18); blip(b_["mf"], 0.12)
# ONE warm note from Kiran's 'ముందు' through the look out at him through the glass
put(music, strings(64, b_["abc0"] - b_["tPt"] + 0.6, 0.5, 0.9), b_["tPt"], 0.08)
cafe(fb1, b_["abc0"], 0.35, seed=7, groove=False)
whoosh(fb1 - 0.05, 0.3, 0.1)
# A/B/C tiles, comment pops, share, end card
for m, g in ((62, 0.05), (69, 0.04), (74, 0.03)): put(music, strings(m, b_["loop0"] - b_["abc0"], 0.4, 0.3), b_["abc0"], g)
k = 0
while b_["abc0"] + k * 0.29 < b_["loop0"] - 0.1:
    put(music, marimba([74, 78, 81, 78][k % 4], 0.5), b_["abc0"] + k * 0.29, 0.04); k += 1
pop_(b_["abc0"], 0.14); pop_(b_["abc0"] + 0.15, 0.12, 500, 1000); pop_(b_["abc0"] + 0.35, 0.12, 550, 1100); ding(b_["tAB"] + 0.05, 0.16, 91)
for i in range(3): pop_(b_["tCm2"] + 0.1 + i * 0.22, 0.10, 700, 1400)
whoosh(b_["sh0"], 0.35, 0.16)
for i in range(3): pop_(b_["tAt"] + 0.1 + i * 0.08, 0.09, 700, 1400)
tap(b_["tTag"], 0.3); ding(b_["tTag"] + 0.12, 0.10, 93)
pop_(b_["end0"], 0.14); tap(b_["tEF"], 0.32)
# the bed drops under Ananya's whisper and Nikhil's inner voice (L3-L4), back up for the follow line
x0, x1 = b_["an0"] - 0.25, b_["fol0"]
dip = 1 - 0.55 * np.clip(np.minimum((tt - x0) / 0.25, (x1 - tt) / 0.25), 0, 1)
music *= dip; amb *= 1 - 0.45 * (1 - dip) / 0.55
# hard cut to frame 1: everything stops on the cut; the cafeteria bed restarts exactly as at t=0
cut = (tt >= b_["loop0"]).astype(float)
music *= 1 - cut; amb *= 1 - cut; sfx *= 1 - cut
m_s, a_s = music, amb; music, amb = np.zeros(n), np.zeros(n)
cafe(b_["loop0"], DUR); m2, a2 = music, amb; music, amb = m_s + m2 * cut, a_s + a2 * cut

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
