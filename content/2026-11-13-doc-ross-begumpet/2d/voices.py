"""Micro-doc 'Ronald Ross, Begumpet, 20 Aug 1897' (2D, PIXEL + PAPER skins) voices: Gopi narrates all 14 lines
(ElevenLabs built-in Liam -> Gemini Puck at 1.15 -> Sarvam shubh). Ross is drawn only, never voiced.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
The whole reel is voiced in a few requests (content_arena.scenevoice: up to 8 lines per call as a two-voice
conversation, cut back into lines at the pauses) because the free tier allows only ~10 TTS requests a day.
Lines it can't split cleanly are voiced one by one; if Gemini refuses, those lines fall back to Sarvam.
Re-take lines with `python voices.py 3 4`; `VOICE=sarvam python voices.py` voices everything with Sarvam.
From 11 Nov 2026 ElevenLabs (eleven_v3, Gopi=Liam, Pinky=Jessica) goes first while the key has credits
(content_arena.elevenvoice); `VOICE=gemini` skips it."""
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

FPS = 30
PACE, TEMP = 1.1, 1.0
COUNTDOWN = 5.0
TEMPO = {**{i: 1.24 for i in range(14)}, 0: 1.2, 13: 1.1}   # on top of SPEED (ElevenLabs Liam reads slowly: x1.30 overall, the whispered hook x1.26, the loop whisper x1.16 so "ఏ దోమ" stays clear), see tighten.py
TAIL = 0.85   # hold on the glowing tube after the last whisper (loop back to frame 1)
CAST = {  # character -> (Gemini voice, pitch factor)
    "gopi":  ("Puck", 1.0),      # host
    "pinky": ("Leda", 1.12),     # little sister, the guesser
}
PERSONA = {"gopi": "You are Gopi, a lively young Telugu storyteller narrating a true history story, talking straight to the viewer like a close friend.",
           "pinky": "You are Pinky, a sweet, curious 6-year-old Telugu girl."}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with ElevenLabs [tags])  -- from script.json
    ("gopi", "20 August 1897, Begumpet. 40 ఏళ్ల army doctor దగ్గర… మిగిలింది రెండే దోమలు.", 0.2, "a tense, low storyteller's whisper, like opening a secret case file; slow on the last three words",
     "[whispers] August twenty, eighteen ninety-seven… Begumpet. [dramatic pause] Forty ఏళ్ల army doctor దగ్గర… మిగిలింది రెండే దోమలు."),  # 0 hook
    ("gopi", "ఇది నిజంగా జరిగింది… మన Hyderabad లో. ఆ building ఇప్పటికీ ఉంది — ఏంటో చివర్లో!", 0.2, "bright and proud of the city, then a sly tease to the viewer",
     "[excited] ఇది నిజంగా జరిగింది… మన Hyderabad లో! [mischievously] ఆ building ఇప్పటికీ ఉంది… ఏంటో చివర్లో!"),  # 1 hold
    ("gopi", "ఆయన Ronald Ross. Writer అవ్వాలనుకున్నారు… నాన్న medicine లో పెట్టారు.", 0.2, "warm and conversational, a knowing laugh shared with the viewer on the father part",
     "[warmly] ఆయన Ronald Ross. Writer అవ్వాలనుకున్నారు… [laughs] నాన్న medicine లో పెట్టారు."),  # 2 context (trimmed for length)
    ("gopi", "నాలుగు రోజుల ముందు… ఆ దోమలు malaria patient రక్తం తాగాయి.", 0.2, "quiet, building suspense, a small pause before the last word",
     "[whispers] నాలుగు రోజుల ముందు… ఆ దోమలు malaria patient రక్తం తాగాయి."),  # 3 clue (trimmed for length)
    ("gopi", "రెండిట్లో ఒకదాన్ని open చేశారు… కడుపు గోడ మీద — malaria parasite!", 0.2, "a hushed lean-in that bursts into a thrilled discovery on the last two words",
     "[whispers] రెండిట్లో ఒకదాన్ని open చేశారు… [gasps] కడుపు గోడ మీద — [excited] malaria parasite!"),  # 4 clue (trimmed for length)
    ("gopi", "లోపలి writer బయటికొచ్చాడు… malaria పై poem — 'million-murdering Death'!", 0.2, "admiring and a little poetic, slowing right down for the quoted English phrase",
     "[warmly] లోపలి writer బయటికొచ్చాడు… Malaria పై poem… [dramatically] 'million-murdering Death'!"),  # 5 clue (trimmed for length)
    ("gopi", "1898, Calcutta లో పక్షులతో proof… 1902 లో — Nobel Prize!", 0.2, "brisk montage rhythm, then a triumphant lift on Nobel",
     "Eighteen ninety-eight, Calcutta లో పక్షులతో proof… [excited] Nineteen oh-two లో — Nobel Prize!"),  # 6 clue (trimmed for length)
    ("gopi", "Twist: Ross British… కానీ పుట్టింది India లో, Almora లో!", 0.2, "playful set-up, then a clear, deliberate reveal",
     "[mischievously] Twist… Ross British. కానీ పుట్టింది India లో, Almora లో!"),  # 7 twist (trimmed for length)
    ("gopi", "India లో పుట్టిన first Nobel winner… Tagore కంటే 11 years ముందు!", 0.2, "an amazed fact-drop, stressing 'eleven'",
     "India లో పుట్టిన first Nobel winner! [excited] Tagore కంటే eleven years ముందు!"),  # 8 twist (trimmed for length)
    ("gopi", "ఇలాంటి true stories కావాలంటే… follow, subscribe!", 0.2, "a quick friendly aside, light and fast",
     "[warmly] ఇలాంటి true stories కావాలంటే… follow, subscribe!"),  # 9 follow (trimmed for length)
    ("gopi", "Ross కోరిక: ఈ రోజు ప్రతి ఏడాది గుర్తుండాలి. ప్రపంచం Aug 20 ని ఏమంటుంది? Comment చేయండి!", 0.2, "a slow, intriguing quiz question, then urgent quiz-host energy before a 5-second countdown",
     "Ross కోరిక… ఈ రోజు ప్రతి ఏడాది గుర్తుండాలి. ప్రపంచం August twenty ని ఏమంటుంది? [excited] Comment చేయండి!"),  # 10 quiz-countdown (trimmed for length)
    ("gopi", "World Mosquito Day! 🦟 Correct ఆ? Comment లో ✅ పెట్టండి!", 0.25 + COUNTDOWN + 0.25, "a big celebratory reveal, then a cheeky check-in with the viewer",
     "[excited] World Mosquito Day! [laughs] Correct ఆ? Comment లో tick పెట్టండి!"),  # 11 reveal (trimmed for length)
    ("gopi", "ఆ building ఇప్పటికీ Begumpet లోనే… Osmania University 'Sir Ronald Ross Institute of Parasitology'!", 0.2, "proud and local, the final answer to the opening tease, clear on the institute name",
     "[warmly] ఆ building… ఇప్పటికీ Begumpet లోనే! [excited] Osmania University 'Sir Ronald Ross Institute of Parasitology'!"),  # 12 reveal
    ("gopi", "Hyderabad friends కి పంపండి… ఇంకోసారి చూడండి — ఏ దోమ history రాసిందో!", 0.2, "friendly sign-off, dropping to a teasing whisper that loops back to the start",
     "Hyderabad friends కి పంపండి! [mischievously] ఇంకోసారి చూడండి… [whispers] ఏ దోమ history రాసిందో!"),  # 13 share-close-loop (trimmed for length)
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

TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")   # ElevenLabs audio tags: never sent to Gemini/Sarvam
def tts(text, voice, who, act, tries=3):
    text = TAGS.sub("", text).strip()
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
    text = TAGS.sub("", text).strip()
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60,
                      headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": text, "target_language_code": "te-IN", "model": "bulbul:v3", "speaker": SARVAM[who][0],
                            "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status()
    return base64.b64decode(r.json()["audios"][0])

only = {int(a) for a in sys.argv[1:]}   # re-take only these line numbers (keeps the other takes)
os.makedirs("vo", exist_ok=True)
todo = [i for i in range(len(LINES)) if not os.path.exists(f"vo/L{i}_raw.wav") or i in only]
sarvam_lines, eleven_lines = set(), set()
ELEVEN_PITCH = {"pinky": 1.15}   # Jessica pitched up for a 6-year-old; others as they are
# Telugu voice per character by temperament (owner, 12 Nov 2026): aggressive/fearful -> Telangana, smooth/emotional/
# cool -> Andhra. e.g. PROFILE = {"inspector": elevenvoice.profile_for("male", "middle", "aggressive")}
PROFILE = {}
# Speed-up per engine (owner: 9 Nov 5% faster; 12 Nov "Gemini should be 10% more faster" -> Gemini 1.15)
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
if todo and os.environ.get("VOICE") not in ("gemini", "sarvam"):   # 0) ElevenLabs while the key has credits
    from content_arena import elevenvoice
    for i in list(todo):
        who, text, gap, act, *say = LINES[i]
        try:
            elevenvoice.voice_line(say[0] if say else text, who, act, f"vo/L{i}_raw.wav", profile=PROFILE.get(who))
        except elevenvoice.ElevenUnavailable as e:
            print(f"  ElevenLabs unavailable from line {i} ({e}); the rest falls back to Gemini", flush=True); break
        eleven_lines.add(i); todo.remove(i)
        open(f"vo/L{i}_model.txt", "w").write("elevenlabs:" + elevenvoice.MODEL)
    if eleven_lines: print("  ElevenLabs voiced lines:", sorted(eleven_lines), flush=True)
