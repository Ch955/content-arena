"""Moral dilemma #2 'the reference call' (2D animated, PAPER: Tower B office at Hitech City, a sepia torn-paper flashback
for 'last year', the chai stall at 6:40 PM in warm dusk paper) voices: Radhika (HR, voice only, ~38, cool/professional ->
Andhra), Nikhil (28, cool -> Andhra), Gopi (host), Ananya (27, emotional -> Andhra), Sandeep (34, smooth -> Andhra).

One engine per character for the whole reel (vo/engine.json). Order: ElevenLabs -> Gemini -> Sarvam, automatic:
- ElevenLabs takes whole characters, story cast first (EL_ORDER), as long as all of that character's lines fit in the
  credits left on the key (x1.2 margin for a retake). If ElevenLabs refuses in the middle of a character, that
  character's ElevenLabs takes are dropped and it (and everyone after it) goes to Gemini, so nobody switches voice.
- PROFILE from elevenvoice.profile_for (temperament casting). On the free plan the library voices answer 402
  paid_plan_required and the built-in voice is used instead (BUILTIN_PICK per character so no two share a voice).
- Gemini batch (content_arena.scenevoice) for the rest, cut back into lines at the pauses; every take is checked with
  stt_check.py (Sarvam STT, else the Gemini listener). Sarvam TTS is the last resort.
Speed: ElevenLabs/Sarvam x1.05, Gemini x1.15 (owner, 12 Nov 2026).
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json
from vo/L*_raw.wav; `python voices.py 3 4` re-takes lines 3 and 4 with their character's engine.
Actually used (17 Nov 2026, for 18 Nov): ALL LINES GEMINI -- Radhika=Gacrux (+ mild phone band), Nikhil=Charon, Gopi=Puck,
Ananya=Kore, Sandeep=Umbriel. ElevenLabs planned the whole cast (account 1,051 credits) but the key's own cap had 51 left
and refused line 0 (needs 94); Sarvam STT 402 (no credits), so takes were checked with the Gemini listener (stt_check.py).
Fixes after voicing: recut.py (four batch-split bleeds: L2|L3, L4|L5, L7|L8, L10|L11), tighten.py (MAXP=.26 KEEP=.18
TH=.02; L9 re-run MAXP=.5 KEEP=.36 for the beat before 'తాగు'), beat.py (+0.6 s end-card pause in L11 before 'ఈ call').
Total 44.24 s: no script trims were needed."""
import base64, json, os, re, subprocess, sys, wave
import numpy as np, requests

