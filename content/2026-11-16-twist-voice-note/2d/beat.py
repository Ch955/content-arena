"""Insert a silent beat into vo/L12_raw.wav between 'Follow…' and the gasp 'అరె' so the end card holds >= 1.2 s
(run after tighten.py). Cuts at the middle of the raw pause nearest AT seconds; writes vo/L12_raw.wav in place and
vo_seg/L12_after.wav (the part after the cut) for an STT check."""
import os, wave, numpy as np
AT, ADD = float(os.environ.get("AT", 2.70)), 0.75 * 1.15   # raw time (final x 1.15 tempo); +0.75 s after the speed-up
with wave.open("vo_fix/L12_tight.wav" if os.path.exists("vo_fix/L12_tight.wav") else "vo/L12_raw.wav") as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); sr = w.getframerate()
os.makedirs("vo_seg", exist_ok=True)
with wave.open("vo_fix/L12_tight.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
hop = sr // 100; fr = len(x) // hop; rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); quiet = rms < 0.03 * rms.max()
k = int(AT * 100); best = min((f for f in range(fr) if quiet[f]), key=lambda f: abs(f - k)); c = best * hop
y = np.concatenate([x[:c], np.zeros(int(ADD * sr), np.int16), x[c:]])
with wave.open("vo/L12_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
with wave.open("vo_seg/L12_after.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x[c:].tobytes())
print("cut at", best / 100, "s raw; new", round(len(y) / sr, 2))
