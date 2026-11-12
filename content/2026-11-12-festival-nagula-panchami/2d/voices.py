"""Nagula Chavithi & Nagula Panchami festival reel (2D, FLAT skin) voices: Gopi (scaredy-cat host), Pinky (6, cheeky),
Lakshmi Amma (Gopi's mother). ElevenLabs eleven_v3 first (reads the [audio tags] in each line's `say`), then Gemini
batches (Gopi=Puck, Pinky=Leda, Amma=Kore), then Sarvam; Gemini/Sarvam get the tags stripped.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
Re-take lines with `python voices.py 3 4`; `VOICE=gemini` skips ElevenLabs, `VOICE=sarvam` forces Sarvam."""
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

FPS = 30
PACE, TEMP = 1.1, 1.0
COUNTDOWN = 3.0
GREETING = 5.0
TEMPO = {**{i: 1.12 for i in range(14)}, 0: 1.08, 5: 1.05}   # comic pace on top of the owner's 5% (ElevenLabs takes;
# screams kept close to natural). The Gemini fallback takes (vo_gemini/) used 1.095 / 1.22.
PITCH_X = {}   # ElevenLabs screams are real screams: no extra pitch (Gemini fallback used {0: 1.08, 5: 1.1})
CAST = {  # character -> (Gemini voice, pitch factor)
    "gopi":  ("Puck", 1.0),      # host, the scaredy-cat
    "pinky": ("Leda", 1.12),     # little sister, cheeky
    "amma":  ("Kore", 1.0),      # Lakshmi Amma
}
PERSONA = {"gopi": "You are Gopi, a lively young Telugu man, a comic scaredy-cat, talking straight to the viewer like a close friend.",
           "pinky": "You are Pinky, a sweet, cheeky 6-year-old Telugu girl.",
           "amma": "You are Lakshmi Amma, Gopi's warm but bossy Telugu mother."}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with ElevenLabs [tags])  -- from script.json
    ("gopi",  "పాము! పాము! పాము!", 0.3, "full-blown panic scream, comically over the top", "[screams] పాము! [panicked] పాము! పాముuu!"),  # 0 hook
    ("pinky", "అన్నయ్యా… అది తాడు!", 0.25, "cheeky little girl, trying not to laugh", "[giggles] అన్నయ్యా… [mischievously] అది తాడు!"),  # 1 hook-twist
    ("gopi",  "రేపు నాగుల చవితి, ఎల్లుండి నాగుల పంచమి… చివర్లో మీకో greeting!", 0.3, "still shaky, then pulls himself together into festive host mode, ends secretive", "[panicked] సరే సరే… [excited] రేపు నాగుల చవితి, ఎల్లుండి నాగుల పంచమి! [whispers] చివర్లో మీకో greeting!"),  # 2 hold
    ("amma",  "Gopi! రేపు తెల్లవారుజామునే లే… పుట్ట దగ్గరికి వెళ్ళాలి!", 0.3, "bossy mother, then softens", "[scolding] Gopi! [warmly] రేపు తెల్లవారుజామునే లే… పుట్ట దగ్గరికి వెళ్ళాలి!"),  # 3 family
    ("gopi",  "Amma… snooze ఐదు నిమిషాలు… పుట్ట అంటే… పాము?!", 0.3, "lazy yawn, then sudden realisation and fear", "[sleepy] Amma… snooze ఐదు నిమిషాలు… [gasps] పుట్ట అంటే… [panicked] పాము?!"),  # 4 comedy
    ("gopi",  "అమ్మో! నిజం పాము!", 0.6, "high-pitched shriek, jumping onto the cot", "[screams] అమ్మో! నిజం పాము!"),  # 5 snake (the snake peeks in the gap)
    ("pinky", "అన్నయ్య కంటే… పామే brave!", 0.9, "giggling, teasing punchline", "[laughs] అన్నయ్య కంటే… [mischievously] పామే brave!"),  # 6 punchline (snake waves + slithers off in the gap)
    ("gopi",  "సరే సరే… ఇలాంటి fun రోజూ కావాలంటే follow, subscribe!", 0.25, "embarrassed laugh, then quick friendly aside", "[laughs] సరే సరే… [excited] ఇలాంటి fun రోజూ కావాలంటే follow, subscribe!"),  # 7 follow
    ("gopi",  "Quiz! పాము రైతుకి friend… ఎందుకు? Reveal ముందే comment చేయండి!", 0.3, "playful quiz-host challenge, then urgent", "[mischievously] Quiz! పాము రైతుకి friend… ఎందుకు? [excited] Reveal ముందే comment చేయండి!"),  # 8 comment-countdown
    ("pinky", "Gopi అన్నయ్యని… భయపెట్టడానికి!", 0.25 + COUNTDOWN + 0.25, "very sure of her silly answer, cheeky", "[giggles] Gopi అన్నయ్యని… [mischievously] భయపెట్టడానికి!"),  # 9 guess (after the 3 s countdown)
    ("amma",  "కాదమ్మా! పంట తినే ఎలుకల్ని తింటుంది… పంటని కాపాడుతుంది!", 0.3, "amused, then warm and clear explanation", "[laughs] కాదమ్మా! [warmly] పంట తినే ఎలుకల్ని తింటుంది… పంటని కాపాడుతుంది!"),  # 10 reveal
    ("gopi",  "అందుకే… దూరం నుంచే గౌరవం! Correct అయితే comment లో ✅!", 0.3, "respectful, then upbeat", "[warmly] అందుకే… దూరం నుంచే గౌరవం! [excited] Correct అయితే comment లో tick!"),  # 11 check
    ("gopi",  "ఈ reel మీ story లో పెట్టి… family కి wish చేయండి!", 0.25, "energetic, inviting", "[excited] ఈ reel మీ story లో పెట్టి… [warmly] family కి wish చేయండి!"),  # 12 share
    ("gopi",  "నాగుల చవితి & నాగుల పంచమి శుభాకాంక్షలు!", 0.3, "warm festive greeting, big smile", "[warmly] నాగుల చవితి… [excited] నాగుల పంచమి శుభాకాంక్షలు!"),  # 13 close + greeting card
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

