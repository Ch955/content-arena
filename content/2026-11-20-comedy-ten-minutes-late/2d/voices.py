"""Office comedy 'పది నిమిషాల లేట్!' (the owner's own script; 2D animated, FLAT: a generic small Hyderabad IT office,
the manager's glass cabin) voices: the manager (~45, smug/smooth -> Andhra), Ramesh (late 20s, cheeky -> furious, cast
as aggressive -> Telangana), Gopi (host, 4 short lines).

One engine per character for the whole reel (vo/engine.json). Order: ElevenLabs -> Gemini -> Sarvam, automatic:
- ElevenLabs takes whole characters (EL_ORDER) only if all of that character's lines fit in the credits the KEY can
  still spend (x1.2 margin). The account shows ~1,051 credits but the key's own cap had ~51 left on 18-19 Nov
  (ELEVEN_KEY_CAP, default 51), so a character only goes to ElevenLabs when it fits under that cap; otherwise it goes
  straight to Gemini without spending credits on takes that would be thrown away.
- Ramesh is never on the free-plan built-in fallback (Liam = Gopi's voice): if ElevenLabs answers 402
  paid_plan_required for his library voice, he goes to Gemini (brief: never let Ramesh and Gopi share a voice).
- Gemini batch (content_arena.scenevoice) for the rest, cut back into lines at the pauses; every take is checked with
  stt_check.py (Sarvam STT, else the Gemini listener). Sarvam TTS is the last resort.
Speed: ElevenLabs/Sarvam x1.05, Gemini x1.15 (owner, 12 Nov 2026).
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json
from vo/L*_raw.wav; `python voices.py 3 4` re-takes lines 3 and 4 with their character's engine.
Actually used (19 Nov 2026, for 20 Nov): ALL LINES GEMINI (batch, 4 requests) -- Ramesh=Sadachbia, the manager=Algieba,
Gopi=Puck. ElevenLabs: account 1,051 credits but the key cap ~51 -> nothing fitted, no credits spent; Sarvam: no credits.
Pipeline: voices.py -> vo_orig (backup) -> recut.py (vo_orig -> vo_fix; L4 cut after 'కొట్టండి', brief trim step 3)
-> tighten.py (MAXP=.26 KEEP=.18 TH=.02; vo_fix -> vo) -> beat.py (+0.36 s gap in L7 for the record scratch)
-> voices.py --build. Takes checked with the Gemini listener (stt_check.json; the strong listener's daily quota ran out
after L9, so L10-L13 were checked with flash-lite + seg_check.py). Total 46.55 s after the brief's 4 trims.
GAP values leave room for the SFX hits (brief: 'leave voice gaps for the high/max hits'): the DUN-DUNN + calendar flip
before L3, the sad trombone before L4, the stomps/door bang + 'ooooh' before L5, DHAN-DHAN-DHAAN before L7, the long
slurp before L9, the 0.4 s TOTAL silence before L11 (the punch), and the silent punch card + laugh track before L12."""
import base64, json, os, re, subprocess, sys, wave
import numpy as np, requests

