"""Rough voice-identity check: mean MFCC (c1-c12, voiced frames) per line; distance to each character's centroid."""
import json, sys, numpy as np, plan
from split import rd
def mfcc_mean(p):
    x, sr = rd(p); x = x.astype(float) / 32768
    if sr != 16000:
        n = int(len(x) * 16000 / sr); x = np.interp(np.linspace(0, len(x) - 1, n), np.arange(len(x)), x); sr = 16000
    W, hop, nf = 400, 160, 512
    fr = np.array([x[k:k + W] * np.hamming(W) for k in range(0, len(x) - W, hop)])
    e = np.sqrt(np.mean(fr ** 2, axis=1)); fr = fr[e > 0.1 * e.max()]
    P = np.abs(np.fft.rfft(fr, nf)) ** 2
    mel = lambda f: 2595 * np.log10(1 + f / 700); imel = lambda m: 700 * (10 ** (m / 2595) - 1)
    pts = imel(np.linspace(mel(60), mel(7600), 28)); bins = np.floor((nf + 1) * pts / sr).astype(int)
    fb = np.zeros((26, nf // 2 + 1))
    for i in range(26):
        a, b, c = bins[i], bins[i + 1], bins[i + 2]
        fb[i, a:b] = (np.arange(a, b) - a) / max(b - a, 1); fb[i, b:c] = (c - np.arange(b, c)) / max(c - b, 1)
    S = np.log(P @ fb.T + 1e-10)
    n = np.arange(26); D = np.cos(np.pi / 26 * (n + 0.5)[None, :] * np.arange(13)[:, None])
    C = S @ D.T
    return C[:, 1:13].mean(axis=0)
if __name__ == "__main__":
    d, L = plan.load(); m = {}
    for n in range(14):
        try: b = json.load(open(f"batches/b{n}.json"))
        except FileNotFoundError: continue
        for i in b["lines"]: m.setdefault(i, (n, b["model"][7:10]))
    V = {l["id"]: mfcc_mean(f"lines/L{l['id']}_raw.wav") for l in L}
    who = {l["id"]: ("tree" if l["who"] == "devata" else l["who"]) for l in L}
    mu = np.mean(list(V.values()), axis=0); sd = np.std(list(V.values()), axis=0) + 1e-9
    Z = {i: (v - mu) / sd for i, v in V.items()}
    # centroids from lines we trust (exclude the suspects)
    sus = {int(a) for a in sys.argv[1:]}
    cent = {}
    for w in set(who.values()):
        ids = [i for i in Z if who[i] == w and i not in sus]
        if ids: cent[w] = np.mean([Z[i] for i in ids], axis=0)
    for i in sorted(Z):
        ds = {w: np.linalg.norm(Z[i] - c) for w, c in cent.items()}
        near = min(ds, key=ds.get)
        flag = "" if near == who[i] else f"  <-- nearer {near}"
        if flag or i in sus:
            print(f"L{i:2d} {who[i]:9s} b{m[i][0]} {m[i][1]}  own {ds[who[i]]:.2f}  nearest {near} {ds[near]:.2f}{flag}")
