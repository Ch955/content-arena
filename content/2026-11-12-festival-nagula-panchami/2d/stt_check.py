"""Transcribe vo/L{i}_raw.wav with Sarvam saarika:v2.5 (te-IN) and compare with each line's text.
Usage: python stt_check.py [i ...]   (default: all lines). Prints transcript + a Telugu-letter similarity."""
import difflib, json, os, re, sys, time
import requests

sys.argv  # noqa
ns = {"COUNTDOWN": 3.0}
src = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "voices.py")).read()
a = src.index("LINES = ["); exec(src[a:src.index("]\n", a) + 2], ns)
LINES = ns["LINES"]
only = [int(x) for x in sys.argv[1:]] or range(len(LINES))
tel = lambda s: re.sub(r"[^ఀ-౿]", "", s)
res = {}
for i in only:
    path = f"vo/L{i}_raw.wav"
    for k in range(4):
        r = requests.post("https://api.sarvam.ai/speech-to-text", timeout=120,
                          headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                          files={"file": (os.path.basename(path), open(path, "rb"), "audio/wav")},
                          data={"model": "saarika:v2.5", "language_code": "te-IN"})
        if r.status_code == 200: break
        print("  retry", r.status_code, r.text[:120]); time.sleep(5)
    r.raise_for_status()
    tr = r.json().get("transcript", "")
    exp = LINES[i][4] if len(LINES[i]) > 4 else LINES[i][1]
    sim = difflib.SequenceMatcher(None, tel(tr), tel(exp)).ratio()
    res[i] = {"expected": exp, "heard": tr, "sim": round(sim, 2)}
    print(f"L{i} sim={sim:.2f}\n  exp: {exp}\n  got: {tr}", flush=True)
json.dump(res, open("stt_check.json", "w"), ensure_ascii=False, indent=1)
