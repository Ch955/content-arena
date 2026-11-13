"""Moral dilemma #1 'the wallet and the EMI' (2D animated, FLAT skin + a 1-s PAPER memory insert) voices:
Nikhil (28, cool -> Andhra), Ananya (27, emotional -> Andhra, voice note), Ramulu (~45, night guard, fearful ->
Telangana), Gopi (narrator asides).
ElevenLabs eleven_v3 first (reads the [audio tags] in each line's `say`; library voices by PROFILE need a paid plan,
else built-in Liam/Jessica/George automatically), then Gemini batches (Nikhil=Charon, Ananya=Kore, Ramulu=Algenib,
Gopi=Puck), then Sarvam (rahul/kavya/ashutosh/shubh); Gemini/Sarvam never see the tags.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
Takes used here (13 Nov 2026): ElevenLabs free plan -> built-in Liam (Nikhil x0.94, Gopi) / Jessica / George; slow lines re-taken
with `takes.py` (briskers `say`), every take tightened (silent runs > .22 s -> .14 s; L9 keeps a .30 s pause), L3 cut to its
second half (brief's >45 s trim) -> vo/L*_raw.wav, then this script only post-processes (+5% speed, pitch, timeline).
Re-take lines with `python voices.py 3 4`; `VOICE=gemini` skips ElevenLabs, `VOICE=sarvam` forces Sarvam."""
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

