"""Insert silent beats into takes (run after tighten.py), so a max hit sits in a voice gap instead of on top of a word:
- L7 (Ramesh's outburst, brief L8): +0.36 s between 'ఒరేయ్…' and 'నీ… దుంప… తెగ!' for the RECORD SCRATCH (the FREEZE starts on it);
- L3 (Gopi, brief L4): +0.15 s before 'secondary' so the STAMP slams in the gap, not on the word (QC, 19 Nov).
Each cut is at the middle of the raw pause nearest AT seconds; writes vo/L{i}_raw.wav from vo/L{i}_tight.wav (kept)."""
import os, shutil, wave, numpy as np
INS = [(7, 0.52, 0.36), (3, 3.07, 0.15)]      # (line, raw seconds in the tightened take, seconds added after the x1.15 tempo)
for I, AT, ADD in INS:
    src = f"vo/L{I}_tight.wav"
    if not os.path.exists(src): shutil.copy(f"vo/L{I}_raw.wav", src)
    with wave.open(src) as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); sr = w.getframerate()
    hop = sr // 100; fr = len(x) // hop; rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); quiet = rms < 0.03 * rms.max()
    k = int(AT * 100); best = min((f for f in range(fr) if quiet[f]), key=lambda f: abs(f - k)); c = best * hop
    y = np.concatenate([x[:c], np.zeros(int(ADD * 1.15 * sr), np.int16), x[c:]])
    with wave.open(f"vo/L{I}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
    print(f"L{I}: cut at", best / 100, "s raw; new", round(len(y) / sr, 2))
