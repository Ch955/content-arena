"""Fix the takes after the Gemini batch (vo_orig -> vo_fix), then run tighten.py (vo_fix -> vo).
No batch-split bleeds were found (Gemini listener, stt_check.py). One TRIM for length (brief's trim order, step 3:
'L5 becomes just Follow కొట్టండి!'): Gopi's follow line (L4 here, 0-based) is cut in the middle of the pause after
'కొట్టండి' (raw 1.10-1.46 s), dropping 'అసలు గొడవ… ఇప్పుడే!'. Others copied as is."""
import shutil, wave, numpy as np, os
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
N = 14
KEEP_HEAD = {4: 1.28}        # line i: keep only its first CUT seconds
os.makedirs("vo_fix", exist_ok=True)
for i in range(N):
    a, sr = rd(f"vo_orig/L{i}_raw.wav")
    if i in KEEP_HEAD: a = a[:int(KEEP_HEAD[i] * sr)]
    wr(f"vo_fix/L{i}_raw.wav", a, sr); shutil.copy(f"vo_orig/L{i}_model.txt", f"vo_fix/L{i}_model.txt")
    print(f"L{i}", round(len(a) / sr, 2))
