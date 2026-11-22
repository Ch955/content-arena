"""Ep 2: fix the Gemini batch split bleeds (vo_orig -> vo), found by listen.py and confirmed by transcribing candidate cuts
(cand.py -> cand/check.json). The takes are contiguous slices of each batch answer, so moving a boundary is exact.
Every cut sits in a pause (gaps.py: segments over 3% of the peak).
  batch A: L2 'ఇంకా పుట్టలేదు!' had gone to L4's head; L4 'Let's take it offline!' to L5's head; 'రమేష్!' (L11's first word)
           to L5's tail; 'రెండు seconds సార్' (L12) to L11's tail; 'నేను మాట్లాడకపోతే' (L13) to L12's tail
  batch B: Priya's 'Game 2!' (L6's first words) had gone to L3's tail"""
import wave, numpy as np
def rd(p):
    with wave.open(f"vo_orig/{p}_raw.wav") as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, parts):
    x = np.concatenate(parts)
    with wave.open(f"vo/{p}_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
    print(p, round(len(x) / sr, 2))
A = {k: rd(f"L{k}")[0] for k in (2, 4, 5, 11, 12, 13, 3, 6)}; sr = rd("L2")[1]
c = lambda s: int(s * sr)
wr("L2", [A[2], A[4][:c(1.51)]])
wr("L4", [A[4][c(1.51):], A[5][:c(1.79)]])
wr("L5", [A[5][c(1.79):c(4.81)]])
wr("L11", [A[5][c(4.81):], A[11][:c(2.82)]])
wr("L12", [A[11][c(2.82):], A[12][:c(0.74)]])
wr("L13", [A[12][c(0.74):], A[13]])
wr("L3", [A[3][:c(4.88)]])
wr("L6", [A[3][c(4.88):], A[6]])
