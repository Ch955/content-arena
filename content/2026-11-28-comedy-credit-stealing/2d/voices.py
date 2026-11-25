"""Office comedy Ep 4 'మీటింగ్‌లో మేనేజర్ మాయ!' (the owner's own script; series "Office Politics"; 2D animated, FLAT):
voices for the manager (Algieba), Ramesh (Sadachbia), the boss (Orus, voice only, phone-filtered in mix.py) and Gopi (Puck),
all Gemini (built on Ep 2's voices.py, 23 Nov). Suresh (Achird) is silent in this episode.

Lean: the 12 spoken lines + Ramesh's non-verbal laugh-cry (the owner's 😭😂, NOT a line) go in THREE Gemini batch requests
(scenevoice allows <= 2 voices and <= 8 lines per request):
  A  manager + Ramesh : L1 L2 L3 L4 L5 L6 L8 L9      (0-based 0 1 2 3 4 5 7 8)
  B  Ramesh + manager : L10 L11 (the punch) + the laugh-cry (last in the batch, so the cut after the punch is clean)
  C  boss + Gopi      : L7 L12
Every take is checked with listen.py (the Gemini listener, several clips per request); batch bleeds are re-cut with recut.py.
Speed: plain Gemini x1.15 for every line (owner, 12 Nov 2026), no extra per-line speed-up.
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json."""
import json, os, re, subprocess, sys, wave
import numpy as np

FPS = 30
INTRO = 0.60       # silent villain walk under the text hook (brief: 0-0.6 s)
SILENCE = 0.30     # all sound out after the freeze (never cut)
# the punch block after L11 (owner): record scratch + FREEZE at +0.1 (0.4 s) -> 0.3 s silence -> ~1.5 s reaction (laugh-cry,
# sad trombone, tuba sting, laugh) -> the ending card (3 stamps) held ~3.3 s -> Gopi
FRZ_OFF, FRZ_D, REACT, CARD = 0.10, 0.40, 1.50, 3.30
PUNCH_BLOCK = FRZ_OFF + FRZ_D + SILENCE + REACT + CARD
TAIL = 1.30        # end card 'Series: Office Politics · Ep 4' (the end sting overlaps the end of L12)
SPEED = 1.15
FIT = {}           # never above the plain x1.15 (coordinator's rule)
SILENT = set()
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with [tags])  -- from script.json (owner's words verbatim)
    ("manager", "గైస్! ఈ ప్రాజెక్ట్ సక్సెస్ అవ్వడానికి మన టీమ్ అందరి కృషి ఉంది.", INTRO,
     "a politician's speech at the meeting table, arms wide, fake-humble and booming, brisk; stress on అందరి",
     "[proudly] గైస్! ఈ ప్రాజెక్ట్ సక్సెస్ అవ్వడానికి… [warmly] మన టీమ్ అందరి కృషి ఉంది."),                     # 0 L1 hook (+ DHOOM, claps)
    ("ramesh", "సార్, ముఖ్యంగా ఆ కోడ్ మొత్తం నేనే రాశాను సార్.", 0.70,
     "a polite raised hand, quietly proud, natural pace; stress on నేనే",
     "[politely] సార్, ముఖ్యంగా… ఆ కోడ్ మొత్తం [proudly] నేనే రాశాను సార్."),                                    # 1 L2 claim 1 (2 AM chip)
    ("manager", "అవును రమేష్... టీమ్‌వర్క్ అంటే అదే!", 0.25,
     "smug, patting Ramesh's head like a kid's, a little chuckle; stress on టీమ్‌వర్క్",
     "[smugly] అవును రమేష్… [chuckles] టీమ్‌వర్క్ అంటే అదే!"),                                                   # 2 L3 (SHLOOP into TEAM)
    ("ramesh", "సార్, క్లయింట్ కాల్స్ కూడా నేనే అటెండ్ అయ్యాను.", 0.75,
     "pushing harder, a little louder and frustrated; stress on నేనే",
     "[deadpan] సార్, క్లయింట్ కాల్స్ కూడా… [frustrated] నేనే అటెండ్ అయ్యాను."),                                  # 3 L4 claim 2 (phones chip)
    ("manager", "చాలా మంచి విషయం. కానీ ప్రాజెక్ట్ విజన్ నాది!", 0.25,
     "calm and smooth, a short pause, then a grand claim, tapping his temple; stress on నాది",
     "[calmly] చాలా మంచి విషయం. [dramatic pause] కానీ… [proudly] ప్రాజెక్ట్ విజన్ నాది!"),                        # 4 L5 (VISION bulb, ooooh)
    ("manager", "సార్! Finally, I delivered the project successfully!", 1.90,
     "on the phone to his boss, voice suddenly sugary, loud and excited, chest out; stress on I",
     "[excited] సార్! [proudly] Finally… I delivered the project successfully!"),                             # 5 L6 (cabin; FAAAH after)
    ("boss", "Excellent! Well done!", 1.60,
     "a big boss on speakerphone: booming, brief, pleased",
     "[impressed] Excellent! [warmly] Well done!"),                                                         # 6 L7 (phone EQ; KA-CHING)
    ("ramesh", "సార్, ఒక్క చిన్న డౌట్.", 0.65,
     "too-sweet and innocent, hand up like a schoolboy; stress on చిన్న",
     "[innocently] సార్… ఒక్క చిన్న డౌట్."),                                                                   # 7 L8
    ("manager", "ఏంటి రమేష్?", 0.40,
     "pressing the phone to his chest, irritated, quick",
     "[annoyed] ఏంటి రమేష్?"),                                                                                # 8 L9
    ("ramesh", "ప్రాజెక్ట్ నేను చేశాను... క్రెడిట్ మీరు తీసుకున్నారు... మరి ఇన్క్రిమెంట్ ఎవరికొస్తుంది సార్?", 0.30,
     "calm and deadpan, counting on his fingers, one point at a time, then a pointed question; stress on ఇన్క్రిమెంట్",
     "[deadpan] ప్రాజెక్ట్ నేను చేశాను… క్రెడిట్ మీరు తీసుకున్నారు… [dramatic pause] మరి ఇన్క్రిమెంట్… ఎవరికొస్తుంది సార్?"),  # 9 L10 (finger count)
    ("manager", "కంపెనీకి వస్తుంది రమేష్!", 0.45,
     "totally straight-faced and proud, as if it's great news; stress on కంపెనీకి",
     "[proudly] కంపెనీకి… వస్తుంది రమేష్!"),                                                                  # 10 L11 PUNCH (owner) + FREEZE
    ("gopi", "మీ credit ఎవరు కొట్టేశారు? Comment లో చెప్పండి!", PUNCH_BLOCK,
     "laughing with the viewer, then cheeky and conspiratorial (clear, not a whisper); say credit and Comment clearly",
     "[laughs] మీ credit ఎవరు కొట్టేశారు? [whispers] Comment లో చెప్పండి!"),                                   # 11 L12 comment CTA
]
REACT_KEY = "ramesh_react"   # the owner's 😭😂 after the punch: a non-verbal take, not a line (no subtitle)
REACT_ACT = ("NON-VERBAL, NO WORDS: a wailing, comic sob that collapses into helpless laughter, about one second; "
             "do not say any word, only the sounds")
