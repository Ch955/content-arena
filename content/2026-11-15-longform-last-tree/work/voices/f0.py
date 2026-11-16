"""YIN pitch per line (numpy only): median / 25th / 75th percentile F0 of voiced frames, grouped by character."""
import json, sys, numpy as np, plan
from split import rd
def yin(p, fmin=60, fmax=500):
    x, sr = rd(p); x = x.astype(float) / 32768
    if sr != 16000:
        n = int(len(x) * 16000 / sr); x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x); sr = 16000
    W = 640; hop = 160; tmin, tmax = sr // fmax, sr // fmin; out = []
    thr = 0.05 * np.max(np.abs(x))
    for k in range(0, len(x) - W - tmax, hop):
        f = x[k:k + W + tmax]
        if np.sqrt(np.mean(f[:W] ** 2)) < thr * 0.5: continue
        d = np.array([np.sum((f[:W] - f[t:t + W]) ** 2) for t in range(tmax + 1)])
        c = np.cumsum(d[1:]); dn = np.ones_like(d); dn[1:] = d[1:] * np.arange(1, tmax + 1) / np.maximum(c, 1e-12)
        cand = np.flatnonzero(dn[tmin:tmax] < 0.15)
        if len(cand) == 0: continue
        t = tmin + cand[0]
        while t + 1 < tmax and dn[t + 1] < dn[t]: t += 1
        out.append(sr / t)
    return np.percentile(out, [25, 50, 75]) if len(out) > 5 else [0, 0, 0]
if __name__ == "__main__":
    d, L = plan.load(); m = {}
    for n in range(13):
        b = json.load(open(f"batches/b{n}.json"))
        for i in b["lines"]: m[i] = (n, b["model"][7:10])
    whos = sys.argv[1:] or None
    for w in ["narrator", "tree", "devata", "meera", "chintu", "veerendra", "thatayya", "villagers"]:
        if whos and w not in whos: continue
        print(w)
        for l in L:
            if l["who"] != w: continue
            q = yin(f"lines/L{l['id']}_raw.wav")
            print(f"   L{l['id']:2d} b{m[l['id']][0]:2d} {m[l['id']][1]}  f0 {q[1]:5.0f}  ({q[0]:.0f}-{q[2]:.0f})", flush=True)
