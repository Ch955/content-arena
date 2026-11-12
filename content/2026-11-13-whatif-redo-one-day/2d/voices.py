"""What-if #1 'redo one day from your 20s' (2D animated, PAPER skin + CLAY replay) voices: Nikhil (28, cool ->
Andhra), Ananya (27, emotional -> Andhra), Nanna (~58, voice only, warm -> Andhra middle), Gopi (narrator asides).
ElevenLabs eleven_v3 first (reads the [audio tags] in each line's `say`; library voices by PROFILE need a paid plan,
else built-in Liam/Jessica/George automatically), then Gemini batches (Nikhil=Charon, Ananya=Kore, Nanna=Algenib,
Gopi=Puck), then Sarvam; Gemini/Sarvam never see the tags.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
Re-take lines with `python voices.py 3 4`; `VOICE=gemini` skips ElevenLabs, `VOICE=sarvam` forces Sarvam."""
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

FPS = 30
PACE, TEMP = 1.1, 1.0
COUNTDOWN = 5.0
TAIL = 0.45   # after the last line: the notification pings again, then the loop cut
TEMPO = {**{i: 1.143 for i in range(13)}, **{i: 1.067 for i in (6, 7, 8, 9, 10)}}   # on top of SPEED: brisk lines x1.2 overall,
# the turn + replay (L8–L12 of the script) x1.12 overall, to fit the 45 s cap   # after the last line: the notification pings again, then the loop cut
CAST = {  # character -> (Gemini voice, pitch factor)
    "gopi":   ("Puck", 1.0),      # narrator / host
    "nikhil": ("Charon", 1.0),    # 28, thoughtful, a little introverted
    "ananya": ("Kore", 1.0),      # 27, warm, curious
    "nanna":  ("Algenib", 1.0),   # ~58, Nikhil's father (voice only)
}
PERSONA = {"gopi": "You are Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend.",
           "nikhil": "You are Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice.",
           "ananya": "You are Ananya, a 27-year-old woman, Nikhil's close friend, warm, curious and empathetic, speaking standard Andhra Telugu.",
           "nanna": "You are Nikhil's father, a warm, unhurried 58-year-old man from coastal Andhra, speaking on the phone."}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with ElevenLabs [tags])  -- from script.json
    ('nikhil' , "11:59 PM… 'మీ 20s లో ఒక్క రోజు redo చేయండి. ఒక్కసారే.'", 0.3, "a low, puzzled whisper reading a strange notification aloud, slowing down on the last word", "[curious] Eleven fifty-nine. 'మీ twenties లో ఒక్క రోజు redo చేయండి... ఒక్కసారే.'"),  # 0 hook   (say retimed; was "[whispers] Eleven fifty-nine… [curious] 'మీ twenties లో ఒక్క రోజు… redo చేయండి. ఒక్కసారే.'")
    ('ananya' , "ఏ రోజు? …ఆ startup offer వదిలేసిన రోజేనా?", 0.2, "curious, then a knowing friendly tease, like she already knows the answer", "[curious] ఏ రోజు? [teasing] …ఆ startup offer వదిలేసిన రోజేనా?"),  # 1 premise
    ('gopi'   , "మీరూ అదే అనుకున్నారు కదా? Nikhil choice… చివర్లో!", 0.2, "a sly narrator aside to the viewer, dropping to a whisper at the end", "[mischievously] మీరూ అదే అనుకున్నారు కదా? [whispers] Nikhil choice… చివర్లో!"),  # 2 hold
    ('nikhil' , "2019… ఆ offer. ఇప్పుడు ఆ ESOPs… కోట్లు.", 0.25, "a dry, rueful half-laugh, then a tired sigh", "[chuckles] Twenty nineteen, ఆ offer. [sighs] ఇప్పుడు ఆ ESOPs... కోట్లు."),  # 3 misdirect   (say retimed; was "[chuckles] Twenty nineteen… ఆ offer. [sighs] ఇప్పుడు ఆ ESOPs… కోట్లు.")
    # script L5 'లేక… Vizag లో Karthik పెళ్ళి…' cut for length (brief: cut L5 first); the wedding card stays on screen
    ('gopi'   , "ఇలాంటి what-ifs రోజూ కావాలంటే… follow చేయండి!", 0.25, "a quick, warm aside, light and brisk", "[warmly] ఇలాంటి what-ifs రోజూ కావాలంటే… follow చేయండి!"),  # 4 follow
    ('gopi'   , "మీరైతే… ఏ రోజు redo చేస్తారు? Nikhil చెప్పేలోపే comment చేయండి!", 0.15, "a slow, personal question to the viewer, then urgent quiz-host energy", "[curious] మీరైతే ఏ రోజు redo చేస్తారు? [excited] Nikhil చెప్పేలోపే comment చేయండి!"),  # 5 comment-countdown   (say retimed; was "[dramatic pause] మీరైతే… ఏ రోజు redo చేస్తారు? [excited] Nikhil చెప్పేలోపే… comment చేయండి!")
    ('nikhil' , "కాదు… 2022. ఒక మంగళవారం, రాత్రి 9:40.", 0.1 + COUNTDOWN + 0.1, "quiet and certain, every word slow and deliberate", "[softly] కాదు. Twenty twenty-two. ఒక మంగళవారం, రాత్రి nine forty."),  # 6 turn   (say retimed; was "[softly] కాదు… [slowly] twenty twenty-two. ఒక మంగళవారం… రాత్రి nine forty.")
    ('nikhil' , "Sprint deadline… screen మీద 'నాన్న calling'. Cut చేశాను.", 0.2, "flat and quiet, the guilt landing on the last two words", "[quietly] Sprint deadline. Screen మీద 'నాన్న calling'. Cut చేశాను."),  # 7 turn   (say retimed; was "[quietly] Sprint deadline… screen మీద 'నాన్న calling'… [sighs] cut చేశాను.")
    ('nikhil' , "'తర్వాత చేస్తాలే' అనుకున్నాను… ఆ 'తర్వాత'… ఇప్పటికీ రాలేదు.", 0.2, "holding back tears, voice cracking, the last word almost a breath", "[voice breaking] 'తర్వాత చేస్తాలే' అనుకున్నాను… [softly] ఆ 'తర్వాత'… ఇప్పటికీ రాలేదు."),  # 8 turn
    ('nikhil' , "హలో… నాన్నా? …ఎలా ఉన్నావ్?", 0.45, "a nervous, tender hush, as if afraid the call will drop", "[nervous] హలో… నాన్నా? [voice breaking] …ఎలా ఉన్నావ్?"),  # 9 reveal
    ('nanna'  , "ఆ… చెప్పు నాన్నా. అన్నం తిన్నావా?", 0.25, "an unhurried, warm father's voice on a phone line, a small fond chuckle", "[warmly] ఆ… చెప్పు నాన్నా. [chuckles] అన్నం తిన్నావా?"),  # 10 reveal
    ('gopi'   , "మీ రోజు comment లో రాయండి… ఈ reel మీ నాన్నకో, ఆ friend కో పంపండి.", 0.25, "gentle and sincere, talking to one viewer, no salesmanship", "[warmly] మీ రోజు comment లో రాయండి. ఈ reel మీ నాన్నకో, ఆ friend కో పంపండి."),  # 11 comment-share   (say retimed; was "[warmly] మీ రోజు… comment లో రాయండి. [softly] ఈ reel మీ నాన్నకో… ఆ friend కో పంపండి.")
    ('gopi'   , "Follow చేయండి… అదిగో… 11:59. మళ్ళీ notification!", 0.15, "a warm sign-off that drops into a hushed, intriguing whisper", "[warmly] Follow చేయండి… [whispers] అదిగో… eleven fifty-nine. [mischievously] మళ్ళీ notification!"),  # 12 close-loop   (uses the first take of the script's say; the retimed retake mangled "eleven fifty-nine")
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

