"""Fix the Gemini batch splits (vo_orig -> vo_fix). The batches cut two line boundaries one phrase off (checked with the
Gemini listener, stt_check.py): 'చివర్లో' (end of Gopi's L1) sat at the head of Kiran's L2 take, and 'మీరైతే' (start of
Gopi's L6) at the tail of L5. Each cut is the middle of the pause between the two phrases (seconds in the original
take). Others copied as is."""
import shutil, wave, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
N = 14
HEAD_TO_PREV = {2: 1.40}     # line j: its first CUT seconds belong to line j-1
TAIL_TO_NEXT = {5: 3.25}     # line i: everything after CUT belongs to line i+1
A = {i: rd(f"vo_orig/L{i}_raw.wav")[0] for i in range(N)}; sr = rd("vo_orig/L0_raw.wav")[1]
for j, c in HEAD_TO_PREV.items(): c = int(c * sr); A[j - 1] = np.concatenate([A[j - 1], A[j][:c]]); A[j] = A[j][c:]
for i, c in TAIL_TO_NEXT.items(): c = int(c * sr); A[i + 1] = np.concatenate([A[i][c:], A[i + 1]]); A[i] = A[i][:c]
for i in range(N):
    wr(f"vo_fix/L{i}_raw.wav", A[i], sr); shutil.copy(f"vo_orig/L{i}_model.txt", f"vo_fix/L{i}_model.txt")
    print(f"L{i}", round(len(A[i]) / sr, 2))
