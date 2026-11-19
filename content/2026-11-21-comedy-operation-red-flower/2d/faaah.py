"""The series' FAAAH (owner: "FAAAH sound for crazy moments") -- OUR OWN sound, never a meme clip -- plus the 3 extra chorus
voices for L16, in THREE Gemini TTS requests (two speakers each, none of them a cast voice):
  0  Alnilam    'FAAAAH!' x2   + Umbriel        'Merry Christmas Sir!'
  1  Rasalgethi 'FAAAAH!' x2   + Callirrhoe     'Merry Christmas Sir!'
  2  Gacrux     'FAAAAH!' x2   + Zubenelgenubi  'Merry Christmas Sir!'
Each answer is cut at its silences into 3 takes -> faaah/take_<K>_<J>.wav (24 kHz). `python faaah.py` fetches what's
missing and splits; `python faaah.py --split` only re-splits; `python faaah.py --build` layers the chosen takes:
  3 FAAAH takes (one per voice) with 0 / 25 / 50 ms offsets and -3 / 0 / +2 semitones, a short hall reverb (~1.2 s,
  20% wet), a 0.4 s reverse-cymbal whoosh ending on the onset and a sub boom (sine 70->40 Hz, 0.6 s) on the onset,
  a phone-band body (soft saturation), 1.2 s total, peak -1 dBFS -> tools/anim2d/sfx/faaah.wav (44.1 kHz stereo) and
  faaah/faaah.json (the onset inside the file, the takes used); a synthesized 'F' fricative (90 ms) sharpens the onset. Ep 2 reuses the same file (series signature)."""
import base64, json, os, sys, time, wave
import numpy as np
sys.path.insert(0, "/home/user/content-arena/src")
from content_arena import scenevoice

PAIRS = [("Alnilam", "Umbriel"), ("Rasalgethi", "Callirrhoe"), ("Gacrux", "Zubenelgenubi")]
NAMES = ("Ravi", "Kiran")
SR = 24000
OUT = "/home/user/content-arena/tools/anim2d/sfx/faaah.wav"

def body(k):
    # (19 Nov: the first wording, 'Perform these three short vocal lines' + 'FAAAAAH!', came back finishReason OTHER with no
    #  audio; the crowd.py framing + 'Faaaaaah!' works)
    a, b = PAIRS[k]
    script = f"{NAMES[0]}: Faaaaaah!\n{NAMES[1]}: Merry Christmas Sir!\n{NAMES[0]}: Faaaaaaah!"
    notes = (f"1. {NAMES[0]}: a huge, long, dramatic, despairing shout, like a movie-trailer scream, about one second\n"
             f"2. {NAMES[1]}: a loud, cheerful, sing-song office-party shout\n3. {NAMES[0]}: the same huge despairing shout again, even bigger")
    prompt = ("Two office colleagues react at a comedy party, one after the other. These are short vocal reactions (no words "
              "beyond what is written), performed big and realistic. Leave about TWO seconds of complete silence between lines. "
              "Director's notes, one per line, NEVER read them aloud:\n" + notes + "\n\nScript:\n" + script)
    return {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"multiSpeakerVoiceConfig": {"speakerVoiceConfigs": [
                {"speaker": NAMES[0], "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": a}}},
                {"speaker": NAMES[1], "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": b}}}]}}}}

def wr(p, x, sr=SR, ch=1):
    with wave.open(p, "wb") as w: w.setnchannels(ch); w.setsampwidth(2); w.setframerate(sr); w.writeframes(np.clip(x, -32767, 32767).astype(np.int16).tobytes())

