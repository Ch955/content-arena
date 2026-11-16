"""Fix the Gemini batch split (vo_orig -> vo_fix): batch 1 cut L1|L2 one phrase early, so 'ఒక number!' (the end of
Gopi's L1) sits at the head of Vimala's L2 take. New L1 = L1 + L2[:CUT]; new L2 = L2[CUT:]. CUT (seconds in the
original L2 take) is the middle of the pause after 'ఒక number'. Every other take is copied as it is."""
import shutil, wave, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
CUT = 0.85
for i in range(12): shutil.copy(f"vo_orig/L{i}_raw.wav", f"vo_fix/L{i}_raw.wav")
a1, sr = rd("vo_orig/L1_raw.wav"); a2, _ = rd("vo_orig/L2_raw.wav"); c = int(CUT * sr)
wr("vo_fix/L1_raw.wav", np.concatenate([a1, a2[:c]]), sr); wr("vo_fix/L2_raw.wav", a2[c:], sr)
print("L1", round((len(a1) + c) / sr, 2), "L2", round((len(a2) - c) / sr, 2))
