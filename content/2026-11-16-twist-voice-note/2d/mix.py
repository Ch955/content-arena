"""Twist story #1 'the voice note from my own number' soundtrack, all synthesized here (original; no film music, no real
ringtone or notification sound): a low night hum + soft tension pad under the 11:58 PM bedroom, a two-tone notification
ping (frame 1 and again at the loop), the voice-note playback blip, clock ticks (11:58, the 5-s countdown, the flip to
12:00), a call buzz, paper rustle + whoosh into the flashbacks, a gentle two-note piano under Amma alone (warm, not sad),
the office bus engine pulling away (last year and this morning, + a honk), a knock on Amma's door and a warm swell,
warm morning music (piano + plucks, major) for the 8:15 AM payoff through the end card, UI pops/taps.
Reads timeline.json + beats.json (node render.js --beats); voices on top with ducking -> mix.wav."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json")); b = json.load(open("beats.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
rng = np.random.default_rng(16)

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

music = np.zeros(n); sfx = np.zeros(n); amb = np.zeros(n)
# scene spans (neon night = bedroom, split call, hall, loop)
night = [(0, b["fb1"]), (b["fb1e"], b["fb2"]), (b["fb3e"], b["kit0"]), (b["loop0"], DUR)]
# 1) night hum: 50/100 Hz hum + soft filtered noise (room tone), constant level so the loop cut is seamless
for a, c in night:
    d = c - a; x = env_x(d)
    hum = (np.sin(2 * np.pi * 50 * x) * 0.5 + np.sin(2 * np.pi * 100 * x) * 0.25 + smooth(rng.standard_normal(len(x)), 60) * 2.2)
    put(amb, hum * win(d, 0.05 if a == 0 or a == b["loop0"] else 0.15, 0.12), a, 0.05)
# soft tension pad (A minor, low strings) under the mystery lines L2-L4 and L7-L8 (not under the voice note itself)
for a, c, root in ((S(1) - 0.2, b["fb1"], 45), (b["fb1e"], b["CD0"], 45)):
    for m, g in ((root, 0.07), (root + 7, 0.05), (root + 12, 0.04), (root + 15, 0.03)): put(music, strings(m, c - a, 0.8, 0.5), a, g)
# countdown: held pad + ticking clock (11:59 PM)
CD0, CD1 = b["CD0"], b["CD1"]
for m, g in ((45, 0.08), (52, 0.06), (57, 0.04), (60, 0.03)): put(music, strings(m, CD1 - CD0 + 0.3, 0.3, 0.4), CD0, g)
def tick(at_, g=0.18, hi=True): put(sfx, add(smooth(noise(0.02, 220), 3) * 0.7, tone(3200 if hi else 2400, 0.02, 160)), at_, g)
for k in range(int(round((CD1 - CD0) * 2))): tick(CD0 + k * 0.5, 0.34 if k % 2 == 0 else 0.22, k % 2 == 0)
for k in range(4): tick(b["clk"] + 0.05 + k * 0.5, 0.14, k % 2 == 0)          # "రాత్రి 11:58": the clock ticks
# reveal: a soft warm chord under Ananya's call, two gentle piano notes under Amma alone, a music box for last year's message
for m, g in ((57, 0.06), (61, 0.05), (64, 0.04)): put(music, strings(m, b["split1"] - b["split0"] + 0.4, 0.5, 0.5), b["split0"], g)
put(music, piano(69, 3.0, 0.7), b["fb2"] + 0.1, 0.10); put(music, piano(64, 3.0, 0.6), b["tAlone"], 0.10); put(music, piano(61, 2.5, 0.5), b["tAlone"] + 0.6, 0.08)
for k, m in enumerate((76, 81, 79, 76)): put(music, add(tone(midi(m), 0.6, 6), 0.3 * tone(midi(m) * 3, 0.3, 14)), b["fb3"] + 0.15 + k * 0.32, 0.05)
# 2) warm morning music (A major, 100 bpm) from the door's warm light to the loop cut
A_, D_, E_, FM = [57, 61, 64], [50, 54, 57], [52, 56, 59], [54, 57, 61]
def bed(t0, t1, prog, g=1.0, bpm=100):
    beat = 60 / bpm; k = 0
    while t0 + k * beat / 2 < t1 - 0.1:
        at_ = t0 + k * beat / 2; ch = prog[(k // 8) % len(prog)]
        if k % 8 == 0:
            put(music, piano(ch[0] - 12, 2.6, 0.9), at_, 0.20 * g)
            put(music, strings(ch[0], min(beat * 4 + 0.3, t1 - at_), 0.5, 0.5), at_, 0.05 * g)
        put(music, pluck(ch[k % 3] + 12 + (12 if k % 4 == 3 else 0), 0.45), at_, 0.07 * g)
        if k % 4 == 2: put(music, piano(ch[1] + 12, 1.0, 0.6), at_, 0.06 * g)
        k += 1
bed(b["warm"] - 0.05, b["loop0"], [A_, D_, FM, E_], 1.0)
put(music, add(piano(69, 2.0), piano(73, 2.0), piano(76, 2.0)), b["warm"], 0.10)   # the door opens: warm chord

# ---------- sfx ----------
def ping(at_, g=0.30):   # notification: two soft bright tones
    for j, (m, dt) in enumerate(((88, 0), (95, 0.11))): put(sfx, add(tone(midi(m), 0.8, 7), 0.25 * tone(midi(m) * 2.01, 0.4, 12)), at_ + dt, g * (1 - 0.2 * j))
ping(0.0); ping(b["loop0"])
def blip(at_, g=0.22): put(sfx, add(tone(1320, 0.05, 50), tone(1980, 0.04, 70) * 0.5), at_, g)
blip(b["tap"]); blip(S(0) - 0.02, 0.12); blip(b["chat0"] + 0.3, 0.12); blip(b["msg2"], 0.08)   # voice-note play blips
def pop_(at_, g=0.18, f0=400, f1=1100): put(sfx, sweep(f0, f1, 0.12, 14), at_, g)
def whoosh(at_, d=0.4, g=0.3): x = env_x(d); put(sfx, smooth(noise(d, 1), 30) * np.sin(np.pi * x / d), at_, g)
def tap(at_, g=0.35): put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), at_, g)
def ding(at_, g=0.25, m=88):
    for j, dt in enumerate((0, 0.09)): put(sfx, add(tone(midi(m + 4 * j), 0.9, 5), 0.3 * tone(midi(m + 4 * j) * 2.01, 0.5, 9)), at_ + dt, g * (1 - 0.25 * j))
def rustle(at_, d=0.35, g=0.15): x = env_x(d); s_ = rng.standard_normal(len(x)); put(sfx, (s_ - smooth(s_, 6)) * np.sin(np.pi * x / d) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * x)), at_, g)
def buzz(at_, d=0.45, g=0.16):
    x = env_x(d); s_ = np.sign(np.sin(2 * np.pi * 160 * x)) * (0.6 + 0.4 * np.sin(2 * np.pi * 25 * x)); put(sfx, smooth(s_, 6) * np.minimum(1, np.minimum(x / 0.01, (d - x) / 0.02)), at_, g)
pop_(b["titleIn"], 0.18)
whoosh(b["pull"] - 0.05, 0.4, 0.18)
pop_(b["tSender"], 0.15, 500, 1200); pop_(b["tVoice"], 0.15, 500, 1200); put(sfx, tone(98, 0.4, 6), b["tVoice2"], 0.25)   # low hit on "Nikhil దే"
pop_(b["chat0"], 0.14); put(sfx, add(smooth(noise(0.1, 30), 4), tone(140, 0.15, 25)), b["t815"], 0.22)
for k, t0 in enumerate((b["slots"], b["slots"] + 0.08, b["slots"] + 0.16)): pop_(t0, 0.10, 600 + k * 200, 1200 + k * 200)
put(sfx, add(smooth(noise(0.12, 30), 4), tone(140, 0.15, 25)), b["tHold"], 0.25)   # tag stamp
put(sfx, tone(midi(84), 0.25, 14), b["tMiss"], 0.08); put(sfx, tone(midi(88), 0.25, 14), b["tMiss"] + 0.07, 0.08)
# flashback in/out: whoosh + paper rustle
for t0 in (b["fb1"], b["fb2"]): whoosh(t0 - 0.12, 0.35, 0.22); rustle(t0, 0.4, 0.18)
for t0 in (b["fb1e"], b["fb3e"]): whoosh(t0 - 0.1, 0.3, 0.2)
rustle(b["fb3"], 0.3, 0.12)
pop_(b["tDead"] + 0.2, 0.14, 900, 400)   # 0% (falling pop)
put(sfx, add(smooth(noise(0.04, 120), 2), tone(700, 0.04, 60)), b["tTake"], 0.2)   # phone slides off the table
put(sfx, add(smooth(noise(0.015, 300), 2), tone(1800, 0.03, 90)), b["tToggle"], 0.35); ding(b["tToggle"] + 0.35, 0.10, 91)   # toggle ON + scheduled
for i, t0 in enumerate((b["slot1"], b["slot2"], b["slot3"])): ding(t0, 0.14, 84 + 2 * i)
pop_(b["fz0"] + 0.05, 0.15); tap(b["tFol"], 0.35)
pop_(b["cal0"], 0.16, 500, 1000); whoosh(b["calFly"], 0.3, 0.15); pop_(b["tTheory"], 0.15); pop_(b["tCm"] - 0.05, 0.15)
for t0 in b["cb"]: pop_(t0, 0.12, 700, 1500)
k = 0
while b["ring0"] + k * 0.5 < b["split0"] + 0.1: buzz(b["ring0"] + k * 0.5, 0.35, 0.20); k += 1   # Ananya calling
tap(b["split0"] - 0.02, 0.25); whoosh(b["split0"], 0.3, 0.18)
put(sfx, add(tone(midi(93), 0.6, 6), tone(midi(100), 0.6, 6) * 0.5), b["tNuvve"], 0.14)   # the clue paying off
# the office bus pulling away (last year softer, this morning full) + a honk this morning
def engine(t0, d, g, f0=42, f1=70):
    x = env_x(d); f = f0 + (f1 - f0) * (x / d) ** 1.5; ph = np.cumsum(f) / SR
    s_ = smooth(2 * (ph % 1) - 1, 6) + 0.6 * np.sin(2 * np.pi * 2 * ph) + smooth(rng.standard_normal(len(x)), 25) * 1.5
    put(sfx, s_ * (1 + 0.3 * np.sin(2 * np.pi * 9 * x)) * np.minimum(1, x / 0.15) * np.exp(-np.maximum(0, x - 0.4) * 1.6), t0, g)
engine(b["busGo"] - 0.6, 2.2, 0.06)
def honk(at_, g=0.12):
    for f in (392, 494):
        x = env_x(0.45); s_ = np.sign(np.sin(2 * np.pi * f * x)) * 0.5 + np.sin(2 * np.pi * f * x); put(sfx, smooth(s_, 4) * np.minimum(1, np.minimum(x / 0.02, (0.45 - x) / 0.05)), at_, g)
honk(b["tHonk"]); engine(b["busGo2"] - 0.5, 2.6, 0.10)
# 12:00: the clock flips (tick + soft chime), Nikhil's happy hop
tick(b["tFlip"] - 0.1, 0.25); ding(b["tFlip"] + 0.05, 0.14, 86)
x = env_x(0.3); put(sfx, smooth(noise(0.3, 6), 20) * np.sin(np.pi * x / 0.3), b["tWish"], 0.15)   # blanket thrown
# knock on Amma's door (3 soft knocks), door opens + warm swell
for k in range(3): put(sfx, add(tone(170, 0.12, 30), smooth(noise(0.04, 120), 3) * 0.6), b["knock"] + 0.05 + k * 0.16, 0.35)
x = env_x(0.5); put(sfx, np.sin(2 * np.pi * np.cumsum(260 + 60 * np.sin(2 * np.pi * 3 * x)) / SR) * np.exp(-x * 5) * 0.4, b["door"], 0.10)   # gentle creak
put(music, strings(69, 1.4, 0.4, 0.6), b["door"], 0.06)
pop_(b["kit0"] + 0.1, 0.12, 500, 900); pop_(b["busGo2"] + 0.3, 0.12, 700, 1300)
ding(b["tCheck"], 0.22, 91)   # ✅
pop_(b["tFeed"] + 0.4, 0.10, 900, 1500)
whoosh(b["sh0"], 0.35, 0.16); for_t = [b["tAt"] + 0.1 + i * 0.08 for i in range(3)]
for t0 in for_t: pop_(t0, 0.09, 700, 1400)
tap(b["tTag"], 0.3); ding(b["tTag"] + 0.12, 0.10, 93)
pop_(b["end0"], 0.14); tap(b["tEF"], 0.32)
# hard cut to frame 1: music stops on the cut, the night hum + ping come back exactly as at t=0
music *= np.where(tt >= b["loop0"], 0, 1)

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * (0.8 if l["i"] == 0 else 0.9), l["start"], 1.0)
act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, (DUR - tt) / 0.03)
mix = (music * duck * 0.9 + sfx * (1 - 0.3 * np.clip(act * 3, 0, 1)) + amb + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
