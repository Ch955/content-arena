"""Extra ElevenLabs takes for slow lines: python takes.py i "say text" [n]. -> vo_takes/L{i}_k{n}.wav (+ tightened copy + Sarvam STT sim)."""
import os, sys, wave, re, difflib, subprocess, requests
import numpy as np
sys.path.insert(0, "/home/user/content-arena/src")
from content_arena import elevenvoice
ns = {"COUNTDOWN": 5.0}; src = open("voices.py").read(); a = src.index("LINES = ["); exec(src[a:src.index("]\n", a) + 2], ns)
PROFILE = {"nikhil": "andhra-male-young", "ananya": "andhra-female-young", "ramulu": "telangana-male-middle"}
i, say = int(sys.argv[1]), sys.argv[2]; k = sys.argv[3] if len(sys.argv) > 3 else "0"
who, text, gap, act, _ = ns["LINES"][i]
os.makedirs("vo_takes", exist_ok=True)
raw = f"vo_takes/L{i}_k{k}_raw.wav"
elevenvoice.voice_line(say, who, act, raw, profile=PROFILE.get(who))
open(f"vo_takes/L{i}_k{k}_say.txt", "w").write(say)
# tighten (same rule as tighten.py: silent runs > .22 s -> .14 s)
with wave.open(raw) as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); sr = w.getframerate()
hop = sr // 100; fr = len(x) // hop
rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); loud = rms > 0.03 * rms.max()
v = np.flatnonzero(loud); f0, f1 = v[0], v[-1] + 1; keep = np.zeros(fr, bool); keep[f0:f1] = True; j0 = f0
while j0 < f1:
    if not loud[j0]:
        j = j0
        while j < f1 and not loud[j]: j += 1
        if (j - j0) / 100 > 0.22: keep[j0:j] = False; keep[j0:j0 + 7] = True; keep[j - 7:j] = True
        j0 = j
    else: j0 += 1
y = np.concatenate([x[f * hop:(f + 1) * hop] for f in np.flatnonzero(keep)])
tw = f"vo_takes/L{i}_k{k}_tight.wav"
with wave.open(tw, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
r = requests.post("https://api.sarvam.ai/speech-to-text", timeout=120, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                  files={"file": ("a.wav", open(tw, "rb"), "audio/wav")}, data={"model": "saarika:v2.5", "language_code": "te-IN"})
tr = r.json().get("transcript", "") if r.status_code == 200 else f"STT {r.status_code}"
tel = lambda s: re.sub(r"[^ఀ-౿]", "", s)
sim = difflib.SequenceMatcher(None, tel(tr), tel(say)).ratio()
print(f"L{i} k{k}: raw {len(x)/sr:.2f} tight {len(y)/sr:.2f} sim {sim:.2f} | {tr}", flush=True)
