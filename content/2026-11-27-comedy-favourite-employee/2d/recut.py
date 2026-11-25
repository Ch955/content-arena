"""Ep 3: fix the Gemini batch-split bleeds (vo_orig -> vo), found by listen.py and confirmed by transcribing candidate cuts
(cand.py -> cand/check1.json, cand/check2.json; gemini-3-flash-preview). The takes are contiguous slices of each batch answer,
so moving a boundary is exact; every cut sits in a pause (gaps.py: segments over 3% of the peak).
  batch A: Ramesh's 'మాట్లాడాలి.' (L3's last word) had gone to the head of the manager's L4; 'ఏంట్రా సురేష్!' (L7's head) to the
           tail of L6; 'ఒరేయ్!' (the punch's first word) to the tail of L9 'అదేంట్రా?'.  (0-based: L2/L3, L5/L6, L8/L10)"""
import wave, numpy as np
def rd(p):
    with wave.open(f"vo_orig/{p}_raw.wav") as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, parts):
    x = np.concatenate(parts)
    with wave.open(f"vo/{p}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
    print(p, round(len(x) / sr, 2))
A = {k: rd(f"L{k}")[0] for k in (2, 3, 5, 6, 8, 10)}; sr = rd("L2")[1]
c = lambda s: int(s * sr)
wr("L2", [A[2], A[3][:c(0.82)]])
wr("L3", [A[3][c(0.82):]])
wr("L5", [A[5][:c(2.30)]])
wr("L6", [A[5][c(2.30):], A[6]])
wr("L8", [A[8][:c(0.71)]])
wr("L10", [A[8][c(0.71):], A[10]])