FPS = 30
PACE, TEMP = 1.1, 1.0
COUNTDOWN = 5.0
TAIL = 0.25   # after the last line: hard cut back to frame 1 (loop)
TEMPO = {}    # no extra speed-up: the script is written short (normal engine speed only)
CAST = {  # character -> (Gemini voice, pitch factor)
    "gopi":   ("Puck", 1.0),      # narrator / host
    "nikhil": ("Charon", 1.0),    # 28, thoughtful, a little introverted
    "ananya": ("Kore", 1.0),      # 27, caring friend (voice note)
    "ramulu": ("Algenib", 1.0),   # ~45, night-shift security guard, frightened father
}
PERSONA = {"gopi": "You are Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend.",
           "nikhil": "You are Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice.",
           "ananya": "You are Ananya, a 27-year-old woman, Nikhil's close friend, caring and emotional, speaking standard Andhra Telugu in a hurried voice note.",
           "ramulu": "You are Ramulu, a 45-year-old night-shift security guard from Medchal, exhausted and frightened for his little daughter, speaking natural Telangana Telugu."}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with ElevenLabs [tags])  -- from script.json
    ('nikhil' , 'Ameerpet metro… ఒక wallet. ₹50,000 cash… ఒక పాప surgery bill.', 0.15, 'a stunned low whisper, as if someone might be watching; slows right down on the last two words', '[tense] Ameerpet metro, ఒక wallet. యాభై వేలు cash, ఒక పాప surgery bill.'),  # 0 hook   (say retimed; script: '[whispers] Ameerpet metro… ఒక wallet. [tense] యాభై వేలు cash… [quietly] ఒక పాప surgery bill.')
    ('gopi'   , 'Nikhil కి EMI రేపే… సరిగ్గా ₹50,000 short! Choice… చివర్లో.', 0.15, 'a sly narrator aside to the viewer, leaning hard on the exact amount, dropping to a whisper at the end', '[mischievously] Nikhil కి EMI రేపే. సరిగ్గా యాభై వేలు short! Choice చివర్లో.'),  # 1 temptation-hold   (say retimed; script: '[mischievously] Nikhil కి EMI… రేపే. [dramatic pause] సరిగ్గా యాభై వేలు short! [whispers] Choice… చివర్లో.')
    ('ananya' , 'Police booth లో ఇచ్చేయ్ Nikhil… 11 కి నీ promotion demo!', 0.2, 'a hurried, caring voice note from a friend who wants him safe; firm on the word promotion', '[worried] Police booth లో ఇచ్చేయ్ Nikhil, [firm] eleven కి నీ promotion demo!'),  # 2 option-b   (say retimed; script: '[worried] Police booth లో ఇచ్చేయ్, Nikhil… [firm] eleven కి నీ promotion demo!')
    ('nikhil' , 'Surgery రేపే… టైంకి చేరుతుందా?', 0.15, 'thinking aloud, calm on the surface, the doubt sharpening on the final question', '[tense] Surgery రేపే, టైంకి చేరుతుందా?'),  # 3 option-a   (brief's >45 s trim: 'Address Medchal… రెండు గంటలు.' cut from the take; the map card shows Medchal ≈ 2 hrs)
    ('gopi'   , 'ఇలాంటి dilemmas రోజూ కావాలంటే… follow చేయండి!', 0.15, 'a quick, warm aside, light and brisk', '[warmly] ఇలాంటి dilemmas రోజూ కావాలంటే… [excited] follow చేయండి!'),  # 4 follow
    ('gopi'   , 'మీరైతే? A — Medchal. B — police booth. Comment చేయండి!', 0.12, 'a slow, personal question to the viewer, then urgent quiz-host energy', 'మీరైతే? A, Medchal. B, police booth. Comment చేయండి!'),  # 5 comment-countdown   (say retimed; script: '[dramatic pause] మీరైతే? A… Medchal. B… police booth. [excited] Comment చేయండి!')
    ('nikhil' , 'Medchal వెళ్ళాను. Demo… miss అయ్యాను.', 0.1 + COUNTDOWN + 0.1, 'plain and matter-of-fact, one small tired sigh before the cost, no self-pity', '[calmly] Medchal వెళ్ళాను. [sighs] Demo, miss అయ్యాను.'),  # 6 reveal   (say retimed; script: '[calmly] Medchal వెళ్ళాను. [sighs] Demo… miss అయ్యాను.')
    ('ramulu' , 'Nikhil సారు?! మీరా? పైసలు లేకుంటే… రేపు పాప ఆపరేషన్…', 0.4, 'a frightened, exhausted father at his door, shocked to see a familiar face; voice cracks and trails off unfinished', '[gasps] Nikhil సారు?! మీరా? [voice breaking] పైసలు లేకుంటే… రేపు పాప ఆపరేషన్…'),  # 7 twist
    ('nikhil' , 'మా office night guard… రోజూ నాకు salute చేసే మనిషి.', 0.15, 'slow realisation, almost to himself, the words sinking in', '[stunned] మా office night guard. రోజూ నాకు salute చేసే మనిషి.'),  # 8 twist   (say retimed; script: '[stunned] మా office… night guard. [softly] రోజూ నాకు salute చేసే మనిషి.')
    ('nikhil' , 'తనకి నా పేరు తెలుసు… నాకు తన పేరు తెలీదు.', 0.2, 'quiet and ashamed, a long pause before the last half, stress on తెలీదు', '[quietly] తనకి నా పేరు తెలుసు. నాకు తన పేరు తెలీదు.'),  # 9 take   (say retimed; script: '[quietly] తనకి నా పేరు తెలుసు… [dramatic pause] నాకు… తన పేరు తెలీదు.')
    ('gopi'   , 'మీ choice comment లో… ఈ dilemma friend కి పంపండి!', 0.2, 'warm and conspiratorial, like daring the viewer to test a friend', '[warmly] మీ choice comment లో. ఈ dilemma friend కి పంపండి!'),  # 10 comment-share   (say retimed; script: '[warmly] మీ choice… comment లో. [mischievously] ఈ dilemma friend కి పంపండి!')
    ('gopi'   , 'Follow చేయండి… మీరూ ఆ ID మీద పేరు చూడలేదు కదా?', 0.15, 'a warm sign-off that drops into a hushed, knowing whisper, inviting a rewatch', '[warmly] Follow చేయండి. [whispers] మీరూ ఆ ID మీద పేరు చూడలేదు కదా?'),  # 11 close-loop   (say retimed; script: '[warmly] Follow చేయండి… [whispers] మీరూ… ఆ ID మీద పేరు చూడలేదు కదా?')
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

SARVAM = {"gopi": ("shubh", 1.0), "nikhil": ("rahul", 1.0), "ananya": ("kavya", 1.0), "ramulu": ("ashutosh", 1.0)}
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
PROFILE = {"nikhil": "andhra-male-young", "ananya": "andhra-female-young", "ramulu": "telangana-male-middle"}  # brief cast table via profile_for
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
    scenevoice.NAMES["ramulu"] = "Ramulu"   # this reel's cast (per the brief)
    scenevoice.PERSONA.update({"nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
                               "ananya": "Ananya, a caring 27-year-old woman, Nikhil's close friend, speaking standard Andhra Telugu in a hurried voice note",
                               "ramulu": "Ramulu, a 45-year-old night-shift security guard from Medchal, exhausted and frightened for his daughter, speaking natural Telangana Telugu"})
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
