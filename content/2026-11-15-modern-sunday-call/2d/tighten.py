"""Shrink the long pauses inside each take (comic timing): vo_fix/L{i}_raw.wav -> vo/L{i}_raw.wav.
Silent runs (10 ms frames under 3% of the peak) longer than MAXP are cut down to KEEP seconds."""
import sys, wave, numpy as np
import os
SR = 44100; MAXP, KEEP = float(os.environ.get("MAXP", .22)), float(os.environ.get("KEEP", .14)); TH = float(os.environ.get("TH", .03)); DST = os.environ.get("DST", "vo")
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
tot0 = tot1 = 0
for i in ([int(x) for x in sys.argv[1:]] or range(13)):
    a, sr = rd(f"vo_fix/L{i}_raw.wav"); hop = sr // 100; fr = len(a) // hop
    rms = np.sqrt(np.mean(a[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); loud = rms > TH * rms.max()
    v = np.flatnonzero(loud); f0, f1 = v[0], v[-1] + 1
    keep = np.zeros(fr, bool); keep[f0:f1] = True
    k = f0
    while k < f1:
        if not loud[k]:
            j = k
            while j < f1 and not loud[j]: j += 1
            if (j - k) / 100 > MAXP:
                n = int(KEEP * 100); mid = (k + j) // 2
                keep[k:j] = False; keep[k:k + n // 2] = True; keep[j - (n - n // 2):j] = True
            k = j
        else: k += 1
    out = np.concatenate([a[f * hop:(f + 1) * hop] for f in np.flatnonzero(keep)])
    with wave.open(f"{DST}/L{i}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(out.tobytes())
    tot0 += len(a) / sr; tot1 += len(out) / sr
    print(f"L{i}: {len(a)/sr:.2f} -> {len(out)/sr:.2f}")
print(f"total {tot0:.2f} -> {tot1:.2f}")
