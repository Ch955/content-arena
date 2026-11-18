"""Modern dilemma #2 'the junior's salary' (2D animated, FLAT: the Tower B cafeteria at Hitech City, Thu 1 PM; Hema's
glass cabin Fri 10:00 AM; a paper/sepia torn-edge flashback 'TUESDAY · HR ROOM') voices: Kiran (23, the new junior from
15 Nov, bubbly/cool -> Andhra), Gopi (host), Ananya (27, emotional -> Andhra), Nikhil (28, cool -> Andhra), Hema (~40,
engineering manager, calm -> Andhra).

One engine per character for the whole reel (vo/engine.json). Order: ElevenLabs -> Gemini -> Sarvam, automatic:
- ElevenLabs takes whole characters (EL_ORDER) as long as all of that character's lines fit in the credits left on the
  key (x1.2 margin). If ElevenLabs refuses in the middle of a character, that character and everyone after it go to
  Gemini, so nobody switches voice.
- Kiran is never on ElevenLabs: profile_for("male","young","cool") is andhra-male-young = Nikhil's voice (the bank has
  only one Andhra young male), so he is always Gemini Fenrir (brief, option 1).
- Gemini batch (content_arena.scenevoice) for the rest, cut back into lines at the pauses; every take is checked with
  stt_check.py (Sarvam STT, else the Gemini listener). Sarvam TTS is the last resort.
Speed: ElevenLabs/Sarvam x1.05, Gemini x1.15 (owner, 12 Nov 2026). Kiran's L11 (the HR-room flashback) gets a light
room reverb (ROOM) so it reads as 'earlier', not a phone.
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json
from vo/L*_raw.wav; `python voices.py 3 4` re-takes lines 3 and 4 with their character's engine.
Actually used (18 Nov 2026, for 19 Nov): ALL LINES GEMINI -- Kiran=Fenrir, Gopi=Puck, Ananya=Kore, Nikhil=Charon, Hema=Despina.
ElevenLabs planned Hema/Ananya/Nikhil/Gopi (account 1,051 credits) but the key's own cap had 51 left and refused line 10
(needs 94); Sarvam STT 402 (no credits), so takes were checked with the Gemini listener (stt_check.py).
Fixes after voicing: recut.py (two batch-split bleeds: L1|L2 'చివర్లో', L5|L6 'మీరైతే'), tighten.py (MAXP=.26 KEEP=.18
TH=.02), beat.py (AT=3.14: +0.6 s end-card pause in L13 before 'clue'). L12's subtitle says 'comment చేయండి!' because
Gopi says it (script: 'comment!'). Total 57.0 s: no script trims were needed (cap 58 s).
Retake (coordinator, 18 Nov): L3 Ananya re-voiced on Gemini Kore with the number in Telugu ('పద్దెనిమిదా', clear, not a
whisper; the whispered 'eighteen' was heard as '80' in the mix), tighten.py 3 (same settings), FIT 0.9243 to keep its
old 3.368 s slot, so every other timing is unchanged; only render chunk 0 of 3 was re-rendered."""
import base64, json, os, re, subprocess, sys, wave
import numpy as np, requests

