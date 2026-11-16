"""What-if #2 'the forehead number' (2D animated: NEON engagement night in a Kukatpally function hall, CLAY time-lapse
at the end, back to NEON for the loop frame) voices: Gopi (narrator/host), Vimala (~52, aggressive -> Telangana),
Ammamma (~74, warm), Ananya (27, emotional -> Andhra), Nikhil (28, cool -> Andhra).

One engine per character for the whole reel (vo/engine.json). Order: ElevenLabs -> Gemini -> Sarvam, automatic:
- ElevenLabs takes whole characters, story cast first (EL_ORDER), as long as all of that character's lines fit in the
  credits left on the key (x1.2 margin for a retake). If ElevenLabs refuses in the middle of a character, that
  character's ElevenLabs takes are dropped and it (and everyone after it) goes to Gemini, so nobody switches voice.
- PROFILE from elevenvoice.profile_for (temperament casting). On the free plan the library voices answer 402
  paid_plan_required and the built-in voice is used instead (BUILTIN_PICK: per character, so two characters never share
  a voice: Vimala would otherwise get Jessica = Ananya's voice).
- Gemini batch (content_arena.scenevoice) for the rest, cut back into lines at the pauses; every take is checked with
  Sarvam STT (stt_check.py). Sarvam TTS is the last resort.
Speed: ElevenLabs/Sarvam x1.05, Gemini x1.15 (owner, 12 Nov 2026).
Actually used (16 Nov 2026): ALL LINES GEMINI -- Gopi=Puck, Vimala=Autonoe, Ammamma=Sulafat, Ananya=Kore, Nikhil=Charon.
The plan put the story cast on ElevenLabs (account showed 1,051 credits) but the API key's own cap had 51 left and refused
line 0, so everyone went to Gemini. Sarvam had no credits (TTS + STT 402): takes were checked with the Gemini listener
(stt_check.py). Fixes after voicing: recut.py (L1|L2 split), tighten.py (MAXP=.26 KEEP=.18 TH=.02), script L10 cut for
length (brief: trim L10 first), beat.py (+0.6 s end-card pause in the last line). Files: vo/L9 = script L11, vo/L10 = L12.
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json
from vo/L*_raw.wav; `python voices.py 3 4` re-takes lines 3 and 4 with their character's engine."""
import base64, json, os, re, subprocess, sys, wave
import numpy as np, requests

FPS = 30
COUNTDOWN = 5.0
TAIL = 0.25   # after 'clue మొదటి seconds లోనే!' -> hard cut back to frame 1 (loop)
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with v3 [tags])  -- from script.json
    ("vimala", "మా Rohit కి US లో crore package తెల్సా? నీకెంత, Nikhil?", 0.30,
     "a loud, smug aunty showing off to the whole function hall, then a sugar-coated jab with a raised eyebrow; stress on crore",
     "[proudly] మా Rohit కి US లో crore package తెల్సా? [sarcastically] నీకెంత, Nikhil?"),                          # 0 hook
    ("gopi", "అప్పుడే… అందరి forehead మీద ఒక number!", 0.15,
     "a narrator dropping to a hush, then a bright jolt as the numbers light up",
     "[dramatic pause] అప్పుడే… [whispers] అందరి forehead మీద… [excited] ఒక number!"),                                # 1 premise
    ("vimala", "Rohit కి 12 ఏంది?! ఎవుసం చేసే Srinu కి… 2,400?!", 0.15,
     "the proud aunty's face falling: shrill disbelief, rising higher and faster on the second number",
     "[shocked] Rohit కి twelve ఏంది?! [panicking] ఎవుసం చేసే Srinu కి… two thousand four hundred?!"),               # 2 setup
    ("gopi", "Salary ఆ? Answer చివర్లో… clues మిస్ అవ్వకండి!", 0.15,
     "a sly narrator aside to the viewer, quick then hushed",
     "[mischievously] Salary ఆ? [whispers] Answer చివర్లో… clues మిస్ అవ్వకండి!"),                                  # 3 hold
    ("ammamma", "నాకు జీతమే లేదు… అయినా నాదే పెద్ద number!", 0.15,
     "a 74-year-old grandmother, amused and unhurried, a twinkle in her voice; stress on నాదే",
     "[chuckles] నాకు జీతమే లేదు… [slowly] అయినా నాదే పెద్ద number!"),                                              # 4 clue-1
    ("ananya", "చూడు… Amma laddu పెడుతుంటే నీది 97! Rohit ది… కదలట్లేదు.", 0.15,
     "a sharp-eyed friend who notices first: quick and excited, then a conspiratorial whisper; stress on కదలట్లేదు",
     "[curious] చూడు… Amma laddu పెడుతుంటే… [excited] నీది ninety-seven! [whispers] Rohit ది… కదలట్లేదు."),          # 5 clue-2
    ("gopi", "Follow కొట్టి… comment చేయండి: ఆ number ఏంటి? 5 seconds!", 0.15,
     "a quick warm aside, then a slow pointed question to the viewer, then urgent quiz-host energy",
     "[warmly] Follow కొట్టి… [dramatic pause] comment చేయండి — ఆ number ఏంటి? [excited] Five seconds!"),            # 6 follow-comment-countdown
    ("ananya", "Money కాదు… ఈ year family తో, phone లేకుండా గడిపిన గంటలు!", 0.1 + COUNTDOWN + 0.1,
     "gentle and certain, letting it land slowly; stress on గంటలు",
     "[softly] Money కాదు… [warmly] ఈ year family తో… phone లేకుండా గడిపిన గంటలు!"),                                # 7 reveal
    ("nikhil", "Amma-Nanna తో… ఈ year మొత్తం నాలుగు రోజులే?", 0.20,
     "a calm man doing the maths in his head and going quiet, the last word almost a breath",
     "[quietly] Amma-Nanna తో… [slowly] ఈ year మొత్తం… నాలుగు రోజులే?"),                                            # 8 why
    # script L10 (Vimala: "Rohit… గా phone పక్కకు పెట్టు రా!") CUT for length (brief: trim L10 first if over 45 s);
    # the turn stays as a silent visual (clay): she nudges Rohit, he puts the phone face-down and sits by her.
    ("gopi", "Correct ఆ? ✅ మీ forehead మీద ఎంత? Comment చేయండి!", 0.45,
     "a warm narrator letting the twist click, then a bright, personal question to the viewer",
     "[warmly] Correct ఆ? [dramatic pause] మీ forehead మీద ఎంత? [excited] Comment చేయండి!"),                        # 9 check-comment (script L11)
    ("gopi", "Compare అయ్యే cousin ని tag చేయండి! Follow… clue మొదటి seconds లోనే!", 0.15,
     "playful and conspiratorial, a quick laugh, then dropping to an intriguing whisper that sends you back to the start",
     "[mischievously] Compare అయ్యే cousin ని… tag చేయండి! [laughs] Follow… [whispers] clue మొదటి seconds లోనే!"),   # 10 share-close-loop (script L12)
]
# 'say' reads 97 as "ninety-seven" for every engine (Gemini/Sarvam read digits oddly); on screen the digits stay.

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import elevenvoice, scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
PROFILE = {"vimala": elevenvoice.profile_for("female", "middle", "aggressive"),   # -> telangana-female-young (bank has no middle)
           "ananya": elevenvoice.profile_for("female", "young", "emotional"),    # -> andhra-female-young
           "nikhil": elevenvoice.profile_for("male", "young", "cool"),           # -> andhra-male-young
           "ammamma": None, "gopi": None}                                         # built-in Matilda / Liam