SARVAM = {"gopi": ("shubh", 1.0), "nikhil": ("rahul", 1.0), "ananya": ("kavya", 1.0), "nanna": ("anand", 1.0)}
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
ELEVEN_PITCH = {"pinky": 1.15, "nikhil": 0.94}   # free plan: Nikhil falls back to Liam = Gopi's voice -> a touch lower (medium-low, per the brief)
# Telugu voice per character by temperament (owner, 12 Nov 2026): aggressive/fearful -> Telangana, smooth/emotional/
# cool -> Andhra. e.g. PROFILE = {"inspector": elevenvoice.profile_for("male", "middle", "aggressive")}
PROFILE = {"nikhil": "andhra-male-young", "ananya": "andhra-female-young", "nanna": "andhra-male-middle"}  # brief cast table via profile_for
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
    scenevoice.NAMES["nanna"] = "Nanna"   # this reel's cast (Andhra, per the brief)
    scenevoice.PERSONA.update({"nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
                               "ananya": "Ananya, a warm, curious 27-year-old woman, Nikhil's close friend, speaking standard Andhra Telugu",
                               "nanna": "Nikhil's father, a warm, unhurried 58-year-old man from coastal Andhra, on a phone line"})
    got = scenevoice.voice_batch(batch, "vo_batch", {scenevoice.NAMES[w]: CAST[w][0] for w in CAST})
    for k in got: open(f"vo/L{todo[k]}_model.txt", "w").write("gemini-batch:" + ",".join(scenevoice.MODELS))
    for k, path in got.items():
        os.replace(path, f"vo/L{todo[k]}_raw.wav")
    todo = [i for k, i in enumerate(todo) if k not in got]
    if todo: print("  voicing one by one:", todo, flush=True)
