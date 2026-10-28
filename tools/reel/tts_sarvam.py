"""Intro reel voiceover: Sarvam bulbul:v3, speaker shubh, pace 1.18 (~12% faster than the 1.05 sample)."""
import base64, io, json, os, wave
from pathlib import Path
import requests

HERE = Path(__file__).parent
LINES = {
    "s1": "నమస్కారం అండీ! Welcome to Reel Rasam — మీ daily cinema rasam!",
    "s2": "ఇక్కడ రోజూ, మూడు రకాల rasam serve చేస్తాం.",
    "s3": "One — This Week on OTT. ప్రతి Friday, ఈ వారం OTT లో ఏ సినిమాలు వస్తున్నాయో, ఒకే post లో.",
    "s4": "Two — Quiz Time. ప్రతి రోజు ఒక movie quiz. మీ Tollywood knowledge ని test చేసుకోండి!",
    "s5": "Three — Box Office 101. Gross, net, share — cinema business ని simple గా explain చేస్తాం, real numbers తో.",
    "s6": "No gossip, no fake news. Sources తో verified facts మాత్రమే.",
    "s7": "So follow అవ్వండి, notifications on చేయండి. రోజుకో సినిమా రసం — Reel Rasam!",
}
durs = {}
for key, text in LINES.items():
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60,
                      headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": text, "target_language_code": "te-IN", "model": "bulbul:v3",
                            "speaker": "shubh", "pace": 1.18, "speech_sample_rate": 44100})
    r.raise_for_status()
    data = base64.b64decode(r.json()["audios"][0])
    (HERE / "vo" / f"{key}.wav").write_bytes(data)
    with wave.open(io.BytesIO(data)) as w:
        durs[key] = round(w.getnframes() / w.getframerate(), 2)
(HERE / "durs.json").write_text(json.dumps({"durations": durs}))
print(durs, "total", round(sum(durs.values()), 1))
