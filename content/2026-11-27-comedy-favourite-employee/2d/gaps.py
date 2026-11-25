"""print the voiced segments (10 ms frames over TH of the peak, gaps >= 80 ms) of raw takes: python gaps.py L5 L6 ..."""
import sys, wave, numpy as np
TH = 0.03
for p in sys.argv[1:]:
    with wave.open(f"vo/{p}_raw.wav") as w: x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(float); sr = w.getframerate()
    hop = sr // 100; fr = len(x) // hop; r = np.sqrt((x[:fr * hop].reshape(fr, hop) ** 2).mean(1)); loud = r > TH * r.max()
    segs = []; on = None; low = 0
    for f in range(fr):
        if loud[f]:
            if on is None: on = f
            low = 0
        elif on is not None:
            low += 1
            if low >= 8: segs.append((on / 100, (f - low + 1) / 100)); on = None
    if on is not None: segs.append((on / 100, fr / 100))
    print(p, round(len(x) / sr, 2), [(round(a, 2), round(b, 2)) for a, b in segs])
