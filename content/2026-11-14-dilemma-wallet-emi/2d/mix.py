"""Moral dilemma #1 'the wallet and the EMI' soundtrack, all synthesized here (original, no film music, no real
announcement voice): metro platform ambience + a three-note station chime + a train pulling out, a tense low pulse
under the dilemma, cash-counter clicks, SMS ping/buzz, voice-note blip, paper whooshes for the memory, map pops +
SAME DATE stamp, a time-freeze swell for the follow tap, a ticking clock + heartbeat for the 5-s countdown, comment
pops, bus rumble, notification ping + missed-call buzz, three door knocks + a creak, a soft emotional piano from the
door to the take, share whoosh, end tap and a tape-rewind for the loop.
Reads timeline.json + beats.json (node render.js --beats); voices on top with ducking -> mix.wav."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); b = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
rng = np.random.default_rng(13)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR)
    if s < 0: sig = sig[-s:]; s = 0
    e = min(n, s + len(sig))
    if s < n: dst[s:e] += sig[: e - s] * gain
def env_x(d): return np.arange(int(d * SR)) / SR
def piano(m, d=2.5, vel=1.0):
    x = env_x(d); f = midi(m); out = np.zeros_like(x)
    for k in range(1, 7):
        fk = f * k * (1 + 0.0004 * k * k)
        out += np.sin(2 * np.pi * fk * x) / k ** 1.4 * np.exp(-x * (1.6 + 0.9 * k))
    out *= np.minimum(1, x / 0.004) * vel
    return out
def strings(m, d, att=0.6, rel=0.8):
    x = env_x(d); f = midi(m); out = np.zeros_like(x)
    for det in (-0.003, 0, 0.0035):
        for k in range(1, 6):
            out += np.sin(2 * np.pi * f * (1 + det) * k * x + k * det * 50) / k ** 1.6
    vib = 1 + 0.004 * np.sin(2 * np.pi * 5.2 * x)
    return out * np.minimum(1, x / att) * np.minimum(1, np.maximum(0, (d - x) / rel)) * vib / 4
def mallet(m, d=0.35):
    x = env_x(d); f = midi(m)
    return (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 9) * np.minimum(1, x / 0.003)
def tone(f, d, decay=8):
    x = env_x(d); return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def noise(d, decay): x = env_x(d); return rng.standard_normal(len(x)) * np.exp(-x * decay)
def sweep(f0, f1, d, decay=4):
    x = env_x(d); f = f0 + (f1 - f0) * x / d
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / 0.01)
def add(*sigs):  # sum signals of different lengths
    o = np.zeros(max(len(x) for x in sigs))
    for x in sigs: o[:len(x)] += x
    return o
def smooth(sig, k=8):  # cheap low-pass (moving average)
    return np.convolve(sig, np.ones(k) / k, mode="same")


music = np.zeros(n); sfx = np.zeros(n); amb = np.zeros(n)
DM, BB, F_, C_, G_, AM = [50, 53, 57], [46, 50, 53], [53, 57, 60], [48, 52, 55], [55, 59, 62], [57, 60, 64]
def lowpass(sig, k): return smooth(sig, k)
# 1) tense low pulse (D minor, 92 bpm) from the open to the countdown; it thins out under the memory
beat = 60 / 92
def pulse(t0, t1, prog, g=1.0):
    k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at_ = t0 + k * beat / 2; ch = prog[(k // 8) % len(prog)]
        gg = g * (0.45 if b["mem0"] <= at_ < b["mem1"] else 1.0)
        put(music, piano(ch[0] - 24, 0.5, 1.0), at_, (0.30 if k % 2 == 0 else 0.18) * gg)
        if k % 8 == 0:
            put(music, strings(ch[0] - 12, min(beat * 4 + 0.3, t1 - at_), 0.4, 0.5), at_, 0.08 * gg)
            put(music, strings(ch[2], min(beat * 4 + 0.3, t1 - at_), 0.4, 0.5), at_, 0.05 * gg)
        if k % 4 == 2: put(music, piano(ch[1] + 12, 0.9, 0.6), at_, 0.06 * gg)
        k += 1
pulse(0.0, b["CD0"], [DM, BB, F_, C_])
# 2) countdown: held strings + heartbeat; loud tick-tock
CD0, CD1 = b["CD0"], b["CD1"]
for m, g in ((38, 0.12), (50, 0.08), (57, 0.05)): put(music, strings(m, CD1 - CD0 + 0.3, 0.3, 0.4), CD0, g)
for k in range(int(round(CD1 - CD0))):
    for j, dt in enumerate((0, 0.17)): put(music, tone(52, 0.2, 16), CD0 + k + 0.35 + dt, 0.45 - 0.15 * j)
def tick(at_, g=0.18, hi=True): put(sfx, add(smooth(noise(0.02, 220), 3) * 0.7, tone(3200 if hi else 2400, 0.02, 160)), at_, g)
for k in range(int(round((CD1 - CD0) * 2))): tick(CD0 + k * 0.5, 0.32 if k % 2 == 0 else 0.2, k % 2 == 0)
# 3) the reveal on the bus: a light driving pulse until the house
pulse(b["rev"], b["house"], [DM, BB], g=0.7)
# 4) the door -> the take: soft emotional piano (F  C  Dm  Bb), then a single soft note under the take
t0 = b["door"] + 0.1; seq = [F_, C_, DM, BB]; seg = (b["take0"] - t0) / 4
for j, ch in enumerate(seq):
    at_ = t0 + j * seg
    put(music, piano(ch[0] - 12, 3.5, 0.9), at_, 0.22)
    for q, m in enumerate(ch): put(music, piano(m + 12, 2.5, 0.7), at_ + 0.25 + q * 0.28, 0.10)
    put(music, strings(ch[0], seg + 0.5, 0.6, 0.6), at_, 0.06)
put(music, piano(62, 5.0, 0.8), b["take0"] + 0.05, 0.16); put(music, strings(50, b["sh0"] - b["take0"] + 0.4, 1.0, 0.6), b["take0"], 0.05)
# 5) share + close: warm piano bed (C G Am F) to the rewind
k = 0; beat2 = 60 / 84
while b["sh0"] + k * beat2 / 2 < b["rw0"] - 0.1:
    at_ = b["sh0"] + k * beat2 / 2; ch = [C_, G_, AM, F_][(k // 8) % 4]
    if k % 8 == 0: put(music, piano(ch[0] - 12, 2.5, 0.9), at_, 0.22)
    put(music, piano(ch[k % 3] + 12, 1.2, 0.8), at_, 0.08); k += 1

# ---------- ambience ----------
def band(d, k1, k2, seed=0):   # crude band-limited noise
    x = rng.standard_normal(int(d * SR)); return smooth(x, k1) - smooth(x, k2)
plat = [(0.0, b["mem0"]), (b["mem1"], b["ab0"])]
hum = np.sin(2 * np.pi * 55 * tt) * 0.25 + np.sin(2 * np.pi * 110 * tt) * 0.1
crowdn = smooth(rng.standard_normal(n), 30) * 1.6
for a0, a1 in plat:
    s0, s1 = int(a0 * SR), int(a1 * SR); w = np.ones(s1 - s0); f = int(0.08 * SR); w[:f] = np.linspace(0, 1, f); w[-f:] = np.linspace(1, 0, f)
    amb[s0:s1] += (hum[s0:s1] * 0.05 + crowdn[s0:s1] * 0.05) * w
# train pulling out (rumble falling away + rail clacks)
x = env_x(3.6); rum = smooth(rng.standard_normal(len(x)), 60) * 3 * np.exp(-x * 0.9)
put(amb, rum, 0.0, 0.18)
for k in range(8): put(sfx, add(smooth(noise(0.04, 90), 3), tone(180, 0.06, 40)), 0.15 + k * (0.42 - 0.03 * k), 0.12 * (1 - k / 9))
# station chime (three soft bell notes, no announcement voice)
for j, m in enumerate((76, 72, 79)): put(sfx, add(tone(midi(m), 1.2, 3.2), 0.3 * tone(midi(m) * 2.0, 0.6, 6)), b["chime"] + j * 0.32, 0.16)
# gate at night: soft crickets under the memory
for k in range(10): put(amb, tone(4300, 0.05, 30) * np.sin(2 * np.pi * 40 * env_x(0.05)), b["mem0"] + 0.05 + k * 0.09, 0.05)
# bus rumble + the house lane (birds)
s0, s1 = int(b["rev"] * SR), int(b["house"] * SR)
amb[s0:s1] += smooth(rng.standard_normal(s1 - s0), 80) * 2.2 * (0.8 + 0.2 * np.sin(2 * np.pi * 3 * tt[s0:s1])) * 0.09
for k, at_ in enumerate((b["house"] + 0.3, b["house"] + 0.5, b["door"] + 1.5, b["door"] + 4.0)): put(amb, sweep(3200, 4200, 0.09, 12), at_, 0.04)

# ---------- sfx ----------
def ping(at_, g=0.3):
    for j, (m, dt) in enumerate(((88, 0), (93, 0.11))): put(sfx, add(tone(midi(m), 0.7, 7), 0.3 * tone(midi(m) * 2.01, 0.4, 12)), at_ + dt, g * (1 - 0.2 * j))
def buzz(at_, d=0.5, g=0.15): x = env_x(d); put(sfx, np.sign(np.sin(2 * np.pi * 150 * x)) * (np.sin(2 * np.pi * 9 * x) > 0) * 0.5, at_, g)
def flip(at_, g=0.35): put(sfx, smooth(noise(0.16, 18), 6) * np.linspace(0.3, 1, int(0.16 * SR)), at_, g)
def pop_(at_, g=0.18, f0=400, f1=1100): put(sfx, sweep(f0, f1, 0.12, 14), at_, g)
def whoosh(at_, d=0.4, g=0.3): x = env_x(d); put(sfx, smooth(noise(d, 1), 30) * np.sin(np.pi * x / d), at_, g)
def stamp(at_, g=0.35): put(sfx, add(smooth(noise(0.12, 30), 4), tone(110, 0.2, 18)), at_, g)
def tap(at_, g=0.35): put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), at_, g)
put(sfx, smooth(noise(0.25, 12), 8), 0.05, 0.2)            # the wallet picked up (leather rustle)
whoosh(b["cu0"] - 0.1, 0.3, 0.2); pop_(b["titleIn"], 0.2)
for i in range(18): put(sfx, add(tone(2100 + (i % 3) * 140, 0.03, 90), smooth(noise(0.015, 300), 2) * 0.6), b["tCash"] + (b["tCash1"] - b["tCash"]) * i / 17, 0.13)   # cash counter
put(sfx, tone(midi(96), 0.5, 8), b["tCash1"], 0.08)
flip(b["tSlip"], 0.35)
ping(b["sms0"], 0.3); buzz(b["sms0"] + 0.05, 0.45, 0.1)
put(sfx, smooth(noise(0.3, 6), 12) * 0.7, b["tMark"], 0.18)   # highlighter
stamp(b["tHold"], 0.3)
for j, m in enumerate((84, 88)): put(sfx, tone(midi(m), 0.25, 14), b["tWink"] + j * 0.07, 0.10)
pop_(b["vn0"], 0.15, 600, 1300); put(sfx, tone(midi(81), 0.12, 20), S(2) - 0.08, 0.12)
pop_(b["tChip"], 0.16, 500, 1200)
whoosh(b["mem0"] - 0.1, 0.4, 0.25); flip(b["mem0"], 0.25); whoosh(b["mem1"] - 0.1, 0.35, 0.2)
pop_(b["map0"] + 0.05, 0.15); pop_(b["map0"] + 0.5, 0.14, 600, 1400); pop_(b["map0"] + 0.6, 0.14, 700, 1500)
pop_(b["tSurg"] - 0.05, 0.14); pop_(b["tDue"] - 0.1, 0.14); stamp(b["tSame"], 0.4)
x = env_x(0.5); put(sfx, smooth(noise(0.5, 0), 20) * (1 - x / 0.5) ** 2, b["fz0"], 0.25); put(sfx, tone(midi(83), 1.2, 3), b["fz0"], 0.06)   # time freeze
tap(b["tFol"], 0.35)
pop_(b["ab0"], 0.15); pop_(b["tA"] - 0.1, 0.18, 500, 1200); pop_(b["tB"] - 0.1, 0.18, 400, 1000)
for t0 in b["cb"]: pop_(t0, 0.12, 700, 1500)
tap(b["tapA"], 0.35); whoosh(b["rev"], 0.45, 0.3)
ping(b["tDemo"] - 0.1, 0.22); buzz(b["tMiss"] - 0.05, 0.6, 0.12)
whoosh(b["house"] - 0.1, 0.3, 0.15)
for k_ in b["knock"]: put(sfx, add(smooth(noise(0.08, 60), 6) * 1.2, tone(95, 0.12, 30), tone(190, 0.08, 40) * 0.5), k_, 0.5)
x = env_x(0.6); put(sfx, np.sin(2 * np.pi * np.cumsum(220 + 90 * np.sin(2 * np.pi * 6 * x) + 60 * x) / SR) * np.exp(-x * 3) * np.minimum(1, x / 0.05), b["door"], 0.07)   # door creak
whoosh(b["fl0"] - 0.05, 0.25, 0.22); flip(b["fl0"], 0.2)
whoosh(b["tShare"] - 0.1, 0.35, 0.2); pop_(b["tShare"] + 0.25, 0.14, 800, 1600); pop_(b["sh0"], 0.14)
tap(b["tEF"], 0.32)
# tape rewind for the loop: a fast falling warble with chirps
d = DUR - b["rw0"]; x = env_x(d); f = 1800 - 1300 * (x / d)
rw = np.sin(2 * np.pi * np.cumsum(f * (1 + 0.15 * np.sin(2 * np.pi * 23 * x))) / SR) * 0.35 + smooth(rng.standard_normal(len(x)), 4) * 0.25
put(sfx, rw * np.minimum(1, x / 0.05), b["rw0"], 0.16)
music *= np.where(tt >= b["rw0"], np.clip(1 - (tt - b["rw0"]) / 0.3, 0, 1), 1)
sfx += amb

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)

act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.05, (DUR - tt) / 0.15))
mix = (music * duck * 0.9 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
