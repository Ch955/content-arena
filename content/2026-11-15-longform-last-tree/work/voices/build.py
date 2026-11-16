"""lines/L{id}_raw.wav (or L{id}_fix.wav) -> scene{N}/vo/L{k}.wav + scene{N}/timeline.json (voices.py format) + film.json.
Per line: trim edge silence, optional cap on long inner pauses (PAUSE_CAP), pitch for the kids (same length),
echo for the tree/Devata, a layered crowd for the villagers, level-matching, 30-fps loudness envelope."""
import json, os, subprocess, wave
import numpy as np
import plan
FPS, SR = 30, 44100
SPEED = float(os.environ.get("SPEED", "1.0"))           # natural pace; at most 1.05 if the film runs past 15 min
PAUSE_CAP = float(os.environ.get("PAUSE_CAP", "0"))     # 0 = keep Gemini's inner pauses as they are
PITCH = {"meera": 1.12, "chintu": 1.08}
FX = {"tree": "apad=pad_dur=0.45,aecho=0.8:0.72:45|95|170:0.32|0.22|0.12,highpass=f=120",
      "devata": "apad=pad_dur=0.35,aecho=0.8:0.8:35|80:0.24|0.14"}
LEVEL = {"tree": -22.0}                                # voiced-RMS target dBFS (default -20)
# scene: lead_in, tail, holds {scene-local line index: seconds after that line (replaces the normal gap), why}
SCENES = {
 1: (1.0, 3.5, {1: (1.0, "whisper hangs"), 2: (4.5, "title card"), 4: (2.5, "montage: swings, deer, rain"),
                5: (1.2, "jeep, Veerendra steps out"), 6: (2.0, "axe montage"), 7: (3.0, "time-lapse green to brown")}),
 2: (1.0, 2.0, {2: (0.8, "dusk at Thatayya's"), 5: (1.5, "dusk to night"), 6: (0.8, "glow"), 7: (1.0, "motes"),
                8: (0.8, "trunk breathes"), 9: (0.8, "eyes of light")}),
 3: (0.8, 3.0, {1: (1.0, "paper flashback"), 3: (1.2, "ground opens"), 4: (0.8, "seed symbols"), 6: (0.8, "handkerchief")}),
 4: (1.2, 2.5, {3: (0.8, "dosa drop"), 4: (1.2, "walk to the cave"), 5: (1.2, "roar shake"), 8: (0.8, "thorns"),
                9: (1.2, "fawn looks back")}),
 5: (1.5, 2.5, {0: (0.8, "Chintu flops"), 6: (1.5, "sparrow drinks, flies"), 7: (0.6, "")}),
 6: (1.5, 3.0, {1: (1.0, ""), 2: (1.0, "locket insert"), 4: (1.5, "silence"), 5: (1.5, "locket placed")}),
 7: (1.2, 3.0, {1: (0.8, "axe raised"), 5: (0.8, "hands clasp"), 6: (1.5, "storm builds")}),
 8: (0.8, 2.5, {0: (1.0, "axes slip"), 3: (0.8, "memory images"), 4: (0.8, "wind spiral"), 5: (1.0, "storm stops"),
                7: (0.8, ""), 8: (1.5, "paper flashback: young Veerendra")}),
 9: (1.5, 10.0, {0: (0.8, "rain everywhere"), 1: (4.0, "montage: pond fills, fawn, birds"), 2: (1.2, "villagers dance"),
                 3: (0.8, ""), 5: (3.0, "planting montage + seasons wipe"), 6: (1.5, "sapling 'అమ్మ'"),
                 8: (1.0, "golden hour"), 9: (2.0, "rainbow crane"), 10: (1.5, "శుభం title")}),
}
def gap(prev, cur):
    if prev["who"] == cur["who"]: return 0.65
    if len(prev["text"]) < 45 and len(cur["text"]) < 45: return 0.4
    return 0.5
def rd(p):
    with wave.open(p) as w: return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
def wr(p, a):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())
def ff(src, dst, af): subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", src, "-af", af, "-ac", "1", "-ar", str(SR), dst], check=True)
def cap_pauses(a, cap):
    hop = SR // 100; fr = len(a) // hop
    rms = np.sqrt(np.mean(a[:fr * hop].reshape(fr, hop) ** 2, axis=1)); loud = rms > 0.03 * rms.max()
    keep = np.ones(fr, bool); k = 0
    while k < fr:
        if not loud[k]:
            j = k
            while j < fr and not loud[j]: j += 1
            n = j - k; m = int(cap * 100)
            if n > m: s = k + m // 2; keep[s:s + n - m] = False
            k = j
        else: k += 1
    return np.concatenate([a[i * hop:(i + 1) * hop] for i in range(fr) if keep[i]] + [a[fr * hop:]])
