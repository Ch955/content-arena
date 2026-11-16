"""STT every processed line (scene{N}/vo/L{k}.wav) with Sarvam saarika:v2.5 -> final_stt.json; also writes a voice-only
mix per scene (scene{N}/vo_mix.wav) and for the film (film_vo.wav) at the timeline positions.
MIX_ONLY=1 python final_check.py   rebuilds only the mixes (no STT requests; final_stt.json is left as it is)."""
import difflib, json, os, re, time, wave
import numpy as np, requests
tel = lambda s: re.sub(r"[^ఀ-౿]", "", s)
film = json.load(open("film.json")); out = {}; SR = 44100; full = []
MIX_ONLY = os.environ.get("MIX_ONLY") == "1"
for sc in film["scenes"]:
    n = sc["scene"]; tl = json.load(open(f"scene{n}/timeline.json"))
    mix = np.zeros(int(tl["dur"] * SR) + SR)
    for l in tl["lines"]:
        p = f"scene{n}/vo/L{l['i']}.wav"
        with wave.open(p) as w: a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float)
        s = int(l["start"] * SR); mix[s:s + len(a)] += a
        if MIX_ONLY: continue
        for k in range(4):
            r = requests.post("https://api.sarvam.ai/speech-to-text", timeout=120, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                              files={"file": (os.path.basename(p), open(p, "rb"), "audio/wav")}, data={"model": "saarika:v2.5", "language_code": "te-IN"})
            if r.status_code == 200: break
            time.sleep(4)
        tr = r.json().get("transcript", "") if r.status_code == 200 else f"ERROR {r.status_code}"
        sim = difflib.SequenceMatcher(None, tel(tr), tel(l["text"])).ratio()
        out[f"s{n}L{l['i']}"] = {"id": l["id"], "who": l["who"], "start": l["start"], "dur": l["dur"], "sim": round(sim, 2), "expected": l["text"], "heard": tr}
        print(f"s{n} L{l['i']:2d} (id {l['id']:2d}) {l['who']:9s} {l['dur']:5.1f}s sim {sim:.2f}", flush=True)
    mix = mix[:int(tl["dur"] * SR)]
    with wave.open(f"scene{n}/vo_mix.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.clip(mix, -32767, 32767).astype(np.int16).tobytes())
    full.append(mix)
f = np.concatenate(full)
with wave.open("film_vo.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(np.clip(f, -32767, 32767).astype(np.int16).tobytes())
if not MIX_ONLY: json.dump(out, open("final_stt.json", "w"), ensure_ascii=False, indent=1)
print("film_vo.wav", len(f) / SR, "s")