BUILTIN_PICK = {"vimala": elevenvoice.VOICES["amma"],      # Sarah (free plan; Jessica is Ananya's)
                "ananya": elevenvoice.BUILTIN["female"],    # Jessica
                "nikhil": elevenvoice.BUILTIN["male"]}      # Liam (Gopi is on Gemini, so no clash)
ELEVEN_PITCH = {"vimala": 0.95, "ammamma": 0.94}           # a little older (owner confirms by ear)
EL_ORDER = ["vimala", "ananya", "nikhil", "ammamma", "gopi"]
GEMINI = {"gopi": "Puck", "nikhil": "Charon", "ananya": "Kore", "vimala": "Autonoe", "ammamma": "Sulafat"}
SARVAM = {"gopi": "shubh", "nikhil": "rahul", "ananya": "kavya", "vimala": "ritu", "ammamma": "priya"}
scenevoice.NAMES.update({"vimala": "Vimala"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
    "ananya": "Ananya, a warm, confident 27-year-old woman, Nikhil's close friend, speaking standard Andhra Telugu, clear and expressive",
    "vimala": "Vimala, a loud, competitive 52-year-old Hyderabad aunty speaking natural Telangana Telugu, sharp-tongued but loving",
    "ammamma": "Ammamma, a warm, amused 74-year-old Telugu grandmother with a gentle, slightly aged voice"})

def eleven(i, who):
    text = LINES[i][4]
    prof = PROFILE.get(who)
    if who in BUILTIN_PICK:   # library voice first; voice_line falls back to BUILTIN[gender] on 402 paid_plan_required
        g = "female" if prof and "-female-" in prof else "male"
        saved = dict(elevenvoice.BUILTIN); elevenvoice.BUILTIN[g] = BUILTIN_PICK[who]; elevenvoice.BUILTIN[g + "-middle"] = BUILTIN_PICK[who]
        try: elevenvoice.voice_line(text, who, LINES[i][3], f"vo/L{i}_raw.wav", profile=prof)
        finally: elevenvoice.BUILTIN.clear(); elevenvoice.BUILTIN.update(saved)
    else:
        elevenvoice.voice_line(text, who, LINES[i][3], f"vo/L{i}_raw.wav", profile=prof)
    open(f"vo/L{i}_model.txt", "w").write("elevenlabs:" + elevenvoice.MODEL)

