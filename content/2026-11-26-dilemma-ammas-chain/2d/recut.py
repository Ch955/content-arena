"""Fix the Gemini batch splits (vo_orig -> vo_fix), found with the Gemini listener (listen.py, 4 clips per request) and
the pauses (pauses.py). Each batch's takes are joined back in batch order and re-cut at the middle of the right pause
(seconds in the joined batch audio):
  A (Nikhil + Narasimha, L0 1 5 8): 'Chain…' (the start of L5) sat at the tail of L1.
  B (Amma + Keerthi, L2 6 7 9): 'అమ్మ' (the start of L6) sat at the tail of L2.
  C (Gopi, L3 4 10): 'గుట్టుగా విడిపించాలా?' (the end of L3) sat at the head of L4."""
import shutil, wave, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
BATCH = {"A": ([0, 1, 5, 8], [None, 8.585, None]),   # None = keep the original boundary
         "B": ([2, 6, 7, 9], [3.60, None, None]),
         "C": ([3, 4, 10], [5.04, None])}
import os; os.makedirs("vo_fix", exist_ok=True)
for tag, (order, cuts) in BATCH.items():
    xs = [rd(f"vo_orig/L{i}_raw.wav") for i in order]; sr = xs[0][1]
    x = np.concatenate([a for a, _ in xs]); ends = np.cumsum([len(a) for a, _ in xs])
    b = [0] + [int(c * sr) if c is not None else int(ends[k]) for k, c in enumerate(cuts)] + [len(x)]
    for k, i in enumerate(order):
        wr(f"vo_fix/L{i}_raw.wav", x[b[k]:b[k + 1]], sr); shutil.copy(f"vo_orig/L{i}_model.txt", f"vo_fix/L{i}_model.txt")
        print(f"L{i}", round((b[k + 1] - b[k]) / sr, 2))
# L3 was re-taken alone (25 Nov: the batch take said "Aah" for the letter A; the new 'say' spells A/B as ఏ/బీ): vo_retake -> vo_fix
if os.path.exists("vo_retake/L3_raw.wav"):
    shutil.copy("vo_retake/L3_raw.wav", "vo_fix/L3_raw.wav"); shutil.copy("vo_retake/L3_model.txt", "vo_fix/L3_model.txt"); print("L3 <- vo_retake")
