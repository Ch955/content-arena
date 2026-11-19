"""Phone-band check (QC's method, 19 Nov): 50 ms RMS of the mix high-passed at 250 Hz (phones play little below that).
For every hit: the loudest 50 ms window in the hit vs the voice's loud moments (p90 of the 50 ms RMS over all lines).
Windows come from beats.json, so they follow the timeline. Usage: python phone_check.py [mix.wav | video.mp4]"""
import json, subprocess, sys, numpy as np
src = sys.argv[1] if len(sys.argv) > 1 else "mix.wav"; sr = 44100
vsrc = sys.argv[2] if len(sys.argv) > 2 else src   # the voice p90 always comes from the full mix
x = np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-i", src, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"], capture_output=True).stdout, np.float32).astype(float)
def hp(x, lo):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / sr); X *= 1 / np.sqrt(1 + (lo / np.maximum(f, 1e-3)) ** 4); return np.fft.irfft(X, len(x))
tl = json.load(open("timeline.json")); b = json.load(open("beats.json"))
W = [("DHOOM", b["dhoom"], b["dhoom"] + 0.45), ("STAMP", b["stamp"], b["stamp"] + 0.25), ("DHAN1", b["dhan"][0], b["dhan"][0] + 0.22), ("DHAN2", b["dhan"][1], b["dhan"][1] + 0.22),
     ("DHAN3", b["dhan"][2], b["dhan"][2] + 0.4), ("scratch", b["scratch"], b["scratch"] + 0.38), ("DONK", b["donk"], b["donk"] + 0.25), ("laugh 1st s", b["laugh"], b["laugh"] + 1.0),
     ("HOORAY", b["hooray"], b["hooray"] + 1.0), ("rimshot", b["rim"] - 0.3, b["rim"] + 0.3), ("TING", b["ting"], b["ting"] + 0.3), ("trombone", b["tromb"], b["tromb"] + 1.0),
     ("ooh", b["oohS"], b["oohS"] + 0.6), ("gasp", b["gasp"], b["gasp"] + 0.35), ("brass", b["tGanta"], b["tGanta"] + 1.0), ("whip whoosh", b["whip"] - 0.05, b["whip"] + 0.25),
     ("slurp1", b["slurp1"], b["slurp1"] + 0.4), ("slurp2", b["slurp2"], b["slurp2"] + 0.6), ("dun-DUNN", b["dun1"], b["dun1"] + 1.0), ("stomps+door", b["stomp"][0], b["stomp"][0] + 0.9)]
out = {}
xv = x if vsrc == src else np.frombuffer(subprocess.run(["ffmpeg", "-loglevel", "error", "-i", vsrc, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"], capture_output=True).stdout, np.float32).astype(float)
for name, sig, vsig in (("full", x, xv), ("phone>250Hz", hp(x, 250), hp(xv, 250))):
    r = lambda a, c: 20 * np.log10(np.sqrt((sig[int(a * sr):int(c * sr)] ** 2).mean()) + 1e-9)
    mx = lambda a, c, st=0.05: max(r(t, t + st) for t in np.arange(a, c - st + 1e-9, 0.01))
    rv = lambda a, c: 20 * np.log10(np.sqrt((vsig[int(a * sr):int(c * sr)] ** 2).mean()) + 1e-9)
    v = np.array([rv(t, t + 0.05) for l in tl["lines"] for t in np.arange(l["start"], l["start"] + l["dur"] - 0.05, 0.05)]); v = v[v > -60]
    p90 = np.percentile(v, 90); print(f"{name}: voice 50 ms RMS median {np.median(v):.1f}, p90 {p90:.1f} dBFS")
    out[name] = {"voice_p90": round(p90, 1), "hits": {}}
    for n, a, c in W:
        m = mx(a, c); out[name]["hits"][n] = round(m - p90, 1); print(f"  {n:13s} max50ms {m:6.1f}  vs voice p90 {m - p90:+5.1f} dB")
json.dump(out, open("phone_check.json" if vsrc == src else "phone_check_fx_only.json", "w"), indent=1)
