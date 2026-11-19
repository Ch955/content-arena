"""Insert a silent beat into vo/L7_raw.wav between 'ఒరేయ్…' and 'నీ దుంప తెగ!' (run after tighten.py) so the RECORD
SCRATCH (max) sits in a voice gap instead of on top of the word, and the FREEZE starts on the scratch. Cuts at the middle
of the raw pause nearest AT seconds; writes vo/L7_raw.wav (from vo/L7_tight.wav, kept)."""
import os, shutil, wave, numpy as np
I, AT, ADD = 7, float(os.environ.get("AT", 0.38)), 0.36 * 1.15   # raw seconds (final x 1.15 tempo): +0.36 s after the speed-up
src = f"vo/L{I}_tight.wav"
if not os.path.exists(src): shutil.copy(f"vo/L{I}_raw.wav", src)
with wave.open(src) as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); sr = w.getframerate()
hop = sr // 100; fr = len(x) // hop; rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); quiet = rms < 0.03 * rms.max()
k = int(AT * 100); best = min((f for f in range(fr) if quiet[f]), key=lambda f: abs(f - k)); c = best * hop
y = np.concatenate([x[:c], np.zeros(int(ADD * sr), np.int16), x[c:]])
with wave.open(f"vo/L{I}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
print("cut at", best / 100, "s raw; new", round(len(y) / sr, 2))
