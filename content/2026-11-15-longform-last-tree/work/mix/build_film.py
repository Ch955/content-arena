"""చివరి చెట్టు రహస్యం: final sound mix + join -> work/render/film.mp4 (1920x1080, 30 fps, AAC 192k, ~-14 LUFS, TP <= -1 dB).

Per scene N (1..9, from work/voices/film.json):
  video   work/render/scene{N}.mp4      (stream copy; its own audio is ignored)
  voice   work/voices/scene{N}/vo_mix.wav  (untouched; swap these for retakes and re-run)
  sfx     2d/scene{N}/sfx.json          (cue list -> synthesized effects, all made here; no third-party audio)
  score   a soft synthesized bed per mood segment (MOODS below), ducked under the voice
Then: concat the scene videos (copy), lay the scene mixes end to end (each cut to its video's exact length so A/V stays in
sync), EBU R128 gain to -14 LUFS + a 4x-oversampled peak limiter (TP <= -1 dB after AAC), mux. Prints the chapter times (scene starts in the film).

Synth helpers follow tools/anim2d/mix.py (tone / mallet / noise / sweep / put; same one-pole style), which is a
per-reel script and can't be imported; there was no shared loudness tool, so loudness uses ffmpeg ebur128 + alimiter.

  .venv/bin/python work/mix/build_film.py            # full build
  .venv/bin/python work/mix/build_film.py --scenes 6 --stems   # just scene 6's mix wav (+ stems) for listening
"""
import argparse, json, re, subprocess, sys, time, wave
from pathlib import Path
import numpy as np

POST = Path(__file__).resolve().parents[2]
WORK = POST / "work"; MIX = WORK / "mix"; RENDER = WORK / "render"; VOICES = WORK / "voices"
SR = 44100
FILM = json.loads((VOICES / "film.json").read_text())

# ---------------- score: mood segments per scene [t0, t1, mood] (scene-local seconds) ----------------
MOODS = {
    1: [(0, 17.5, "magic"), (17.5, 56.5, "village"), (56.5, 93.5, "tension"), (93.5, 1e9, "sad")],
    2: [(0, 27, "village"), (27, 55.5, "warm"), (55.5, 79, "magic"), (79, 1e9, "mystery")],
    3: [(0, 11.15, "magic"), (11.15, 22.1, "sad"), (22.1, 39, "mystery"), (39, 1e9, "magic")],
    4: [(0, 42.6, "village"), (42.6, 85.4, "tension"), (85.4, 1e9, "triumph")],
    5: [(0, 51.8, "heat"), (51.8, 76, "warm"), (76, 1e9, "triumph")],
    6: [(0, 41.1, "warm"), (41.1, 52.8, "silent"), (52.8, 67, "warm"), (67, 1e9, "triumph")],
    7: [(0, 5.3, "magic"), (5.3, 48.4, "tension"), (48.4, 58.2, "storm"), (58.2, 1e9, "magic")],
    8: [(0, 51.3, "storm"), (51.3, 72.4, "magic"), (72.4, 82.0, "nostalgia"), (82.0, 1e9, "sad")],
    9: [(0, 16.4, "magic"), (16.4, 41.7, "triumph"), (41.7, 97, "warm"), (97, 124, "resolution"), (124, 136.7, "warm"), (136.7, 1e9, "outro")],
}
# near-silent windows (owner): music off, effects almost off
QUIET = {6: [(41.1, 52.8)]}
MUSIC_DB = -9.0      # score level re the voice RMS (before ducking; ducking takes ~10 dB more under speech)
AMB_DB = -18.0        # ambience beds re the voice RMS
ONESHOT = 0.30        # one-shot peak re the voice peak (x level)
LEVEL = {"soft": .6, "mid": 1.0, "loud": 1.45}

rng = np.random.default_rng(15)