SARVAM = {"gopi": ("shubh", 1.0), "pinky": ("priya", 1.22), "amma": ("kavya", 1.0)}
def tts_sarvam(text, who):
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60,
                      headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": text, "target_language_code": "te-IN", "model": "bulbul:v3", "speaker": SARVAM[who][0],
                            "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status()
    return base64.b64decode(r.json()["audios"][0])

untag = lambda x: re.sub(r"\[[^\]]{1,40}\]\s*", "", x).replace("uu!", "!").strip()
only = {int(a) for a in sys.argv[1:]}   # re-take only these line numbers (keeps the other takes)
os.makedirs("vo", exist_ok=True)
todo = [i for i in range(len(LINES)) if not os.path.exists(f"vo/L{i}_raw.wav") or i in only]
sarvam_lines, eleven_lines = set(), set()
ELEVEN_PITCH = {"pinky": 1.15}   # Jessica pitched up for a 6-year-old; others as they are
sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
if todo and os.environ.get("VOICE") not in ("gemini", "sarvam"):   # 0) ElevenLabs while the key has credits
    from content_arena import elevenvoice
    for i in list(todo):
        who, text, gap, act, *say = LINES[i]
        try:
            elevenvoice.voice_line(say[0] if say else text, who, act, f"vo/L{i}_raw.wav")
        except elevenvoice.ElevenUnavailable as e:
            print(f"  ElevenLabs unavailable from line {i} ({e}); the rest falls back to Gemini", flush=True); break
        eleven_lines.add(i); todo.remove(i)
        open(f"vo/L{i}_model.txt", "w").write("elevenlabs:" + elevenvoice.MODEL)
    if eleven_lines: print("  ElevenLabs voiced lines:", sorted(eleven_lines), flush=True)
if todo and os.environ.get("VOICE") != "sarvam":   # 1) Gemini whole-reel batches (2–3 requests per reel)
    from content_arena import scenevoice
    batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": (LINES[i][4] if len(LINES[i]) > 4 else None)}
             for i in todo]
    got = scenevoice.voice_batch(batch, "vo_batch", {"Gopi": CAST["gopi"][0], "Pinky": CAST["pinky"][0], "Amma": CAST["amma"][0]})
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
            open(raw, "wb").write(tts_sarvam(untag(say[0]) if say else text, who)); pitch = SARVAM[who][1]
            open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")
        elif len(parts) == 1:
            try:   # 2) one-by-one Gemini; 3) Sarvam if Gemini refuses (quota)
                take = tts(untag(say[0]) if say else text, spk, who, act); os.replace("vo/_model.txt", f"vo/L{i}_model.txt"); time.sleep(21)
            except requests.HTTPError as e:
                print(f"  line {i}: Gemini refused ({e.response.status_code if e.response is not None else '?'}) -> Sarvam", flush=True)
                take = tts_sarvam(untag(say[0]) if say else text, who); pitch = SARVAM[who][1]
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
    pitch *= PITCH_X.get(i, 1.0)
    af += f",asetrate=44100*{pitch},aresample=44100,atempo={1.05*TEMPO.get(i, 1.0)/pitch:.4f}"  # owner: 5% faster
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
    with wave.open(dst) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    dur = len(a) / 44100
    hop = 44100 // FPS
    env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
    m = max(env) or 1
    env = [round(min(1, e / m * 1.4), 3) for e in env]
    t += gap
    out.append({"i": i, "who": who, "text": text, "spoken": untag(say[0]) if say else text, "start": round(t, 3), "dur": round(dur, 3), "env": env})
    t += dur
json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(max(t + 1.0, out[-1]["start"] + GREETING), 2)}, open("timeline.json", "w"), ensure_ascii=False)
for l in out: print(l["i"], l["who"], l["start"], l["dur"])
print("total", round(max(t + 1.0, out[-1]["start"] + GREETING), 2))
