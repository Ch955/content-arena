"""Ask the Gemini listener about one short segment: python seg_check.py file.wav 'question'"""
import base64, subprocess, sys, time, requests
path, q = sys.argv[1], sys.argv[2]
small = path + ".16k.wav"; subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", path, "-ac", "1", "-ar", "16000", small], check=True)
body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(small, "rb").read()).decode()}}, {"text": q}]}]}
for rnd in range(4):
    for m in ("gemini-3.5-flash-lite", "gemini-3.5-transcribe", "gemini-3.1-flash-lite", "gemini-flash-lite-latest"):
        try:
            r = requests.post(f"https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent", json=body, timeout=90)
            if r.status_code == 200: print(m, "->", " ".join(x.get("text","") for x in r.json()["candidates"][0]["content"]["parts"] if not x.get("thought")).strip()); sys.exit()
            print(m, r.status_code)
        except Exception as e: print(m, e.__class__.__name__)
    time.sleep(15)
