"""Level check of a scene's stems (run build_film.py --scenes N --stems first): per window, dB of voice / music / ambience /
one-shots / full mix, and voice-over-background margin while speech is on."""
import sys, wave
import numpy as np
from pathlib import Path
MIX = Path(__file__).parent
def rd(p):
    with wave.open(str(p)) as w: a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).reshape(-1, 2) / 32768
    return a.mean(1)
n = sys.argv[1]; win = float(sys.argv[2]) if len(sys.argv) > 2 else 5
S = {k: rd(MIX / f"scene{n}_{k}.wav") for k in ("voice", "music", "amb", "oneshot")}
mix = sum(S.values()); SR = 44100
db = lambda x: 20 * np.log10(np.sqrt(np.mean(x ** 2)) + 1e-9)
print(f"scene {n}  peak mix {20*np.log10(np.abs(mix).max()):.1f} dBFS   (dB RMS per {win:g}s window)")
print("   t    voice  music   amb   shots    mix   margin(voice-bg while speaking)")
for t0 in np.arange(0, len(mix) / SR, win):
    sl = slice(int(t0 * SR), int((t0 + win) * SR)); v = S["voice"][sl]; bg = (S["music"] + S["amb"] + S["oneshot"])[sl]
    sp = np.abs(v) > 0.02; mg = (db(v[sp]) - db(bg[sp])) if sp.sum() > SR * .3 else float("nan")
    print(f"{t0:6.1f} {db(v):6.1f} {db(S['music'][sl]):6.1f} {db(S['amb'][sl]):6.1f} {db(S['oneshot'][sl]):6.1f} {db(mix[sl]):6.1f}   {mg:5.1f}")
