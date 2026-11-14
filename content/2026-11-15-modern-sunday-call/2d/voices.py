"""Modern dilemma #1 'the 10-minute Sunday call' (2D animated, CLAY skin; the office side switches to NEON) voices:
Gopi (narrator/host), Nikhil (28, cool -> Andhra), Suresh (~40, TL, aggressive -> Telangana), Saroja (Amma ~55,
emotional -> Andhra), Prasad (Nanna ~60, cool -> Andhra).
One engine per character for the whole reel (ENGINE; recorded in vo/engine.json): ElevenLabs only had ~1,150 credits
left (the reel is 1,050 chars), and on the free plan Suresh and Prasad would both fall back to the same built-in George,
so ElevenLabs voices Gopi (Liam) + Nikhil (Liam x0.94) and Gemini voices Suresh=Algenib, Saroja=Kore, Prasad=Orus.
If ElevenLabs runs out part-way, ALL lines of that character are re-voiced with Gemini (Gopi=Puck, Nikhil=Charon),
so nobody switches voice mid-reel. Sarvam (shubh/rahul/...) is the last resort.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
Re-take lines with `python voices.py 3 4`; `VOICE=gemini` skips ElevenLabs, `VOICE=sarvam` forces Sarvam."""
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

FPS = 30
PACE, TEMP = 1.1, 1.0
COUNTDOWN = 5.0
TAIL = 0.45   # after the last line: the phone buzzes again, then a hard cut back to frame 1 (loop)
TEMPO = {}    # no extra speed-up: the script is written short (normal engine speed only)
CAST = {  # character -> (Gemini voice, pitch factor)
    "gopi":   ("Puck", 1.0),      # narrator / host
    "nikhil": ("Charon", 1.0),    # 28, thoughtful, a little introverted
    "suresh": ("Algenib", 1.0),   # ~40, team lead, stressed and pushy
    "saroja": ("Kore", 1.0),      # ~55, Amma, warm, a little dramatic
    "prasad": ("Orus", 1.0),      # ~60, Nanna, retired, dry humour
}
PERSONA = {"gopi": "You are Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend.",
           "nikhil": "You are Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice.",
           "suresh": "You are Suresh, a 40-year-old IT team lead in Hyderabad, stressed and pushy during a client escalation, speaking natural Telangana Telugu fast.",
           "saroja": "You are Saroja, a warm 55-year-old Telugu mother at her 30th wedding anniversary lunch, a little dramatic, speaking standard Andhra Telugu.",
           "prasad": "You are Prasad, a quiet retired 60-year-old Telugu father with a dry sense of humour, speaking slow standard Andhra Telugu in a deep calm voice."}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with ElevenLabs [tags])  -- from script.json
    ('gopi'   , 'Amma Nanna 30th anniversary… cake cut చేయబోతుంటే — TL call!', 0.15, 'a lively narrator dropping the viewer into the moment, then a hushed, doom-laden whisper on the last two words', '[excited] Amma Nanna thirtieth anniversary… [dramatic pause] cake cut చేయబోతుంటే — [whispers] TL call!'),  # 0 hook
    ('suresh' , 'Nikhil, జర పది నిమిషాలే… client escalation. ఆ module నీకే తెల్సు!', 0.15, 'a stressed, pushy team lead talking fast over office noise, sweet-talking on the first half, pressing hard on నీకే', '[hurried] Nikhil, జర పది నిమిషాలే… [insistent] client escalation. ఆ module నీకే తెల్సు!'),  # 1 call
    ('gopi'   , 'పది నిమిషాలు… ఎప్పుడూ పది కాదు. Nikhil ఏం చేశాడో… చివర్లో!', 0.15, 'a knowing chuckle shared with every office-goer, then a sly teasing whisper', '[laughs] పది నిమిషాలు… ఎప్పుడూ పది కాదు. [mischievously] Nikhil ఏం చేశాడో… [whispers] చివర్లో!'),  # 2 hold
    ('saroja' , 'నీకిష్టమని pulihora చేశా… ఆ phone కింద పెట్టు!', 0.2, 'a loving mother whose warmth turns into a firm, mock-stern order; stress on కింద', '[warmly] నీకిష్టమని pulihora చేశా… [annoyed] ఆ phone కింద పెట్టు!'),  # 3 option-b
    ('nikhil' , 'Appraisal వచ్చే నెల… boot లో laptop… just in case.', 0.15, 'calm inner voice weighing it up, a small guilty sigh on the last words', '[thoughtful] Appraisal… వచ్చే నెల. [quietly] boot లో laptop… [sighs] just in case.'),  # 4 option-a
    ('saroja' , "Office గోల… Friday family group లో కూడా 'runbook' పంపావ్!", 0.15, 'an exasperated mother complaining to the relatives, half laughing; stress on family group', '[sighs] Office గోల… [annoyed] Friday family group లో కూడా runbook పంపావ్!'),  # 5 plant
    ('gopi'   , 'ఇలాంటి office dilemmas కావాలంటే… follow చేయండి!', 0.2, 'a quick, bright aside, light and brisk', '[warmly] ఇలాంటి office dilemmas కావాలంటే… [excited] follow చేయండి!'),  # 6 follow
    ('gopi'   , 'మీరైతే? A… call తీస్తారు. B… switch off. Comment చేయండి!', 0.12, 'a slow, personal question to the viewer, then urgent quiz-host energy', '[dramatic pause] మీరైతే? A… call తీస్తారు. B… switch off. [excited] Comment చేయండి!'),  # 7 comment-countdown
    ('nikhil' , 'Sir, Friday నే Kiran కి runbook ఇచ్చా… step 4!', 0.1 + COUNTDOWN + 0.1, 'cool and unhurried, a tiny smile in the voice; stress on Friday', '[calmly] Sir, Friday నే Kiran కి runbook ఇచ్చా… [confidently] step four!'),  # 8 reveal
    ('suresh' , 'అరె… Kiran fix చేసిండు! నిజంగా పది నిమిషాలే!', 0.2, 'the same pushy lead, caught off guard, then relieved and smiling; say నిజంగా పది నిమిషాలే clearly, word by word (no laughing over the words)', '[surprised] అరె… Kiran fix చేసిండు! [laughs] నిజంగా పది నిమిషాలే!'),  # 9 payoff
    ('prasad' , 'పని ఒక్కడికే తెలిస్తే… వాడికి Sunday ఉండదు రా.', 0.25, 'a quiet, dry father who has seen it all, slow and amused; stress on Sunday', '[chuckles] పని ఒక్కడికే తెలిస్తే… [slowly] వాడికి Sunday ఉండదు రా.'),  # 10 take
    ('gopi'   , 'మీ office లో ఇలా జరిగిందా? Comment… office friend కి పంపండి!', 0.2, 'conspiratorial and playful, like gossiping with a colleague', '[mischievously] మీ office లో ఇలా జరిగిందా? Comment… [excited] office friend కి పంపండి!'),  # 11 comment-share
    ('gopi'   , 'Team lead కి మాత్రం కాదు! Follow… అరె, మళ్ళీ phone!', 0.15, 'a laughing warning, a warm sign-off cut short by a startled gasp', '[laughs] Team lead కి మాత్రం కాదు! [warmly] Follow… [gasps] అరె, మళ్ళీ phone!'),  # 12 close-loop
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