FPS = 30
INTRO = 1.20       # silent intro (trim step 1: 1.45 -> 1.2): clock tick-tock -> 10:10 TING, Ramesh tiptoes in (brief: first voice at ~1.5 s)
SILENCE = 0.40     # the total silence before the punch (never cut)
CARD = 2.75        # DONK + laugh + HOORAY + the silent punch card (typed in two halves, rimshot) before L12
TAIL = 1.05        # end card (trim step 4: the sting overlaps L13's end): sting + sparkle, tick-tick-ting callback
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
FIT = {}           # extra atempo per line (0.9-1.1) to fit a re-take into its old slot
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with v3 [tags])  -- from script.json
    ("manager", "ఒరేయ్ రమేష్! ఏంట్రా లేటుగా వచ్చావు?", INTRO,
     "a smug 45-year-old boss catching a latecomer: a loud bark on the name, then slow, mocking sarcasm; stress on లేటుగా",
     "[shouting] ఒరేయ్ రమేష్! [sarcastically] ఏంట్రా… లేటుగా వచ్చావు?"),                                     # 0 hook (DHOOM on ఏంట్రా)
    ("ramesh", "పది నిమిషాలే కదా సార్!", 0.30,
     "a cheeky late-20s employee, helmet still in hand, caught but grinning: a small nervous laugh, then casual innocence; stress on పది",
     "[nervous laugh] పది నిమిషాలే… [cheekily] కదా సార్!"),                                                   # 1 excuse
    ("manager", "సరే, సరే... rating టైమ్ లో చూసుకుందాం.", 0.25,
     "waving it off, far too calm, then a slow, smug threat over the coffee mug; stress on rating",
     "[dismissively] సరే, సరే… [smugly] rating టైమ్ లో… చూసుకుందాం."),                                      # 2 plant (slurp, dun-DUNN, flip)
    ("gopi", "Appraisal రోజు… top rating రావాల్సిన రమేష్ కి… secondary rating!", 1.00,
     "a narrator teasing the viewer: a hushed build-up, then a gleeful sting on secondary",
     "[dramatic pause] Appraisal రోజు… [whispers] top rating రావాల్సిన రమేష్ కి… [mischievously] secondary rating!"),   # 3 stamp + trombone
    ("gopi", "Follow కొట్టండి!", 0.95,      # trimmed (brief's trim order, step 3): the take is cut after 'కొట్టండి' in recut.py
     "quick and playful, a wink to the viewer, then a gleeful tease",
     "[excited] Follow కొట్టండి!"),                                                                            # 4 follow (stomps after)
    ("ramesh", "సార్, ఎందుకు సార్ నాకు సెకండరీ రేటింగ్ ఇచ్చారు? నా పని మీకు నచ్చలేదా?", 1.15,
     "an angry, hurt employee still holding his temper and still polite: fast and hot on the first question, then a wounded drop; stress on ఎందుకు",
     "[frustrated] సార్, ఎందుకు సార్ నాకు సెకండరీ రేటింగ్ ఇచ్చారు? [hurt] నా పని… మీకు నచ్చలేదా?"),             # 5 confront ('ooooh' before)
    ("manager", "నీ పని బాగానే ఉంది రమేష్. కానీ నువ్వు పది నిమిషాలు లేటుగా వచ్చావు కదా!", 0.25,
     "unbothered and sweet at first, then a slow, smug gotcha, leaning back with the mug; stress on పది",
     "[calmly] నీ పని బాగానే ఉంది రమేష్. [smugly] కానీ నువ్వు… పది నిమిషాలు… [sarcastically] లేటుగా వచ్చావు కదా!"),  # 6 reason (DHAN x3 after)
    ("ramesh", "ఒరేయ్... నీ దుంప తెగ! పది నిమిషాలు లేటుగా వస్తే రేటింగ్ తగ్గిస్తారా ఎవరైనా?", 0.95,
     "the dam breaks: a furious shout that throws the respect out of the window and hands the boss his own ఒరేయ్ back, then fast, incredulous ranting; comic fury, not real venom; stress on పది",
     "[shouting] ఒరేయ్… [furious] నీ దుంప తెగ! [angry] పది నిమిషాలు లేటుగా వస్తే… రేటింగ్ తగ్గిస్తారా ఎవరైనా?"),    # 7 outburst (scratch + freeze)
    ("manager", "మరి ఏం చేయమంటావ్?", 0.25,
     "completely unmoved, a slow, smug shrug, almost bored",
     "[smugly] మరి… [chuckles] ఏం చేయమంటావ్?"),                                                                 # 8 ask (long slurp after)
    ("ramesh", "రేపటి నుంచి గంట ముందే ఆఫీస్‌కి వస్తా!", 0.70,
     "a sudden switch to mock-heroic resolve, chest out, slow like a punch dialogue; stress on గంట",
     "[determined] రేపటి నుంచి… [proudly] గంట ముందే ఆఫీస్‌కి వస్తా!"),                                          # 9 promise (heroic brass)
    ("manager", "అయితే చాలా మంచిది రమేష్!", 0.20,
     "delighted, a smug, victorious smile, raising the mug like a toast",
     "[pleased] అయితే… [warmly] చాలా మంచిది రమేష్!"),                                                            # 10 trap (ding) -> 0.4 s silence
    ("ramesh", "మరి నా శాలరీ డబుల్ చేస్తావా నువ్వు?", SILENCE + 0.12,
     "leaning in, a slow, cheeky, dead-serious bargain, a beat before డబుల్; stress on డబుల్",
     "[mischievously] మరి… నా శాలరీ… [deadpan] డబుల్ చేస్తావా నువ్వు?"),                                          # 11 PUNCH (DONK, laugh, HOORAY)
    ("gopi", "మీ manager ఇలా చేశాడా? Comment చేయండి!", CARD,
     "laughing along with the viewer, a friendly nudge",
     "[laughs] మీ manager ఇలా చేశాడా? [excited] Comment చేయండి!"),                                              # 12 comment
    ("gopi", "మీ manager ని tag చేయండి!", 0.20,
     "a conspiratorial grin, dropping to a cheeky whisper as if the manager might hear",
     "[mischievously] మీ manager ని… [whispers] tag చేయండి!"),                                                   # 13 tag -> end card
]

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import elevenvoice, scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
PROFILE = {"ramesh": elevenvoice.profile_for("male", "young", "aggressive"),   # -> telangana-male-young (Kaka)
           "manager": elevenvoice.profile_for("male", "middle", "smooth"),     # -> andhra-male-middle (Sai Datta, warm)
           "gopi": None}                                                        # built-in Liam
