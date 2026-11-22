"""Ep 2 L15 'మీరే సార్!' = the whole team as ONE layered chorus (Ep 1's layering): the 3 cast takes from the voice batches
(Ramesh=Sadachbia, Priya=Pulcherrima, Suresh=Achird; chorus/*.wav) + 4 extra takes from batch D (Umbriel x2, Callirrhoe x2;
they stand in for Ep 1's Umbriel/Callirrhoe/Zubenelgenubi, the FAAAH being reused as-is). Each take is trimmed, time-stretched (ffmpeg atempo) to the same length
(TARGET s, i.e. about the x1.15 house speed), onsets aligned with small offsets (0-75 ms), +-1 semitone, a short room
reverb -> vo/L14_raw.wav (mono 44.1 kHz; voices.py does NOT speed it up again)."""
import subprocess, wave, numpy as np
FS = 44100; TARGET = 0.66
TAKES = [("chorus/ramesh.wav", 0.000, 0.0, 1.0), ("chorus/priya.wav", 0.015, 0.0, 0.95), ("chorus/suresh.wav", 0.030, 0.0, 0.9),
         ("chorus/umbriel.wav", 0.045, -1.0, 0.75), ("chorus/callirrhoe.wav", 0.060, 1.0, 0.75), ("chorus/umbriel_2.wav", 0.075, 1.5, 0.6),
         ("chorus/callirrhoe_2.wav", 0.035, -1.5, 0.6)]
def rd(p):
    with wave.open(p) as w: a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768; sr = w.getframerate()
    return np.interp(np.arange(0, len(a), sr / FS), np.arange(len(a)), a) if sr != FS else a
def trim(a, th=0.04):
    m = np.abs(a).max() or 1; v = np.flatnonzero(np.abs(a) > th * m); return a[max(0, v[0] - 200):v[-1] + 1]
o = np.zeros(int((TARGET + 0.6) * FS))
for p, off, st, g in TAKES:
    a = trim(rd(p)); tempo = len(a) / FS / TARGET
    tmp = "_ch.wav"
    with wave.open(tmp, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(FS); w.writeframes((a * 32767).astype(np.int16).tobytes())
    r = 2 ** (st / 12)
    af = f"asetrate={FS}*{r:.5f},aresample={FS},atempo={tempo / r:.4f}"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-af", af, "_ch2.wav"], check=True)
    b = rd("_ch2.wav"); b = b / (np.abs(b).max() or 1) * g; s = int(off * FS); o[s:s + len(b)] += b[: len(o) - s]
    print(p, f"{len(a)/FS:.2f}s -> {len(b)/FS:.2f}s  st {st:+.1f}")
t = np.arange(int(0.5 * FS)) / FS; ir = np.random.default_rng(3).standard_normal(len(t)) * np.exp(-6.9 * t / 0.5); ir[:300] = 0; ir /= np.abs(ir).max()
wet = np.convolve(o, ir)[: len(o)]; o = o + wet / (np.abs(wet).max() or 1) * np.abs(o).max() * 0.18
v = np.flatnonzero(np.abs(o) > 0.01 * np.abs(o).max()); o = o[: v[-1] + int(0.12 * FS)]
o = o / np.abs(o).max() * 0.89; fe = int(0.03 * FS); o[-fe:] *= np.linspace(1, 0, fe)
with wave.open("vo/L14_raw.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(FS); w.writeframes((o * 32767).astype(np.int16).tobytes())
open("vo/L14_model.txt", "w").write("gemini-chorus:Sadachbia,Pulcherrima,Achird,Umbriel,Callirrhoe,Umbriel,Callirrhoe")
print("vo/L14_raw.wav", round(len(o) / FS, 2), "s")