SARVAM = {"gopi": ("shubh", 1.0), "nikhil": ("rahul", 1.0), "suresh": ("ashutosh", 1.0), "saroja": ("kavya", 1.0), "prasad": ("aditya", 1.0)}
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
# cool -> Andhra -- from the brief's cast table via elevenvoice.profile_for(gender, age, temper)
PROFILE = {"nikhil": "andhra-male-young", "suresh": "telangana-male-middle", "saroja": "andhra-female-middle", "prasad": "andhra-male-middle"}
# ONE engine per character for the whole reel (persisted, so retakes never switch a voice)
ENGINE = {"gopi": "eleven", "nikhil": "eleven", "suresh": "gemini", "saroja": "gemini", "prasad": "gemini"}
if os.path.exists("vo/engine.json"): ENGINE.update(json.load(open("vo/engine.json")))
if os.environ.get("VOICE") in ("gemini", "sarvam"): ENGINE = {w: os.environ["VOICE"] for w in ENGINE}
# Speed-up per engine (owner: 9 Nov 5% faster; 12 Nov "Gemini should be 10% more faster" -> Gemini 1.15)
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
def model_of(i):
    p = f"vo/L{i}_model.txt"; return open(p).read() if os.path.exists(p) else ""
if any(ENGINE[LINES[i][0]] == "eleven" for i in todo):   # 0) ElevenLabs while the key has credits
    from content_arena import elevenvoice
    for i in list(todo):
        who, text, gap, act, *say = LINES[i]
        if ENGINE[who] != "eleven": continue
        try:
            elevenvoice.voice_line(say[0] if say else text, who, act, f"vo/L{i}_raw.wav", profile=PROFILE.get(who))
        except elevenvoice.ElevenUnavailable as e:
            # out of credits part-way: every character still on ElevenLabs moves to Gemini for ALL of its lines
            moved = [w for w in ENGINE if ENGINE[w] == "eleven"]
            print(f"  ElevenLabs unavailable at line {i} ({e}); re-voicing all lines of {moved} with Gemini", flush=True)
            for w in moved: ENGINE[w] = "gemini"
            todo = sorted(set(todo) | {j for j, l in enumerate(LINES) if l[0] in moved}); eleven_lines -= {j for j in eleven_lines if LINES[j][0] in moved}
            break
        eleven_lines.add(i); todo.remove(i)
        open(f"vo/L{i}_model.txt", "w").write("elevenlabs:" + elevenvoice.MODEL)
    if eleven_lines: print("  ElevenLabs voiced lines:", sorted(eleven_lines), flush=True)
