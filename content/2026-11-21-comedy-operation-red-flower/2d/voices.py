"""Office comedy Ep 1 '🎄 Operation Red Flower' (the owner's own story; series "Office Politics"; 2D animated, FLAT):
voices for the manager (Algieba), Ramesh (Sadachbia), Priya (Pulcherrima), Suresh (Achird), Gopi (Puck), all Gemini.
ElevenLabs is skipped on purpose (its key cap of ~51 credits fits nothing, and its bank clashes with this cast: brief).

Credits are low, so the 17 spoken lines + the 3 cast chorus takes go in THREE Gemini batch requests, grouped by speaker
pair (not by story order; scenevoice allows <= 2 voices and <= 8 lines per request):
  A  manager + Ramesh : L1 L2 L4 L5 L6 L9 L11 L14            (0-based 0 1 3 4 5 8 10 13)
  B  Priya + Ramesh   : L3 L8 L12 L13 L15 + chorus (Ramesh, Priya)
  C  Gopi + Suresh    : L7 L10 L17 L18 + chorus (Suresh)
The team chorus (L16 'Merry Christmas Sir!') = these 3 cast takes + 3 extras (Umbriel, Callirrhoe, Zubenelgenubi) that
come from faaah.py's requests (same requests as the FAAAH takes, no extra calls) -> chorus.py layers them into
vo/L15_raw.wav. Every take is checked with stt_check.py (the Gemini listener).
Speed: Gemini x1.15 (owner, 12 Nov 2026).
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json."""
import json, os, re, subprocess, sys, wave
import numpy as np

