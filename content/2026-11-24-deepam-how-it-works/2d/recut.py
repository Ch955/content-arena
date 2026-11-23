"""Fix the Gemini batch split (vo_orig -> vo_fix): batch A (Gopi + Pinky, L0-L7) put 'Maha Deepam.' (the end of L1)
at the head of L2, "ఎలా manage చేస్తారు?" at the head of L3 and "1,100 CCTV cameras!" at the head of L5 (found with the
Gemini listener: the batch cut at every pause and each piece transcribed alone, since multi-clip requests bled context). The batch's takes are joined back in order and re-cut
at the middle of the right pause (seconds in the joined batch audio). Batch B (L8-L11) was voiced line by line."""
import shutil, wave, os, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
BATCH = {"A": ([0, 1, 2, 3, 4, 5, 6, 7], [None, 7.58, 12.10, None, 22.95, None, None]),   # None = keep the original boundary
         "B": ([8], []), "C": ([9], []), "D": ([10], []), "E": ([11], [])}
os.makedirs("vo_fix", exist_ok=True)
for tag, (order, cuts) in BATCH.items():
    xs = [rd(f"vo_orig/L{i}_raw.wav") for i in order]; sr = xs[0][1]
    x = np.concatenate([a for a, _ in xs]); ends = np.cumsum([len(a) for a, _ in xs])
    b = [0] + [int(c * sr) if c is not None else int(ends[k]) for k, c in enumerate(cuts)] + [len(x)]
    for k, i in enumerate(order):
        wr(f"vo_fix/L{i}_raw.wav", x[b[k]:b[k + 1]], sr); shutil.copy(f"vo_orig/L{i}_model.txt", f"vo_fix/L{i}_model.txt")
        print(f"L{i}", round((b[k + 1] - b[k]) / sr, 2))