# ---------------- small DSP kit (tools/anim2d/mix.py style) ----------------
def T(d): return np.arange(int(max(d, 0) * SR)) / SR
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def noise(d): return rng.standard_normal(int(max(d, 0) * SR))
def env_ar(n, a, r):
    e = np.ones(n); a, r = min(int(a * SR), n // 2), min(int(r * SR), n // 2)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] *= np.linspace(1, 0, r)
    return e
def band(x, lo=0, hi=SR / 2, soft=.25):
    """FFT band-pass with soft edges (lo/hi in Hz)."""
    if len(x) < 16: return x
    n = 1 << int(np.ceil(np.log2(len(x) + 1))); X = np.fft.rfft(x, n); f = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(f)
    if lo > 0: g *= np.clip((f - lo * (1 - soft)) / (lo * soft * 2 + 1e-9), 0, 1)
    if hi < SR / 2: g *= np.clip((hi * (1 + soft) - f) / (hi * soft * 2 + 1e-9), 0, 1)
    return np.fft.irfft(X * g, n)[:len(x)]
def tone(f, d, decay=8, ph=0):
    x = T(d); return np.sin(2 * np.pi * f * x + ph) * np.exp(-x * decay)
def mallet(f, d=.6):
    x = T(d); return (np.sin(2 * np.pi * f * x) + .35 * np.sin(2 * np.pi * f * 4 * x) * np.exp(-x * 30)) * np.exp(-x * 7) * np.minimum(1, x / .003)
def bell(f, d=2.5, decay=2.2):
    x = T(d); out = np.zeros_like(x)
    for k, a in ((1, 1), (2.76, .5), (5.4, .25), (8.93, .12)): out += a * np.sin(2 * np.pi * f * k * x) * np.exp(-x * decay * k ** .5)
    return out * np.minimum(1, x / .002)
def sweep(f0, f1, d, decay=4):
    x = T(d); f = f0 + (f1 - f0) * x / max(d, 1e-6); return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-x * decay) * np.minimum(1, x / .01)
def norm(x, peak=1.0): m = np.abs(x).max() if len(x) else 0; return x / m * peak if m > 0 else x
def rmsn(x, r=1.0): m = np.sqrt(np.mean(x ** 2)) if len(x) else 0; return x / m * r if m > 0 else x
def put(dst, sig, at, gain=1.0):
    s = int(at * SR)
    if s >= len(dst) or len(sig) == 0: return
    if s < 0: sig = sig[-s:]; s = 0
    e = min(len(dst), s + len(sig)); dst[s:e] += sig[:e - s] * gain

# ---------------- effects (each returns a mono signal, ~unit peak) ----------------
def amb_crickets(d):
    out = band(noise(d), 200, 900) * .05; x = T(d)
    for c in range(3):
        f = 4200 + 600 * c; rate = 14 + 3 * c; gate = (np.sin(2 * np.pi * rate * x) > .2) * (np.sin(2 * np.pi * (.6 + .2 * c) * x + c) > -.2)
        out += np.sin(2 * np.pi * f * x) * gate * .25
    return out * env_ar(len(x), .8, 1.2)
def amb_cicadas(d):
    x = T(d); n = band(noise(d), 3800, 6500); am = .55 + .45 * np.sin(2 * np.pi * 38 * x)
    return n * am * (.7 + .3 * np.sin(2 * np.pi * .25 * x)) * env_ar(len(x), 1, 1.5) * .6
def amb_wind(d, strong=False):
    x = T(d); n = band(noise(d), 120 if strong else 200, 1400 if strong else 900)
    sw = .45 + .55 * (.5 + .5 * np.sin(2 * np.pi * (.11 if strong else .07) * x + rng.random() * 6)) ** 2
    if strong: sw *= .7 + .3 * np.sin(2 * np.pi * .37 * x)
    return n * sw * env_ar(len(x), 1.2, 1.5)
def amb_rain(d):
    x = T(d); out = band(noise(d), 1500, 9000) * .5 + band(noise(d), 150, 700) * .35
    for _ in range(int(d * 18)): put(out, sweep(2600 + rng.random() * 1800, 900, .03, 60), rng.random() * d, .4 * rng.random())
    return out * env_ar(len(x), 1.5, 2)
def amb_birds(d, n_per_s=1.2):
    out = band(noise(d), 300, 1500) * .04
    for _ in range(int(d * n_per_s) + 1):
        at = rng.random() * d; f = 2200 + rng.random() * 2600
        for j in range(rng.integers(2, 5)): put(out, sweep(f, f * (1.25 + .3 * rng.random()), .07, 25), at + j * .11, .5)
    return out * env_ar(len(out), .5, 1)
def amb_hum(d):
    x = T(d); return (np.sin(2 * np.pi * 110 * x) + .6 * np.sin(2 * np.pi * 165 * x) + .3 * np.sin(2 * np.pi * 220 * x)) * (.75 + .25 * np.sin(2 * np.pi * .5 * x)) * env_ar(len(x), 1, 1.5) * .4
def amb_cave(d): x = T(d); return (band(noise(d), 60, 300) * .7 + .2 * np.sin(2 * np.pi * 55 * x)) * env_ar(len(x), 1.5, 1.5)
def amb_water(d):
    x = T(d); n = band(noise(d), 300, 2500); am = .5 + .5 * np.abs(np.sin(2 * np.pi * .7 * x + rng.random()))
    out = n * am * .5
    for _ in range(int(d * 4)): put(out, sweep(500 + rng.random() * 600, 1300, .06, 30), rng.random() * d, .3)
    return out * env_ar(len(x), .4, .6)
