"""Insert a silent beat into vo/L10_raw.wav between 'Follow…' and the whisper 'clue మొదటి seconds లోనే' so the end
card holds ~1.1 s (run after tighten.py). Cuts at the middle of the raw pause nearest AT seconds; writes
vo/L10_raw.wav (from vo/L10_tight.wav, kept) and vo_seg/L10_after.wav (the part after the cut) for a listener check."""
import os, shutil, wave, numpy as np
AT, ADD = float(os.environ.get("AT", 3.12)), 0.60 * 1.15   # raw seconds (final x 1.15 tempo): +0.60 s after the speed-up
if not os.path.exists("vo/L10_tight.wav"): shutil.copy("vo/L10_raw.wav", "vo/L10_tight.wav")
with wave.open("vo/L10_tight.wav") as w: x = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16); sr = w.getframerate()
os.makedirs("vo_seg", exist_ok=True)
hop = sr // 100; fr = len(x) // hop; rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); quiet = rms < 0.03 * rms.max()
k = int(AT * 100); best = min((f for f in range(fr) if quiet[f]), key=lambda f: abs(f - k)); c = best * hop
y = np.concatenate([x[:c], np.zeros(int(ADD * sr), np.int16), x[c:]])
with wave.open("vo/L10_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(y.tobytes())
for nm, part in (("before", x[:c]), ("after", x[c:])):
    with wave.open(f"vo_seg/L10_{nm}.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(part.tobytes())
print("cut at", best / 100, "s raw; new", round(len(y) / sr, 2))
