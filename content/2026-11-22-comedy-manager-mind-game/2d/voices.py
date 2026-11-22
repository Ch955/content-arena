"""Office comedy Ep 2 '😂 Operation Manager Mind Game' (the owner's own story; series "Office Politics"; 2D animated, FLAT):
voices for the manager (Algieba), Ramesh (Sadachbia), Priya (Pulcherrima), Suresh (Achird), Gopi (Puck), all Gemini (as Ep 1).

Credits are low, so the 15 spoken lines + the chorus takes go in FOUR Gemini batch requests, grouped by speaker pair
(scenevoice allows <= 2 voices and <= 8 lines per request):
  A  manager + Ramesh  : L1 L2 L3 L5 L6 L12 L13 L14          (0-based 0 1 2 4 5 11 12 13)
  B  Priya + Ramesh    : L4 L7 L8 L11 L16 + chorus (Ramesh, Priya)
  C  Suresh + Gopi     : L10 L17 + chorus (Suresh)
  D  2 extra voices    : chorus x2 each (Umbriel, Callirrhoe) -> the 'team' extras (Ep 1 got its 3 extras free from the FAAAH
                         requests; the FAAAH is reused as-is now, so 2 extra voices x 2 takes replace Umbriel/Callirrhoe/Zubenelgenubi)
L9 (Priya's hike clue) is trim step 1 of the brief, planned UP FRONT (Ep 1's takes ran ~35% over the estimate): not voiced.
The team chorus (L15 'మీరే సార్!') = 3 cast takes + the extra takes, layered by chorus.py (Ep 1 method) -> vo/L14_raw.wav.
Every take is checked with listen.py (the Gemini listener, several clips per request).
Speed: Gemini x1.15 (owner, 12 Nov 2026) + FIT per line; the owner's punch (L16) gets no extra speed-up.
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json."""
import json, os, re, subprocess, sys, wave
import numpy as np