def amb_crowd(d, cheer=False):
    out = np.zeros(int(d * SR))
    for _ in range(int(d * (14 if cheer else 6))):   # babble: short formant-filtered noise "syllables"
        L = .12 + rng.random() * .25; f1 = 300 + rng.random() * 500; s = band(noise(L), f1, f1 * 3.2) * np.hanning(int(L * SR))
        put(out, s, rng.random() * d, .6 + rng.random() * .6)
    if cheer: out += band(noise(d), 600, 3500) * .25 * (.6 + .4 * np.sin(2 * np.pi * .4 * T(d)))
    return out * env_ar(len(out), .6, 1.2)
def amb_rustle(d):
    x = T(d); n = band(noise(d), 1800, 7000); am = np.clip(band(noise(d), 0, 9), 0, None)
    return n * norm(am) * env_ar(len(x), .1, .2)
def s_thunder(d=4.5):
    out = band(noise(.25), 800, 6000) * np.exp(-T(.25) * 18) * .8
    r = band(noise(d), 25, 220) * np.exp(-T(d) * .9) * np.minimum(1, T(d) / .08)
    full = np.zeros(int(d * SR)); put(full, r, 0, 1.0); put(full, out, 0, 1.0); return norm(full)
def s_rumble(d=3.0): x = T(d); return norm(band(noise(d), 20, 120) * (.6 + .4 * np.sin(2 * np.pi * 7 * x) ** 2) * env_ar(len(x), .4, .9))
def s_swell(d=3.0, peak=True):
    x = T(d); out = np.zeros_like(x)
    for m in (62, 66, 69, 73, 76, 81): out += np.sin(2 * np.pi * midi(m) * x * (1 + .002 * np.sin(2 * np.pi * 5 * x))) * (.6 if m < 75 else .35)
    riser = band(noise(d), 2500, 9000) * (x / d) ** 2 * .5
    sh = (np.minimum(1, x / (d * .7)) ** 1.6) * np.minimum(1, (d - x) / (d * .3 if peak else d * .6) + .0)
    return norm((out * .5 + riser) * sh)
def s_chime(d=2.4, f=None):
    f = f or midi(rng.choice([79, 81, 83, 84, 86, 88])); out = bell(f, d)
    put(out, bell(f * 1.5, d - .12), .12, .5); return norm(out)
def s_clink(): return norm(bell(2600 + rng.random() * 600, .5, 9))
def s_whoosh(d=.8): x = T(d); n = noise(d); return norm(band(n, 300, 3000) * np.sin(np.pi * x / d) ** 2)
def s_chop(): return norm(add(tone(90, .25, 22) * 1.0, band(noise(.08), 1500, 6000) * np.exp(-T(.08) * 50) * .6, band(noise(.4), 2000, 7000) * np.exp(-T(.4) * 12) * .2))
def s_thud(): return norm(add(tone(60, .4, 12), band(noise(.15), 80, 600) * np.exp(-T(.15) * 25) * .6))
def s_crash():
    out = add(np.zeros(int(2.2 * SR)), band(noise(.9), 1500, 6000) * np.exp(-T(.9) * 3) * .35)
    for k in range(10): put(out, band(noise(.03), 2000, 7000), rng.random() * .7, .4)
    put(out, s_thud(), .75, 1.2); put(out, band(noise(1.4), 40, 300) * np.exp(-T(1.4) * 2.5), .75, .7); return norm(out)
def s_creak(d=1.2): x = T(d); f = 120 + 60 * np.sin(2 * np.pi * .8 * x); s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)); return norm(band(s, 300, 2500) * env_ar(len(x), .1, .3))
def s_metal(): return norm(add(bell(1900, .9, 5), band(noise(.06), 3000, 9000) * .4))
def s_footsteps(d=2.0, rate=2.2, heavy=False):
    out = np.zeros(int(d * SR))
    for k in range(int(d * rate)):
        st = add(tone(70 if heavy else 120, .09, 40) * (.9 if heavy else .4), band(noise(.06), 600 if heavy else 1500, 4000) * np.exp(-T(.06) * 60))
        put(out, st, k / rate + rng.random() * .03, .7 + .3 * rng.random())
    return norm(out)
def s_engine(d=3.0, rising=True):
    x = T(d); f = 38 + 14 * (x / d if rising else 1); s = np.sin(2 * np.pi * np.cumsum(f) / SR)
    s = np.sign(s) * np.abs(s) ** .5 + .4 * np.sin(2 * np.pi * np.cumsum(2 * f) / SR)
    return norm(band(s + band(noise(d), 100, 800) * .3, 30, 1200) * (np.minimum(1, x / d * 1.3) if rising else 1) * env_ar(len(x), .2, .5))
