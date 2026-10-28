"""Episode soundtrack: playful bed, 'mass' drums in slow-mo, cartoon SFX, record scratch, voices, ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
slowA, slowB, fight = S(3), S(4), E(6); impact = fight + 0.7; amma_in = S(7) - 0.1; drag = E(8) + 0.15
rng = np.random.default_rng(3)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR); e = min(n, s + len(sig))
    if s < n: dst[s:e] += sig[: e - s] * gain
def tone(f, d, decay=8, kind="sin"):
    x = np.arange(int(d * SR)) / SR
    w = np.sin(2 * np.pi * f * x) if kind == "sin" else 2 * ((f * x) % 1) - 1
    return w * np.exp(-x * decay)

music = np.zeros(n)
# playful bed: bouncy bass + plucks (C F G Am), 120 bpm, outside slow-mo and the freeze
beat = 0.5; prog = [[48, 52, 55], [53, 57, 60], [55, 59, 62], [57, 60, 64]]
for k in range(int(DUR / beat)):
    at = k * beat
    if slowA - 0.2 < at < impact + 0.6 or amma_in < at < amma_in + 0.6: continue
    ch = prog[(k // 4) % 4]
    put(music, tone(midi(ch[0] - 12), 0.35, 9), at, 0.30 if k % 2 == 0 else 0.18)
    put(music, tone(midi(ch[(k % 3)] + 12), 0.25, 12), at + 0.25, 0.10)
    put(music, rng.standard_normal(int(0.04 * SR)) * np.exp(-np.arange(int(0.04 * SR)) / SR * 90), at + 0.25, 0.04)
# slow-mo 'mass': drone + big drum hits
x = tt[(tt > slowA) & (tt < fight)]
drone = 0.12 * np.sin(2 * np.pi * 55 * x) + 0.06 * np.sin(2 * np.pi * 82.4 * x)
put(music, drone * np.minimum(1, (x - slowA) / 0.6), slowA)
for k in range(int((fight - slowA) / 0.8) + 1):
    d = np.arange(int(0.6 * SR)) / SR
    put(music, np.sin(2 * np.pi * (45 + 60 * np.exp(-d * 25)) * d) * np.exp(-d * 6), slowA + k * 0.8, 0.55)

sfx = np.zeros(n)
def whoosh(at, d=0.6, g=0.5):
    m = int(d * SR); w = rng.standard_normal(m); out = np.empty(m); acc = 0
    for i in range(m):
        a = 0.03 + 0.25 * np.sin(np.pi * i / m); acc += a * (w[i] - acc); out[i] = acc
    put(sfx, out * np.sin(np.pi * np.arange(m) / m) ** 2 * 3, at, g)
whoosh(slowA - 0.2, 0.8, 0.5); whoosh(fight, 0.7, 0.6); whoosh(drag, 0.6, 0.5)
d = np.arange(int(0.35 * SR)) / SR  # punch: thump + crack
punch = np.sin(2 * np.pi * (60 + 140 * np.exp(-d * 40)) * d) * np.exp(-d * 12) + rng.standard_normal(len(d)) * np.exp(-d * 60) * 0.6
put(sfx, punch, impact, 0.9); put(sfx, punch, impact + 0.18, 0.5)
d = np.arange(int(0.5 * SR)) / SR  # boing on landing
put(sfx, np.sin(2 * np.pi * (180 + 120 * np.sin(d * 40)) * d) * np.exp(-d * 6), impact + 0.9, 0.35)
d = np.arange(int(0.45 * SR)) / SR  # record scratch before Amma
put(sfx, np.sin(2 * np.pi * np.cumsum(900 - 1500 * d) / SR) * np.exp(-d * 4) * 0.5 + rng.standard_normal(len(d)) * 0.08, amma_in - 0.35, 0.6)
for i in range(3):  # sparkle when lollipop returns
    put(sfx, tone(1568 + i * 400, 0.3, 10), impact + 0.6 + i * 0.08, 0.12)

voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a, l["start"], 0.95)

act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
duck = 1 - 0.6 * np.clip(act * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 0.5, (DUR - tt) / 1.2))
mix = (music * duck + sfx + voice) * fade
mix /= np.abs(mix).max() / 0.9
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