elevenvoice.STABILITY.update({"ramesh": 0.0, "manager": 0.5})                   # Ramesh: Creative, swings cheeky -> furious
NO_BUILTIN = {"ramesh"}           # free-plan fallback would be Liam = Gopi's voice -> Gemini instead
ELEVEN_PITCH = {}
EL_ORDER = ["manager", "ramesh", "gopi"]
KEY_CAP = int(os.environ.get("ELEVEN_KEY_CAP", "51"))
GEMINI = {"gopi": "Puck", "ramesh": "Sadachbia", "manager": "Algieba"}
SARVAM = {"gopi": "shubh", "ramesh": "rohan", "manager": "rahul"}
scenevoice.NAMES.update({"ramesh": "Ramesh", "manager": "Manager"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "ramesh": "Ramesh, a cheeky Telugu office employee in his late 20s from Hyderabad, quick-witted, who flips from playful to furious, with a lively, youthful male voice",
    "manager": "the Manager, a smug, sarcastic Telugu office manager of about 45, slow and very pleased with himself, with a smooth, mature male voice"})

def eleven(i, who):
    text = LINES[i][4]
    prof = PROFILE.get(who)
    if who in NO_BUILTIN:   # no built-in fallback: a 402 on the library voice -> ElevenUnavailable -> Gemini
        saved = dict(elevenvoice.BUILTIN); elevenvoice.BUILTIN.clear()
        elevenvoice.BUILTIN.update({k: None for k in saved})
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
    # 1) plan: whole characters on ElevenLabs while the key's credits last
    if not eng:
        left = elevenvoice.credits_left() if forced not in ("gemini", "sarvam") else 0
        budget = min(left or 0, KEY_CAP)
        print("ElevenLabs credits left (account):", left, "| key cap:", KEY_CAP, "| budget:", budget, flush=True)
        for who in EL_ORDER:
            need = sum(len(elevenvoice.clean(LINES[i][4])) for i in lines_of(who))
            if forced not in ("gemini", "sarvam") and need * 1.2 <= budget: eng[who] = "eleven"; budget -= need
            else: eng[who] = "sarvam" if forced == "sarvam" else "gemini"
            print(f"  {who}: needs {need} credits -> {eng[who]}", flush=True)
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
        except (elevenvoice.ElevenUnavailable, TypeError) as e:
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
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
        with wave.open(dst) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
        dur = len(a) / 44100; hop = 44100 // FPS
        env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
        mx = max(env) or 1; env = [round(min(1, x / mx * 1.4), 3) for x in env]
        t += gap
        out.append({"i": i, "who": who, "engine": e, "text": text, "spoken": TAGS.sub("", say).strip(), "start": round(t, 3), "dur": round(dur, 3), "env": env})
        t += dur
    json.dump({"fps": FPS, "silence": SILENCE, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
    for l in out: print(l["i"], l["who"], l["engine"], l["start"], l["dur"])
    print("total", round(t + TAIL, 2))

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--build" not in args: voice_all([int(a) for a in args if a.isdigit()])
    build()