def s_skid(): x = T(1.1); return norm(add(band(noise(1.1), 400, 4000) * np.exp(-x * 2.2) * .8, sweep(1100, 700, 1.1, 2) * .25))
def s_drip(): return norm(add(sweep(1400, 500, .12, 25), sweep(900, 1800, .08, 40) * .3))
def s_plop(): return norm(add(sweep(500, 140, .2, 14), band(noise(.25), 200, 2500) * np.exp(-T(.25) * 16) * .6))
def s_splash(): return norm(add(band(noise(.6), 400, 6000) * np.exp(-T(.6) * 7), sweep(700, 200, .3, 10) * .4))
def s_pop(): return norm(sweep(380, 1100, .12, 18))
def s_click(): return norm(add(band(noise(.02), 1500, 6000) * np.exp(-T(.02) * 200), tone(2200, .03, 120) * .5))
def s_heartbeat(d=3.0):
    out = np.zeros(int(d * SR))
    for k in range(int(d / .95)):
        put(out, tone(55, .18, 18), k * .95, 1); put(out, tone(52, .18, 18), k * .95 + .17, .7)
    return norm(out)
def s_drone(d=4.0): x = T(d); return norm((np.sin(2 * np.pi * 73.4 * x) + .7 * np.sin(2 * np.pi * 77.8 * x) + .4 * np.sin(2 * np.pi * 146.8 * x)) * env_ar(len(x), 1.2, 1.2))
def s_boom(): return norm(add(sweep(80, 35, 1.5, 2.5), band(noise(1.0), 30, 200) * np.exp(-T(1.0) * 3) * .6))
def s_owl(): return norm(np.concatenate([tone(390, .35, 5), np.zeros(int(.15 * SR)), tone(370, .5, 4)]))
def s_cry(): x = T(.5); return norm(np.sin(2 * np.pi * np.cumsum(700 + 250 * np.sin(2 * np.pi * 9 * x)) / SR) * env_ar(len(x), .03, .25))
def s_wings(d=1.2): x = T(d); return norm(band(noise(d), 300, 3000) * (np.sin(2 * np.pi * 16 * x) > 0) * env_ar(len(x), .05, .4))
def add(*sigs):
    out = np.zeros(max(len(s) for s in sigs))
    for s in sigs: out[:len(s)] += s
    return out