FPS = 30
INTRO = 0.60       # silent villain entry under the text hook (brief: 0-0.6 s)
SILENCE = 0.30     # all sound out before the punch (never cut)
TAIL = 1.20        # end card 'Series: Office Politics · Ep 2' (trim step 3: the end sting overlaps L17)
SPEED = 1.15
FIT = {0: 1.06, 2: 1.05, 4: 1.06, 6: 1.05, 7: 1.04, 10: 1.06, 13: 1.07}
# ^ extra atempo per line on top of x1.15 (22 Nov): after the recut + tighten the reel was 59.8 s; these (+ 3 tighter action gaps)
#   bring it to ~58 s. NEVER on the owner's punch (L16 = index 15: plain x1.15, coordinator's rule) or the short lines.
SILENT = {8}       # trim step 1 (brief), planned up front: L9 Priya's hike clue is not voiced
TEAM = "team"
CHORUS_TEXT = "మీరే సార్!"
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with [tags])  -- from script.json (acts tightened: brisk, no 'slow')
    ("manager", "ఈరోజు మీ అందరికీ ఒక ఛాలెంజ్! ఎవరు ఎక్కువ తెలివైనవాళ్లో ఈ గేమ్స్‌లో తెలుస్తుంది!", INTRO,
     "a smug villain boss making his grand entrance: booming and punchy, a short pause after ఛాలెంజ్, then brisk; stress on ఛాలెంజ్",
     "[smugly] ఈరోజు మీ అందరికీ… ఒక ఛాలెంజ్! [dramatic pause] ఎవరు ఎక్కువ తెలివైనవాళ్లో… [proudly] ఈ గేమ్స్‌లో తెలుస్తుంది!"),   # 0 L1 hook (owner, verbatim)
    ("ramesh", "మీరు కూడా ఆడతారా సార్?", 0.30,
     "wide-eyed, too-sweet innocent question, quick; stress on మీరు",
     "[innocently] మీరు కూడా… ఆడతారా సార్?"),                                                                          # 1 L2
    ("manager", "నన్ను ఓడించేవాడు… ఈ office లో ఇంకా పుట్టలేదు!", 0.20,
     "over-confident punch-dialogue swagger, chest out, a little chuckle first, punchy not slow; stress on పుట్టలేదు",
     "[chuckles] నన్ను ఓడించేవాడు… [smugly] ఈ office లో… ఇంకా పుట్టలేదు!"),                                              # 2 L3
    ("priya", "సార్! మీరు ఎప్పుడైనా టీమ్‌కి ఇచ్చిన డెడ్‌లైన్ మీరే ఫాలో అయ్యారా?", 0.75,
     "sharp, polite and deadly: a quiz-host smile on సార్, then the question crisp and precise; stress on మీరే",
     "[mischievously] సార్! [dramatic pause] మీరు ఎప్పుడైనా టీమ్‌కి ఇచ్చిన డెడ్‌లైన్… మీరే ఫాలో అయ్యారా?"),                # 3 L4 game 1 (owner, verbatim)
    ("manager", "See… deadline అనేది ఒక mindset. Let's take it offline!", 0.70,
     "caught: a quick nervous laugh, then slick corporate jargon, avoiding eyes; stress on offline",
     "[nervous laugh] See… deadline అనేది ఒక mindset. [calmly] Let's take it… offline!"),                                 # 4 L5
    ("ramesh", "మీ deadlines వల్ల సార్… మాకు offline life ఏ లేదు!", 0.55,
     "dry and innocent, a tiny sad smile; stress on life",
     "[deadpan] మీ deadlines వల్ల సార్… [sarcastically] మాకు offline life ఏ… లేదు!"),                                     # 5 L6
    ("priya", "Game 2! Blindfold… సార్, మీ chair ని మీరే కనిపెట్టండి!", 0.90,
     "a bright, fast game host, then a sly dare; stress on మీరే",
     "[excited] Game 2! [mischievously] Blindfold… సార్, మీ chair ని మీరే కనిపెట్టండి!"),                                 # 6 L7 game 2 (+ silent follow tap)
    ("ramesh", "కొంచెం left సార్… మా pending appraisals లాగే… slow గా!", 0.35,
     "a helpful low voice with a knife in it (clear, not a whisper); stress on slow",
     "[whispers] కొంచెం left సార్… [deadpan] మా pending appraisals లాగే… slow గా!"),                                       # 7 L8
    ("priya", "ఇంకొంచెం ముందుకి… మా hike ఆగిపోయిన చోటే మీ chair!", 0.30,
     "sweet guidance, sarcastic sting; stress on hike",
     "[mischievously] ఇంకొంచెం ముందుకి… [sarcastically] మా hike ఆగిపోయిన చోటే… మీ chair!"),                              # 8 L9 (SILENT: trim step 1)
    ("suresh", "Yes sir! Straight వెళ్ళండి సార్!", 0.60,
     "the eager yes-man, loud and loyal, nodding, pointing confidently at exactly the wrong thing",
     "[excited] Yes sir! [proudly] Straight వెళ్ళండి సార్!"),                                                              # 9 L10 (+ glass door, FAAAH #1)
    ("priya", "Game 3! Silence challenge… ఒక్క నిమిషం, ఒక్క మాట కూడా వద్దు!", 1.80,
     "bright host on the title, then a hushed, theatrical rule (clear, not a whisper); stress on ఒక్క",
     "[excited] Game 3! [whispers] Silence challenge… ఒక్క నిమిషం, ఒక్క మాట కూడా వద్దు!"),                              # 10 L11 game 3
    ("manager", "రమేష్! ఆ రిపోర్ట్ ఎక్కడ? సురేష్! క్లయింట్‌కి కాల్ చేశావా?", 0.75,
     "explodes instantly: loud, reflex boss-barking, rapid-fire; stress on రిపోర్ట్",
     "[shouting] రమేష్! ఆ రిపోర్ట్ ఎక్కడ? [angry] సురేష్! క్లయింట్‌కి కాల్ చేశావా?"),                                        # 11 L12 (owner, verbatim; + FAAAH #2)
    ("ramesh", "రెండు seconds సార్… మీరు out!", 1.20,
     "a calm referee's verdict, savouring it; stress on out",
     "[deadpan] రెండు seconds సార్… [mischievously] మీరు out!"),                                                          # 12 L13 (+ OUT stamp)
    ("manager", "నేను మాట్లాడకపోతే ఈ office నడవదు! So… winner ఎవరు?", 0.45,
     "totally unashamed, chest out, then a smug fishing question; stress on నడవదు",
     "[proudly] నేను మాట్లాడకపోతే… ఈ office నడవదు! [smugly] So… winner ఎవరు?"),                                          # 13 L14
    (TEAM, CHORUS_TEXT, 0.25,
     "the whole team in perfect fake-cheerful unison",
     "[excited] మీరే సార్!"),                                                                                              # 14 L15 chorus (chorus.py)
    ("ramesh", "అవును సార్... గేమ్‌లో మీరు గెలిచారు. కానీ మా అందరి మనసుల్లో మాత్రం మీరు ఎప్పుడో ఓడిపోయారు!", 1.30,
     "to the camera, the innocent-looking mastermind: calm agreement, a beat, then a sweet, unhurried knife; stress on ఓడిపోయారు",
     "[deadpan] అవును సార్… గేమ్‌లో మీరు గెలిచారు. [dramatic pause] కానీ మా అందరి మనసుల్లో మాత్రం… [mischievously] మీరు ఎప్పుడో ఓడిపోయారు!"),  # 15 L16 PUNCH (owner, verbatim) + FREEZE
    ("gopi", "Comment చేయండి… మీ office manager ని tag చేయండి!", 1.30,
     "laughing with the viewer, then cheeky and conspiratorial (clear, not a whisper); say Comment and tag clearly",
     "[laughs] Comment చేయండి… [mischievously] మీ office manager ని… tag చేయండి!"),                                       # 16 L17 comment + tag
]
CHORUS = {"ramesh": "B", "priya": "B", "suresh": "C", "umbriel": "D", "callirrhoe": "D"}   # chorus takes -> chorus/<who>[_2].wav
GROUPS = {"A": [0, 1, 2, 4, 5, 11, 12, 13], "B": [3, 6, 7, 10, 15, "ramesh", "priya"], "C": [9, 16, "suresh"],
          "D": ["umbriel", "callirrhoe", "umbriel_2", "callirrhoe_2"]}

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
GEMINI = {"gopi": "Puck", "ramesh": "Sadachbia", "manager": "Algieba", "priya": "Pulcherrima", "suresh": "Achird", "umbriel": "Umbriel", "callirrhoe": "Callirrhoe"}
scenevoice.NAMES.update({"ramesh": "Ramesh", "manager": "Manager", "priya": "Priya", "suresh": "Suresh", "umbriel": "Ravi", "callirrhoe": "Divya"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "ramesh": "Ramesh, a cool, innocent-looking Telugu office employee in his late 20s, the sarcastic mastermind, with a lively, youthful male voice",
    "manager": "the Manager, a smug, strict, overconfident Telugu office manager of about 45 who loves assigning work, with a smooth, mature male voice",
    "priya": "Priya, a sharp, confident Telugu IT employee in her late 20s, dry and witty, a born quiz host",
    "suresh": "Suresh, an eager, over-polite Telugu office yes-man of about 30, always nodding, high and grateful",
    "umbriel": "Ravi, a cheerful Telugu office colleague in his 30s", "callirrhoe": "Divya, a cheerful Telugu office colleague in her late 20s"})