def sarvam(i, who):
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": TAGS.sub("", LINES[i][4]).strip(), "target_language_code": "te-IN", "model": "bulbul:v3",
                            "speaker": SARVAM[who], "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status(); open(f"vo/L{i}_raw.wav", "wb").write(base64.b64decode(r.json()["audios"][0]))
    open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")

def lines_of(who): return [i for i, l in enumerate(LINES) if l[0] == who]

def voice_all(only):
    os.makedirs("vo", exist_ok=True)
    eng = json.load(open("vo/engine.json")) if os.path.exists("vo/engine.json") else {}
    forced = os.environ.get("VOICE")
    # 1) plan: whole characters on ElevenLabs while the credits last
    if not eng:
        left = elevenvoice.credits_left() if forced not in ("gemini", "sarvam") else 0
        print("ElevenLabs credits left:", left, flush=True)
        budget = left or 0
        for who in EL_ORDER:
            need = sum(len(elevenvoice.clean(LINES[i][4])) for i in lines_of(who))
            if forced not in ("gemini", "sarvam") and need * 1.2 <= budget: eng[who] = "eleven"; budget -= need
            else: eng[who] = "sarvam" if forced == "sarvam" else "gemini"
        print("plan:", eng, flush=True)
    redo = set(only)
    # 2) ElevenLabs, one character at a time
    stop = False
    for who in EL_ORDER:
        if eng.get(who) != "eleven": continue
        todo = [i for i in lines_of(who) if i in redo or not os.path.exists(f"vo/L{i}_raw.wav")]
        if stop: eng[who] = "gemini"; continue
        try:
            for i in todo: print("  eleven", i, who, flush=True); eleven(i, who)
        except elevenvoice.ElevenUnavailable as e:
            print(f"  ElevenLabs refused at {who} ({e}) -> {who} and the rest go to Gemini", flush=True)
            for i in lines_of(who):
                for f in (f"vo/L{i}_raw.wav", f"vo/L{i}_model.txt"):
                    if os.path.exists(f): os.remove(f)
            eng[who] = "gemini"; stop = True
    # 3) Gemini batch for the rest (scenevoice: <= 2 voices per request)
    gem = [i for i in range(len(LINES)) if eng[LINES[i][0]] == "gemini" and (i in redo or not os.path.exists(f"vo/L{i}_raw.wav"))]
    if gem:
        batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": LINES[i][4]} for i in gem]
        got = scenevoice.voice_batch(batch, "vo_batch", {scenevoice.NAMES[w]: GEMINI[w] for w in GEMINI})
        for k, path in got.items():
            os.replace(path, f"vo/L{gem[k]}_raw.wav"); open(f"vo/L{gem[k]}_model.txt", "w").write("gemini-batch:" + ",".join(scenevoice.MODELS))
        miss = [i for k, i in enumerate(gem) if k not in got]
        for i in miss:   # one by one
            who = LINES[i][0]
            try:
                got1 = scenevoice.voice_batch([batch[gem.index(i)]], "vo_one", {scenevoice.NAMES[who]: GEMINI[who]})
                if 0 not in got1: raise RuntimeError("no take")
                os.replace(got1[0], f"vo/L{i}_raw.wav"); open(f"vo/L{i}_model.txt", "w").write("gemini-single:" + ",".join(scenevoice.MODELS))
            except Exception as e:
                print(f"  line {i}: Gemini failed ({e}) -> Sarvam for {who}", flush=True); eng[who] = "sarvam"
    # 4) Sarvam (last resort, whole character)
    for i in range(len(LINES)):
        who = LINES[i][0]
        if eng[who] == "sarvam" and (i in redo or not os.path.exists(f"vo/L{i}_raw.wav") or not open(f"vo/L{i}_model.txt").read().startswith("sarvam")):
            sarvam(i, who)
    json.dump(eng, open("vo/engine.json", "w"))

def build():
    t, out = 0.0, []
    for i, (who, text, gap, act, say) in enumerate(LINES):
        raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
        m = open(f"vo/L{i}_model.txt").read()
        e = "eleven" if m.startswith("eleven") else "sarvam" if m.startswith("sarvam") else "gemini"
        pitch = ELEVEN_PITCH.get(who, 1.0) if e == "eleven" else 1.0
        af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        af += f",asetrate=44100*{pitch},aresample=44100,atempo={SPEED[e] / pitch:.4f}"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
        with wave.open(dst) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
        dur = len(a) / 44100; hop = 44100 // FPS
        env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
        mx = max(env) or 1; env = [round(min(1, x / mx * 1.4), 3) for x in env]
        t += gap
        out.append({"i": i, "who": who, "engine": e, "text": text, "spoken": TAGS.sub("", say).strip(), "start": round(t, 3), "dur": round(dur, 3), "env": env})
        t += dur
    json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
    for l in out: print(l["i"], l["who"], l["engine"], l["start"], l["dur"])
    print("total", round(t + TAIL, 2))

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--build" not in args: voice_all([int(a) for a in args if a.isdigit()])
    build()
