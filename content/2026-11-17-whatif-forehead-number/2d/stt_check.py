"""Check every take: transcribe vo/L{i}_raw.wav and compare with the line's text (Telugu letters + Latin words).
Sarvam STT (saarika:v2.5) first; on 17 Nov 2026 the Sarvam key had no credits (402), so it falls back to the Gemini
listener (gemini-flash-latest, the same listener voices.py templates use). Usage: python stt_check.py [i ...]"""
import base64, difflib, json, os, re, subprocess, sys, time
import requests

src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "voices.py")).read()
a = src.index("LINES = ["); ns = {"COUNTDOWN": 5.0}; exec(src[a:src.index("\n]\n", a) + 3], ns)
LINES = ns["LINES"]
only = [int(x) for x in sys.argv[1:]] or range(len(LINES))
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
norm = lambda s: re.sub(r"[^ఀ-౿a-z]", "", s.lower())
API = "https://generativelanguage.googleapis.com/v1beta/models"

def sarvam(path):
    r = requests.post("https://api.sarvam.ai/speech-to-text", timeout=120, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      files={"file": (os.path.basename(path), open(path, "rb"), "audio/wav")}, data={"model": "saarika:v2.5", "language_code": "te-IN"})
    r.raise_for_status(); return r.json().get("transcript", "")

def gemini(path):
    small = path + ".16k.wav"; subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", path, "-ac", "1", "-ar", "16000", small], check=True)
    body = {"contents": [{"role": "user", "parts": [
        {"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(small, "rb").read()).decode()}},
        {"text": "Transcribe exactly what is spoken (Telugu in Telugu script, English words in Latin letters). Reply with the transcript only."}]}]}
    for rnd in range(6):
        for model in ("gemini-3.5-flash", "gemini-2.5-flash", "gemini-3.8-flash", "gemini-flash-latest", "gemini-2.5-pro"):
            try: r = requests.post(f"{API}/{model}:generateContent", json=body, timeout=60)
            except requests.RequestException as e: print("  ", model, e.__class__.__name__, flush=True); continue
            if r.status_code == 200:
                try: return r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
                except (KeyError, IndexError): pass
            print("  ", model, r.status_code, flush=True)
        time.sleep(20 * (rnd + 1))
    raise RuntimeError("no listener available")

use_sarvam = True
res = json.load(open("stt_check.json")) if os.path.exists("stt_check.json") else {}
for i in only:
    path = f"{os.environ.get('SRC', 'vo')}/L{i}_raw.wav"
    tr, by = None, "sarvam"
    if use_sarvam:
        try: tr = sarvam(path)
        except requests.HTTPError as e: print("  Sarvam STT unavailable:", e.response.status_code, "-> Gemini listener"); use_sarvam = False
    if tr is None: tr, by = gemini(path), "gemini"
    exp = TAGS.sub("", LINES[i][4]).strip()
    sim = difflib.SequenceMatcher(None, norm(tr), norm(exp)).ratio()
    res[str(i)] = {"expected": exp, "heard": tr, "by": by, "sim": round(sim, 2)}
    print(f"L{i} [{by}] sim={sim:.2f}\n  exp: {exp}\n  got: {tr}", flush=True)
    json.dump(res, open("stt_check.json", "w"), ensure_ascii=False, indent=1)
