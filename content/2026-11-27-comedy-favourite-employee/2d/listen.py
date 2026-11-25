"""Check takes with the Gemini listener, SEVERAL CLIPS PER REQUEST (credits are low): every clip goes in as its own
audio part, labelled 'Clip N', and the listener returns one transcript per clip as JSON. Lines are compared with their
text (Telugu letters + Latin words, like stt_check.py); FAAAH/chorus takes are described.
Usage: python listen.py lines [i ...] | python listen.py takes  -> listen.json"""
import base64, difflib, json, os, re, subprocess, sys, time, glob
import requests
src = open("voices.py").read(); a = src.index("LINES = ["); ns = {"INTRO": 0.6, "POST": 5.3}
exec(src[a:src.index("\n]\n", a) + 3], ns); LINES = ns["LINES"]
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*"); norm = lambda s: re.sub(r"[^ఀ-౿a-z]", "", s.lower())
API = "https://generativelanguage.googleapis.com/v1beta/models"
MODELS = ("gemini-3.5-flash", "gemini-3-flash-preview", "gemini-flash-latest", "gemini-3.5-flash-lite", "gemini-3.1-flash-lite", "gemini-flash-lite-latest")

def b64(path):
    small = "/tmp/_l16k.wav"; subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", path, "-ac", "1", "-ar", "16000", small], check=True)
    return base64.b64encode(open(small, "rb").read()).decode()

def ask(paths, q):
    parts = []
    for n, p in enumerate(paths, 1): parts += [{"text": f"Clip {n}:"}, {"inlineData": {"mimeType": "audio/wav", "data": b64(p)}}]
    parts.append({"text": q})
    body = {"contents": [{"role": "user", "parts": parts}], "generationConfig": {"responseMimeType": "application/json"}}
    for rnd in range(3):
        for m in MODELS:
            try: r = requests.post(f"{API}/{m}:generateContent", json=body, timeout=180)
            except requests.RequestException as e: print("  ", m, e.__class__.__name__, flush=True); continue
            if r.status_code == 200:
                try:
                    t = " ".join(x.get("text", "") for x in r.json()["candidates"][0]["content"]["parts"] if not x.get("thought")).strip()
                    return m, json.loads(t)
                except (KeyError, IndexError, ValueError) as e: print("  ", m, "bad answer", e, flush=True); continue
            print("  ", m, r.status_code, flush=True)
        time.sleep(30)
    raise RuntimeError("no listener")

res = json.load(open("listen.json")) if os.path.exists("listen.json") else {}
mode = sys.argv[1] if len(sys.argv) > 1 else "lines"
if mode == "lines":
    idx = [int(x) for x in sys.argv[2:]] or list(range(len(LINES)))
    for k in range(0, len(idx), 15):
        grp = idx[k:k + 15]
        m, ans = ask([f"{os.environ.get('SRC', 'vo')}/L{i}_raw.wav" for i in grp],
                     f"There are {len(grp)} clips. Transcribe exactly what is spoken in EACH clip (Telugu in Telugu script, English words in Latin letters). "
                     "Also note if a clip contains a second speaker, words from another line, or someone reading out instructions. "
                     'Reply as JSON: {"1": {"text": "...", "issue": "none or a short note"}, "2": ...}')
        for n, i in enumerate(grp, 1):
            a_ = ans.get(str(n), {}); heard = a_.get("text", "") if isinstance(a_, dict) else str(a_)
            exp = TAGS.sub("", LINES[i][4]).strip(); sim = difflib.SequenceMatcher(None, norm(heard), norm(exp)).ratio()
            res[f"L{i}"] = {"expected": exp, "heard": heard, "issue": a_.get("issue") if isinstance(a_, dict) else None, "sim": round(sim, 2), "by": m}
            print(f"L{i} [{m}] sim={sim:.2f} issue={res[f'L{i}']['issue']}\n  exp: {exp}\n  got: {heard}", flush=True)
        json.dump(res, open("listen.json", "w"), ensure_ascii=False, indent=1)
else:
    paths = sorted(glob.glob("faaah/take_*.wav")) + sorted(glob.glob("chorus/*.wav"))
    m, ans = ask(paths, f"There are {len(paths)} short vocal clips. For EACH clip say what is heard: the words (if any), how many voices, "
                 "whether it is one long dramatic shout like 'Faaaah!', a cheerful Telugu 'మీరే సార్!' (Meere Sir!), or something else/extra (speech, "
                 'instructions read aloud, noise, silence). Reply as JSON: {"1": {"heard": "...", "kind": "SHOUT|CHORUS|OTHER", "clean": true/false, "note": "..."}, ...}')
    for n, p in enumerate(paths, 1):
        res[p] = ans.get(str(n)); print(p, "->", res[p], flush=True)
    json.dump(res, open("listen.json", "w"), ensure_ascii=False, indent=1)
