"""Fix Gemini batch split boundaries (vo_orig -> vo_fix). Batch 1 cut L1..L4 one phrase late, so each line's head
belongs to the line before: new L1 = L1 + L2[:c2], new L2 = L2[c2:] + L3[:c3], new L3 = L3[c3:] + L4[:c4], new L4 = L4[c4:].
Cut points (seconds in the ORIGINAL take) sit in the middle of the pause after the moved phrase."""
import wave, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
CUTS = {2: 1.21, 3: 1.70, 4: 1.66}   # 'Nikhil దే' | 'నా office bus' | 'clues మిస్ అవ్వకండి'
X = {i: rd(f"vo_orig/L{i}_raw.wav") for i in range(1, 5)}; sr = X[1][1]
head = {i: X[i][0][:int(c * sr)] for i, c in CUTS.items()}; tail = {i: X[i][0][int(c * sr):] for i, c in CUTS.items()}
new = {1: np.concatenate([X[1][0], head[2]]), 2: np.concatenate([tail[2], head[3]]), 3: np.concatenate([tail[3], head[4]]), 4: tail[4]}
for i, x in new.items(): wr(f"vo_fix/L{i}_raw.wav", x, sr); print(i, round(len(x) / sr, 2))