def fetch():
    os.makedirs("faaah", exist_ok=True)
    for k in range(len(PAIRS)):
        p = f"faaah/raw_{k}.pcm"
        if os.path.exists(p): continue
        print("request", k, PAIRS[k], flush=True)
        res = scenevoice._call(body(k))
        if "content" not in res["candidates"][0]: print("  no audio:", res["candidates"][0].get("finishReason")); continue
        open(p, "wb").write(base64.b64decode(res["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]))
        json.dump({"voices": PAIRS[k], "model_order": scenevoice.MODELS}, open(f"faaah/raw_{k}.json", "w"))
        if k < len(PAIRS) - 1: time.sleep(21)

def split(min_gap=0.45, floor=0.03):
    info = {}
    for k in range(len(PAIRS)):
        a = np.frombuffer(open(f"faaah/raw_{k}.pcm", "rb").read(), dtype=np.int16)
        hop = SR // 100; fr = len(a) // hop
        rms = np.sqrt(np.mean(a[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); loud = rms > floor * rms.max()
        segs, on, low = [], None, 0
        for f in range(fr):
            if loud[f]:
                if on is None: on = f
                low = 0
            elif on is not None:
                low += 1
                if low >= int(min_gap * 100): segs.append((on, f - low + 1)); on = None
        if on is not None: segs.append((on, fr))
        for j, (s, e) in enumerate(segs):
            s, e = max(0, s - 2), min(fr, e + 5)
            nm = f"faaah/take_{k}_{j}.wav"; wr(nm, a[s * hop:e * hop]); info[nm] = round((e - s) / 100, 2)
        print(k, PAIRS[k], [info[f"faaah/take_{k}_{j}.wav"] for j in range(len(segs))], flush=True)
    json.dump(info, open("faaah/split.json", "w"), indent=1)

# ---------------- the build ----------------
FS = 44100
def rd(p):
    with wave.open(p) as w: a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768; sr = w.getframerate()
    return np.interp(np.arange(0, len(a), sr / FS), np.arange(len(a)), a) if sr != FS else a
def fft_filter(x, lo=None, hi=None, order=2):
    N = len(x); X = np.fft.rfft(x, 2 * N); f = np.fft.rfftfreq(2 * N, 1 / FS); g = np.ones_like(f)
    if hi: g *= 1 / np.sqrt(1 + (f / hi) ** (2 * order))
    if lo: g *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** (2 * order))
    return np.fft.irfft(X * g)[:N]
def pitch(x, semis): r = 2 ** (semis / 12); return np.interp(np.arange(0, len(x) - 1, r), np.arange(len(x)), x)
def trim(a, th=0.04):
    m = np.abs(a).max() or 1; v = np.flatnonzero(np.abs(a) > th * m); return a[v[0]:v[-1] + 1] if len(v) else a
def build(choice):
    rng = np.random.default_rng(7)
    PRE = 0.40; TOT = 1.20 + PRE                     # the whoosh runs 0.4 s BEFORE the onset; the shout + tail = 1.2 s
    n = int(TOT * FS); o = np.zeros((n, 2)); on = int(PRE * FS)
    # 1) three takes, offsets 0/25/50 ms, pitch -3/0/+2 st, spread L/C/R
    for (k, j), off, st, pan, g in zip(choice, (0.0, 0.025, 0.050), (-3, 0, 2), (-0.45, 0.0, 0.45), (1.0, 0.9, 0.8)):
        a = trim(rd(f"faaah/take_{k}_{j}.wav")); a = pitch(a, st); a = a / (np.abs(a).max() or 1)
        L = min(len(a), n - on - int(off * FS) - int(0.25 * FS))                  # keep 0.25 s for the reverb tail
        e = np.ones(L); r_ = int(0.18 * FS); e[-r_:] = np.linspace(1, 0, r_) ** 1.5; e[:int(0.004 * FS)] = np.linspace(0, 1, int(0.004 * FS))
        s = on + int(off * FS); seg = a[:L] * e * g
        o[s:s + L, 0] += seg * np.sqrt((1 - pan) / 2) * 1.414; o[s:s + L, 1] += seg * np.sqrt((1 + pan) / 2) * 1.414
    # 1b) a crisp synthesized 'F' fricative (2.5-7 kHz noise, 90 ms) on the onset, so every layer reads as 'FAAAH' (the
    #     listener heard 'Faaaah' only in Rasalgethi's take; Alnilam's and Gacrux's start on 'Aaaah'/'Haaaa')
    d = 0.09; x = np.arange(int(d * FS)) / FS; fr_ = fft_filter(rng.standard_normal(len(x)), 2500, 7000) * np.sin(np.pi * x / d) ** 0.7
    fr_ = fr_ / (np.abs(fr_).max() or 1) * 0.5; s0 = on - int(0.06 * FS); o[s0:s0 + len(x), 0] += fr_; o[s0:s0 + len(x), 1] += fr_
    dry = o.copy()
    # 2) hall reverb ~1.2 s, 20% wet
    t = np.arange(int(1.2 * FS)) / FS
    for c in range(2):
        ir = np.random.default_rng(11 + c).standard_normal(len(t)) * np.exp(-6.9 * t / 1.2); ir = fft_filter(ir, 200, 5000); ir[: int(0.02 * FS)] = 0; ir /= np.abs(ir).max()
        w = np.fft.irfft(np.fft.rfft(dry[:, c], 2 * n) * np.fft.rfft(ir, 2 * n))[:n]; w *= (np.abs(dry[:, c]).max() / (np.abs(w).max() or 1))
        o[:, c] = dry[:, c] * 0.8 + w * 0.2 * 1.6
    # 3) phone-band body: soft saturation of the 300 Hz-4 kHz band (a phone speaker plays this) mixed under
    body_ = np.tanh(3 * fft_filter(dry.mean(1), 300, 4000) / (np.abs(dry).max() or 1)) * 0.35
    o += np.stack([body_, body_], 1) * (np.abs(dry).max() or 1)
    # 4) a 0.4 s reverse cymbal whoosh that ends on the onset
    d = PRE; x = np.arange(int(d * FS)) / FS
    cym = fft_filter(rng.standard_normal(len(x)), 3500, None) * np.exp(-(d - x) * 6) * (x / d) ** 2      # reversed crash: swells into the onset
    sw = fft_filter(rng.standard_normal(len(x)), 500, 3000) * (x / d) ** 3 * 0.5
    rw = (cym + sw); rw = rw / (np.abs(rw).max() or 1) * 0.55
    o[on - len(x):on, 0] += rw; o[on - len(x):on, 1] += np.roll(rw, 40)
    # 5) sub boom on the onset: sine 70 -> 40 Hz, 0.6 s (+ a little 2nd harmonic for phones)
    d = 0.6; x = np.arange(int(d * FS)) / FS; f = 40 + 30 * np.exp(-x * 5); ph = 2 * np.pi * np.cumsum(f) / FS
    boom = (np.sin(ph) + 0.35 * np.sin(2 * ph)) * np.exp(-x * 4.5) * np.minimum(1, x / 0.004) * 0.85
    o[on:on + len(x)] += boom[:, None]
    # end fade + peak -1 dBFS
    fe = int(0.05 * FS); o[-fe:] *= np.linspace(1, 0, fe)[:, None]
    o = o / np.abs(o).max() * 10 ** (-1 / 20)
    os.makedirs(os.path.dirname(OUT), exist_ok=True); wr(OUT, o.reshape(-1) * 32767, FS, 2)
    json.dump({"file": OUT, "onset_s": PRE, "dur_s": round(TOT, 3), "takes": [f"faaah/take_{k}_{j}.wav" for k, j in choice],
               "voices": [PAIRS[k][0] for k, j in choice], "build": "offsets 0/25/50 ms, pitch -3/0/+2 st, hall 1.2 s 20% wet, reverse cymbal 0.4 s, sub 70->40 Hz 0.6 s, phone body"},
              open("faaah/faaah.json", "w"), indent=1)
    print("wrote", OUT, round(TOT, 2), "s (onset at", PRE, "s)")

if __name__ == "__main__":
    if "--build" in sys.argv:
        ch = json.load(open("faaah/choice.json")); build([tuple(x) for x in ch["faaah"]])
    else:
        if "--split" not in sys.argv: fetch()
        split()
