"""Ep 3: insert a silent beat into a take so a max hit sits in a voice gap instead of on top of a word (Ep 2 method;
silence only, the speech itself is untouched and plays at plain x1.15):
- L2 (Ramesh, brief L3): +0.50 s after 'నా ప్రమోషన్ గురించి…' for the DHOOM (punch-in on ప్రమోషన్), then 'మాట్లాడాలి.'
Each cut is at the middle of the raw pause nearest AT seconds; writes vo/L{i}_raw.wav from vo/L{i}_pre.wav (kept)."""
import os, shutil, wave, numpy as np
INS = [(2, 1.85, 0.50)]      # (line, raw seconds, seconds added after the speed-up)
for I, AT, ADD in INS:
    src = f"vo/L{I}_pre.wav"
    if not os.path.exists(src): shutil.copy(f"vo/L{I}_raw.wav", src)
    with wave.open(src) as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); sr = w.getframerate()
    hop = sr // 100; fr = len(x) // hop; rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); quiet = rms < 0.03 * rms.max()
    k = int(AT * 100); best = min((f for f in range(fr) if quiet[f]), key=lambda f: abs(f - k)); c = best * hop
    y = np.concatenate([x[:c], np.zeros(int(ADD * 1.15 * sr), np.int16), x[c:]])
    with wave.open(f"vo/L{I}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
    print(f"L{I}: cut at", best / 100, "s raw; new", round(len(y) / sr, 2))