FPS = 30
COUNTDOWN = 5.0
TAIL = 0.25   # after 'clue మొదట్లోనే ఉంది!' -> hard cut back to frame 1 (loop)
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
FIT = {3: 0.9243}   # L3 retake (19 Nov) fitted to its old slot; extra atempo per line (0.9-1.1) to fit a re-take into the old slot
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with v3 [tags])  -- from script.json
    ("kiran", "Anna! నా CTC 18 lakhs అయ్యింది… మీ runbook వల్లే!", 0.30,
     "a bubbly 23-year-old bursting with good news across the lunch table, loud, innocent and grateful; a delighted laugh on runbook",
     "[excited] Anna! నా CTC… eighteen lakhs అయ్యింది! [laughs] మీ runbook వల్లే!"),                                  # 0 hook
    ("gopi", "Nikhil… ఆరేళ్ళ experience. CTC… 14 lakhs. ఏం చేశాడో… చివర్లో!", 0.15,
     "a narrator freezing the moment, deadpan, a hushed sting on the number, then a sly tease to the viewer",
     "[dramatic pause] Nikhil… ఆరేళ్ళ experience. [whispers] CTC… fourteen lakhs. [mischievously] ఏం చేశాడో… చివర్లో!"),  # 1 stakes-hold
    ("kiran", "వేరే offer చూపిస్తే… match చేశారు! ఇంకో పని కూడా చేశా anna…", 0.15,
     "rattling on, pleased with himself, then a secretive little grin as he starts a second story and trails off mid-thought",
     "[proudly] వేరే offer చూపిస్తే… match చేశారు! [mischievously] ఇంకో పని కూడా చేశా anna…"),                       # 2 plant
    ("ananya", "Junior కి పద్దెనిమిదా? Nikhil… ఇప్పుడే cabin కి వెళ్ళు!", 0.55,     # Kiran's band buzzes, he jogs off in this gap
     "a fiercely loyal friend, surprised and indignant, in a clear, low but full voice (NOT a whisper); say పద్దెనిమిదా clearly in disbelief, then a firm push; stress on ఇప్పుడే",
     "[surprised] Junior కి… పద్దెనిమిదా? [firmly] Nikhil… ఇప్పుడే cabin కి వెళ్ళు!"),                                 # 3 option-a
    ("nikhil", "Fight చేస్తే drama… quiet గా resume update చేయనా?", 0.15,
     "a calm man's inner voice, hurt but controlled, weighing the quiet exit; a small tired sigh before the question",
     "[quietly] Fight చేస్తే… drama. [sighs] quiet గా resume update చేయనా?"),                                          # 4 option-b
    ("gopi", "రోజూ ఇలాంటి office dilemmas కావాలంటే… follow చేయండి!", 0.15,
     "a quick, bright aside, light and brisk",
     "[warmly] రోజూ ఇలాంటి office dilemmas కావాలంటే… [excited] follow చేయండి!"),                                      # 5 follow
    ("gopi", "మీరైతే? A… ఇవాళే fight. B… silent job hunt. Comment చేయండి!", 0.15,
     "a slow, personal question to the viewer, each option weighed evenly, then urgent quiz-host energy",
     "[dramatic pause] మీరైతే? A… ఇవాళే fight. B… silent job hunt. [excited] Comment చేయండి!"),                     # 6 comment-countdown
    ("nikhil", "Negotiate చేశావ్ కదా… good. Congrats రా, Kiran!", 0.1 + COUNTDOWN + 0.1,
     "genuinely warm and unbothered, an elder-brother smile in the voice; no sarcasm at all",
     "[warmly] Negotiate చేశావ్ కదా… [laughs] good. Congrats రా, Kiran!"),                                              # 7 reveal
    ("nikhil", "Ma'am, పదిహేను నిమిషాలే. Runbook… మూడు outages… నలుగురు juniors.", 0.85,   # the calendar wipe to Fri 10:00 AM plays in this gap
     "composed and businesslike in a small meeting, laying down three facts one by one like cards; stress on పదిహేను",
     "[calmly] Ma'am, పదిహేను నిమిషాలే. [confidently] Runbook… మూడు outages… నలుగురు juniors."),                     # 8 solution
    ("nikhil", "Kiran తో compare కాదు… market correction కావాలి. Review date తో.", 0.2,
     "steady and polite, drawing a clear line on the first half, then a plain, confident ask; no pleading",
     "[firmly] Kiran తో compare కాదు… [calmly] market correction కావాలి. Review date తో."),                            # 9 solution
    ("hema", "Review — December 1. నువ్వు అడగకముందే… Kiran HR కి చెప్పాడు.", 0.25,
     "a calm, kind engineering manager of about 40; businesslike on the date, then a warm half-smile as she shares a secret; stress on అడగకముందే",
     "[calmly] Review… December first. [warmly] నువ్వు అడగకముందే… [softly] Kiran HR కి చెప్పాడు."),                  # 10 twist
    ("kiran", "Runbook Nikhil anna ది… ముందు ఆయన salary చూడండి!", 0.45,      # the torn-paper flashback opens in this gap
     "the same bubbly junior, for once serious and sincere, standing up for his mentor in a formal room; stress on ముందు",
     "[earnest] Runbook Nikhil anna ది… [firmly] ముందు ఆయన salary చూడండి!"),                                          # 11 twist (flashback)
    ("gopi", "మీకు ఎప్పుడైనా junior కంటే తక్కువ వచ్చిందా? A or B… comment చేయండి!", 0.8,      # Nikhil looks out at Kiran through the glass
     "conspiratorial and playful, like asking a colleague at the coffee machine, then a bright call to comment",
     "[mischievously] మీకు ఎప్పుడైనా junior కంటే తక్కువ వచ్చిందా? [excited] A or B… comment!"),                     # 12 comment
    ("gopi", "మీరు train చేసిన junior ని tag చేయండి! Follow… clue మొదట్లోనే ఉంది!", 0.15,
     "a cheeky laugh, a warm sign-off, then a hushed tip that sends you back to the start",
     "[laughs] మీరు train చేసిన junior ని… tag చేయండి! [warmly] Follow… [whispers] clue మొదట్లోనే ఉంది!"),            # 13 share-close-loop
]
# 'say' reads 18 / 14 as "eighteen" / "fourteen" and "December 1" as "December first" for every engine; on screen the digits stay.
# 'say' reads ₹30 LPA as "thirty LPA" and Q3 as "Q three" for every engine; on screen the digits stay.

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import elevenvoice, scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
PROFILE = {"hema": elevenvoice.profile_for("female", "middle", "cool"),       # -> andhra-female-middle (Seeta)
           "ananya": elevenvoice.profile_for("female", "young", "emotional"),  # -> andhra-female-young
           "nikhil": elevenvoice.profile_for("male", "young", "cool"),         # -> andhra-male-young (Darsh M)
           "kiran": None,                                                       # never ElevenLabs (would be Nikhil's voice)
           "gopi": None}                                                        # built-in Liam
