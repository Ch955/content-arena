"""Intelligibility spot-check of the final mix: cut lines out of work/render/film.mp4 (voice + score + effects), run Sarvam STT
(saarika:v2.5, te-IN) and compare with the script text and with the clean voice's STT score (voices/final_stt.json).
  .venv/bin/python work/mix/stt_check.py 7:6 8:4 9:2 ...      (scene:line, line = index in that scene's timeline)"""
import difflib, json, os, re, subprocess, sys, tempfile
from pathlib import Path
import requests
WORK = Path(__file__).resolve().parents[1]
film = json.loads((WORK / "voices" / "film.json").read_text()); chap = json.loads((WORK / "mix" / "chapters.json").read_text())
start = {c["scene"]: c["start"] for c in chap}; clean = json.loads((WORK / "voices" / "final_stt.json").read_text())
tel = lambda s: re.sub(r"[^ఀ-౿]", "", s)
for arg in sys.argv[1:]:
    n, i = map(int, arg.split(":")); L = json.loads((WORK / "voices" / f"scene{n}" / "timeline.json").read_text())["lines"][i]
    a = start[n] + L["start"] - .15; d = L["dur"] + .3
    with tempfile.TemporaryDirectory() as td:
        wav = Path(td) / "cut.wav"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.3f}", "-t", f"{d:.3f}", "-i", str(WORK / "render" / "film.mp4"), "-vn", "-ac", "1", "-ar", "16000", str(wav)], check=True)
        r = requests.post("https://api.sarvam.ai/speech-to-text", timeout=120, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                          files={"file": ("cut.wav", open(wav, "rb"), "audio/wav")}, data={"model": "saarika:v2.5", "language_code": "te-IN"})
    r.raise_for_status(); got = r.json().get("transcript", "")
    sim = difflib.SequenceMatcher(None, tel(got), tel(L["text"])).ratio(); ref = clean.get(f"s{n}L{i}", {}).get("sim")
    print(f"scene {n} line {i} ({L['who']}, film {a:.1f}s): mix sim {sim:.2f}  clean-voice sim {ref}\n  got: {got}")