FPS = 30
COUNTDOWN = 5.0
TAIL = 0.25   # after 'clue మొదటి seconds లోనే!' -> hard cut back to frame 1 (loop)
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
FIT = {}   # extra atempo per line (0.9-1.1) to fit a re-take into the old slot
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with v3 [tags])  -- from script.json
    ("radhika", "Sandeep కి ₹30 LPA offer… మీ honest feedback మీదే ఉంది.", 0.30,
     "a polished, polite HR manager on a work call, warm but businesslike; a small weight on మీదే, as if handing him the decision",
     "[professional] Sandeep కి thirty LPA offer… [warmly] మీ honest feedback… [firm] మీదే ఉంది."),                     # 0 hook
    ("nikhil", "నా Q3 release credit తనదన్నాడు… నా promotion పోయింది.", 0.15,
     "a calm man muting the call and muttering to himself; an old hurt surfacing, clipped and quiet; stress on పోయింది",
     "[under his breath] నా Q three release… credit తనదన్నాడు. [bitter] నా promotion… పోయింది."),                    # 1 stakes
    ("gopi", "ఒక్క call తో revenge! Nikhil ఏం చెప్పాడో… చివర్లో.", 0.15,
     "a sly narrator aside to the viewer, tempting, then dropping to a hush",
     "[mischievously] ఒక్క call తో… revenge! [whispers] Nikhil ఏం చెప్పాడో… చివర్లో."),                              # 2 temptation-hold
    ("ananya", "Sandeep వాళ్ళ అమ్మకి… ఈ నెలే dialysis మొదలైంది.", 0.15,
     "a caring friend leaning in so the call can't hear, gentle and worried; stress on ఈ నెలే",
     "[whispers] Sandeep వాళ్ళ అమ్మకి… [softly] ఈ నెలే dialysis మొదలైంది."),                                         # 3 option-b
    ("gopi", "ఇలాంటి dilemmas రోజూ కావాలంటే… follow చేయండి!", 0.15,
     "a quick, warm aside, light and brisk",
     "[warmly] ఇలాంటి dilemmas రోజూ కావాలంటే… [excited] follow చేయండి!"),                                            # 4 follow
    ("gopi", "మీరైతే? A — మొత్తం నిజం. B — cover చేయడం. Comment చేయండి!", 0.15,
     "a slow, personal question to the viewer, each option weighed, then urgent quiz-host energy",
     "[dramatic pause] మీరైతే? A… మొత్తం నిజం. B… cover చేయడం. [excited] Comment చేయండి!"),                        # 5 comment-countdown
    ("nikhil", "Pressure లో Sandeep deliver చేస్తాడు. అది నిజం.", 0.1 + COUNTDOWN + 0.1,
     "unmuting and answering evenly, fair and composed, no bitterness left in the voice",
     "[calmly] Pressure లో Sandeep… deliver చేస్తాడు. [firm] అది నిజం."),                                            # 6 reveal
    ("nikhil", "Credit విషయంలో నేను biased… ఆయన్నే Q3 గురించి అడగండి.", 0.15,
     "honest and measured, admitting his own bias plainly, then a polite, steady suggestion; stress on biased",
     "[thoughtful] Credit విషయంలో… నేను biased. [calmly] ఆయన్నే Q three గురించి అడగండి."),                            # 7 take
    ("sandeep", "HR Q3 గురించే అడిగారు… నిజం చెప్పా. Sorry రా.", 0.75,      # the clock-wipe to 6:40 PM plays in this gap
     "a usually slick colleague, for once without his polish: awkward, a small exhale, then a quiet sincere apology",
     "[awkwardly] HR… Q three గురించే అడిగారు. [sighs] నిజం చెప్పా. [softly] Sorry రా."),                            # 8 turn
    ("nikhil", "Chai చల్లారిపోతుంది… తాగు.", 0.25,
     "understated and kind, almost a small smile in the voice; the forgiveness is in the tone, not the words",
     "[warmly] Chai చల్లారిపోతుంది… [softly] తాగు."),                                                                # 9 turn
    ("gopi", "A, B… లేక Nikhil లా C? Comment చేయండి!", 0.45,
     "a playful narrator springing the third option on the viewer, then a bright call to comment",
     "[mischievously] A, B… లేక Nikhil లా… C? [excited] Comment చేయండి!"),                                          # 10 comment-choice
    ("gopi", "Credit కొట్టేసే colleague ని tag చేయండి! Follow… ఈ call మీకే వస్తే?", 0.15,
     "cheeky and conspiratorial with a quick laugh, then a warm sign-off that drops into a hushed question sending you back to the start",
     "[laughs] Credit కొట్టేసే colleague ని… tag చేయండి! [warmly] Follow… [whispers] ఈ call మీకే వస్తే?"),             # 11 share-close-loop
]
# 'say' reads ₹30 LPA as "thirty LPA" and Q3 as "Q three" for every engine; on screen the digits stay.

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import elevenvoice, scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
PROFILE = {"radhika": elevenvoice.profile_for("female", "middle", "cool"),     # -> andhra-female-middle (Seeta)
           "sandeep": elevenvoice.profile_for("male", "middle", "smooth"),     # -> andhra-male-middle (Sai Datta, warm)
           "ananya": elevenvoice.profile_for("female", "young", "emotional"),  # -> andhra-female-young
           "nikhil": elevenvoice.profile_for("male", "young", "cool"),         # -> andhra-male-young
           "gopi": None}                                                        # built-in Liam
BUILTIN_PICK = {"radhika": elevenvoice.BUILTIN["female-middle"],  # Matilda (free plan)
                "sandeep": elevenvoice.BUILTIN["male-middle"],    # George
                "ananya": elevenvoice.BUILTIN["female"],          # Jessica
                "nikhil": elevenvoice.BUILTIN["male"]}            # Liam (= Gopi's voice -> pitched, see ELEVEN_PITCH)
ELEVEN_PITCH = {"nikhil": 0.94}
PHONE = {"radhika": "highpass=f=230,lowpass=f=5200,equalizer=f=1800:t=q:w=1.2:g=3"}
EL_ORDER = ["radhika", "sandeep", "ananya", "nikhil", "gopi"]
GEMINI = {"gopi": "Puck", "nikhil": "Charon", "ananya": "Kore", "sandeep": "Umbriel", "radhika": "Gacrux"}
SARVAM = {"gopi": "shubh", "nikhil": "rahul", "ananya": "kavya", "sandeep": "aditya", "radhika": "ritu"}
scenevoice.NAMES.update({"sandeep": "Sandeep", "radhika": "Radhika"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
    "ananya": "Ananya, a warm, confident 27-year-old woman, Nikhil's close friend, speaking standard Andhra Telugu, clear and expressive",
    "sandeep": "Sandeep, a 34-year-old senior software engineer, usually slick and charming, speaking standard Andhra Telugu with a smooth, slightly deeper voice",
    "radhika": "Radhika, a polished, polite HR manager in her late thirties on a work call, speaking standard Andhra Telugu, clear and professional"})

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
        af += f",asetrate=44100*{pitch},aresample=44100,atempo={SPEED[e] * FIT.get(i, 1.0) / pitch:.4f}"
        if who in PHONE: af += "," + PHONE[who]   # Radhika is heard over the call: a mild phone band
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