FPS = 30
INTRO = 0.60       # silent villain entry under the text hook (brief: 0-0.8 s; 0.6 to fit the 60 s cap)
SILENCE = 0.30     # all sound out before the punch (never cut)
TAIL = 1.20        # end card (trim step 3: the end sting overlaps L18): 'Series: Office Politics · Ep 1' + sting
SPEED = 1.15
FIT = {0: 1.12, 1: 1.08, 2: 1.08, 4: 1.15, 5: 1.05, 7: 1.04, 9: 1.06, 10: 1.04, 11: 1.08, 12: 1.06, 13: 1.10, 14: 1.03, 16: 1.06, 17: 1.10}
# ^ extra atempo per line on top of x1.15 (19 Nov): the takes ran 55 s of voice (brief estimate ~41 s), 74 s in all. After the
#   brief's trims (L7 silent, chair action short, end sting over L18), tighter pauses and minimum SFX gaps it was still ~66 s,
#   so the slowest lines (chars/s) are sped up most; the owner's punch (L15 = index 14) only x1.03, సురేష్! not at all.
SILENT = {6}       # trim step 1 (brief): L7 'Follow కొట్టండి…' becomes a SILENT follow tap (over the laugh after L6); not voiced in the reel
TEAM = "team"
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with [tags])  -- from script.json
    ("manager", "Attention everyone! ఈరోజు Christmas games! కానీ… pending work finish చేశాకే ఇంటికి!", INTRO,
     "a smug, overconfident boss making a villain-style entrance: a big bark, a fake-generous announcement, then a slow, smug sting in the tail; a clear pause before కానీ; stress on కానీ",
     "[shouting] Attention everyone! [smugly] ఈరోజు… Christmas games! [sarcastically] కానీ… pending work finish చేశాకే ఇంటికి!"),      # 0 L1 hook
    ("ramesh", "వావ్ సార్… games తో పాటు overtime కూడా free ఆ?", 0.45,
     "innocent face, sweet fake gratitude that turns bone-dry; stress on overtime",
     "[sarcastically] వావ్ సార్… [deadpan] games తో పాటు… overtime కూడా free ఆ?"),                                                     # 1 L2
    ("priya", "Games నేను నడిపిస్తా… target మాత్రం ఒక్కరే.", 0.45,
     "a sharp, confident colleague in a secret huddle: a low, crisp whisper, a sly smile on ఒక్కరే",
     "[whispers] Games నేను నడిపిస్తా… [mischievously] target మాత్రం… ఒక్కరే."),                                                    # 2 L3 pantry
    ("ramesh", "Manager! Code name… Operation Red Flower!", 0.20,
     "the innocent-looking mastermind: a hushed reveal, a beat, then the name slow and grand like a heist-movie title; stress on Red",
     "[whispers] Manager! [dramatic pause] Code name… [mischievously] Operation Red Flower!"),                                           # 3 L4
    ("manager", "Musical chairs ఆ? Chair నా weakness కాదు… నా strength!", 0.55,
     "over-confident, slow like a hero's punch dialogue, cracking his knuckles; stress on strength",
     "[chuckles] Musical chairs ఆ? [smugly] Chair నా weakness కాదు… నా strength!"),                                                    # 4 L5 (+ chairs, FAAAH #1)
    ("ramesh", "Relax సార్… office లో important chair ఎప్పుడూ మీదేగా!", 2.25,
     "offering a hand with a too-sweet smile, the jab hidden in the politeness; stress on ఎప్పుడూ",
     "[mischievously] Relax సార్… [deadpan] office లో important chair… ఎప్పుడూ మీదేగా!"),                                              # 5 L6
    ("gopi", "Follow కొట్టండి… next game ఇంకా డేంజర్!", 0.00,
     "quick and playful, a wink to the viewer, then a gleeful tease",
     "[excited] Follow కొట్టండి… [mischievously] next game… ఇంకా డేంజర్!"),                                                          # 6 L7 follow
    ("priya", "Truth or Dare! సార్… మీ favourite employee ఎవరు?", 0.85,
     "a bright quiz-show host, fast, then a clear one-second pause, then a slow, sly trap question; stress on favourite",
     "[excited] Truth or Dare! [dramatic pause] సార్… [mischievously] మీ favourite employee ఎవరు?"),                                 # 7 L8
    ("manager", "సురేష్!", 0.25,
     "no hesitation at all, an instant, proud answer, pointing straight at him",
     "[proudly] సురేష్!"),                                                                                                             # 8 L9
    ("suresh", "Yes sir! Thank you sir!", 0.20,
     "an eager office yes-man, nodding fast, high and grateful, almost bowing",
     "[excited] Yes sir! [nervous laugh] Thank you sir!"),                                                                             # 9 L10
    ("ramesh", "మేమంతా appraisal queue లో… Suresh కి మాత్రం VIP pass ఆ సార్?", 0.20,
     "innocent-faced, polite and slow, every word a needle; stress on VIP",
     "[sarcastically] మేమంతా appraisal queue లో… [deadpan] Suresh కి మాత్రం… VIP pass ఆ సార్?"),                                     # 10 L11
    ("priya", "సార్… మీకోసం ఒక special award!", 1.30,
     "fake-sweet and ceremonial, like an award-function anchor, a smirk underneath; stress on special",
     "[warmly] సార్… [mischievously] మీకోసం ఒక… special award!"),                                                                     # 11 L12 (+ garland, FAAAH #2)
    ("ramesh", "సంవత్సరం మొత్తం… మమ్మల్ని పరిగెత్తించినందుకు!", 1.45,
     "a solemn award-function announcer, then bone-dry on the reason; stress on పరిగెత్తించినందుకు",
     "[proudly] సంవత్సరం మొత్తం… [deadpan] మమ్మల్ని… పరిగెత్తించినందుకు!"),                                                          # 12 L13
    ("manager", "ఏంటీ?! రేపటి నుంచి అందరికీ… double workload!", 0.80,
     "the villain unmasked: a furious roar, garland swinging, Santa hat askew; stress on double",
     "[shouting] ఏంటీ?! [angry] రేపటి నుంచి అందరికీ… [furious] double workload!"),                                                    # 13 L14
    ("ramesh", "క్రిస్మస్‌కి శాంటా గిఫ్టులు ఇస్తాడనుకున్నాం... మన మేనేజర్ మాత్రం పనులు గిఫ్ట్‌గా ఇచ్చాడు!", 0.70,
     "turning to the camera with the innocent face of a mastermind: a dry storyteller's set-up, a beat, then the sting; stress on పనులు",
     "[deadpan] క్రిస్మస్‌కి శాంటా గిఫ్టులు ఇస్తాడనుకున్నాం… [dramatic pause] మన మేనేజర్ మాత్రం… [sarcastically] పనులు గిఫ్ట్‌గా ఇచ్చాడు!"),  # 14 L15 PUNCH (owner, verbatim)
    (TEAM, "Merry Christmas Sir!", 0.70,
     "the whole team together, a loud, cheerful, sing-song shout, perfectly innocent",
     "[excited] Merry Christmas Sir!"),                                                                                                 # 15 L16 chorus (chorus.py) + FREEZE
    ("gopi", "మీ manager కి ఏ award ఇస్తారు? Comment చేయండి!", 1.50,
     "laughing along with the viewer, a friendly nudge, in a clear, normal voice; say the English word Comment clearly",
     "[laughs] మీ manager కి ఏ award ఇస్తారు? [excited] Comment చేయండి!"),                                                           # 16 L17 comment
    ("gopi", "మీ office manager ని tag చేయండి… రేపు Episode 2!", 0.20,
     "a cheeky grin, a conspiratorial tone on tag (clear, not a whisper), then a bright teaser; say tag and Episode 2 clearly",
     "[mischievously] మీ office manager ని… tag చేయండి… [excited] రేపు Episode 2!"),                                                  # 17 L18 tag + teaser
]
CHORUS = {"ramesh": "B", "priya": "B", "suresh": "C"}   # cast chorus takes -> chorus/<who>.wav
GROUPS = {"A": [0, 1, 3, 4, 5, 8, 10, 13], "B": [2, 7, 11, 12, 14, "ramesh", "priya"], "C": [6, 9, 16, 17, "suresh"]}

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
GEMINI = {"gopi": "Puck", "ramesh": "Sadachbia", "manager": "Algieba", "priya": "Pulcherrima", "suresh": "Achird"}
scenevoice.NAMES.update({"ramesh": "Ramesh", "manager": "Manager", "priya": "Priya", "suresh": "Suresh"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "ramesh": "Ramesh, a cool, innocent-looking Telugu office employee in his late 20s, the sarcastic mastermind, with a lively, youthful male voice",
    "manager": "the Manager, a smug, strict, overconfident Telugu office manager of about 45 who loves assigning work, with a smooth, mature male voice",
    "priya": "Priya, a sharp, confident Telugu IT employee in her late 20s, dry and witty, a born quiz host",
    "suresh": "Suresh, an eager, over-polite Telugu office yes-man of about 30, always nodding, high and grateful"})
CHORUS_ACT = "joining the whole team in one loud, cheerful, sing-song shout, perfectly innocent"

def item(x):
    if isinstance(x, int): who, text, gap, act, say = LINES[x]; return {"who": who, "text": text, "act": act, "say": say}
    return {"who": x, "text": "Merry Christmas Sir!", "act": CHORUS_ACT, "say": "Merry Christmas Sir!"}

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
