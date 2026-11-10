"""Podupu Katha #3 (rain riddle) 2D animated reel voices. Gemini TTS via the AI Studio key,
Gopi=Puck + Pinky=Leda. Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
The whole reel is voiced in a few requests (content_arena.scenevoice: up to 8 lines per call as a two-voice
conversation, cut back into lines at the pauses) because the free tier allows only ~10 TTS requests a day.
Lines it can't split cleanly are voiced one by one; if Gemini refuses, those lines fall back to Sarvam.
Re-take lines with `python voices.py 3 4`; `VOICE=sarvam python voices.py` voices everything with Sarvam."""
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

FPS = 30
PACE, TEMP = 1.1, 1.0
COUNTDOWN = 5.0
CAST = {  # character -> (Gemini voice, pitch factor)
    "gopi":  ("Puck", 1.0),      # host
    "pinky": ("Leda", 1.12),     # little sister, the guesser
}
PERSONA = {"gopi": "You are Gopi, a lively young Telugu storyteller talking straight to the viewer like a close friend.",
           "pinky": "You are Pinky, a sweet, curious 6-year-old Telugu girl."}
LINES = [  # (who, subtitle text, gap before, acting direction[, spoken text if different])  -- from script.json; beat in the comment
    ("gopi",  "Hey! ఆగండి… ఈ riddle 90% మంది solve చేయలేరు!", 0.6, "bright, challenging hook"),                          # 0 hook
    ("gopi",  "Answer చివర్లో ఉంది… చివరి వరకు చూడండి!", 0.4, "teasing, secretive"),                                    # 1 hold
    ("gopi",  "ఒక అంకుల్… జోరు వర్షంలో ఇంటికి నడిచి వెళ్ళాడు.", 0.5, "storyteller, rain atmosphere"),                 # 2 story
    ("gopi",  "గొడుగు లేదు… టోపీ లేదు… raincoat కూడా లేదు!", 0.4, "counting off on fingers, building suspense"),        # 3 story
    ("gopi",  "బట్టలన్నీ తడిసిపోయాయి… కానీ తలపై ఒక్క వెంట్రుక కూడా తడవలేదు!", 0.45, "amazed, mysterious"),            # 4 clue
    ("gopi",  "ఇలాంటివి రోజూ కావాలంటే… follow చేయండి, YouTube లో subscribe!", 0.7, "quick friendly aside"),          # 5 follow
    ("pinky", "అన్నయ్యా… raincoat వేసుకున్నాడా?", 0.6, "unsure, hopeful guess"),                                         # 6 guess
    ("gopi",  "ఉహూ! Raincoat లేదని చెప్పాను కదా! Answer reveal అయ్యే ముందే… comment లో చెప్పండి!", 0.5, "playful no, then urgent quiz-host energy"),  # 7 comment-countdown
    ("gopi",  "Answer… ఆ అంకుల్ కి బట్టతల!", 0.35 + COUNTDOWN + 0.4, "dramatic pause, then a big laughing reveal"),    # 8 reveal (after the 5 s countdown)
    ("gopi",  "తడవడానికి… తలపై వెంట్రుకలే లేవు!", 0.5, "laughing, delighted explanation"),                              # 9 why
    ("pinky", "హహ! భలే riddle!", 0.55, "giggling, amazed"),                                                               # 10 react
    ("gopi",  "మీ answer correct ఆ? Comment లో ✅ పెట్టండి!", 0.6, "warm, inviting", "మీ answer correct ఆ? Comment లో tick పెట్టండి!"),  # 11 check (spoken: tick)
    ("gopi",  "ఈ riddle మీ friend కి share చేసి… వాళ్ళ brain test చేయండి! Follow… subscribe… రేపు ఇంకో twist!", 0.45, "energetic, smiling sign-off"),  # 12 share-close
]

import difflib, re, time
API = "https://generativelanguage.googleapis.com/v1beta/models"
TTS_MODELS = ["gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview", "gemini-3.8-flash-tts"]  # next one is used once a model's daily free quota is gone
def studio(model, body):
    for wait in (0, 20, 40, 60, 90, 120):
        time.sleep(wait)
        r = requests.post(f"{API}/{model}:generateContent", json=body, timeout=120)
        if r.status_code != 429: break
        if "PerDay" in r.text: break   # daily quota: waiting won't help
        print("  rate-limited, waiting", flush=True)
    r.raise_for_status()
    return r.json()

def tts_call(body):
    while True:
        try: return studio(TTS_MODELS[0], body), TTS_MODELS[0]
        except requests.HTTPError as e:
            if e.response is not None and e.response.status_code == 429 and "PerDay" in e.response.text and len(TTS_MODELS) > 1:
                print(f"  {TTS_MODELS[0]}: daily free quota used up -> {TTS_MODELS[1]}", flush=True); TTS_MODELS.pop(0)
            else: raise