REACT_SAY = "ఊఊఊఊ… హ్హహ్హహ్హ… హహహ!"
GROUPS = {"A": [0, 1, 2, 3, 4, 5, 7, 8], "B": [9, 10, REACT_KEY], "C": [6, 11]}

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
GEMINI = {"gopi": "Puck", "ramesh": "Sadachbia", "manager": "Algieba", "suresh": "Achird", "boss": "Orus"}
scenevoice.NAMES.update({"ramesh": "Ramesh", "manager": "Manager", "suresh": "Suresh", "boss": "Boss"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "ramesh": "Ramesh, a cool, innocent-looking Telugu office employee in his late 20s, the sarcastic hero, with a lively, youthful male voice",
    "manager": "the Manager, a smug, smooth Telugu office manager of about 45 who takes all the credit, with a smooth, mature male voice",
    "suresh": "Suresh, an eager, over-polite Telugu office yes-man of about 30",
    "boss": "the Boss, a big senior executive of about 55 on a speakerphone, booming, brisk and pleased, Indian English"})

def item(x):
    if isinstance(x, int): who, text, gap, act, say = LINES[x]; return {"who": who, "text": text, "act": act, "say": say}
    return {"who": "ramesh", "text": REACT_SAY, "act": REACT_ACT, "say": REACT_SAY}

def voice_all(only):
    os.makedirs("vo", exist_ok=True)
    for g, idx in GROUPS.items():
        dst = lambda x: f"vo/L{x}_raw.wav" if isinstance(x, int) else f"vo/{x}_raw.wav"
        if not any(x in only or not os.path.exists(dst(x)) for x in idx): continue
        batch = [item(x) for x in idx]
        print("request", g, [x for x in idx], flush=True)
        got = scenevoice.voice_batch(batch, f"vo_batch_{g}", {scenevoice.NAMES[w]: GEMINI[w] for w in GEMINI})
        for k, path in got.items():
            os.replace(path, dst(idx[k]))
            open(dst(idx[k]).replace("_raw.wav", "_model.txt"), "w").write(f"gemini-batch-{g}:" + ",".join(scenevoice.MODELS))
        miss = [idx[k] for k in range(len(idx)) if k not in got]
        if miss: print("  NOT SPLIT:", miss, "(raw batch audio kept in", f"vo_batch_{g})", flush=True)

def prep(raw, dst, tempo):
    af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    af += f",atempo={tempo:.4f}"
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
    with wave.open(dst) as w:
        return np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768

def build():
    t, out = 0.0, []
    for i, (who, text, gap, act, say) in enumerate(LINES):
        if i in SILENT: continue
        a = prep(f"vo/L{i}_raw.wav", f"vo/L{i}.wav", SPEED * FIT.get(i, 1.0))
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
    # the laugh-cry reaction (placed by the page's beats: B.react)
    ra = prep(f"vo/{REACT_KEY}_raw.wav", "vo/react.wav", SPEED); rhop = 44100 // FPS
    renv = [float(np.sqrt(np.mean(ra[k:k + rhop] ** 2))) for k in range(0, len(ra), rhop)]; rm = max(renv) or 1
    react = {"dur": round(len(ra) / 44100, 3), "env": [round(min(1, x / rm * 1.4), 3) for x in renv]}
    json.dump({"fps": FPS, "silence": SILENCE, "punch": {"frz_off": FRZ_OFF, "frz_d": FRZ_D, "react": REACT, "card": CARD},
               "react": react, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
    for l in out: print(l["i"], l["who"], l["start"], l["dur"], l["fseg"])
    print("react", react["dur"], "| total", round(t + TAIL, 2))

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--build" not in args: voice_all([int(a) if a.isdigit() else a for a in args])
    if "--nobuild" not in args: build()
