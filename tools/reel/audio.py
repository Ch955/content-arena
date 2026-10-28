"""Build the reel timeline from voice durations and mix an original soundtrack:
synthesized music bed + whoosh/ding SFX + Telugu voiceover. Writes timeline.json and mix.wav."""
import json, wave
from pathlib import Path
import numpy as np

HERE = Path(__file__).parent
SR = 44100
LEAD, TAIL, END_HOLD = 0.5, 0.6, 1.5  # seconds before voice, after voice, extra on last scene

durs = json.loads((HERE / "durs.json").read_text())["durations"]
scenes, t = [], 0.0
for key, d in durs.items():
    end = t + LEAD + d + TAIL
    scenes.append([key, round(t, 2), round(end, 2)])
    t = end
DUR = round(t + END_HOLD, 2)
(HERE / "timeline.json").write_text(json.dumps({"scenes": scenes, "dur": DUR}))

n = int(DUR * SR)
tt = np.arange(n) / SR
rng = np.random.default_rng(7)

def env(length, a, r):
    e = np.ones(length)
    ai, ri = min(int(a * SR), length // 2), min(int(r * SR), length // 2)
    e[:ai] = np.linspace(0, 1, ai)
    if ri: e[-ri:] *= np.linspace(1, 0, ri)
    return e

def lowpass(x, alpha):
    a = np.broadcast_to(np.asarray(alpha, dtype=float), x.shape)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc); y[i] = acc
    return y

def midi(m): return 440 * 2 ** ((m - 69) / 12)

# --- music: Am - F - C - G pad, plucked arpeggio, soft kick + hat, 96 bpm ---
bpm = 96; beat = 60 / bpm; bar = 4 * beat
chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
music = np.zeros(n)
pad = np.zeros(n)
for b in range(int(DUR / bar) + 1):
    s = int(b * bar * SR); e = min(n, int((b + 1) * bar * SR))
    if s >= n: break
    seg = tt[s:e] - tt[s]
    for m in chords[b % 4]:
        f = midi(m)
        for det in (-0.12, 0.12):  # detuned saws
            ph = (f * (1 + det / 100) * seg) % 1
            pad[s:e] += (2 * ph - 1) * 0.05
    pad[s:e] *= env(e - s, 0.4, 0.4)
music += lowpass(pad, 0.04)

for k in range(int(DUR / (beat / 2))):  # eighth-note arpeggio
    s = int(k * beat / 2 * SR); L = int(0.35 * SR)
    if s + L >= n: break
    ch = chords[int(k * beat / 2 / bar) % 4]
    f = midi(ch[[0, 1, 2, 1][k % 4]] + 12)
    seg = np.arange(L) / SR
    music[s:s + L] += 0.06 * np.sin(2 * np.pi * f * seg) * np.exp(-seg * 9)

for k in range(int(DUR / beat)):  # kick on every beat, hat on off-beats
    s = int(k * beat * SR); L = int(0.25 * SR)
    if s + L >= n: break
    seg = np.arange(L) / SR
    music[s:s + L] += 0.22 * np.sin(2 * np.pi * (50 + 90 * np.exp(-seg * 30)) * seg) * np.exp(-seg * 14)
    h = s + int(beat / 2 * SR); HL = int(0.05 * SR)
    if h + HL < n:
        music[h:h + HL] += 0.025 * rng.standard_normal(HL) * np.exp(-np.arange(HL) / SR * 80)

# --- voice track ---
voice = np.zeros(n)
for key, a, b in scenes:
    with wave.open(str(HERE / "vo" / f"{key}.wav")) as w:
        sr = w.getframerate(); v = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    v = np.interp(np.arange(int(len(v) * SR / sr)) * sr / SR, np.arange(len(v)), v)
    s = int((a + LEAD) * SR); voice[s:s + len(v)] += v[: n - s] * 0.9

# --- SFX: whoosh at each scene change, ding when numbers finish counting ---
sfx = np.zeros(n)
for i, (key, a, b) in enumerate(scenes):
    if i:  # whoosh: band-swept noise
        L = int(0.6 * SR); s = max(0, int((a - 0.25) * SR)); seg = np.arange(L) / L
        noise = lowpass(rng.standard_normal(L), 0.05 + 0.25 * np.sin(np.pi * seg))
        sfx[s:s + L] += 0.5 * noise * np.sin(np.pi * seg) ** 2
    if key in ("s1", "s2", "s3", "s4", "s5"):
        s = int((a + 1.8) * SR); L = int(0.8 * SR); seg = np.arange(L) / SR
        sfx[s:s + L] += 0.12 * (np.sin(2 * np.pi * 1318.5 * seg) + 0.5 * np.sin(2 * np.pi * 1975.5 * seg)) * np.exp(-seg * 6)

# duck music under the voice
active = lowpass((np.abs(voice) > 0.01).astype(float), 0.0008)
duck = 1 - 0.65 * np.clip(active * 3, 0, 1)
fade = np.minimum(1, np.minimum(tt / 1.0, (DUR - tt) / 1.5))
mix = (music * duck * 0.9 + voice + sfx) * fade
mix /= max(1e-9, np.abs(mix).max()) / 0.89
pcm = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open(str(HERE / "mix.wav"), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print(json.dumps({"scenes": scenes, "dur": DUR}))
