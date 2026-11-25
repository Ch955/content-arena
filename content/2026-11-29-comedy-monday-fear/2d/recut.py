"""Ep 5: fix the Gemini batch-A split bleeds (vo_orig -> vo), found by listen.py and confirmed by transcribing candidate cuts
(cand.py -> cand/check.json). The takes are contiguous slices of the batch answer, so moving a boundary is exact; every cut
sits in a pause (>= 0.19 s of silence, 3% of the peak).
  batch A: L1 'ఏంట్రా ఇది!' had gone to L2's head; L2 'టాస్క్ కంప్లీట్ చేశావా?' to L3's take; L3 'చేశాను సార్' to L4's head;
           L5 'థాంక్యూ సార్' to L4's tail.  (0-based: 0 <- 1[:1.34]; 1 = 1[1.34:] + 2; 2 = 3[:0.86]; 3 = 3[0.86:3.79]; 4 = 3[3.79:] + 4)"""
import wave, numpy as np
def rd(p):
    with wave.open(f"vo_orig/{p}_raw.wav") as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, parts):
    x = np.concatenate(parts)
    with wave.open(f"vo/{p}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
    print(p, round(len(x) / sr, 2))
A = {k: rd(f"L{k}")[0] for k in (0, 1, 2, 3, 4)}; sr = rd("L0")[1]
c = lambda s: int(s * sr)
wr("L0", [A[0], A[1][:c(1.34)]])
wr("L1", [A[1][c(1.34):], A[2]])
wr("L2", [A[3][:c(0.86)]])
wr("L3", [A[3][c(0.86):c(3.79)]])
wr("L4", [A[3][c(3.79):], A[4]])
