"""Episode 1 'Mass Entry' voices: one Sarvam voice per character, kids pitched up.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync)."""
import base64, io, json, os, subprocess, wave
import numpy as np, requests

FPS = 30
CAST = {  # character -> (speaker, pitch factor)
    "gopi":   ("shubh", 1.0),     # narrator / friend
    "chinna": ("aayan", 1.22),    # kid hero
    "pandu":  ("rahul", 1.12),    # kid villain
    "pinky":  ("priya", 1.22),    # little sister
    "amma":   ("kavitha", 1.0),   # mom
}
LINES = [
    ("gopi",   "Hey! ఆగండి ఆగండి… మా colony లో ఈ రోజు పెద్ద scene జరిగింది!", 0.6),
    ("pandu",  "ఈ lollipop ఇక నాదే! హ హ హ!", 0.3),
    ("pinky",  "అన్నయ్యా…!", 0.2),
    ("gopi",   "అప్పుడే… slow motion లో… వచ్చాడు మా Chinna!", 0.5),
    ("chinna", "Pandu… lollipop తిరిగి ఇచ్చెయ్. లేదంటే…", 0.9),
    ("pandu",  "లేదంటే ఏం చేస్తావ్ రా?", 0.3),
    ("chinna", "ఇదే చేస్తా!", 0.3),
    ("amma",   "చిన్నా! Homework చేయకుండా బయట ఏం చేస్తున్నావ్ రా?!", 2.8),   # after the fight
    ("chinna", "అమ్మా… just two minutes!", 0.4),
    ("gopi",   "Mass hero అయినా… అమ్మ ముందు zero! Follow Reel Rasam!", 0.9),
]

def tts(text, speaker):
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60,
                      headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": text, "target_language_code": "te-IN", "model": "bulbul:v3",
                            "speaker": speaker, "pace": 1.15, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status()
    return base64.b64decode(r.json()["audios"][0])

t, out = 0.0, []
for i, (who, text, gap) in enumerate(LINES):
    spk, pitch = CAST[who]
    raw = f"vo/L{i}_raw.wav"; open(raw, "wb").write(tts(text, spk))
    dst = f"vo/L{i}.wav"
    af = f"asetrate=44100*{pitch},aresample=44100,atempo={1/pitch:.4f}" if pitch != 1.0 else "anull"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
    with wave.open(dst) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    dur = len(a) / 44100
    hop = 44100 // FPS
    env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
    m = max(env) or 1
    env = [round(min(1, e / m * 1.4), 3) for e in env]
    t += gap
    out.append({"i": i, "who": who, "text": text, "start": round(t, 3), "dur": round(dur, 3), "env": env})
    t += dur
json.dump({"fps": FPS, "lines": out, "dur": round(t + 2.2, 2)}, open("timeline.json", "w"), ensure_ascii=False)
for l in out: print(l["i"], l["who"], l["start"], l["dur"])
print("total", round(t + 2.2, 2))
