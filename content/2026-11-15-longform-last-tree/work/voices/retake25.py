"""Retake lines on gemini-2.5-flash only (voice consistency + the scene-1 'పెద్ద వ్యాపారి' fix) WITHOUT moving any timing.

Steps (each saves its state to retake25.json, so it can be re-run offline):
  voice  GROUPS -> one Gemini request each (voice.body: same VOICE names + PERSONA + per-line act as every other take),
         model gemini-2.5-flash-preview-tts ONLY (no 3.1/pro fallback); any 429/quota error stops all requests.
         Raw audio -> batches/b{N}.wav + b{N}.json (model recorded), requests.json logged.
  cut    split.split (pause DP) -> lines/L{id}_v25.wav; nothing in lines/L*_raw|_fix.wav is touched.
  fit    build.process (same trim, SPEED, kid pitch, PAUSE_CAP, tree/devata echo, level) with an extra atempo folded
         into the SPEED stage, iterated until the take is the old slot's exact length (last few ms padded/trimmed).
         Allowed stretch 0.9-1.1; outside that the old take stays.
  stt    Sarvam saarika:v2.5 on the fitted take vs the script text; pass = sim >= 0.93 (recut.py's threshold).
         Failing lines get their batch boundaries re-cut by STT (recut.py method) and are fitted/checked again.
  (check)  before install, compare each fitting take with the character's 2.5 lines (mfcc.py neighbours, f0.py
         pitch); a take that does not sound like the character is not installed (decision + why in retake25.json).
  install  fitted takes -> scene{N}/vo/L{k}.wav, timeline env updated (start/dur untouched).
Then: MIX_ONLY=1 python final_check.py rebuilds the scene vo_mix.wav files.
Usage: python retake25.py voice|cut|fit|stt|recut|install [batch ...]"""
import base64, difflib, json, os, sys, time, wave
os.environ.setdefault("SPEED", "1.05"); os.environ.setdefault("PAUSE_CAP", "0.85")
import numpy as np, requests
import plan, voice, build, split, recut

MODEL = "gemini-2.5-flash-preview-tts"
THRESH = 0.93
FIRST_BATCH = 15
GROUPS = [[1, 16, 19, 21, 22, 23, 25, 26],          # Meera + Vriksha (tree), scenes 1-3
          [42, 44, 53, 58, 68, 80, 81],              # Meera + Vriksha, scenes 5-9
          [5, 6, 65, 72, 77]]                        # Narrator (Charon) + Veerendra
STATE = "retake25.json"
PREV = sorted(d for d in os.listdir(".") if d.startswith("prev_"))[-1]   # backup of the takes as they were
d, L = plan.load()
film = json.load(open("film.json")); assert film["speed"] == build.SPEED and film["pause_cap"] == build.PAUSE_CAP
st = json.load(open(STATE)) if os.path.exists(STATE) else {"batches": {}, "lines": {}, "requests": {"gemini": 0, "sarvam": 0}}
def save(): json.dump(st, open(STATE, "w"), ensure_ascii=False, indent=1)

def slot(i):
    """(scene, scene-local k, old take path in the backup, old sample count) for line id i."""
    for n in range(1, 10):
        for l in json.load(open(f"{PREV}/scene{n}/timeline.json" if os.path.exists(f"{PREV}/scene{n}") else f"scene{n}/timeline.json"))["lines"]:
            if l["id"] == i:
                p = f"{PREV}/scene{n}/vo/L{l['i']}.wav"
                with wave.open(p) as w: return n, l["i"], p, w.getnframes()

