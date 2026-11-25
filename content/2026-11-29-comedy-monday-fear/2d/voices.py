"""Office Politics Ep 5 'సోమవారం భయం!' (the owner's own script; 2D animated, FLAT): voices for the manager (Algieba),
Ramesh (Sadachbia) and Gopi (Puck), all Gemini (ElevenLabs skipped, as Ep 1-2).

Lean: the 11 lines go in TWO Gemini batch requests (scenevoice allows <= 2 voices and <= 8 lines per request):
  A  manager + Ramesh : L1-L8   (0-based 0..7)
  B  Ramesh + Gopi    : L9 L10 L11 (0-based 8 9 10)
No chorus this episode (the laugh track reuses Ep 2's in-house crowd takes, crowd/). FAAAH = tools/anim2d/sfx/faaah.wav as is.
Every take is checked with listen.py (the Gemini listener, several clips per request); batch bleeds are re-cut (recut.py).
Speed: plain Gemini x1.15 on EVERY line (coordinator: never beyond it; no FIT this episode).
L1 speaks the '9' as 'తొమ్మిది' (`say`); the subtitle keeps '9'. The manager's 😳 is a reaction only (not a line).
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json."""
import json, os, re, subprocess, sys, wave
import numpy as np

FPS = 30
INTRO = 3.60       # pre-roll, no voice: 0-1.0 couch bliss + text hook; 1.0 PING + DHOOM; the manager's message types in + holds ~2 s
SILENCE = 0.30     # all sound out after the freeze (never cut)
TAIL = 1.60        # end card 'Series: Office Politics · Ep 5'
SPEED = 1.15
FIT = {}           # never beyond the plain x1.15
SILENT = set()
LINES = [  # (who, subtitle text = owner's words, gap before, acting direction, spoken text with [tags]) -- from script.json
    ("ramesh", "ఆదివారం రాత్రి 9 గంటలకి చిన్న టాస్కా? ఏంట్రా ఇది!", INTRO,
     "bliss shattered: disbelief rising into a wail; stress on చిన్న",
     "[shocked] ఆదివారం రాత్రి తొమ్మిది గంటలకి… చిన్న టాస్కా? [frustrated] ఏంట్రా ఇది!"),                          # 0 L1 hook (+ FAAAH #1)
    ("manager", "గుడ్ మార్నింగ్ రమేష్! టాస్క్ కంప్లీట్ చేశావా?", 3.60,
     "fresh and well-rested, smug, sipping coffee in Ramesh's own chair; brisk; stress on కంప్లీట్",
     "[cheerfully] గుడ్ మార్నింగ్ రమేష్! [smugly] టాస్క్ కంప్లీట్ చేశావా?"),                                       # 1 L2 (after FAAAH + time-lapse + MONDAY card)
    ("ramesh", "చేశాను సార్.", 0.50,
     "a zombie: panda eyes, one flat exhausted breath, short",
     "[exhausted] చేశాను సార్."),                                                                                  # 2 L3
    ("manager", "వెరీ గుడ్! నువ్వు చాలా డెడికేటెడ్ ఎంప్లాయ్‌వి.", 0.50,
     "a gracious king handing out praise instead of money, brisk; stress on డెడికేటెడ్",
     "[proudly] వెరీ గుడ్! [warmly] నువ్వు చాలా… డెడికేటెడ్ ఎంప్లాయ్‌వి."),                                       # 3 L4 (+ DEDICATED sticker)
    ("ramesh", "థాంక్యూ సార్. మరి ఈరోజు కొంచెం త్వరగా వెళ్లొచ్చా?", 0.50,
     "seizing the good mood, hopeful and sweet, quick; stress on త్వరగా",
     "[hopefully] థాంక్యూ సార్. [innocently] మరి ఈరోజు… కొంచెం త్వరగా వెళ్లొచ్చా?"),                             # 4 L5
    ("manager", "ఎందుకు?", 0.60,
     "the mug stops mid-sip; one cold, suspicious word",
     "[suspiciously] ఎందుకు?"),                                                                                   # 5 L6 (needle-stop)
    ("ramesh", "నిన్న ఆదివారం కూడా పని చేశాను కదా సార్!", 0.65,
     "pleading, holding up his phone; stress on ఆదివారం",
     "[pleading] నిన్న ఆదివారం కూడా… పని చేశాను కదా సార్!"),                                                      # 6 L7
    ("manager", "రమేష్... మనం ఫ్యామిలీ లాంటివాళ్లం కదా!", 0.60,
     "fake family-drama emotion, soft and syrupy, an arm round Ramesh; stress on ఫ్యామిలీ",
     "[softly] రమేష్… [warmly] మనం ఫ్యామిలీ లాంటివాళ్లం కదా!"),                                                  # 7 L8 (serial violin)
    ("ramesh", "అయితే సార్... ఫ్యామిలీ ఫంక్షన్‌కి వెళ్లినట్టు జీతం కూడా పెంచండి సార్!", 0.60,
     "turning the manager's own card on him, bright and sweet; stress on జీతం",
     "[mischievously] అయితే సార్… ఫ్యామిలీ ఫంక్షన్‌కి వెళ్లినట్టు… [excited] జీతం కూడా పెంచండి సార్!"),          # 8 L9 (+ needle-stop, DHAN-DHAN, 😳, FAAAH #2)
    ("ramesh", "ఫ్యామిలీ అంటారు... కానీ జీతం దగ్గరికి వచ్చేసరికి కంపెనీ అంటారు!", 2.90,
     "to the camera, calm and knowing, a slow sweet knife; stress on కంపెనీ",
     "[deadpan] ఫ్యామిలీ అంటారు… [dramatic pause] కానీ జీతం దగ్గరికి వచ్చేసరికి… [sarcastically] కంపెనీ అంటారు!"),   # 9 L10 PUNCH (owner) + FREEZE
    ("gopi", "Sunday కూడా పని చేసే friend ని… tag చేయండి!", 5.35,
     "laughing with the viewer, then a cheeky nudge (clear, not a whisper); say Sunday, friend and tag clearly",
     "[laughs] Sunday కూడా పని చేసే friend ని… [mischievously] tag చేయండి!"),                                    # 10 L11 tag (after freeze 0.35 + silence 0.3 + reaction 1.5 + card 3.0)
]
GROUPS = {"A": [0, 1, 2, 3, 4, 5, 6, 7], "B": [8, 9, 10]}

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
GEMINI = {"gopi": "Puck", "ramesh": "Sadachbia", "manager": "Algieba"}
scenevoice.NAMES.update({"ramesh": "Ramesh", "manager": "Manager"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "ramesh": "Ramesh, a cool, innocent-looking Telugu office employee in his late 20s, the sarcastic hero, with a lively, youthful male voice",
    "manager": "the Manager, a smug, strict, overconfident Telugu office manager of about 45 who loves assigning work, with a smooth, mature male voice"})

