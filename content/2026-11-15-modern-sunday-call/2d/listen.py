import base64, sys, requests
for p in sys.argv[1:]:
    body = {"contents": [{"role": "user", "parts": [{"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(p, "rb").read()).decode()}},
            {"text": "Transcribe exactly what is spoken (Telugu in Telugu script, English words in English). Note any laughter in brackets. Reply with the transcript only."}]}]}
    r = requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent", json=body, timeout=120)
    print(p, "->", r.json()["candidates"][0]["content"]["parts"][0]["text"].strip() if r.ok else r.status_code)
