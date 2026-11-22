"""Transcribe candidate cuts of the batch takes in ONE listener request (to find the exact batch-bleed boundaries).
Usage: python cand.py file:start:end ...  -> cand/check.json"""
import base64, json, subprocess, sys, time, requests
API = "https://generativelanguage.googleapis.com/v1beta/models"
MODELS = ("gemini-3-flash-preview", "gemini-3.5-flash", "gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite")
specs = sys.argv[1:]; parts = []
for n, s in enumerate(specs, 1):
    f, a, b = s.split(":"); p = f"cand/c{n}.wav"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f, "-ss", a, "-to", b, "-ac", "1", "-ar", "16000", p], check=True)
    parts += [{"text": f"Clip {n}:"}, {"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(p, "rb").read()).decode()}}]
parts.append({"text": f"There are {len(specs)} short clips cut from Telugu/English speech. Transcribe EXACTLY what is audible in each clip "
              "(Telugu in Telugu script, English in Latin letters; write [laugh] for a laugh, [none] for silence, and mark a word cut off at the edge with ~). "
              'Reply as JSON: {"1": "...", "2": "..."}'})
body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseMimeType": "application/json"}}
for rnd in range(3):
    for m in MODELS:
        r = requests.post(f"{API}/{m}:generateContent", json=body, timeout=180)
        if r.status_code == 200:
            t = " ".join(x.get("text", "") for x in r.json()["candidates"][0]["content"]["parts"] if not x.get("thought"))
            ans = json.loads(t); out = {s: ans.get(str(n)) for n, s in enumerate(specs, 1)}
            for s, v in out.items(): print(f"{s:34s} {v}")
            json.dump({"by": m, "res": out}, open("cand/check.json", "w"), ensure_ascii=False, indent=1); sys.exit()
        print(m, r.status_code, flush=True)
    time.sleep(30)