# keyword rules: (regex, kind, generator(d) , default duration, is_ambience, base gain)
RULES = [
    (r"silence|drops out|cut the wind dead|near silence|fade to black|fade out", "skip", None, 0, False, 0),
    (r"thunder", "thunder", lambda d: s_thunder(max(d, 4.0)), 4.5, False, 1.3),
    (r"rumble|shaking|earth cracking|ground (?:open|shak)", "rumble", lambda d: s_rumble(max(d, 2.5)), 3.0, False, 1.0),
    (r"first raindrop|second drop|third drop|drop impact|big drop", "plop", lambda d: s_plop(), 0, False, 1.0),
    (r"\brain\b(?! stops)|downpour|rain on", "rain", amb_rain, 12, True, 1.4),
    (r"jeep engine|engines?\b", "engine", lambda d: s_engine(max(d, 2.0)), 3.5, False, .7),
    (r"brakes?|skid", "skid", lambda d: s_skid(), 0, False, .8),
    (r"door", "door", lambda d: s_thud(), 0, False, .6),
    (r"axe chop|\bchop\b", "chop", lambda d: s_chop(), 0, False, 1.0),
    (r"crash|tree .*fall", "crash", lambda d: s_crash(), 0, False, 1.0),
    (r"thud|thump|knees? (?:on|thud)|kneel|lands|sign post", "thud", lambda d: s_thud(), 0, False, .8),
    (r"shing|blade|clang|clatter|rattle|metal|axes?\b", "metal", lambda d: s_metal(), 0, False, .55),
    (r"creak", "creak", lambda d: s_creak(min(max(d, .8), 2.5)), 1.2, False, .45),
    (r"footstep|running|\bsteps?\b|boots|hooves|hopping|tiptoe|creeps", "steps", None, 2.0, False, .55),
    (r"cricket", "crickets", amb_crickets, 12, True, .9),
    (r"cicada|noon heat", "cicadas", amb_cicadas, 12, True, .7),
    (r"owl", "owl", lambda d: s_owl(), 0, False, .4),
    (r"deer cry|bleat", "cry", lambda d: s_cry(), 0, False, .45),
    (r"wing|flutter|flock", "wings", lambda d: s_wings(min(max(d, .8), 2.5)), 1.2, False, .45),
    (r"bird|rooster|chirp|sparrow|peacock|frog|morning", "birds", amb_birds, 10, True, .9),
    (r"howling wind|wind spiral|wind gust|gust|storm ambience|whirl|dust devil", "windS", lambda d: amb_wind(d, True), 6, True, 1.3),
    (r"wind|breeze", "wind", amb_wind, 10, True, 1.0),
    (r"cheer|crowd|chatting|murmur|villagers", "crowd", lambda d: amb_crowd(d, cheer=True), 5, True, .75),
    (r"laugh|giggle|chuckle", "laugh", lambda d: amb_crowd(min(max(d, 1.2), 3), cheer=False), 1.5, True, .8),
    (r"cave|room tone", "cave", amb_cave, 8, True, .9),
    (r"water|pour|lapping|slosh|gush|trickl|pond|filling", "water", amb_water, 3, True, 1.0),
    (r"splash|puddle", "splash", lambda d: s_splash(), 0, False, .7),
    (r"drip|sip|plink|plop", "drip", lambda d: s_drip(), 0, False, .6),
    (r"heartbeat", "heart", lambda d: s_heartbeat(max(d, 2.5)), 3.0, False, .7),
    (r"drone|suspense|ominous|tension|tense", "drone", lambda d: s_drone(max(d, 3)), 4.0, False, .55),
    (r"boom|low hit|\bhit\b", "boom", lambda d: s_boom(), 0, False, .8),
    (r"swell|shimmer|magic|magical|sting|glow|light|rising|riser|sunbeam", "swell", lambda d: s_swell(min(max(d, 2.0), 5.0)), 3.0, False, .6),
    (r"\bhum\b", "hum", amb_hum, 6, True, .8),
    (r"chime|ting|twinkle|sparkle|glint|jingle|ding|bell", "chime", lambda d: s_chime(), 0, False, .5),
    (r"clink|chain", "clink", lambda d: s_clink(), 0, False, .35),
    (r"whoosh|swish|wipe|page flip", "whoosh", lambda d: s_whoosh(min(max(d, .5), 2.0)), .8, False, .5),
    (r"rustle|leaves|leaf|cloth|mat\b|fanning|feather|thorns", "rustle", lambda d: amb_rustle(min(max(d, .6), 8)), 1.2, False, .45),
    (r"pop|boing|click|tap|gulp|flop|pat\b|knot|snap|crack|unscrew|cap", "pop", None, 0, False, .4),   # click or pop: chosen in build_sfx
]
def classify(text):
    text = text.lower(); out = []
    for part in re.split(r"\s\+\s|;\s|,\s(?=[a-z])", text):
        if re.search(r"\b(stops?|settles|ends)\b", part) and not re.search(r"skid|brake", part): continue
        for rx, kind, gen, dd, amb, g in RULES:
            if re.search(rx, part):
                if kind != "skip": out.append((kind, gen, dd, amb, g, part))
                break
    return out
def cue_span(c):
    t = float(c["t"]); txt = c.get("effect", "")
    if c.get("dur"): return t, float(c["dur"])
    m = re.search(r"\((?:[^()]*?)(\d+(?:\.\d+)?)\s*[-–]\s*(\d+(?:\.\d+)?)\)", txt)
    if m and float(m.group(2)) > float(m.group(1)) >= t - .5: return float(m.group(1)), float(m.group(2)) - float(m.group(1))
    m = re.search(r"until (\d+(?:\.\d+)?)", txt)
    if m and float(m.group(1)) > t: return t, float(m.group(1)) - t
    return t, 0.0

def build_sfx(n, dur, vref_rms, vref_peak):
    data = json.loads((POST / "2d" / f"scene{n}" / "sfx.json").read_text())
    amb, one = np.zeros((2, int(dur * SR))), np.zeros((2, int(dur * SR)))
    log = []; BED = re.compile(r"ambience|ambient|room tone")
    beds = sorted(float(c["t"]) for c in data["cues"] if BED.search(c.get("effect", "")))
    for c in data["cues"]:
        t0, d = cue_span(c); lvl = LEVEL.get(c.get("level", "mid"), 1.0)
        if d <= 0 and BED.search(c.get("effect", "")):   # a bed with no end: runs until the next bed starts (or the scene ends)
            nxt = [b for b in beds if b > t0 + .5]; d = (nxt[0] + 1.0 if nxt else dur) - t0
        for kind, gen, dd, is_amb, g, part in classify(c.get("effect", "")):
            dur_k = d if d > 0 else dd
            dur_k = min(dur_k, dur - t0 + .2)
            if dur_k <= 0 and is_amb: continue
            if kind == "steps": sig = s_footsteps(max(dur_k, .8), rate=3.4 if re.search("run|jump", part) else 2.0, heavy=bool(re.search("heavy|boots|slow", part)))
            elif kind == "pop": sig = s_click() if re.search("click|tap|snap|crack|cap", part) else s_pop()
            else: sig = gen(max(dur_k, .3))
            pan = rng.uniform(-.35, .35); L, R = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
            if is_amb:
                sig = rmsn(sig, vref_rms * 10 ** (AMB_DB / 20) * g * lvl); tgt = amb
                if len(sig) > SR: sig[-int(.8 * SR):] *= np.linspace(1, 0, int(.8 * SR))
            else:
                sig = norm(sig, vref_peak * ONESHOT * g * lvl); tgt = one
            put(tgt[0], sig, t0, L * 1.41); put(tgt[1], sig, t0, R * 1.41)
            log.append((round(t0, 2), kind, round(dur_k, 1)))
    return amb, one, log