if todo and os.environ.get("VOICE") != "sarvam":   # 1) Gemini whole-reel batches (2–3 requests per reel)
    from content_arena import scenevoice
    batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": (LINES[i][4] if len(LINES[i]) > 4 else None)}
             for i in todo]
    got = scenevoice.voice_batch(batch, "vo_batch", {"Gopi": CAST["gopi"][0], "Pinky": CAST["pinky"][0]})
    for k, path in got.items():
        os.replace(path, f"vo/L{todo[k]}_raw.wav")
        open(f"vo/L{todo[k]}_model.txt", "w").write("gemini-batch:" + ",".join(scenevoice.MODELS))
    todo = [i for k, i in enumerate(todo) if k not in got]
    if todo: print("  voicing one by one:", todo, flush=True)
elif todo:
    sarvam_lines = set(todo)
t, out = 0.0, []
for i, (who, text, gap, act, *say) in enumerate(LINES):
    spk, pitch = CAST[who]
    raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
    if i in eleven_lines or (i not in todo and open(f"vo/L{i}_model.txt").read().startswith("elevenlabs") if os.path.exists(f"vo/L{i}_model.txt") else False):
        pitch = ELEVEN_PITCH.get(who, 1.0)
    if i in todo:
        parts = [text]
        if i in sarvam_lines:
            open(raw, "wb").write(tts_sarvam(say[0] if say else text, who)); pitch = SARVAM[who][1]
            open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")
        elif len(parts) == 1:
            try:   # 2) one-by-one Gemini; 3) Sarvam if Gemini refuses (quota)
                take = tts(say[0] if say else text, spk, who, act); os.replace("vo/_model.txt", f"vo/L{i}_model.txt"); time.sleep(21)
            except requests.HTTPError as e:
                print(f"  line {i}: Gemini refused ({e.response.status_code if e.response is not None else '?'}) -> Sarvam", flush=True)
                take = tts_sarvam(say[0] if say else text, who); pitch = SARVAM[who][1]
                open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")
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
    mfile = f"vo/L{i}_model.txt"
    engine = ("eleven" if i in eleven_lines or (os.path.exists(mfile) and open(mfile).read().startswith("elevenlabs"))
              else "sarvam" if i in sarvam_lines or (os.path.exists(mfile) and open(mfile).read().startswith("sarvam")) else "gemini")
    af += f",asetrate=44100*{pitch},aresample=44100,atempo={SPEED[engine]*TEMPO.get(i, 1.0)/pitch:.4f}"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
    with wave.open(dst) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    dur = len(a) / 44100
    hop = 44100 // FPS
    env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
    m = max(env) or 1
    env = [round(min(1, e / m * 1.4), 3) for e in env]
    t += gap
    out.append({"i": i, "who": who, "text": text, "spoken": TAGS.sub("", say[0]).strip() if say else text, "engine": engine, "start": round(t, 3), "dur": round(dur, 3), "env": env})
    t += dur
json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
for l in out: print(l["i"], l["who"], l["start"], l["dur"])
print("total", round(t + TAIL, 2))
