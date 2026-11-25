"""Office comedy Ep 3 'ఆఫీస్‌లో ఫేవరెట్ ఎవరు?' (the owner's own script; series "Office Politics"; 2D animated, FLAT):
voices for the manager (Algieba), Ramesh (Sadachbia), Suresh (Achird), Gopi (Puck), all Gemini (as Ep 1-2; ElevenLabs skipped).

Lean: the 12 lines go in TWO Gemini batch requests, grouped by speaker pair (scenevoice allows <= 2 voices, <= 8 lines):
  A  manager + Ramesh : L1 L3 L4 L5 L6 L7 L9 L11   (0-based 0 2 3 4 5 6 8 10)
  B  Suresh + Gopi    : L2 L8 L10 L12              (0-based 1 7 9 11)
Every take is checked with listen.py (a Gemini listener, all clips in one request); batch bleed is re-cut by recut.py.
Speed: plain Gemini x1.15 on EVERY line (owner, 12 Nov 2026); no extra per-line speed-up (coordinator, 27 Nov).
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json."""
import json, os, re, subprocess, sys, wave
import numpy as np

FPS = 30
INTRO = 1.00       # intro under the text hook: harp + pink glow + hearts, the manager's arm round Suresh (action from frame 1)
POST = 5.60        # after the punch: freeze (+0.1) -> 0.3 s silence (+0.5..+0.8) -> 1.6 s reaction (+0.8..+2.4) -> ending card ~3.2 s (+2.4..+5.6)
TAIL = 2.60        # the tag lands (~0.8 s) + end card 'Series: Office Politics · Ep 3' with its follow tap
SPEED = 1.15
FIT = {}           # never: every line plays at plain x1.15
SILENT = set()
SILENCE = 0.30     # all sound out after the freeze (never cut)
LINES = [  # (who, subtitle text = the owner's words verbatim, gap before, acting direction, spoken text with [tags]) -- from script.json
    ("manager", "సురేష్! నువ్వు ఈ టీమ్‌కి చాలా ఇంపార్టెంట్ రా. నీ మీద నాకు చాలా నమ్మకం ఉంది.", INTRO,
     "syrupy, fatherly praise for his favourite, an arm round his shoulder; sweet and warm but not dragging; stress on నమ్మకం",
     "[warmly] సురేష్! నువ్వు ఈ టీమ్‌కి… చాలా ఇంపార్టెంట్ రా. [proudly] నీ మీద నాకు… చాలా నమ్మకం ఉంది."),           # 0 L1 hook
    ("suresh", "థాంక్యూ సార్!", 0.85,
     "the eager yes-man, gushing, a deep grateful nod; quick",
     "[excited] థాంక్యూ సార్!"),                                                                                      # 1 L2
    ("ramesh", "సార్, నా ప్రమోషన్ గురించి మాట్లాడాలి.", 1.00,
     "walks in clutching a thick appraisal file, hopeful but firm; stress on ప్రమోషన్",
     "[hopefully] సార్… నా ప్రమోషన్ గురించి… మాట్లాడాలి."),                                                            # 2 L3 (DHOOM on ప్రమోషన్)
    ("manager", "ఇప్పుడు టైమ్ లేదు రమేష్. తర్వాత చూద్దాం.", 0.60,
     "without looking up, waving him off like a fly, bored; stress on తర్వాత",
     "[dismissively] ఇప్పుడు టైమ్ లేదు రమేష్. [sighs] తర్వాత చూద్దాం."),                                              # 3 L4
    ("ramesh", "సార్, గత సంవత్సరం కూడా తర్వాత అన్నారు.", 0.65,
     "dry and wounded, flat, a sarcastic edge at the end; stress on కూడా",
     "[deadpan] సార్… గత సంవత్సరం కూడా… [sarcastically] తర్వాత అన్నారు."),                                            # 4 L5 (calendar + STAMP)
    ("manager", "నీకు ఓపిక ఉండాలి రమేష్!", 1.45,
     "a guru's sermon: finger raised, self-satisfied, smug; stress on ఓపిక",
     "[smugly] నీకు… ఓపిక ఉండాలి రమేష్!"),                                                                            # 5 L6 (door shuts, follow tap)
    ("ramesh", "ఏంట్రా సురేష్! నీకు ప్రమోషన్ వచ్చిందా?", 2.20,
     "pulls his colleague aside at the water cooler: curious, then a jealous low voice (clear, not a whisper); stress on ప్రమోషన్",
     "[curious] ఏంట్రా సురేష్! [whispers] నీకు ప్రమోషన్ వచ్చిందా?"),                                                    # 6 L7
    ("suresh", "లేదురా... నాకు ఇంకో పని ఇచ్చాడు.", 0.45,
     "a tired sigh that flips into odd pride; stress on పని",
     "[sighs] లేదురా… [proudly] నాకు ఇంకో పని ఇచ్చాడు."),                                                              # 7 L8 (drumroll)
    ("ramesh", "అదేంట్రా?", 0.40,
     "leaning in, eyebrows up, one quick curious word",
     "[curious] అదేంట్రా?"),                                                                                          # 8 L9 (DUN)
    ("suresh", "మేనేజర్ కొడుకు పెళ్లికి వెడ్డింగ్ ప్లానింగ్!", 0.80,
     "beaming as if it were a promotion, proudly unrolling a long checklist; stress on వెడ్డింగ్",
     "[proudly] మేనేజర్ కొడుకు పెళ్లికి… [excited] వెడ్డింగ్ ప్లానింగ్!"),                                              # 9 L10 TWIST (FAAAH)
    ("ramesh", "ఒరేయ్! నువ్వు ఎంప్లాయ్‌వా? లేక ఫ్యామిలీ మెంబర్‌వా రా?", 2.40,
     "stunned, then a cutting, sarcastic question; stress on ఫ్యామిలీ",
     "[shocked] ఒరేయ్! [dramatic pause] నువ్వు ఎంప్లాయ్‌వా? [sarcastically] లేక… ఫ్యామిలీ మెంబర్‌వా రా?"),             # 10 L11 PUNCH -> FREEZE
    ("gopi", "మీ office సురేష్ ని… comment లో tag చేయండి!", POST,
     "laughing with the viewer, then a cheeky conspiratorial nudge (clear, not a whisper); say office, comment and tag clearly",
     "[laughs] మీ office సురేష్ ని… [mischievously] comment లో tag చేయండి!"),                                            # 11 L12 tag
]
GROUPS = {"A": [0, 2, 3, 4, 5, 6, 8, 10], "B": [1, 7, 9, 11]}

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
GEMINI = {"gopi": "Puck", "ramesh": "Sadachbia", "manager": "Algieba", "suresh": "Achird"}
scenevoice.NAMES.update({"ramesh": "Ramesh", "manager": "Manager", "suresh": "Suresh"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "ramesh": "Ramesh, a cool, innocent-looking Telugu office employee in his late 20s, the sarcastic mastermind, with a lively, youthful male voice",
    "manager": "the Manager, a smug, strict, overconfident Telugu office manager of about 45 who loves assigning work, with a smooth, mature male voice",
    "suresh": "Suresh, an eager, over-polite Telugu office yes-man of about 30, the boss's favourite, always nodding, high and grateful"})

def item(x):
    who, text, gap, act, say = LINES[x]; return {"who": who, "text": text, "act": act, "say": say}

def voice_all(only):
    os.makedirs("vo", exist_ok=True)
    for g, idx in GROUPS.items():
        dst = lambda x: f"vo/L{x}_raw.wav"
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
        af += f",atempo={SPEED:.4f}"                                            # plain x1.15, every line
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