CHORUS_ACT = "joining the whole team in one loud, fake-cheerful, sing-song shout, perfectly innocent, short"

def item(x):
    if isinstance(x, int): who, text, gap, act, say = LINES[x]; return {"who": who, "text": text, "act": act, "say": say}
    return {"who": x.split("_")[0], "text": CHORUS_TEXT, "act": CHORUS_ACT, "say": CHORUS_TEXT}

def voice_all(only):
    os.makedirs("vo", exist_ok=True); os.makedirs("chorus", exist_ok=True)
    for g, idx in GROUPS.items():
        dst = lambda x: f"vo/L{x}_raw.wav" if isinstance(x, int) else f"chorus/{x}.wav"
        if not any(x in only or not os.path.exists(dst(x)) for x in idx): continue
        batch = [item(x) for x in idx]
        print("request", g, [x for x in idx], flush=True)
        got = scenevoice.voice_batch(batch, f"vo_batch_{g}", {scenevoice.NAMES[w]: GEMINI[w] for w in GEMINI})
        for k, path in got.items():
            os.replace(path, dst(idx[k]))
            if isinstance(idx[k], int): open(f"vo/L{idx[k]}_model.txt", "w").write(f"gemini-batch-{g}:" + ",".join(scenevoice.MODELS))
        miss = [idx[k] for k in range(len(idx)) if k not in got]
        if miss: print("  NOT SPLIT:", miss, "(raw batch audio kept in", f"vo_batch_{g})", flush=True)

def build():
    t, out = 0.0, []
    for i, (who, text, gap, act, say) in enumerate(LINES):
        if i in SILENT: continue
        raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
        af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        af += f",atempo={SPEED * FIT.get(i, 1.0):.4f}" if who != TEAM else ""      # the chorus is built at final speed
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
        with wave.open(dst) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
        dur = len(a) / 44100; hop = 44100 // FPS
        env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
        mx = max(env) or 1; env = [round(min(1, x / mx * 1.4), 3) for x in env]
        t += gap
        # fine voiced segments (10 ms frames over 4% of the peak, gaps >= 50 ms): word anchors for the picture + the SFX
        h = 441; fr = len(a) // h; r = np.sqrt(np.mean(a[:fr * h].reshape(fr, h) ** 2, axis=1)); loud = r > 0.04 * r.max(); fs, on, low = [], None, 0
        for f in range(fr):
            if loud[f]:
                if on is None: on = f
                low = 0
            elif on is not None:
                low += 1
                if low >= 5: fs.append([round(on / 100, 2), round((f - low + 1) / 100, 2)]); on = None
        if on is not None: fs.append([round(on / 100, 2), round(fr / 100, 2)])
        out.append({"i": i, "who": who, "engine": "gemini", "text": text, "spoken": TAGS.sub("", say).strip(), "start": round(t, 3), "dur": round(dur, 3), "env": env, "fseg": fs})
        t += dur
    json.dump({"fps": FPS, "silence": SILENCE, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
    for l in out: print(l["i"], l["who"], l["start"], l["dur"], l["fseg"])
    print("total", round(t + TAIL, 2))

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--build" not in args: voice_all([int(a) if a.isdigit() else a for a in args])
    if "--nobuild" not in args: build()
