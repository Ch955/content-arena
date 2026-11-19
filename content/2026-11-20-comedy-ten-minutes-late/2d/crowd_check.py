"""Classify every crowd take with the Gemini listener (is it an 'ooh', a gasp, a laugh or a cheer?) -> crowd/check.json"""
import base64, json, glob, os, subprocess, time, requests
res = json.load(open("crowd/check.json")) if os.path.exists("crowd/check.json") else {}
Q = ("This clip is one short vocal reaction from an audience member. Classify it as exactly one word: OOH (a long 'ooooh'), "
     "GASP (a short shocked gasp), LAUGH (laughter), CHEER (hooray / yay / woohoo), or MIXED (two different kinds). Reply: WORD | what you hear in 3-6 words.")
for p in sorted(glob.glob("crowd/c[123]_*.wav")):
    if p in res or p.endswith(".16k.wav"): continue
    small = p + ".16k.wav"; subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", p, "-ac", "1", "-ar", "16000", small], check=True)
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(small, "rb").read()).decode()}}, {"text": Q}]}]}
    ans = None
    for m in ("gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-lite-latest", "gemini-3.1-flash-lite-preview"):
        r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent", json=body, timeout=90)
        if r.status_code == 200:
            try: ans = r.json()["candidates"][0]["content"]["parts"][0]["text"].strip(); break
            except (KeyError, IndexError): pass
    os.remove(small)
    res[p] = ans; print(p, "->", ans, flush=True); json.dump(res, open("crowd/check.json", "w"), indent=1); time.sleep(4)
