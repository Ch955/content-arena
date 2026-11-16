"""Cut batches/b{N}.wav back into lines/L{id}_raw.wav (44.1 kHz) at the pauses: DP over silent gaps, cost =
distance (s) from the char-ratio cut + strong bonus for long gaps (Gemini leaves ~1.5-2 s between lines, ~1 s inside).
Overrides in cuts.json: {"N": [cut seconds, ...]} force the cut points of a batch.
Usage: python split.py [N ...]"""
import json, os, subprocess, sys, wave
import numpy as np
import plan
BONUS = float(os.environ.get("BONUS", "6.0"))
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16), w.getframerate()
def gaps_of(x, sr, floor=0.03, mn=0.3):
    hop = sr // 100; fr = len(x) // hop
    rms = np.sqrt(np.mean(x[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); loud = rms > floor * rms.max()
    v = np.flatnonzero(loud); first, last = v[0], v[-1] + 1
    gaps, k = [], first
    while k < last:
        if not loud[k]:
            j = k
            while j < last and not loud[j]: j += 1
            if (j - k) / 100 >= mn: gaps.append(((k + j) / 200, (j - k) / 100))
            k = j
        else: k += 1
    return first / 100, last / 100, gaps
def split(x, sr, weights):
    first, last, gaps = gaps_of(x, sr)
    n = len(weights)
    if n == 1: return [first, last], []
    exp = first + np.cumsum(weights)[:-1] / sum(weights) * (last - first)
    g = len(gaps); INF = 1e18
    cost = np.full((n - 1, g), INF); back = np.zeros((n - 1, g), int)
    for j in range(g): cost[0, j] = abs(gaps[j][0] - exp[0]) - BONUS * gaps[j][1]
    for i in range(1, n - 1):
        for j in range(i, g):
            b = int(np.argmin(cost[i - 1, :j])); cost[i, j] = cost[i - 1, b] + abs(gaps[j][0] - exp[i]) - BONUS * gaps[j][1]; back[i, j] = b
    j = int(np.argmin(cost[n - 2])); idx = [j]
    for i in range(n - 2, 0, -1): j = back[i, j]; idx.append(j)
    idx = idx[::-1]
    return [first] + [gaps[c][0] for c in idx] + [last], [gaps[c][1] for c in idx]
if __name__ == "__main__":
    d, L = plan.load()
    over = json.load(open("cuts.json")) if os.path.exists("cuts.json") else {}
    os.makedirs("lines", exist_ok=True)
    ns = [int(a) for a in sys.argv[1:]] or sorted(int(f[1:-4]) for f in os.listdir("batches") if f.endswith(".wav"))
    for n in ns:
        meta = json.load(open(f"batches/b{n}.json")); ids = meta["lines"]
        x, sr = rd(f"batches/b{n}.wav")
        bounds, gl = split(x, sr, [max(4, len(L[i]["text"])) for i in ids])
        segs = [(bounds[k], bounds[k + 1]) for k in range(len(ids))]
        if str(n) in over:   # either cut points, or one [start, end] per line (drops repeated/extra takes)
            o = over[str(n)]; gl = ["forced"]
            if isinstance(o[0], list): segs = [tuple(p) for p in o]
            else: first, last, _ = gaps_of(x, sr); b2 = [first] + o + [last]; segs = [(b2[k], b2[k + 1]) for k in range(len(ids))]
        meta["segments"] = [[round(float(a), 2), round(float(b), 2)] for a, b in segs]; meta.pop("bounds", None)
        json.dump(meta, open(f"batches/b{n}.json", "w"))
        for k, i in enumerate(ids):
            a, b = int(segs[k][0] * sr), int(segs[k][1] * sr)
            tmp = f"lines/_t{i}.pcm"; open(tmp, "wb").write(x[a:b].tobytes())
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(sr), "-ac", "1", "-i", tmp,
                            "-ar", "44100", f"lines/L{i}_raw.wav"], check=True); os.unlink(tmp)
        print(f"b{n}: segments", meta["segments"], "gaps", [round(float(g), 2) if g != "forced" else g for g in gl])
