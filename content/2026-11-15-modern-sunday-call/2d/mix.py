"""Modern dilemma #1 'the 10-minute Sunday call' soundtrack, all synthesized here (original, no film music, no real
ringtone): a warm family-lunch bed (soft piano + plucks + strings, F major) under the home scenes, relatives' claps,
phone vibration buzz (opening, ringing under L2-L7, frozen for the follow tap, again for the loop), a cold detuned synth
sting + office hum + alarm blips on the office side, a glass crack on the '10 mins' chip, plate scrape, car-boot pop
(thunk + spring) and the boot closing, chat pops, the follow tap, a ticking clock for the 5-s countdown + comment pops,
a whoosh as the split snaps shut, mouse click + ding on step 4, a bright ding when the chip snaps back to '10 mins',
a soft comic button (pizzicato two-note) at the payoff (no laugh track), a single warm note under Nanna's take,
share whoosh, end tap. Reads timeline.json + beats.json (node render.js --beats); voices on top with ducking -> mix.wav."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); b = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
rng = np.random.default_rng(15)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n: dst[s:e] += sig[: e - s] * gain
def env_x(d): return np.arange(int(d * SR)) / SR
def piano(m, d=2.5, vel=1.0):
    x = env_x(d); f = midi(m); o = np.zeros_like(x)
    for k in range(1, 7):
        o += np.sin(2 * np.pi * f * k * (1 + 0.0004 * k * k) * x) / k ** 1.4 * np.exp(-x * (1.6 + 0.9 * k))
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

music = np.zeros(n); sfx = np.zeros(n); amb = np.zeros(n)
F_, C_, DM, BB, G_ = [53, 57, 60], [48, 52, 55], [50, 53, 57], [46, 50, 53], [55, 59, 62]
office = [(b["off0"], b["off1"]), (b["off2"], b["off3"])]
def bed(t0, t1, prog, g=1.0, bpm=96):
    beat = 60 / bpm; k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at_ = t0 + k * beat / 2; ch = prog[(k // 8) % len(prog)]
        if any(a <= at_ < c for a, c in office): k += 1; continue
        if k % 8 == 0:
            put(music, piano(ch[0] - 12, 2.6, 0.9), at_, 0.20 * g)
            put(music, strings(ch[0], min(beat * 4 + 0.3, t1 - at_), 0.5, 0.5), at_, 0.05 * g)
        put(music, pluck(ch[k % 3] + 12 + (12 if k % 4 == 3 else 0), 0.45), at_, 0.07 * g)
        if k % 4 == 2: put(music, piano(ch[1] + 12, 1.0, 0.6), at_, 0.06 * g)
        k += 1
# 1) warm family bed: open -> follow freeze; after the reveal -> the end (thinner under the dilemma lines)
bed(0.0, b["fz0"], [F_, C_, DM, BB], 1.0)
bed(b["rev"], b["tChuck"], [F_, C_], 0.6)
put(music, piano(65, 5.0, 0.8), b["tChuck"] + 0.05, 0.18); put(music, strings(53, E(10) - b["tChuck"] + 0.5, 1.0, 0.6), b["tChuck"], 0.06)   # a single warm note under the take
bed(b["sh0"], b["loop0"], [F_, G_, DM, BB], 0.9, 104)
# 2) cold office: detuned saw sting + low drone + hum (both office cuts)
def saw(f, d):
    x = env_x(d); return 2 * ((f * x) % 1) - 1
for a, c in office:
    d = c - a; x = env_x(d); w = np.minimum(1, np.minimum(x / 0.02, (d - x) / 0.1))
    sting = smooth(sum(saw(midi(m) * (1 + det), d) for m in (38, 45, 50, 53) for det in (-0.004, 0.004)), 12) * np.exp(-x * 1.2)
    put(music, sting * w, a, 0.05 if a == b["off2"] else 0.08)
    put(amb, (np.sin(2 * np.pi * 60 * x) * 0.3 + smooth(rng.standard_normal(len(x)), 40) * 1.5) * w, a, 0.05)
    for k in range(int(d / 0.5)): put(sfx, tone(1650, 0.08, 30), a + 0.2 + k * 0.5, 0.05 if a + k * 0.5 < b["tRes"] else 0)   # alarm blips
put(music, add(piano(77, 1.2), piano(81, 1.2)), b["tRes"], 0.12)   # RESOLVED
# 3) countdown: held tension + ticking clock
CD0, CD1 = b["CD0"], b["CD1"]
for m, g in ((41, 0.10), (53, 0.07), (60, 0.04)): put(music, strings(m, CD1 - CD0 + 0.3, 0.3, 0.4), CD0, g)
def tick(at_, g=0.18, hi=True): put(sfx, add(smooth(noise(0.02, 220), 3) * 0.7, tone(3200 if hi else 2400, 0.02, 160)), at_, g)
for k in range(int(round((CD1 - CD0) * 2))): tick(CD0 + k * 0.5, 0.34 if k % 2 == 0 else 0.22, k % 2 == 0)
# A/B question: a light pulse from the split to the countdown
for k in range(int((CD0 - b["ab0"]) / 0.3125)): put(music, tone(midi(41 + (0 if k % 4 else 12)), 0.25, 10), b["ab0"] + k * 0.3125, 0.12)

# ---------- sfx ----------
def buzz(at_, d=0.45, g=0.16):
    x = env_x(d); s_ = np.sign(np.sin(2 * np.pi * 160 * x)) * (0.6 + 0.4 * np.sin(2 * np.pi * 25 * x)); put(sfx, smooth(s_, 6) * np.minimum(1, np.minimum(x / 0.01, (d - x) / 0.02)), at_, g)
def ring(t0, t1, g):
    k = 0
    while t0 + k * 0.75 < t1 - 0.2: buzz(t0 + k * 0.75, 0.45, g); k += 1
ring(0.0, b["off0"], 0.20)
ring(b["off1"], b["fz0"], 0.07)          # still ringing under the family lines
ring(b["loop0"] - 0.02, DUR, 0.22)
def pop_(at_, g=0.18, f0=400, f1=1100): put(sfx, sweep(f0, f1, 0.12, 14), at_, g)
def whoosh(at_, d=0.4, g=0.3): x = env_x(d); put(sfx, smooth(noise(d, 1), 30) * np.sin(np.pi * x / d), at_, g)
def tap(at_, g=0.35): put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), at_, g)
def ding(at_, g=0.25, m=88):
    for j, dt in enumerate((0, 0.09)): put(sfx, add(tone(midi(m + 4 * j), 0.9, 5), 0.3 * tone(midi(m + 4 * j) * 2.01, 0.5, 9)), at_ + dt, g * (1 - 0.25 * j))
def clap(at_, g=0.18): put(sfx, smooth(noise(0.06, 70), 2) * (1 + 0.5 * np.sin(2 * np.pi * 1200 * env_x(0.06))), at_, g)
for k in range(8): clap(0.05 + k * 0.14 + 0.03 * rng.random(), 0.14)                 # relatives clapping, frozen by the buzz
for k in range(10): clap(b["tCut"] + 0.15 + k * 0.13 + 0.03 * rng.random(), 0.12)     # ...and again when the cake is cut
pop_(b["titleIn"], 0.2)
whoosh(b["off0"] - 0.08, 0.25, 0.22); whoosh(b["off1"] - 0.08, 0.25, 0.2); whoosh(b["off2"] - 0.08, 0.25, 0.2); whoosh(b["off3"] - 0.08, 0.3, 0.2)
pop_(b["tChip"], 0.16, 500, 1200)
# glass crack on the chip
for j in range(5): put(sfx, add(smooth(noise(0.05, 90), 2), tone(2600 + 900 * rng.random(), 0.04, 60)), b["tCrack"] + j * 0.035, 0.22)
put(sfx, tone(110, 0.25, 14), b["t2h"], 0.18); pop_(b["t2h"], 0.12, 900, 300)
for k in range(10): tick(b["tCrack"] + 0.05 + k * 0.08, 0.08)                         # wall clock spinning
put(sfx, tone(midi(84), 0.25, 14), b["tWink"], 0.10); put(sfx, tone(midi(88), 0.25, 14), b["tWink"] + 0.07, 0.10)
put(sfx, add(smooth(noise(0.12, 30), 4), tone(140, 0.15, 25)), b["tHold"], 0.25)       # tag stamp
x = env_x(0.5); put(sfx, smooth(rng.standard_normal(len(x)), 3) * np.sin(np.pi * x / 0.5) * 0.4, b["tPlate"] + 0.05, 0.12)   # steel plate slides
pop_(b["tCal"], 0.15, 500, 1000)
# car boot: pop + spring, then the lid closing
put(sfx, add(smooth(noise(0.08, 40), 6) * 1.2, tone(80, 0.25, 12), tone(160, 0.12, 25)), b["tBoot"], 0.45)
x = env_x(0.5); put(sfx, np.sin(2 * np.pi * np.cumsum(330 + 120 * np.sin(2 * np.pi * 14 * x) * np.exp(-x * 5)) / SR) * np.exp(-x * 6), b["tBoot"] + 0.04, 0.10)
put(sfx, add(tone(midi(84), 1.0, 3), tone(midi(91), 1.0, 3) * 0.6), b["tHalo"], 0.07)  # halo shimmer
put(sfx, add(smooth(noise(0.1, 30), 6), tone(70, 0.3, 10)), b["boot0"] + 0.38, 0.4)
# chat pops + wince
pop_(b["chat0"], 0.15); [pop_(b[k], 0.14, 700, 1500) for k in ("tM1", "tM2", "tM3")]
# follow (time freeze + tap)
x = env_x(0.5); put(sfx, smooth(noise(0.5, 0), 20) * (1 - x / 0.5) ** 2, b["fz0"], 0.22); put(sfx, tone(midi(83), 1.2, 3), b["fz0"], 0.06)
tap(b["tFol"], 0.35)
pop_(b["ab0"], 0.15); pop_(b["tA"] - 0.1, 0.18, 500, 1200); pop_(b["tB"] - 0.1, 0.18, 400, 1000); pop_(b["t2hA"], 0.12, 900, 300)
for t0 in b["cb"]: pop_(t0, 0.12, 700, 1500)
whoosh(b["rev"] - 0.05, 0.35, 0.3); put(sfx, add(smooth(noise(0.06, 50), 4), tone(120, 0.12, 25)), b["rev"] + 0.2, 0.3)   # the split snaps shut
put(sfx, tone(midi(93), 0.2, 20), b["fl0"], 0.10)                                       # flash of the runbook message
pop_(b["kir0"], 0.14); put(sfx, add(smooth(noise(0.015, 300), 2), tone(2500, 0.015, 200)), b["tStep"], 0.35); ding(b["tStep"] + 0.1, 0.12, 84)
# payoff: the chip snaps back to "10 mins ✅" + a soft comic button (pizzicato, no laugh track)
ding(b["tTen"] - 0.05, 0.22, 91)
put(sfx, pluck(67, 0.3), E(9) - 0.05, 0.25); put(sfx, pluck(72, 0.5), E(9) + 0.12, 0.28)
put(sfx, add(smooth(noise(0.06, 60), 3), tone(300, 0.1, 30)), b["tCut"], 0.2)          # knife into the cake
whoosh(b["sh0"], 0.35, 0.18); whoosh(b["tShare"] - 0.1, 0.35, 0.2); pop_(b["tShare"] + 0.25, 0.14, 800, 1600)
pop_(b["tTL2"], 0.12, 500, 900); x = env_x(0.18); put(sfx, smooth(noise(0.18, 8), 4), b["tX"], 0.25); put(sfx, tone(150, 0.2, 12), b["tX"], 0.2)   # red cross
pop_(b["end0"], 0.14); tap(b["tEF"], 0.32)
music *= np.where(tt >= b["loop0"], np.clip(1 - (tt - b["loop0"]) / 0.15, 0, 1), 1)
music *= np.where((tt > b["fz0"]) & (tt < b["ab0"]), 0.35, 1)
sfx += amb

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.02, (DUR - tt) / 0.05))
mix = (music * duck * 0.9 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
