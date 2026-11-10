"""Karthika Masam festival special (2D animated) soundtrack.
Music = our original devotional song (content/<post>/assets/karthika-song.wav, 68 s, Telugu vocals) instead of the
synthesized bed: solo for the ~3 s intro, ducked ~-16 dB under every voice line (sidechain-style, 0.25 s fades),
up again for the silent 5 s countdown, and swelling over the outro after the last line. The song is time-stretched
(tempo only, pitch kept) so its own ending lands on the end card, then trimmed/faded to the reel length.
Light synthesized SFX only: diya whooshes, bell ding, tick-tock in the countdown, ta-da on the reveal (+ a soft
wrong-guess buzz and follow taps). Times mirror ep.html."""
import json, os, subprocess, wave
import numpy as np

SR = 44100
SONG = os.environ.get("SONG", "/home/user/content-arena/content/2026-11-10-festival-karthika-masam/assets/karthika-song.wav")
SONG_END = 66.8          # where the song's own ending has faded (s, original tempo)
DUCK_DB = -16.0
FADE = 0.25
tl = json.load(open("timeline.json"))
L = tl["lines"]; DUR = tl["dur"]; CDN = tl["countdown"]; n = int(DUR * SR); tt = np.arange(n) / SR
S = lambda i: L[i]["start"]; E = lambda i: L[i]["start"] + L[i]["dur"]
lerp = lambda a, b, k: a + (b - a) * k

def seg(i, k, cnt):  # same phrase finder as ep.html
    l = L[i]; e = l["env"] + [0] * 6; segs = []; on = None; low = 0
    for f, v in enumerate(e):
        if v > 0.1:
            if on is None: on = f
            low = 0
        else:
            low += 1
            if on is not None and low >= 5: segs.append((l["start"] + on / 30, l["start"] + (f - low + 1) / 30)); on = None
    if len(segs) != cnt: segs = [(l["start"] + l["dur"] * j / cnt, l["start"] + l["dur"] * (j + 1) / cnt) for j in range(cnt)]
    return segs[k]

# cut times (same as ep.html cuts())
cB, cC, cD, cE, cF, cG = S(3) - 0.3, S(4) - 0.3, S(5) - 0.3, S(6) - 0.3, S(7) - 0.3, S(8) - 0.3
CD0 = E(10) + 0.35; CD1 = CD0 + CDN; cH = S(12) - 0.3; cO = E(14) + 0.35
tLight = lambda i: 0.35 + i * 0.22
a3b, b3b = seg(3, 1, 2); tAmma = lerp(a3b, b3b, 0.55)
tBell = seg(5, 1, 3)[0] + 0.1
a10 = seg(10, 0, 2)[0]
tTapF, tTapS = lerp(S(7), E(7), 0.55), lerp(S(7), E(7), 0.85)
rng = np.random.default_rng(7)

def put(dst, sig, at, gain=1.0):
    s = int(at * SR); e = min(n, s + len(sig))
    if 0 <= s < n: dst[s:e] += sig[: e - s] * gain
def tone(f, d, decay=8):
    x = np.arange(int(d * SR)) / SR
    return np.sin(2 * np.pi * f * x) * np.exp(-x * decay)
def noise(d, decay): x = np.arange(int(d * SR)) / SR; return rng.standard_normal(len(x)) * np.exp(-x * decay)
def lp(sig, a):
    out = np.empty_like(sig); acc = 0.0
    for i, v in enumerate(sig): acc += a * (v - acc); out[i] = acc
    return out
def whoosh(d=0.45, a=0.12):   # soft airy swell (diya catching / scene cut)
    x = np.arange(int(d * SR)) / SR
    return lp(rng.standard_normal(len(x)), a) * np.sin(np.pi * x / d) ** 2
def fwoomp():                # tiny flame catch: low thump + airy hiss
    x = np.arange(int(0.35 * SR)) / SR
    return np.sin(2 * np.pi * (90 + 60 * np.exp(-x * 20)) * x) * np.exp(-x * 14) * 0.6 + whoosh(0.35, 0.25) * 0.8
def bell(f=740, d=3.0):      # small temple bell: inharmonic partials, long ring
    x = np.arange(int(d * SR)) / SR
    parts = [(1, 1, 1.4), (2.0, .5, 2.0), (2.76, .35, 2.6), (5.4, .18, 4.5), (8.93, .08, 7)]
    s = sum(a * np.sin(2 * np.pi * f * m * x) * np.exp(-x * dec) for m, a, dec in parts)
    return s * (1 + 0.15 * np.sin(2 * np.pi * 5 * x)) * np.minimum(1, x / 0.002)

# ---------------- song ----------------
dur_song = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", SONG],
                                capture_output=True, text=True).stdout)