json.dump(ENGINE, open("vo/engine.json", "w"))
sarvam_lines = {i for i in todo if ENGINE[LINES[i][0]] == "sarvam"}
gem = [i for i in todo if ENGINE[LINES[i][0]] == "gemini"]
if gem:   # 1) Gemini whole-reel batches (2–3 requests per reel)
    from content_arena import scenevoice
    batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": (LINES[i][4] if len(LINES[i]) > 4 else None)}
             for i in gem]
    scenevoice.NAMES.update({"suresh": "Suresh", "saroja": "Saroja", "prasad": "Prasad"})   # this reel's cast (per the brief)
    scenevoice.PERSONA.update({"nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
                               "suresh": "Suresh, a 40-year-old IT team lead, stressed and pushy during a client escalation, speaking natural Telangana Telugu fast",
                               "saroja": "Saroja, a warm 55-year-old Telugu mother at her 30th anniversary lunch, a little dramatic, speaking standard Andhra Telugu",
                               "prasad": "Prasad, a quiet retired 60-year-old Telugu father with a dry sense of humour, speaking slow standard Andhra Telugu in a deep calm voice"})
    got = scenevoice.voice_batch(batch, "vo_batch", {scenevoice.NAMES[w]: CAST[w][0] for w in CAST})
    for k in got: open(f"vo/L{gem[k]}_model.txt", "w").write("gemini-batch:" + ",".join(scenevoice.MODELS))
    for k, path in got.items():
        os.replace(path, f"vo/L{gem[k]}_raw.wav")
    todo = [i for i in todo if i not in {gem[k] for k in got} and i not in eleven_lines]
    if todo: print("  voicing one by one:", todo, flush=True)
else:
    todo = [i for i in todo if i not in eleven_lines]
t, out = 0.0, []
for i, (who, text, gap, act, *say) in enumerate(LINES):
    spk, pitch = CAST[who]
    TEMPO_X = TEMPO.get(i, 1.0)
    raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
    if i not in todo and model_of(i).startswith("elevenlabs"):
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
