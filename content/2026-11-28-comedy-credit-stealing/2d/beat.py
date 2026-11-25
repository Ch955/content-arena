"""Insert silent beats into takes (run after tighten.py) so a max hit sits in a voice gap instead of on top of a word:
- L0 (manager, brief L1): +0.22 s before 'కానీ…' for the RECORD SCRATCH (the jingle dies dead);
- L12 (Ramesh, brief L13): +0.12 s before 'పరిగెత్తించినందుకు!' for the STAMP slam;
- L13 (manager, brief L14): +0.14 s before 'double' for the DHOOM crack.
Each cut is at the middle of the raw pause nearest AT seconds; writes vo/L{i}_raw.wav from vo/L{i}_tight.wav (kept).
(If tighten.py is re-run, delete vo/L*_tight.wav first.)"""
import os, shutil, wave, numpy as np
INS = [(0, 3.51, 0.22), (12, 2.08, 0.12), (13, 2.38, 0.14)]      # (line, raw seconds in the tightened take, seconds added after the speed-up)
FIT = {0: 1.12, 12: 1.06, 13: 1.10}
for I, AT, ADD in INS:
    src = f"vo/L{I}_tight.wav"
    if not os.path.exists(src): shutil.copy(f"vo/L{I}_raw.wav", src)
    with wave.open(src) as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); sr = w.getframerate()
    hop = sr // 100; fr = len(x) // hop; rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); quiet = rms < 0.03 * rms.max()
    k = int(AT * 100); best = min((f for f in range(fr) if quiet[f]), key=lambda f: abs(f - k)); c = best * hop
    y = np.concatenate([x[:c], np.zeros(int(ADD * 1.15 * FIT.get(I, 1) * sr), np.int16), x[c:]])
    with wave.open(f"vo/L{I}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
    print(f"L{I}: cut at", best / 100, "s raw; new", round(len(y) / sr, 2))