# ---------------- score ----------------
PROG = {  # chord roots/notes (midi) per mood; one chord per bar
    "village": ([[62, 66, 69], [67, 71, 74], [59, 62, 66], [57, 61, 64]], 4.0, "pluck"),
    "warm": ([[62, 66, 69, 73], [67, 71, 74], [64, 67, 71], [57, 61, 64, 67]], 4.0, "pluck_slow"),
    "triumph": ([[62, 66, 69], [67, 71, 74], [69, 73, 76], [62, 66, 69, 74]], 3.0, "pluck_bright"),
    "resolution": ([[62, 66, 69, 73], [67, 71, 74, 78], [59, 62, 66, 69], [64, 67, 71, 74], [57, 61, 64, 67]], 4.0, "pluck_slow"),
    "outro": ([[62, 66, 69, 73], [67, 71, 74, 78], [59, 62, 66, 69], [57, 61, 64, 67]], 3.5, "pluck"),
    "magic": ([[65, 69, 72, 76], [67, 71, 74, 79], [64, 69, 71, 76], [62, 65, 69, 72]], 5.0, "bells"),
    "mystery": ([[57, 60, 64], [58, 62, 65], [57, 60, 64], [55, 59, 62]], 5.0, "bells_sparse"),
    "nostalgia": ([[62, 66, 69], [59, 62, 66], [67, 71, 74], [57, 61, 64]], 4.0, "musicbox"),
    "sad": ([[59, 62, 66], [55, 59, 62], [62, 66, 69], [57, 61, 64]], 5.0, "none"),
    "heat": ([[57, 60, 64], [55, 59, 62]], 6.0, "sparse"),
    "tension": ([[50, 53, 57], [50, 52, 57]], 6.0, "pulse"),
    "storm": ([[45, 48, 52], [45, 46, 52]], 6.0, "pulse_low"),
}
def pad(notes, d, bright=.3):
    x = T(d); out = np.zeros((2, len(x)))
    for m in notes:
        for ch, det in ((0, -.0025), (1, .0025)):
            f = midi(m) * (1 + det); out[ch] += np.sin(2 * np.pi * f * x) + bright * .35 * np.sin(2 * np.pi * 2 * f * x)
    e = env_ar(len(x), min(1.2, d * .35), min(1.4, d * .4)); return out * e / max(1, len(notes))
def score_segment(mood, d, t_abs0):
    out = np.zeros((2, int(d * SR) + 1))
    if mood == "silent" or d <= 0: return out
    chords, bar, style = PROG[mood]; k = 0; t = 0.0
    while t < d:
        ch = chords[k % len(chords)]; L = min(bar * 1.25, d - t + .5)
        p = pad(ch if mood not in ("tension", "storm") else [n - 12 for n in ch], L, .4 if mood in ("triumph", "outro") else .2)
        put(out[0], p[0], t); put(out[1], p[1], t)
        if style.startswith("pluck"):
            step = {"pluck": .5, "pluck_slow": .75, "pluck_bright": .375}[style]
            j = 0
            while j * step < bar and t + j * step < d:
                m = ch[[0, 1, 2, 1, 2, 1][j % 6] % len(ch)] + 12; s = mallet(midi(m), .8) * (.32 if j % 2 == 0 else .22)
                pn = .5 + .3 * np.sin(j); put(out[0], s, t + j * step, 1 - pn * .6); put(out[1], s, t + j * step, .4 + pn * .6); j += 1
        elif style.startswith("bells"):
            for j in range(3 if style == "bells" else 1):
                at = t + j * bar / 3 + rng.random() * .3
                if at < d:
                    s = bell(midi(ch[rng.integers(len(ch))] + 24), 3.0, 1.6) * .18; put(out[0], s, at, .8); put(out[1], s, at + .012, .8)
        elif style == "musicbox":
            for j in range(8):
                if t + j * bar / 8 < d: s = bell(midi(ch[j % len(ch)] + 24), 1.6, 3.5) * .16; put(out[0], s, t + j * bar / 8); put(out[1], s, t + j * bar / 8 + .01)
        elif style == "sparse":
            s = mallet(midi(ch[0] + 12), 1.2) * .25; put(out[0], s, t + bar * .5); put(out[1], s, t + bar * .5)
        elif style.startswith("pulse"):
            per = 1.2 if style == "pulse" else .9
            j = 0
            while j * per < bar and t + j * per < d:
                s = tone(41 if style == "pulse" else 36, .5, 7) * .9; put(out[0], s, t + j * per); put(out[1], s, t + j * per); j += 1
            sh = band(noise(min(bar, d - t + .1)), 2500, 7000) * .03 * env_ar(int(min(bar, d - t + .1) * SR), 1.5, 1.5); put(out[0], sh, t); put(out[1], sh, t)
        t += bar; k += 1
    return out
