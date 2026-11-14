"""Fix Gemini batch split boundaries: move audio between adjacent takes at a chosen pause (vo_orig -> vo_fix)."""
import wave, numpy as np
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def wr(p, x, sr):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.tobytes())
# (a, b, cut seconds, which file the cut point refers to)
for a, b, cut, ref in [(1, 2, 3.79, "a"), (7, 8, 1.15, "b"), (9, 10, 1.42, "b")]:
    xa, sr = rd(f"vo_orig/L{a}_raw.wav"); xb, _ = rd(f"vo_orig/L{b}_raw.wav")
    c = int(cut * sr)
    if ref == "a": na, nb = xa[:c], np.concatenate([xa[c:], xb])
    else: na, nb = np.concatenate([xa, xb[:c]]), xb[c:]
    wr(f"vo_fix/L{a}_raw.wav", na, sr); wr(f"vo_fix/L{b}_raw.wav", nb, sr)
    print(a, len(na) / sr, b, len(nb) / sr)