target_end = DUR - 0.25                       # song's own ending lands at the very end
tempo = SONG_END / target_end                 # < 1 => slightly slower (pitch preserved)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", SONG, "-af", f"rubberband=tempo={tempo:.5f}:pitchq=quality",
                "-ac", "2", "-ar", str(SR), "song_fit.wav"], check=True)
with wave.open("song_fit.wav") as w:
    song = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float).reshape(-1, 2) / 32768
music = np.zeros((n, 2)); m = min(n, len(song)); music[:m] = song[:m]
print(f"song {dur_song:.2f}s -> tempo {tempo:.4f} ({(1 / tempo - 1) * 100:+.1f}% length)")

# ducking: -16 dB under each voice line (merged when lines are close), 0.25 s ramps
duck_lin = 10 ** (DUCK_DB / 20)
want = np.ones(n)
spans = []
for l in L:
    a, b = l["start"] - 0.08, l["start"] + l["dur"] + 0.08
    if spans and a - spans[-1][1] < 0.7: spans[-1][1] = b
    else: spans.append([a, b])
for a, b in spans: want[int(max(0, a - FADE) * SR):int(min(DUR, b) * SR)] = duck_lin   # reach the duck as the line starts
# smooth with a 0.25 s linear ramp (moving average of the step = linear crossfade)
k = int(FADE * SR); env = np.convolve(np.pad(want, (k, k), mode="edge"), np.ones(k) / k, mode="same")[k:-k]
env = np.clip(env, duck_lin, 1)
# level shape: intro solo, countdown up a little under the ticks, outro swells
level = np.full(n, 0.5)
level[tt >= CD0] = 0.42; level[tt >= CD1] = 0.5
sw = (tt - E(14)) / 2.0
level = np.where(tt > E(14), lerp(0.5, 0.78, np.clip(sw, 0, 1)), level)
level = np.convolve(np.pad(level, (k, k), mode="edge"), np.ones(k) / k, mode="same")[k:-k]
fade = np.minimum(1, (DUR - tt) / 1.8) * np.minimum(1, tt / 0.15)
music *= (env * level * np.clip(fade, 0, 1))[:, None]

# ---------------- SFX ----------------
sfx = np.zeros(n)
for i in range(11): put(sfx, fwoomp(), tLight(i), 0.05)                      # wall diyas light one by one
put(sfx, whoosh(0.9, 0.08), 0.15, 0.10)                                       # title swell
for ct in (cB, cC, cD, cE, cF, cG, cH, cO): put(sfx, whoosh(0.4, 0.15), ct - 0.2, 0.08)   # soft scene whooshes
put(sfx, fwoomp(), tAmma, 0.14); put(sfx, fwoomp(), tAmma + 0.5, 0.08)         # Amma's doorstep diya
put(sfx, bell(), tBell, 0.10)                                                 # temple bell ding
for tp in (tTapF, tTapS): put(sfx, tone(1300, 0.06, 60) + tone(2100, 0.06, 90) * 0.5, tp, 0.12)   # follow taps
for j in range(2):                                                            # soft wrong buzz on "ఉహూ!"
    x = np.arange(int(0.2 * SR)) / SR
    put(sfx, np.sign(np.sin(2 * np.pi * (150 - j * 25) * x)) * np.exp(-x * 5), a10 + j * 0.22, 0.06)
for kk in range(int(CDN * 2)):                                                # tick-tock
    put(sfx, noise(0.03, 160) * 0.6 + tone(2400 if kk % 2 == 0 else 1800, 0.03, 120), CD0 + kk * 0.5, 0.30 if kk % 2 == 0 else 0.20)
def mallet(f, d=0.6):
    x = np.arange(int(d * SR)) / SR
    return (np.sin(2 * np.pi * f * x) + 0.35 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 7) * np.minimum(1, x / 0.003)
midi = lambda mm: 440 * 2 ** ((mm - 69) / 12)
for j, mm in enumerate([72, 76, 79, 84]): put(sfx, mallet(midi(mm)), CD1 + j * 0.07, 0.16)   # ta-da
for mm in (60, 64, 67, 72): put(sfx, tone(midi(mm), 1.4, 2.2), CD1 + 0.28, 0.07)
put(sfx, lp(noise(1.2, 3), 0.5), CD1, 0.12)
put(sfx, bell(1100, 2.0), cO + 0.1, 0.05)                                     # end-card shimmer

# ---------------- voices ----------------
voice = np.zeros(n)
for l in L:
    with wave.open(f"vo/L{l['i']}.wav") as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
    put(voice, a / (np.abs(a).max() or 1) * 0.9, l["start"], 1.0)

mix = music + (sfx + voice)[:, None]
mix /= np.abs(mix).max() / 0.92
pcm = (mix * 32767).astype(np.int16)
with wave.open("mix.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("mix ok", DUR)