def build_score(n, dur):
    out = np.zeros((2, int(dur * SR))); XF = 1.5
    for t0, t1, mood in MOODS[n]:
        t1 = min(t1, dur)
        if t1 <= t0: continue
        a, b = max(0, t0 - XF / 2), min(dur, t1 + XF / 2); seg = score_segment(mood, b - a, a)
        L = seg.shape[1]; e = np.ones(L); xi = int(XF * SR)
        if a > 0: e[:xi] = np.linspace(0, 1, min(xi, L))[:min(xi, L)] if L >= xi else np.linspace(0, 1, L)
        if b < dur: e[-xi:] *= np.linspace(1, 0, xi) if L >= xi else 1
        put(out[0], seg[0] * e, a); put(out[1], seg[1] * e, a)
    return out

# ---------------- ducking ----------------
def voice_env(v):
    w = int(.02 * SR); n = len(v) // w + 1; p = np.zeros(n * w); p[:len(v)] = v ** 2
    r = np.sqrt(p.reshape(n, w).mean(1)); thr = max(1e-4, np.percentile(r[r > 1e-4], 40) if np.any(r > 1e-4) else 1e-4) * .5
    act = (r > thr).astype(float); out = np.zeros(n); a = 0.0
    for i, x in enumerate(act): a += (x - a) * (.5 if x > a else .06); out[i] = a   # fast attack, ~300 ms release
    return np.repeat(out, w)[:len(v)]

def read_wav(p):
    with wave.open(str(p)) as w:
        ch, sr, sw, nf = w.getnchannels(), w.getframerate(), w.getsampwidth(), w.getnframes(); a = np.frombuffer(w.readframes(nf), dtype=np.int16) / 32768
    a = a.reshape(-1, ch).mean(1) if ch > 1 else a
    if sr != SR: a = np.interp(np.arange(int(len(a) * SR / sr)) * sr / SR, np.arange(len(a)), a)
    return a
def write_wav(p, st):
    pcm = (np.clip(st, -1, 1).T * 32767).astype(np.int16)
    with wave.open(str(p), "wb") as w: w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
def video_info(p):
    r = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-count_packets", "-show_entries", "stream=nb_read_packets,r_frame_rate,width,height",
                        "-of", "json", str(p)], capture_output=True, text=True, check=True)
    s = json.loads(r.stdout)["streams"][0]; num, den = map(int, s["r_frame_rate"].split("/")); return int(s["nb_read_packets"]), num / den, s["width"], s["height"]

def mix_scene(sc, stems=False):
    n, dur_plan = sc["scene"], sc["dur"]
    frames, fps, w, h = video_info(RENDER / f"scene{n}.mp4"); dur = frames / fps
    assert (w, h) == (1920, 1080) and abs(fps - 30) < 1e-6, f"scene {n}: {w}x{h} @ {fps}"
    v = read_wav(VOICES / f"scene{n}" / "vo_mix.wav"); N = int(round(dur * SR))
    voice = np.zeros(N); voice[:min(N, len(v))] = v[:N]
    act = voice_env(voice); vr = np.sqrt(np.mean(voice[act > .5] ** 2)) if np.any(act > .5) else .05; vp = np.percentile(np.abs(voice), 99.9)
    amb, one, log = build_sfx(n, dur, vr, vp)
    mus = build_score(n, dur); mus *= vr * 10 ** (MUSIC_DB / 20) / max(1e-9, np.sqrt(np.mean(mus ** 2)))
    q = np.ones(N)
    for a, b in QUIET.get(n, []):
        i0, i1 = int(a * SR), int(b * SR); q[i0:i1] = 0; r = int(.6 * SR)
        q[max(0, i0 - r):i0] = np.linspace(1, 0, i0 - max(0, i0 - r)); q[i1:i1 + r] = np.linspace(0, 1, len(q[i1:i1 + r]))
    duck_m, duck_a = 1 - .68 * act, 1 - .45 * act
    duck_o = 1 - .4 * act
    mix = np.stack([voice, voice]) + mus * duck_m * q + amb * duck_a * (.06 + .94 * q) + one * duck_o * (.35 + .65 * q)
    if stems:
        for nm, s in (("voice", np.stack([voice, voice])), ("music", mus * duck_m * q), ("amb", amb * duck_a), ("oneshot", one * duck_o)): write_wav(MIX / f"scene{n}_{nm}.wav", s)
    return mix, dur, frames, log, vr

