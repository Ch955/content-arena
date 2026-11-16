"""Re-cut batch splits that bled into neighbours: walk the boundaries left to right; for each boundary next to a line
with low STT similarity, try every pause (>= 0.08 s) within +-WIN s of the current cut, STT the left piece and keep the
cut whose transcript best matches the left line's text. Saves the segments to cuts.json and rewrites lines/L*_raw.wav.
Usage: python recut.py N [N ...]"""
import difflib, json, os, re, subprocess, sys, time, wave
import numpy as np, requests
import plan
from split import rd, gaps_of
WIN = float(os.environ.get("WIN", "5"))
tel = lambda s: re.sub(r"[^ఀ-౿]", "", s)
def stt(x, sr, a, b):
    p = "lines/_probe.wav"
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x[int(a * sr):int(b * sr)].tobytes())
    for k in range(4):
        r = requests.post("https://api.sarvam.ai/speech-to-text", timeout=120, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                          files={"file": ("p.wav", open(p, "rb"), "audio/wav")}, data={"model": "saarika:v2.5", "language_code": "te-IN"})
        if r.status_code == 200: return r.json().get("transcript", "")
        time.sleep(4)
    r.raise_for_status()
sim = lambda h, e: difflib.SequenceMatcher(None, tel(h), tel(e)).ratio()
if __name__ == "__main__":
    d, L = plan.load(); res = json.load(open("stt.json")); over = json.load(open("cuts.json")) if os.path.exists("cuts.json") else {}
    for n in map(int, sys.argv[1:]):
        meta = json.load(open(f"batches/b{n}.json")); ids = meta["lines"]; segs = [list(s) for s in meta["segments"]]
        x, sr = rd(f"batches/b{n}.wav")
        _, _, gaps = gaps_of(x, sr, floor=0.05, mn=0.08)
        bad = [res.get(str(i), {}).get("sim", 0) < 0.93 for i in ids]
        for k in range(len(ids) - 1):
            if not (bad[k] or bad[k + 1]): continue
            a0, c0 = segs[k][0], segs[k][1]
            hi = segs[k + 1][1] - 0.6
            cands = sorted({round(g, 2) for g, _ in gaps if abs(g - c0) <= WIN and a0 + 0.5 < g < hi} | {c0})
            best = None
            for c in cands:
                s = sim(stt(x, sr, a0, c), L[ids[k]]["text"])
                if best is None or s > best[0] + 1e-9 or (abs(s - best[0]) < 1e-9 and abs(c - c0) < abs(best[1] - c0)): best = (s, c)
            print(f"b{n} L{ids[k]}|L{ids[k + 1]}: {c0} -> {best[1]} (left sim {best[0]:.2f}, {len(cands)} tries)", flush=True)
            segs[k][1] = segs[k + 1][0] = best[1]
        over[str(n)] = segs; json.dump(over, open("cuts.json", "w"))
        subprocess.run([sys.executable, "split.py", str(n)], check=True)
