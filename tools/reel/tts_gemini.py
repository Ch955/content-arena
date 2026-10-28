"""Reel voiceover — narrator Gopi on Gemini TTS (owner-approved 28 Oct 2026), same takes/checks as comedy.

Usage: python tts_gemini.py lines.json
lines.json: {"s1": "Hey! ఆగండి…", "s2": {"text": "...", "act": "excited countdown"}, ...}
Writes vo/<key>.wav (44.1 kHz mono) + durs.json. ~₹1–2 per reel (Google trial credit).
"""
import json
import sys
from pathlib import Path

from content_arena import assemble

HERE = Path(__file__).parent
lines = json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))
(HERE / "vo").mkdir(exist_ok=True)
durs = {}
for key, line in lines.items():
    line = {"text": line} if isinstance(line, str) else line
    durs[key] = round(assemble.tts({"who": "gopi", "act": "an energetic host talking straight to the viewer", **line},
                                   HERE / "vo" / f"{key}.wav"), 2)
(HERE / "durs.json").write_text(json.dumps({"durations": durs}))
print(durs, "total", round(sum(durs.values()), 1))