def run(cmd, **kw): return subprocess.run(cmd, check=True, **kw)
def ebur(p):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", str(p), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    summ = r.stderr[r.stderr.rfind("Summary:"):]
    return float(re.search(r"I:\s+(-?[\d.]+) LUFS", summ).group(1)), float(re.search(r"Peak:\s+(-?[\d.]+) dBFS", summ).group(1))

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--scenes", default="1-9"); ap.add_argument("--stems", action="store_true"); ap.add_argument("--no-video", action="store_true")
    a = ap.parse_args()
    lo, _, hi = a.scenes.partition("-"); want = list(range(int(lo), int(hi or lo) + 1))
    MIX.mkdir(exist_ok=True); t0 = time.time()
    scenes = [s for s in FILM["scenes"] if s["scene"] in want]; parts, chapters, start = [], [], 0.0
    for sc in scenes:
        ts = time.time(); mix, dur, frames, log, vr = mix_scene(sc, a.stems); parts.append(mix)
        write_wav(MIX / f"scene{sc['scene']}_mix.wav", mix * .5)   # listening copy (pre-loudness, -6 dB headroom)
        chapters.append((start, sc["scene"], sc["title"])); start += dur
        print(f"scene {sc['scene']}: {frames} frames = {dur:.3f}s (plan {sc['dur']}), {len(log)} sfx, voice RMS {20*np.log10(vr):.1f} dBFS, {time.time()-ts:.1f}s", flush=True)
    film = np.concatenate(parts, axis=1)
    pk = np.abs(film).max(); film *= .5 / pk                       # headroom before loudnorm
    raw = MIX / "film_premaster.wav"; write_wav(raw, film)
    if len(want) < 9 or a.no_video: print("mix wavs in", MIX); return
    # loudness: measure (EBU R128), gain to -14 LUFS, then a peak limiter at 4x rate (true-peak safe) -> 48 kHz master; one
    # correction pass if the limiter moved the integrated level. (loudnorm alone falls back to its dynamic mode here: speech
    # has ~16 dB peak-to-loudness, so -14 LUFS needs ~3 dB of peak limiting.)
    master = MIX / "film_master.wav"; I0 = ebur(raw)[0]; gain = -14.0 - I0
    for _ in range(2):
        run(["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", "-i", str(raw), "-af",
             f"volume={gain:.2f}dB,aresample=192000,alimiter=limit=0.83:attack=4:release=60:level=disabled,aresample=48000", "-c:a", "pcm_s16le", str(master)])
        I1, _ = ebur(master)
        if abs(I1 + 14) <= .25: break
        gain += -14 - I1
    # video: each scene's video stream only (so the concat uses the true video length), then join without re-encoding
    lst = MIX / "videos.txt"; lines = []
    for sc in scenes:
        vo = MIX / f"v{sc['scene']}.mp4"; run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(RENDER / f"scene{sc['scene']}.mp4"), "-map", "0:v", "-c", "copy", str(vo)])
        lines.append(f"file '{vo}'")
    lst.write_text("\n".join(lines) + "\n")
    out = RENDER / "film.mp4"
    run(["ffmpeg", "-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", str(lst), "-i", str(master), "-map", "0:v", "-map", "1:a",
         "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", str(out)])
    I, TP = ebur(out)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(out)], capture_output=True, text=True).stdout)
    print(f"\nwrote {out}  {dur:.2f}s ({int(dur//60)}:{dur%60:05.2f})  loudness {I:.1f} LUFS, true peak {TP:.1f} dBFS")
    print("chapters:")
    for s, n, title in chapters: print(f"  {int(s//60)}:{int(s%60):02d}  ({s:7.2f}s)  {n}. {title}")
    (MIX / "chapters.json").write_text(json.dumps([{"start": round(s, 3), "scene": n, "title": t} for s, n, t in chapters], ensure_ascii=False, indent=1))
    print(f"build time {time.time()-t0:.0f}s")

if __name__ == "__main__":
    main()
