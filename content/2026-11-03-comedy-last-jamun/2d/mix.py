"""Episode 7 'The Last Jamun' soundtrack (all synthesized here, original): playful bed for hook/CTA,
a sad 'violin' line (additive synth) that speeds up with the bowl ping-pong, steal zip, violin screech +
string ping at the empty bowl, whip-pan whoosh, cheeky villain sting, voices, ducking."""
import json, wave
import numpy as np

SR = 44100
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
# same shot boundaries as ep.html
sh2, sh3, sh4 = S(2) - 0.55, S(4) - 0.3, E(5) + 0.45
zip_t, freeze, pan, sh6 = E(6) + 0.05, E(6) + 0.55, E(8) + 0.05, S(10) - 0.35
rng = np.random.default_rng(7)

def midi(m): return 440 * 2 ** ((m - 69) / 12)
def put(dst, sig, at, gain=1.0):
    s = int(at * SR); e = min(n, s + len(sig))
    if 0 <= s < n: dst[s:e] += sig[: e - s] * gain
def tone(f, d, decay=8):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def violin(f, d):
    x = np.arange(int(d * SR)) / SR
    vib = 1 + 0.007 * np.sin(2 * np.pi * 5.6 * x) * np.minimum(1, x / 0.25)
    ph = 2 * np.pi * f * np.cumsum(vib) / SR
    w = sum(np.sin(h * ph) / h ** 1.15 for h in range(1, 9))
    env = np.minimum(1, x / 0.12) * np.minimum(1, (d - x) / 0.15)
    return w * env * 0.5
def noise_sweep(d, lo, hi):
    m = int(d * SR); w = rng.standard_normal(m); out = np.empty(m); acc = 0.0
    for i in range(m):
        a = lo + (hi - lo) * np.sin(np.pi * i / m); acc += a * (w[i] - acc); out[i] = acc
    out = out * np.sin(np.pi * np.arange(m) / m) ** 2
    return out / (np.abs(out).max() or 1)

music = np.zeros(n)
# playful bed (C F G Am, 120 bpm): hook, reveal-on-swing, CTA
beat = 0.5; prog = [[48, 52, 55], [53, 57, 60], [55, 59, 62], [57, 60, 64]]
for k in range(int(DUR / beat)):
    at = k * beat
    if not (at < sh2 - 0.2 or pan + 0.6 < at): continue
    ch = prog[(k // 4) % 4]
    put(music, tone(midi(ch[0] - 12), 0.35, 9), at, 0.30 if k % 2 == 0 else 0.18)
    put(music, tone(midi(ch[(k % 3)] + 12), 0.25, 12), at + 0.25, 0.10)
    put(music, rng.standard_normal(int(0.04 * SR)) * np.exp(-np.arange(int(0.04 * SR)) / SR * 90), at + 0.25, 0.04)
# sentiment: low pad + sad violin (A minor), accelerating through the ping-pong, cut at the freeze
x = tt[(tt > sh2) & (tt < freeze)]
pad = (np.sin(2 * np.pi * midi(45) * x) + 0.6 * np.sin(2 * np.pi * midi(52) * x)) * np.minimum(1, (x - sh2) / 1.0) * 0.07
put(music, pad, sh2)
phrase = [76, 74, 72, 71, 69, 72, 71, 69, 68, 69]
at, i = sh2 + 0.1, 0
while at < freeze - 0.1:
    k = min(1.0, max(0.0, (at - sh3) / (sh4 - sh3)))
    d = 0.75 if at < sh3 else 0.75 - 0.5 * k          # faster and faster with the bowl
    if at > sh4: d = 0.6
    note = phrase[i % len(phrase)] + (2 if (sh3 < at < sh4 and k > 0.6) else 0)
    put(music, violin(midi(note), min(d * 1.05, freeze - at)), at, 0.16 + 0.10 * k)
    at += d; i += 1

sfx = np.zeros(n)
for at in (S(2) + 0.2, S(3) + 0.3):                     # bowl slides on the mat
    put(sfx, noise_sweep(0.5, 0.02, 0.12), at, 0.25)
d = np.arange(int(1.2 * SR)) / SR                        # cymbal swell at HUNDRED / flash
put(sfx, rng.standard_normal(len(d)) * np.exp(-d * 3) * 0.25, sh4 - 0.05, 0.8)
put(sfx, noise_sweep(0.4, 0.05, 0.35), zip_t, 0.7)       # Pandu's zip
d = np.arange(int(0.5 * SR)) / SR                        # violin screech
put(sfx, np.sign(np.sin(2 * np.pi * np.cumsum(1400 - 1800 * d) / SR)) * np.exp(-d * 5) * 0.25 + rng.standard_normal(len(d)) * 0.05 * np.exp(-d * 5), freeze - 0.05, 0.5)
d = np.arange(int(0.6 * SR)) / SR                        # string ping / boing
put(sfx, np.sin(2 * np.pi * (330 + 60 * np.sin(d * 50)) * d) * np.exp(-d * 6), freeze + 0.1, 0.35)
put(sfx, noise_sweep(0.55, 0.03, 0.3), pan, 0.6)         # whip-pan
d = np.arange(int(0.7 * SR)) / SR                        # slide whistle up on the swing reveal
put(sfx, np.sin(2 * np.pi * np.cumsum(500 + 900 * d / 0.7) / SR) * np.minimum(1, d / 0.05) * np.exp(-d * 2), pan + 0.45, 0.18)
for j, m in enumerate([48, 47, 46]):                     # cheeky 'dun dun dunnn' after the gloat
    dd = 0.5 if j < 2 else 0.9
    put(sfx, tone(midi(m), dd, 4) + 0.4 * tone(midi(m + 12), dd, 6), E(9) + 0.05 + j * 0.28, 0.28)
for j in range(3):                                       # sparkle on the end card
    put(sfx, tone(1568 + j * 400, 0.3, 10), S(11) - 0.2 + j * 0.08, 0.12)

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
