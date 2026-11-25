"""Ep 4: fix the Gemini batch split bleed (vo_orig -> vo), found by listen.py (L9 'second speaker at the end').
The takes are contiguous slices of the batch answer, so moving a boundary is exact; the cut sits in the 0.8 s pause.
  batch B: 'కంపెనీకి' (the first word of the punch L11 = index 10) had gone to the tail of L10 (index 9)."""
import wave, numpy as np
def rd(p):
    with wave.open(f"vo_orig/{p}_raw.wav") as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, parts):
    x = np.concatenate(parts)
    with wave.open(f"vo/{p}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
    print(p, round(len(x) / sr, 2))
A = {k: rd(f"L{k}")[0] for k in (9, 10)}; sr = rd("L9")[1]
c = lambda s: int(s * sr)
wr("L9", [A[9][:c(7.0)]])
wr("L10", [A[9][c(7.0):], A[10]])
