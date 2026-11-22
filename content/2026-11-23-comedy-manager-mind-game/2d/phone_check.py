"""Phone-band check (QC's method, 19 Nov): 50 ms RMS of the mix high-passed at 250 Hz (phones play little below that).
For every cue: the loudest 50 ms window in its measure window vs the voice's loud moments (p90 of the 50 ms RMS over
all lines). Windows come from cues.json (written by mix.py from beats.json, so they follow the timeline).
Targets (mix.py PH): max +7, high +1.5, mid -5, low -14 dB. Usage: python phone_check.py [mix.wav | video.mp4]"""
import json, subprocess, sys, numpy as np
src = sys.argv[1] if len(sys.argv) > 1 else "mix.wav"; sr = 44100
vsrc = sys.argv[2] if len(sys.argv) > 2 else src   # the voice p90 always comes from the full mix (2nd arg: run on stem_fx.wav)
rdx = lambda f: np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-i", f, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"], capture_output=True).stdout, np.float32).astype(float)
x = rdx(src); xv = x if vsrc == src else rdx(vsrc)
def hp(x, lo):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr); X *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4); return np.fft.irfft(X, len(x))
tl = json.load(open("timeline.json")); W = json.load(open("cues.json"))
TGT = {"max": 7.0, "high": 1.5, "mid": -5.0, "low": -14.0}
out = {}
for name, sig, vsig in (("full", x, xv), ("phone>250Hz", hp(x, 250), hp(xv, 250))):
    rv = lambda a, c: 20 * np.log10(np.sqrt((vsig[int(a * sr):int(c * sr)] ** 2).mean()) + 1e-9)
    r = lambda a, c: 20 * np.log10(np.sqrt((sig[int(a * sr):int(c * sr)] ** 2).mean()) + 1e-9)
    mx = lambda a, c, st=0.05: max(r(t, t + st) for t in np.arange(a, max(a + 0.001, c - st) + 1e-9, 0.01))
    v = np.array([rv(t, t + 0.05) for l in tl["lines"] for t in np.arange(l["start"], l["start"] + l["dur"] - 0.05, 0.05)]); v = v[v > -60]
    p90 = np.percentile(v, 90); print(f"{name}: voice 50 ms RMS median {np.median(v):.1f}, p90 {p90:.1f} dBFS")
    out[name] = {"voice_p90": round(p90, 1), "hits": {}}
    for n, lev, a, c in W:
        m = mx(a, c); out[name]["hits"][n] = {"level": lev, "t": round(a, 2), "vs_voice_p90_db": round(m - p90, 1)}
        if name != "full" or lev in ("max",): print(f"  {a:6.2f} {lev:4s} {n:44s} max50ms {m:6.1f}  vs voice p90 {m - p90:+5.1f} dB (target {TGT.get(lev, 0):+.1f})")
json.dump(out, open("phone_check.json" if vsrc == src else "phone_check_fx_only.json", "w"), indent=1, ensure_ascii=False)
