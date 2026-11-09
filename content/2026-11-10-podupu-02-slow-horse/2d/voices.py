"""Podupu Katha #2 (2D animated) voices: Gemini TTS (AI Studio key), Gopi=Puck + Pinky=Leda, +5% speed.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
Each take is checked (length + a Gemini listener) and re-taken up to 3 times if it drags or reads the direction aloud."""
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
LINES = [  # (who, subtitle text, gap before, acting direction) -- text/act from script.json
    ("gopi",  "Hey! ఆగండి… ఈ race లో నెమ్మదిగా వెళ్ళినవాడే గెలుస్తాడు!", 0.6, "bright, intriguing hook, playful disbelief"),
    ("gopi",  "Answer చివర్లో ఉంది… చివరి వరకు చూడండి!", 0.4, "teasing, secretive"),
    ("gopi",  "ఒక ఊరి పెద్ద… ఇద్దరు కొడుకులకి ఒక పరీక్ష పెట్టాడు.", 0.45, "storyteller, inviting"),
    ("gopi",  "ఎవరి గుర్రం ఆఖరున చేరుతుందో… వాడికే నా పొలం!", 0.35, "imitating a stern old village elder"),
    ("gopi",  "ఇద్దరూ నత్తలా… రోజంతా నెమ్మదిగా!", 0.4, "comic, slowed-down exaggeration"),
    ("gopi",  "అప్పుడు ఒక తాతయ్య… రెండే మాటలు చెప్పాడు.", 1.0, "mysterious, lowering the voice"),
    ("gopi",  "వెంటనే ఇద్దరూ… full speed లో పరుగు!", 0.35, "sudden excitement, fast"),
    ("gopi",  "ఇలాంటివి రోజూ కావాలంటే… follow చేయండి, YouTube లో subscribe!", 0.7, "quick friendly aside"),
    ("pinky", "అన్నయ్యా… 'పరిగెత్తండి' అన్నాడా?", 0.6, "unsure, hopeful guess"),
    ("gopi",  "ఉహూ! Answer reveal అయ్యే ముందే… మీ answer comment లో పెట్టండి!", 0.55, "playful no, then urgent quiz-host energy"),
    ("gopi",  "ఆ రెండు మాటలు… గుర్రాలు మార్చుకోండి!", 0.35 + COUNTDOWN + 0.4, "dramatic pause, then a big satisfied reveal"),
    ("gopi",  "అన్న గుర్రం మీద తమ్ముడు… తమ్ముడి గుర్రం మీద అన్న!", 0.75, "explaining with delight"),
    ("gopi",  "ఎదుటివాడి గుర్రం ముందు చేరితే… తన గుర్రమే ఆఖరు!", 0.4, "aha moment, satisfied"),
    ("pinky", "అబ్బా! భలే trick!", 0.75, "amazed, clapping"),
    ("gopi",  "మీ answer correct ఆ? Comment లో ✅ పెట్టండి!", 0.5, "warm, inviting"),
    ("gopi",  "ఈ riddle friend కి share చేసి… వాళ్ళ brain check చేయండి! Follow… subscribe… రేపు ఇంకో twist!", 0.45, "energetic, smiling sign-off"),
]
SPOKEN = {"✅": "టిక్"}   # emoji in the subtitle, a word for the voice (Telugu script reads clearer than "tick")

import time, re, difflib
URL = "https://generativelanguage.googleapis.com/v1beta/models/"
# free tier: 10 requests/day per TTS model; when one is used up the next Gemini TTS model in the list is used
TTS_MODELS = os.environ.get("TTS_MODELS", "gemini-2.5-flash-preview-tts,gemini-3.1-flash-tts-preview").split(",")
USED = []
def studio(model, body):
    for wait in (0, 30, 60, 90, 120, 180, 240):
        time.sleep(wait)
        r = requests.post(URL + model + ":generateContent", json=body, timeout=120)
        if r.status_code not in (429, 500, 502, 503): break
        if r.status_code == 429 and "PerDay" in r.text: break   # daily quota: waiting won't help (tts() moves to the next model)
        try: msg = r.json()["error"]["message"].split("\n")[0][:160]
        except Exception: msg = ""
        print("  busy/rate-limited (%d), waiting" % r.status_code, msg, flush=True)
    r.raise_for_status()
    return r.json()