elif todo:
    sarvam_lines = set(todo)
t, out = 0.0, []
for i, (who, text, gap, act, *say) in enumerate(LINES):
    spk, pitch = CAST[who]
    TEMPO_X = TEMPO.get(i, 1.0)
    raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
    if i in eleven_lines or (i not in todo and open(f"vo/L{i}_model.txt").read().startswith("elevenlabs") if os.path.exists(f"vo/L{i}_model.txt") else False):
        pitch = ELEVEN_PITCH.get(who, 1.0)
    if i in todo:
        parts = [text]
        if i in sarvam_lines:
            open(raw, "wb").write(tts_sarvam(say[0] if say else text, who)); pitch = SARVAM[who][1]; open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")
        elif len(parts) == 1:
            try:   # 2) one-by-one Gemini; 3) Sarvam if Gemini refuses (quota)
                take = tts(say[0] if say else text, spk, who, act); os.replace("vo/_model.txt", f"vo/L{i}_model.txt"); time.sleep(21)
            except requests.HTTPError as e:
                print(f"  line {i}: Gemini refused ({e.response.status_code if e.response is not None else '?'}) -> Sarvam", flush=True)
                take = tts_sarvam(say[0] if say else text, who); pitch = SARVAM[who][1]; open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")
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
    af += f",asetrate=44100*{pitch},aresample=44100,atempo={SPEED[engine]*TEMPO_X/pitch:.4f}"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
    with wave.open(dst) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    dur = len(a) / 44100
    hop = 44100 // FPS
    env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
    m = max(env) or 1
    env = [round(min(1, e / m * 1.4), 3) for e in env]
    t += gap
    out.append({"i": i, "who": who, "text": text, "spoken": TAGS.sub("", say[0]).strip() if say else text, "start": round(t, 3), "dur": round(dur, 3), "env": env})
    t += dur
json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
for l in out: print(l["i"], l["who"], l["start"], l["dur"])
print("total", round(t + TAIL, 2))