BUILTIN_PICK = {"hema": elevenvoice.BUILTIN["female-middle"],     # Matilda (free plan)
                "ananya": elevenvoice.BUILTIN["female"],          # Jessica
                "nikhil": elevenvoice.BUILTIN["male"]}            # Liam (= Gopi's voice -> pitched, see ELEVEN_PITCH)
ELEVEN_PITCH = {"nikhil": 0.94}
PHONE = {}
ROOM = {"kiran": (11, "aecho=0.8:0.55:38|67:0.22|0.13,highpass=f=120")}   # the HR-room flashback line only
EL_ORDER = ["hema", "ananya", "nikhil", "gopi"]        # Kiran is not in it: always Gemini Fenrir
GEMINI = {"gopi": "Puck", "nikhil": "Charon", "ananya": "Kore", "kiran": "Fenrir", "hema": "Despina"}
SARVAM = {"gopi": "shubh", "nikhil": "rahul", "ananya": "kavya", "kiran": "rohan", "hema": "roopa"}
scenevoice.NAMES.update({"kiran": "Kiran", "hema": "Hema"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
    "ananya": "Ananya, a warm, confident 27-year-old woman, Nikhil's close friend, speaking standard Andhra Telugu, clear and expressive",
    "kiran": "Kiran, a bubbly, innocent 23-year-old Telugu software engineer, quick and excited, speaking standard Andhra Telugu with a bright, youthful voice",
    "hema": "Hema, a calm, kind Telugu engineering manager of about 40, measured and warm, speaking standard Andhra Telugu"})

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
        eng["kiran"] = "sarvam" if forced == "sarvam" else "gemini"
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
        af += f",asetrate=44100*{pitch},aresample=44100,atempo={SPEED[e] * FIT.get(i, 1.0) / pitch:.4f}"
        if who in PHONE: af += "," + PHONE[who]
        if who in ROOM and ROOM[who][0] == i: af += "," + ROOM[who][1]   # flashback room reverb
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
