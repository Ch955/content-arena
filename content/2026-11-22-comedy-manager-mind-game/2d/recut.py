"""Fix the Gemini batch split bleeds (vo_orig -> vo), found by listen.py (19 Nov) and confirmed by transcribing candidate
cuts (cand/). The takes are contiguous slices of each batch answer, so moving a boundary is exact:
  batch B: Priya's 'ఒక్కరే' (L2's last word) had gone to the head of L7  -> L2 = L2 + L7[:1.10],  L7 = L7[1.10:]
  batch A: the manager's 'నా strength!' had gone to the head of L5     -> L4 = L4 + L5[:1.24],  L5 = L5[1.24:]
  batch C: Gopi's 'రేపు Episode 2!' had gone to Suresh's chorus take   -> L17 = L17 + chorus[:1.39], chorus/suresh = chorus[1.39:]"""
import wave, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
def move(head_of, cut, onto, dst_head, dst_tail):
    a, sr = rd(head_of); b, _ = rd(onto); c = int(cut * sr)
    wr(dst_head, np.concatenate([b, a[:c]]), sr); wr(dst_tail, a[c:], sr)
    print(dst_head, round((len(b) + c) / sr, 2), "|", dst_tail, round((len(a) - c) / sr, 2))
move("vo_orig/L7_raw.wav", 1.10, "vo_orig/L2_raw.wav", "vo/L2_raw.wav", "vo/L7_raw.wav")
move("vo_orig/L5_raw.wav", 1.24, "vo_orig/L4_raw.wav", "vo/L4_raw.wav", "vo/L5_raw.wav")
move("vo_orig/chorus_suresh.wav", 1.39, "vo_orig/L17_raw.wav", "vo/L17_raw.wav", "chorus/suresh.wav")
# 2nd pass (19 Nov, the listener on the final takes): L4 still began with an extra 'Red Flower' (batch A, the tail of the
# conversation's previous line). Applied after tighten.py: vo/L4_raw.wav = vo/L4_before_headcut.wav[0.81 s:] (cut in the
# first pause, 0.75-0.87 s).