def level(a, who):
    hop = SR // 100; fr = len(a) // hop
    rms = np.sqrt(np.mean(a[:fr * hop].reshape(fr, hop) ** 2, axis=1)); v = rms[rms > 0.1 * rms.max()]
    g = 10 ** (LEVEL.get(who, -20.0) / 20) / max(np.sqrt(np.mean(v ** 2)), 1e-5)
    g = min(g, 10 ** (-1 / 20) / max(np.abs(a).max(), 1e-5)); return a * g
def process(i, who, out, src=None, tempo=1.0):
    """tempo: extra time-stretch folded into the SPEED atempo (retake25.py uses it to fit a new take to its old slot)."""
    src = src or (f"lines/L{i}_fix.wav" if os.path.exists(f"lines/L{i}_fix.wav") else f"lines/L{i}_raw.wav")
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    p = PITCH.get(who, 1.0)
    af = trim + (f",asetrate={SR}*{p},aresample={SR},atempo={SPEED * tempo / p:.6f}" if p != 1 or SPEED * tempo != 1 else "")
    tmp = out + ".tmp.wav"; ff(src, tmp, af)
    a = rd(tmp)
    if PAUSE_CAP: a = cap_pauses(a, PAUSE_CAP)
    if who == "villagers":   # a small crowd from one take: + a lower and a higher copy, slightly late
        wr(tmp, a)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-filter_complex",
            f"[0]asplit=3[a][b][c];[b]asetrate={SR}*0.84,aresample={SR},atempo=1.1905,adelay=140,volume=0.7[b2];"
            f"[c]asetrate={SR}*1.18,aresample={SR},atempo=0.8475,adelay=260,volume=0.55[c2];"
            "[a][b2][c2]amix=inputs=3:duration=longest:normalize=0", "-ac", "1", "-ar", str(SR), tmp + "c.wav"], check=True)
        a = rd(tmp + "c.wav"); os.unlink(tmp + "c.wav")
    if who in FX: wr(tmp, a); ff(tmp, tmp + "2.wav", FX[who]); a = rd(tmp + "2.wav"); os.unlink(tmp + "2.wav")
    a = level(a, who); wr(out, a); os.unlink(tmp)
    hop = SR // FPS
    env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
    m = max(env) or 1
    return len(a) / SR, [round(min(1, e / m * 1.4), 3) for e in env]
if __name__ == "__main__":
    d, L = plan.load(); film, T = [], 0.0
    for s in d["scenes"]:
        n = s["n"]; lead, tail, holds = SCENES[n]
        os.makedirs(f"scene{n}/vo", exist_ok=True)
        lines = [l for l in L if l["scene"] == n]; t = lead; out = []; speech = 0.0
        for k, l in enumerate(lines):
            if k: t += holds[k - 1][0] if k - 1 in holds else gap(lines[k - 1], l)
            dur, env = process(l["id"], l["who"], f"scene{n}/vo/L{k}.wav"); speech += dur
            out.append({"i": k, "id": l["id"], "who": l["who"], "text": l["text"], "start": round(t, 3), "dur": round(dur, 3), "env": env})
            t += dur
        total = round(t + tail, 2)
        json.dump({"fps": FPS, "scene": n, "title": s["title"], "lead_in": lead, "tail": tail,
                   "holds": [{"after": k, "sec": h[0], "for": h[1]} for k, h in sorted(holds.items())],
                   "lines": out, "dur": total}, open(f"scene{n}/timeline.json", "w"), ensure_ascii=False)
        film.append({"scene": n, "title": s["title"], "start": round(T, 2), "dur": total, "speech": round(speech, 2),
                     "lead_in": lead, "tail": tail, "lines": len(out), "timeline": f"scene{n}/timeline.json"})
        print(f"scene {n}: {total:7.2f}s (speech {speech:6.2f}s, {len(out)} lines) starts {T:7.2f}s")
        T += total
    json.dump({"fps": FPS, "speed": SPEED, "pause_cap": PAUSE_CAP, "scenes": film, "total": round(T, 2),
               "total_min": f"{int(T // 60)}:{T % 60:05.2f}"}, open("film.json", "w"), ensure_ascii=False, indent=1)
    print(f"total {T:.2f}s = {int(T // 60)}:{T % 60:05.2f}")