def item(x):
    who, text, gap, act, say = LINES[x]; return {"who": who, "text": text, "act": act, "say": say}

def voice_all(only):
    os.makedirs("vo", exist_ok=True)
    for g, idx in GROUPS.items():
        if not any(x in only or not os.path.exists(f"vo/L{x}_raw.wav") for x in idx): continue
        print("request", g, idx, flush=True)
        got = scenevoice.voice_batch([item(x) for x in idx], f"vo_batch_{g}", {scenevoice.NAMES[w]: GEMINI[w] for w in GEMINI})
        for k, path in got.items():
            os.replace(path, f"vo/L{idx[k]}_raw.wav")
            open(f"vo/L{idx[k]}_model.txt", "w").write(f"gemini-batch-{g}:" + ",".join(scenevoice.MODELS))
        miss = [idx[k] for k in range(len(idx)) if k not in got]
        if miss: print("  NOT SPLIT:", miss, flush=True)

def build():
    t, out = 0.0, []
    for i, (who, text, gap, act, say) in enumerate(LINES):
        if i in SILENT: continue
        raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
        af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        af += f",atempo={SPEED * FIT.get(i, 1.0):.4f}"
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
    if "--build" not in args: voice_all([int(a) for a in args if a.isdigit()])
    if "--nobuild" not in args: build()