def heard_ok(expected, wav_bytes):
    """Gemini listener: the take must say just the line (it sometimes reads the direction aloud)."""
    heard = None
    for model in ("gemini-3.5-flash", "gemini-3.8-flash"):   # gemini-2.5-flash is closed to new keys
        try:
            out = studio(model, {"contents": [{"role": "user", "parts": [
                {"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(wav_bytes).decode()}},
                {"text": "Transcribe exactly what is spoken. Reply with the transcript only."}]}]})
            heard = out["candidates"][0]["content"]["parts"][0]["text"]; break
        except Exception as e:
            print("  listener", model, "unavailable:", str(e)[:80])
    if heard is None: return True   # best-effort check; never block the reel on it
    print("  heard:", heard.strip()[:120], flush=True)
    norm = lambda s: re.sub(r"[\W_]+", "", s.lower())
    return len(norm(heard)) <= 1.5 * len(norm(expected)) + 6 or \
        difflib.SequenceMatcher(None, norm(heard), norm(expected)).ratio() > 0.7

# Sarvam fallback (house voice: bulbul:v3 shubh, pace 1.18, temp 0.9) -- used with VOICE=sarvam when Gemini is out
VOICE = os.environ.get("VOICE", "gemini")
SARVAM_CAST = {"gopi": ("shubh", 1.0), "pinky": ("priya", 1.22)}
def tts_sarvam(text, who):
    for k, v in SPOKEN.items(): text = text.replace(k, v)
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60,
                      headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": text, "target_language_code": "te-IN", "model": "bulbul:v3",
                            "speaker": SARVAM_CAST[who][0], "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status()
    USED.append("sarvam bulbul:v3 " + SARVAM_CAST[who][0])
    return base64.b64decode(r.json()["audios"][0])

def tts(text, voice, who, act, tries=3):
    """Best of up to `tries` takes: the first that passes the length + listener checks, else the shortest."""
    for k, v in SPOKEN.items(): text = text.replace(k, v)
    body = {"contents": [{"parts": [{"text": f"{PERSONA[who]} Speak natural Telugu (English words as Indians say them), "
                                             f"expressive and human, with natural pauses at '…'. The tone should be {act}. "
                                             f"Say only this line:\n{text}"}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    best = None
    for n in range(tries):
        while True:
            try:
                out = studio(TTS_MODELS[0], body); break
            except requests.HTTPError as e:
                if e.response is not None and e.response.status_code == 429 and "PerDay" in e.response.text and len(TTS_MODELS) > 1:
                    print("  daily quota used up for", TTS_MODELS.pop(0), "-> trying", TTS_MODELS[0], flush=True); continue
                raise
        part = out["candidates"][0]["content"]["parts"][0]["inlineData"]
        data = base64.b64decode(part["data"])
        if part.get("mimeType", "").startswith("audio/wav"):
            open("vo/_tmp_in.wav", "wb").write(data); src_args = ["-i", "vo/_tmp_in.wav"]
        else:
            rate = int(re.search(r"rate=(\d+)", part.get("mimeType", "")).group(1)) if "rate=" in part.get("mimeType", "") else 24000
            open("vo/_tmp.pcm", "wb").write(data); src_args = ["-f", "s16le", "-ar", str(rate), "-ac", "1", "-i", "vo/_tmp.pcm"]
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *src_args, "-ac", "1", "-ar", "44100", "vo/_tmp.wav"], check=True)
        wav = open("vo/_tmp.wav", "rb").read()
        with wave.open("vo/_tmp.wav") as w: dur = w.getnframes() / w.getframerate()
        ok_len = dur <= max(3.5, 0.16 * len(text))
        print(f"  take {n+1} [{TTS_MODELS[0]}]: {dur:.2f}s{'' if ok_len else ' (too long)'}", flush=True)
        if best is None or dur < best[0]: best = (dur, wav, TTS_MODELS[0])
        if ok_len and heard_ok(text, wav): best = (dur, wav, TTS_MODELS[0]); break
        time.sleep(21)
    USED.append(best[2])
    return best[1]

only = {int(a) for a in sys.argv[1:]}   # re-take only these line numbers (keeps the other takes)
t, out = 0.0, []
for i, (who, text, gap, act) in enumerate(LINES):
    spk, pitch = CAST[who]
    if VOICE == "sarvam": pitch = SARVAM_CAST[who][1]
    speed = 1.0 if VOICE == "sarvam" else 1.05   # owner: Gemini 5% faster; Sarvam already runs at pace 1.18
    raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
    if not os.path.exists(raw) or i in only:
        print(f"L{i} {who}: {text}", flush=True)
        parts = [text]
        if len(parts) == 1:
            if VOICE == "sarvam": wav = tts_sarvam(text, who)
            else: wav = tts(text, spk, who, act); time.sleep(21)
            open(raw, "wb").write(wav); open("vo/models.txt", "a").write(f"L{i} {USED[-1]}\n")
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
    af += f",asetrate=44100*{pitch},aresample=44100,atempo={speed/pitch:.4f}"
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
