"""Fix the Gemini batch splits (vo_orig -> vo_fix). Both batches were cut one phrase off at several boundaries (found
with the Gemini listener, listen.py, plus the pitch of each phrase: Ananya/Lakshmi vs Nikhil/Gopi). Each batch's takes
are joined back in batch order and re-cut at the middle of the right pause (seconds in the joined batch audio):
  A (Ananya + Nikhil, L0 1 2 3 5 8 11): 'పెసరట్టు-ఉప్మా…' sat at the tail of L0, 'లేదు.' at the head of L2,
    'అమ్మ రాజమండ్రిలో…' at the tail of L2, 'Aunty…' at the tail of L5, 'అమ్మా…' at the tail of L8.
  B (Lakshmi + Gopi, L4 6 7 9 10 12): 'ఈ box మా బాబుది…' sat at the tail of Gopi's L7.
The short sniff at the head of L5 is Ananya's [sniffs] and stays."""
import shutil, wave, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
BATCH = {"A": ([0, 1, 2, 3, 5, 8, 11], [3.69, 9.965, 12.67, None, 21.35, 23.175]),   # None = keep the original boundary
         "B": ([4, 6, 7, 9, 10, 12], [None, None, 11.54, None, None])}
import os; os.makedirs("vo_fix", exist_ok=True)
for tag, (order, cuts) in BATCH.items():
    xs = [rd(f"vo_orig/L{i}_raw.wav") for i in order]; sr = xs[0][1]
    x = np.concatenate([a for a, _ in xs]); ends = np.cumsum([len(a) for a, _ in xs])
    b = [0] + [int(c * sr) if c is not None else int(ends[k]) for k, c in enumerate(cuts)] + [len(x)]
    for k, i in enumerate(order):
        wr(f"vo_fix/L{i}_raw.wav", x[b[k]:b[k + 1]], sr); shutil.copy(f"vo_orig/L{i}_model.txt", f"vo_fix/L{i}_model.txt")
        print(f"L{i}", round((b[k + 1] - b[k]) / sr, 2))