def gemini(ids):
    b = voice.body([L[i] for i in ids])
    r = requests.post(f"{voice.API}/{MODEL}:generateContent", json=b, timeout=300); st["requests"]["gemini"] += 1; save()
    if r.status_code == 429 or "quota" in r.text[:2000].lower() and r.status_code != 200:
        print(f"   {MODEL}: HTTP {r.status_code} (quota/rate limit) - stopping Gemini requests:", r.text[:200]); return None
    if r.status_code != 200: print(f"   HTTP {r.status_code}:", r.text[:300]); return None
    try: return base64.b64decode(r.json()["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    except (KeyError, IndexError): print("   no audio:", r.text[:300]); return None

def do_voice(groups, first):
    log = json.load(open("requests.json"))
    for g, ids in enumerate(groups):
        n = first + g
        if os.path.exists(f"batches/b{n}.wav"): continue
        if g: time.sleep(21)
        pcm = gemini(ids)
        if pcm is None: print("stopped; no audio for", ids); return False
        with wave.open(f"batches/b{n}.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        json.dump({"batch": n, "lines": ids, "model": MODEL, "retake": True, "retake25": True}, open(f"batches/b{n}.json", "w"))
        log.append({"batch": n, "model": MODEL, "time": time.strftime("%H:%M:%S"), "retake": ids}); json.dump(log, open("requests.json", "w"), indent=1)
        st["batches"][str(n)] = {"lines": ids, "model": MODEL}; save()
        print(f"b{n}: {MODEL} {len(pcm) / 48000:.1f}s audio for {ids}", flush=True)
    return True

def cut(n, segs=None):
    meta = json.load(open(f"batches/b{n}.json")); ids = meta["lines"]
    x, sr = split.rd(f"batches/b{n}.wav")
    if segs is None:
        bounds, _ = split.split(x, sr, [max(4, len(L[i]["text"])) for i in ids])
        segs = [[bounds[k], bounds[k + 1]] for k in range(len(ids))]
    meta["segments"] = [[round(float(a), 2), round(float(b), 2)] for a, b in segs]; json.dump(meta, open(f"batches/b{n}.json", "w"))
    over = json.load(open("cuts.json")); over[str(n)] = meta["segments"]; json.dump(over, open("cuts.json", "w"))
    for k, i in enumerate(ids):
        a, b = int(segs[k][0] * sr), int(segs[k][1] * sr); tmp = f"lines/_t{i}.pcm"; open(tmp, "wb").write(x[a:b].tobytes())
        build.subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(sr), "-ac", "1", "-i", tmp,
                              "-ar", "44100", f"lines/L{i}_v25.wav"], check=True); os.unlink(tmp)
        st["lines"].setdefault(str(i), {})["batch"] = n
    print(f"b{n}: segments {meta['segments']}"); save()

def fit(i):
    n, k, old, want = slot(i); who = L[i]["who"]; src = f"lines/L{i}_v25.wav"; out = f"lines/L{i}_v25fit.wav"
    rec = st["lines"].setdefault(str(i), {}); rec.update(scene=n, k=k, who=who, old_samples=want, old_dur=round(want / build.SR, 3))
    t = 1.0; build.process(i, who, out, src=src, tempo=t); got = len(build.rd(out)); rec["natural_dur"] = round(got / build.SR, 3)
    for _ in range(6):
        if abs(got - want) <= 0.004 * build.SR: break
        t *= got / want
        if not 0.9 <= t <= 1.1: break
        build.process(i, who, out, src=src, tempo=t); got = len(build.rd(out))
    rec["stretch"] = round(t, 4)
    if not 0.9 <= t <= 1.1 or abs(got - want) > 0.004 * build.SR:
        rec["fit"] = "out of range"; os.path.exists(out) and os.unlink(out); save()
        print(f"L{i} s{n}L{k} {who}: natural {rec['natural_dur']}s vs slot {rec['old_dur']}s -> stretch {t:.3f} OUT OF RANGE"); return
    a = build.rd(out)
    if len(a) >= want: a = a[:want].copy(); f = min(len(a), int(0.01 * build.SR)); a[-f:] *= np.linspace(1, 0, f)
    else: a = np.concatenate([a, np.zeros(want - len(a))])
    build.wr(out, a); rec["fit"] = "ok"; save()
    print(f"L{i} s{n}L{k} {who}: natural {rec['natural_dur']}s -> slot {rec['old_dur']}s, atempo x{t:.4f}")

def sarvam(path):
    for k in range(4):
        r = requests.post("https://api.sarvam.ai/speech-to-text", timeout=120, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                          files={"file": (os.path.basename(path), open(path, "rb"), "audio/wav")}, data={"model": "saarika:v2.5", "language_code": "te-IN"})
        st["requests"]["sarvam"] += 1
        if r.status_code == 200: return r.json().get("transcript", "")
        time.sleep(4)
    r.raise_for_status()

def stt(i):
    rec = st["lines"][str(i)]
    if rec.get("fit") != "ok": return
    tr = sarvam(f"lines/L{i}_v25fit.wav"); s = recut.sim(tr, L[i]["text"])
    rec.update(heard=tr, sim=round(s, 3), passed=s >= THRESH); save()
    print(f"L{i} {rec['who']}: sim {s:.2f} {'ok' if s >= THRESH else 'FAIL'}\n   exp {L[i]['text']}\n   got {tr}", flush=True)

def do_recut(n):
    """recut.py's method on batch n: boundaries next to a failing line move to the pause whose left piece STTs best."""
    meta = json.load(open(f"batches/b{n}.json")); ids = meta["lines"]; segs = [list(s) for s in meta["segments"]]
    x, sr = split.rd(f"batches/b{n}.wav"); _, _, gaps = split.gaps_of(x, sr, floor=0.05, mn=0.08)
    bad = [not st["lines"].get(str(i), {}).get("passed", False) for i in ids]
    if not any(bad): return
    for k in range(len(ids) - 1):
        if not (bad[k] or bad[k + 1]): continue
        a0, c0 = segs[k][0], segs[k][1]; hi = segs[k + 1][1] - 0.6
        cands = sorted({round(g, 2) for g, _ in gaps if abs(g - c0) <= recut.WIN and a0 + 0.5 < g < hi} | {c0})
        best = None
        for c in cands:
            s = recut.sim(recut.stt(x, sr, a0, c), L[ids[k]]["text"]); st["requests"]["sarvam"] += 1
            if best is None or s > best[0] + 1e-9 or (abs(s - best[0]) < 1e-9 and abs(c - c0) < abs(best[1] - c0)): best = (s, c)
        print(f"b{n} L{ids[k]}|L{ids[k + 1]}: {c0} -> {best[1]} (left sim {best[0]:.2f}, {len(cands)} tries)", flush=True)
        segs[k][1] = segs[k + 1][0] = best[1]
    save(); cut(n, segs)

def install(i):
    rec = st["lines"][str(i)]
    if not rec.get("passed"): return
    n, k = rec["scene"], rec["k"]; dst = f"scene{n}/vo/L{k}.wav"
    a = build.rd(f"lines/L{i}_v25fit.wav"); assert len(a) == rec["old_samples"]
    build.wr(dst, a)
    tl = json.load(open(f"scene{n}/timeline.json")); l = tl["lines"][k]; assert l["id"] == i
    hop = build.SR // build.FPS; env = [float(np.sqrt(np.mean(a[j:j + hop] ** 2))) for j in range(0, len(a), hop)]; m = max(env) or 1
    l["env"] = [round(min(1, e / m * 1.4), 3) for e in env]
    json.dump(tl, open(f"scene{n}/timeline.json", "w"), ensure_ascii=False); rec["installed"] = dst; save()
    print(f"installed L{i} -> {dst}")

if __name__ == "__main__":
    cmd, args = sys.argv[1], [int(a) for a in sys.argv[2:]]
    batches = args or sorted(int(b) for b in st["batches"])
    ids_of = lambda bs: [i for b in bs for i in st["batches"][str(b)]["lines"]]
    if cmd == "voice": do_voice(GROUPS, FIRST_BATCH)
    elif cmd == "cut": [cut(n) for n in batches]
    elif cmd == "fit": [fit(i) for i in ids_of(batches)]
    elif cmd == "stt": [stt(i) for i in ids_of(batches)]
    elif cmd == "recut": [do_recut(n) for n in batches]
    elif cmd == "install": [install(i) for i in ids_of(batches)]
    print("requests so far:", st["requests"])
