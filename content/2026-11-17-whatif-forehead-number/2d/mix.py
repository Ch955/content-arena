"""What-if #2 'the forehead number' soundtrack, all synthesized here (original; no film music, no real song): a
function-hall bed for the neon engagement night (soft crowd murmur + a light festive groove: plucks, a drone and a
hand-drum pattern, D major), a bell 'ting' as each forehead number ignites, whip whooshes + a comic 'wah-wah' sting
on 2,400, a stamp for the hold tag, slot dings, a +1 blip when Nikhil's 96 -> 97, a digital glitch on Rohit's frozen 12,
UI pops/taps (follow, comments, tag, end card), a held pad + ticks for the 5-s countdown, a shimmering swell for the
reveal, ONE soft synth note under Nikhil's 'four days' line (the bed drops out), a warm clay swell + fast clock ticks and
rising counter blips for the 8 -> 11 PM time-lapse, a sparkle at 100, a ✅ ding. At the loop cut the hall bed restarts
exactly as at t=0. Reads timeline.json + beats.json (node render.js --beats); voices on top with ducking -> mix.wav."""
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
# 1) the hall: crowd murmur (band-limited noise with slow swells) + festive groove (D major, 104 bpm)
def hall(t0, t1, g=1.0, seed=3):
    r = np.random.default_rng(seed); d = t1 - t0; x = env_x(d)
    mur = smooth(r.standard_normal(len(x)), 30) - smooth(r.standard_normal(len(x)), 300)
    mur *= 0.7 + 0.3 * np.sin(2 * np.pi * 0.37 * x + 1) * np.sin(2 * np.pi * 0.11 * x)
    put(amb, mur * win(d, 0.02, 0.1) * 2.2, t0, 0.05 * g)
    beat = 60 / 104; k = 0; prog = [[62, 66, 69], [67, 71, 74], [69, 73, 76], [62, 66, 69]]
    while t0 + k * beat / 2 < t1 - 0.05:
        at_ = t0 + k * beat / 2; ch = prog[(k // 8) % 4]
        if k % 8 == 0: put(music, strings(ch[0] - 12, min(beat * 4 + 0.2, t1 - at_), 0.2, 0.3), at_, 0.05 * g)
        put(music, pluck(ch[(k * 2) % 3] + 12 + (12 if k % 4 == 3 else 0), 0.35), at_, 0.05 * g)
        put(music, drum(k % 4 == 0 or k % 8 == 5), at_, (0.16 if k % 4 == 0 else 0.07) * g)
        k += 1
hall(0, b["why"] - 0.05)                 # neon party until Nikhil's quiet line
hall(b["loop0"], DUR)                    # the loop: the same hall from frame 1
# countdown: a held suspense pad + ticks (the groove keeps going, lower)
CD0, CD1 = b["CD0"], b["CD1"]
for m, g in ((50, 0.08), (57, 0.06), (62, 0.04), (64, 0.03)): put(music, strings(m, CD1 - CD0 + 0.2, 0.3, 0.3), CD0, g)
def tick(at_, g=0.18, hi=True): put(sfx, add(smooth(noise(0.02, 220), 3) * 0.7, tone(3200 if hi else 2400, 0.02, 160)), at_, g)
for k in range(int(round((CD1 - CD0) * 2))): tick(CD0 + k * 0.5, 0.34 if k % 2 == 0 else 0.22, k % 2 == 0)
# 2) Nikhil's '...four days' line: the bed drops out, one soft synth note (D) with a slow swell
put(music, strings(62, b["clay"] - b["why"] + 0.3, 0.6, 0.4), b["why"], 0.10); put(music, tone(midi(74), 2.5, 1.2) * 0.5, b["tMath"], 0.05)
# 3) clay: warm swell, then the time-lapse (fast clock ticks + rising plucks), warm music to the share card
for m, g in ((62, 0.06), (66, 0.05), (69, 0.05), (74, 0.03)): put(music, strings(m, b["loop0"] - b["clay"], 0.5, 0.3), b["clay"], g)
put(music, add(piano(62, 2.5), piano(66, 2.5), piano(69, 2.5)), b["clay"], 0.10)
k = 0
while b["tl0"] + k * 0.12 < b["tl1"]: tick(b["tl0"] + k * 0.12, 0.10, k % 2 == 0); k += 1
for k, m in enumerate((74, 76, 78, 81, 83, 86)): put(music, pluck(m, 0.4), b["tl0"] + k * (b["tl1"] - b["tl0"]) / 6, 0.07)
# ---------- sfx ----------
def ting(at_, g=0.20, m=93): put(sfx, add(tone(midi(m), 1.2, 4), 0.35 * tone(midi(m) * 2.76, 0.6, 9)), at_, g)
def pop_(at_, g=0.18, f0=400, f1=1100): put(sfx, sweep(f0, f1, 0.12, 14), at_, g)
def whoosh(at_, d=0.35, g=0.25): x = env_x(d); put(sfx, smooth(noise(d, 1), 30) * np.sin(np.pi * x / d), at_, g)
def tap(at_, g=0.35): put(sfx, add(smooth(noise(0.05, 80), 3), tone(900, 0.06, 40)), at_, g)
def ding(at_, g=0.25, m=88):
    for j, dt in enumerate((0, 0.09)): put(sfx, add(tone(midi(m + 4 * j), 0.9, 5), 0.3 * tone(midi(m + 4 * j) * 2.01, 0.5, 9)), at_ + dt, g * (1 - 0.25 * j))
def stamp(at_, g=0.25): put(sfx, add(smooth(noise(0.12, 30), 4), tone(140, 0.15, 25)), at_, g)
pop_(b["titleIn"], 0.16); pop_(b["crore"] + 0.05, 0.10, 600, 1300)
# the numbers ignite (Vimala first, then across the hall): a soft rising run of bells + a shimmer
for k in range(7): ting(b["ign0"] + (0 if k == 0 else 0.25 + (k - 1) * (b["ign1"] - b["ign0"] - 0.1) / 6), 0.13, 86 + [0, 2, 4, 7, 9, 11, 12][k])
x = env_x(1.4); put(sfx, smooth(rng.standard_normal(len(x)), 3) * np.sin(np.pi * x / 1.4) * (0.5 + 0.5 * np.sin(2 * np.pi * 9 * x)), b["ign0"] + 0.2, 0.05)
whoosh(b["wR"] - 0.05, 0.3, 0.22); whoosh(b["wS"] - 0.05, 0.3, 0.22); whoosh(b["wBack"] - 0.05, 0.25, 0.15)
pop_(b["wS"] + 0.25, 0.12, 500, 1200)                               # B.Tech chip
for k, (m0, m1) in enumerate(((67, 65), (64, 58))):                  # comic 'wah-wah' sting on 2,400
    x = env_x(0.42); f = midi(m0) * (midi(m1) / midi(m0)) ** (x / 0.42); s_ = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.4 + np.sin(2 * np.pi * np.cumsum(f) / SR)
    put(sfx, smooth(s_, 10) * np.minimum(1, x / 0.03) * np.exp(-x * 2.5) * (1 + 0.3 * np.sin(2 * np.pi * 7 * x)), b["t2400"] + 0.15 + k * 0.42, 0.10)
put(sfx, sweep(300, 900, 0.18, 8), b["wBack"] + 0.1, 0.08)        # eyes flick to 96
for k in range(3): pop_(b["slots"] + k * 0.08, 0.10, 600 + k * 200, 1200 + k * 200)
stamp(b["tHold"]); put(sfx, tone(midi(84), 0.25, 14), b["tMiss"], 0.08); put(sfx, tone(midi(88), 0.25, 14), b["tMiss"] + 0.07, 0.08)
for k in range(3): put(sfx, add(smooth(noise(0.03, 150), 2), tone(600, 0.04, 60)), b["tTap"] + k * 0.17, 0.12)   # Ammamma taps her forehead
for i, t0 in enumerate((b["slot1"], b["slot2"], b["slot3"])): ding(t0, 0.14, 84 + 2 * i)
ting(b["tTick"], 0.18, 98); pop_(b["tTick"] + 0.05, 0.12, 800, 1600)                     # 96 -> 97: +1
for k in range(5):                                                                     # Rohit's 12: digital glitch, not moving
    x = env_x(0.06); put(sfx, np.sign(np.sin(2 * np.pi * (180 + 90 * k) * x)) * np.exp(-x * 20), b["wRo"] + 0.15 + k * 0.25, 0.05)
pop_(b["fol0"] + 0.05, 0.15); tap(b["tFol"], 0.35); pop_(b["tQ"], 0.15); pop_(b["tCm"] - 0.05, 0.15)
for t0 in b["cb"]: pop_(t0, 0.12, 700, 1500)
# reveal: every number flashes, a shimmering swell, the label whooshes in
for m, g in ((74, 0.06), (78, 0.05), (81, 0.05), (86, 0.03)): put(music, strings(m, 2.6, 0.08, 1.6), b["rev"], g)
ting(b["rev"], 0.18, 98); ting(b["rev"] + 0.08, 0.12, 105); whoosh(b["tFam"] - 0.15, 0.3, 0.16); pop_(b["tPhone"], 0.12)
put(sfx, sweep(900, 500, 0.25, 6), b["tShrug"], 0.08)          # Ananya's shrug (her family isn't here)
pop_(b["tMath"], 0.12, 500, 900)
put(sfx, add(smooth(noise(0.08, 40), 3), tone(240, 0.08, 30)), b["tPocket"] + 0.3, 0.12)   # phone into the pocket
whoosh(b["clay"] - 0.1, 0.4, 0.15)
put(sfx, add(smooth(noise(0.04, 120), 2), tone(500, 0.05, 50)), b["tDown"], 0.18)        # phone face-down on the chair
put(sfx, add(smooth(noise(0.03, 150), 2), tone(700, 0.04, 60)), b["tPat"], 0.10); put(sfx, add(smooth(noise(0.03, 150), 2), tone(700, 0.04, 60)), b["tPat"] + 0.13, 0.08)
for k in range(3): put(sfx, tone(midi(91 + 2 * k), 0.15, 20), b["tl0"] + (k + 1) * (b["tl1"] - b["tl0"]) / 3.0, 0.08)   # counters tick up on 9, 10, 11 PM
for k, m in enumerate((98, 103, 107)): put(sfx, tone(midi(m), 0.5, 7), b["tl1"] + k * 0.06, 0.07)   # sparkle at 100 (11:00 PM)
ding(b["tCheck"], 0.22, 91); pop_(b["tQ2"], 0.12)
whoosh(b["sh0"], 0.35, 0.16)
for i in range(3): pop_(b["tAt"] + 0.1 + i * 0.08, 0.09, 700, 1400)
tap(b["tTag"], 0.3); ding(b["tTag"] + 0.12, 0.10, 93)
pop_(b["end0"], 0.14); tap(b["tEF"], 0.32)
# hard cut to frame 1: everything but the restarted hall bed stops on the cut
cut = np.where(tt >= b["loop0"], 1, 0)
loopbed_m = music * cut; loopbed_a = amb * cut
music = music * (1 - cut); amb = amb * (1 - cut); sfx = sfx * (1 - cut)
# (the restarted bed was put into music/amb above; rebuild it alone for the loop part)
m2 = np.zeros(n); a2 = np.zeros(n)
music_save, amb_save = music, amb
music, amb = m2, a2; hall(b["loop0"], DUR); m2, a2 = music, amb; music, amb = music_save, amb_save
music += m2 * cut; amb += a2 * cut

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