def heard_ok(expected, wav):
    """Gemini listener: does the take say just the line? (best-effort, never blocks)"""
    try:
        out = studio("gemini-flash-latest", {"contents": [{"role": "user", "parts": [
            {"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(open(wav, "rb").read()).decode()}},
            {"text": "Transcribe exactly what is spoken. Reply with the transcript only."}]}]})
        heard = out["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        print("  listener skipped:", e); return True
    norm = lambda s: re.sub(r"[\W_]+", "", s.lower())
    ok = len(norm(heard)) <= 1.5 * len(norm(expected)) + 6 or difflib.SequenceMatcher(None, norm(heard), norm(expected)).ratio() > 0.7
    print("  heard:", heard.strip()[:120], "| ok" if ok else "| RETAKE", flush=True)
    return ok

def dur_of(path):
    with wave.open(path) as w: return w.getnframes() / w.getframerate()

def tts(text, voice, who, act, tries=3):
    body = {"contents": [{"parts": [{"text": f"{PERSONA[who]} Speak natural Telugu (English words as Indians say them), "
                                             f"expressive and human, with natural pauses at '…'. The tone should be {act}. "
                                             f"Say only this line, nothing else:\n{text}"}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    for k in range(tries):
        if k: time.sleep(21)
        j, model = tts_call(body)
        open(f"vo/_model.txt", "w").write(model)
        pcm = base64.b64decode(j["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
        open("vo/_tmp.pcm", "wb").write(pcm)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "vo/_tmp.pcm",
                        "-ar", "44100", "vo/_tmp.wav"], check=True)
        d = dur_of("vo/_tmp.wav"); lim = max(3.5, 0.16 * len(text) * (1.5 if "recitation" in act else 1))
        print(f"  take {k}: {d:.2f}s (limit {lim:.1f})", flush=True)
        if d <= lim and heard_ok(text, "vo/_tmp.wav"): break
    return open("vo/_tmp.wav", "rb").read()

SARVAM = {"gopi": ("shubh", 1.0), "pinky": ("priya", 1.22)}
def tts_sarvam(text, who):
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60,
                      headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": text, "target_language_code": "te-IN", "model": "bulbul:v3", "speaker": SARVAM[who][0],
                            "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status()
    return base64.b64decode(r.json()["audios"][0])

only = {int(a) for a in sys.argv[1:]}   # re-take only these line numbers (keeps the other takes)
os.makedirs("vo", exist_ok=True)
todo = [i for i in range(len(LINES)) if not os.path.exists(f"vo/L{i}_raw.wav") or i in only]
sarvam_lines = set()
if todo and os.environ.get("VOICE") != "sarvam":   # 1) whole-reel batches (2–3 requests per reel)
    sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
    from content_arena import scenevoice
    batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": (LINES[i][4] if len(LINES[i]) > 4 else None)}
             for i in todo]
    got = scenevoice.voice_batch(batch, "vo_batch", {"Gopi": CAST["gopi"][0], "Pinky": CAST["pinky"][0]})
    for k, path in got.items():
        os.replace(path, f"vo/L{todo[k]}_raw.wav")
    todo = [i for k, i in enumerate(todo) if k not in got]
    if todo: print("  voicing one by one:", todo, flush=True)
elif todo:
    sarvam_lines = set(todo)
t, out = 0.0, []
for i, (who, text, gap, act, *say) in enumerate(LINES):
    spk, pitch = CAST[who]
    raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
    if i in todo:
        parts = [text]
        if i in sarvam_lines:
            open(raw, "wb").write(tts_sarvam(say[0] if say else text, who)); pitch = SARVAM[who][1]
        elif len(parts) == 1:
            try:   # 2) one-by-one Gemini; 3) Sarvam if Gemini refuses (quota)
                take = tts(say[0] if say else text, spk, who, act); os.replace("vo/_model.txt", f"vo/L{i}_model.txt"); time.sleep(21)
            except requests.HTTPError as e:
                print(f"  line {i}: Gemini refused ({e.response.status_code if e.response is not None else '?'}) -> Sarvam", flush=True)
                take = tts_sarvam(say[0] if say else text, who); pitch = SARVAM[who][1]
            open(raw, "wb").write(take)
        else:
            segs = []
            for j, ptxt in enumerate(parts):
                open(f"vo/L{i}_p{j}.wav", "wb").write(tts(ptxt, spk, who, act))
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f"vo/L{i}_p{j}.wav", "-af",
                                "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                                "-ac", "1", "-ar", "44100", f"vo/L{i}_t{j}.wav"], check=True)
                with wave.open(f"vo/L{i}_t{j}.wav") as w: segs.append(np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16))
            sil = np.zeros(int(0.32 * 44100), dtype=np.int16)
            pcm = np.concatenate([x for s_ in segs for x in (s_, sil)][:-1])
            with wave.open(raw, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(44100); w.writeframes(pcm.tobytes())
    # trim leading/trailing silence, then pitch the kid voice up (same length)
    af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    af += f",asetrate=44100*{pitch},aresample=44100,atempo={1.05/pitch:.4f}"  # owner: 5% faster
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
json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(t + 2.6, 2)}, open("timeline.json", "w"), ensure_ascii=False)
for l in out: print(l["i"], l["who"], l["start"], l["dur"])
print("total", round(t + 2.6, 2))
