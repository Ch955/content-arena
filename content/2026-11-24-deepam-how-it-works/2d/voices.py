"""Special-day reel 'ఒక్క దీపం కోసం 50 లక్షల మంది' (Arunachalam Maha Deepam logistics, 24 Nov 2026). 2D, FLAT skin, night
-> dusk -> the hilltop flame. Built on the 24 Nov tiffin voices.py.

ALL GEMINI (Manager, 24 Nov: skip ElevenLabs): Gopi=Puck, Pinky=Leda, Ammamma=Sulafat (cast.md). TWO batch requests,
in story order, each <= 2 speakers: A = L0-L7 (Gopi + Pinky), B = L8-L11 (Ammamma + Gopi). Every take is checked with
the Gemini listener (listen.py) and batch bleed is re-cut (recut.py). Numbers are spelled in Telugu words in `say`
(digits stay on screen and in the subtitles) so the voice can't misread them.
Speed: Gemini x1.15, never more. FIT: an extra atempo per line only to slow a take (<= 1.0).
`python voices.py` voices what's missing and builds; `--build` only rebuilds vo/L*.wav + timeline.json."""
import base64, json, os, re, subprocess, sys, wave
import numpy as np, requests

FPS = 30
COUNTDOWN = 0.0
FLAME = 2.7   # the silent hilltop-flame beat before L11 (whoosh + swell, no voice)
TAIL = 2.5    # after the last word: end card, then the wide night hill (= frame 1) for the loop
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
FIT = {}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with [tags])  -- from script.json
    ("gopi", "ఒక్క దీపం కోసం… 50 లక్షల మంది!", 0.2,
     "hushed awe on the first half, then a big amazed punch on 'యాభై లక్షల'; not shouting",
     "[whispers] ఒక్క దీపం కోసం… [excited] యాభై లక్షల మంది!"),                                              # 0 hook
    ("gopi", "ఈ సాయంత్రం Arunachalam కొండ మీద… Maha Deepam.", 0.25,
     "soft, reverent, slow; warmth on 'Maha Deepam'",
     "[softly] ఈ సాయంత్రం… Arunachalam కొండ మీద… [warmly] Maha Deepam."),                                  # 1
    ("gopi", "ఊరు Tiruvannamalai… ఇంత మందిని ఎలా manage చేస్తారు?", 0.2,
     "curious, leaning in, opening a question the viewer wants answered; stress on 'ఎలా'",
     "ఊరు Tiruvannamalai… [mischievously] ఇంత మందిని… ఎలా manage చేస్తారు?"),                              # 2 open loop
    ("gopi", "4,877 buses… 16 special trains!", 0.25,
     "fast, impressed, like reading a scoreboard; hit 'పదహారు' hard",
     "[excited] నాలుగు వేల ఎనిమిది వందల డెబ్బై ఏడు buses… [dramatic pause] పదహారు special trains!"),          # 3 fact 1
    ("gopi", "15,500 కి పైగా police… 1,100 CCTV cameras!", 0.2,
     "firm and proud on the police number, then a sly whisper on the cameras, as if they are watching",
     "పదిహేను వేల ఐదు వందలకు పైగా police… [whispers] పదకొండు వందల CCTV cameras!"),                          # 4 fact 2
    ("gopi", "ఇలాంటి behind-the-scenes కావాలంటే… follow చేయండి!", 0.2,
     "quick, friendly nudge; don't slow the pace",
     "[excited] ఇలాంటి behind-the-scenes కావాలంటే… follow చేయండి!"),                                         # 5 follow
    ("gopi", "కొండ చుట్టూ 14 km… గిరి ప్రదక్షిణ దారి.", 0.25,
     "slower, devotional calm; let 'పద్నాలుగు kilometres' breathe",
     "[softly] కొండ చుట్టూ… పద్నాలుగు kilometres… [warmly] గిరి ప్రదక్షిణ దారి."),                            # 6 fact 3
    ("pinky", "అమ్మమ్మా… కాళ్ళు నొప్పి! ఆకలి!", 0.45,     # cut close to the family on the path
     "a tired 6-year-old tugging her grandmother's hand, whiny and cute; two short complaints",
     "[whiny] అమ్మమ్మా… కాళ్ళు నొప్పి! [pouting] ఆకలి!"),                                                    # 7 interrupt
    ("ammamma", "భయం లేదు… 120 medical camps, 288 చోట్ల free భోజనం.", 0.2,
     "a calm ~70-year-old grandmother, amused and reassuring, slow and kind",
     "[chuckles] భయం లేదు… [warmly] నూట ఇరవై medical camps… రెండు వందల ఎనభై ఎనిమిది చోట్ల free భోజనం."),    # 8 facts 4-5
    ("gopi", "మీరు గిరి ప్రదక్షిణ చేశారా? Comment లో చెప్పండి!", 0.35,
     "a genuine, warm question to the viewer, then a bright nudge",
     "[warmly] మీరు గిరి ప్రదక్షిణ చేశారా? [excited] Comment లో చెప్పండి!"),                                   # 9 comment
    ("gopi", "సాయంత్రం… 50 లక్షల మంది… ఒక్క దీపం వైపు.", 0.4,
     "hushed, awe-struck, very slow; the quietest line of the reel",
     "[whispers] సాయంత్రం… [dramatic pause] యాభై లక్షల మంది… ఒక్క దీపం వైపు."),                                # 10 climax
    ("gopi", "Arunachalam వెళ్ళే మీ వాళ్ళకి పంపండి… follow చేయండి!", FLAME,   # the silent flame beat plays in this gap
     "warm send-off, then a friendly close; keep it short",
     "[warmly] Arunachalam వెళ్ళే మీ వాళ్ళకి… పంపండి! [excited] follow చేయండి!"),                              # 11 share + close
]

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import elevenvoice, scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
PROFILE = {"gopi": None,   # host
           "pinky": None,   # cameo kid: Gemini Leda (ElevenLabs: Jessica pitched up),
           "ammamma": None}   # cast.md: ElevenLabs 'ammamma' (Matilda) if ever used; Gemini Sulafat here
GEMINI = {"gopi": "Puck", "pinky": "Leda", "ammamma": "Sulafat"}
SARVAM = {"gopi": "shubh", "pinky": "kavya", "ammamma": "roopa"}
BATCHES = [[0, 1, 2, 3, 4, 5, 6, 7], [8, 9, 10, 11]]
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend, full of quiet awe on this festival day",
    "pinky": "Pinky, a sweet, tired 6-year-old Telugu girl walking a long path with her grandmother",
    "ammamma": "Ammamma, a calm, loving 70-year-old Telugu grandmother with a gentle, slightly aged voice, speaking standard Andhra Telugu"})

def sarvam(i, who):
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": TAGS.sub("", LINES[i][4]).strip(), "target_language_code": "te-IN", "model": "bulbul:v3",
                            "speaker": SARVAM[who], "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status(); open(f"vo/L{i}_raw.wav", "wb").write(base64.b64decode(r.json()["audios"][0]))
    open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")

def voice_all(only):
    os.makedirs("vo", exist_ok=True)
    redo = set(only)
    scenevoice.CHUNK = 12
    for grp in BATCHES:
        gem = [i for i in grp if i in redo or not os.path.exists(f"vo/L{i}_raw.wav")]
        if not gem: continue
        batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": LINES[i][4]} for i in gem]
        print("batch", gem, flush=True)
        got = scenevoice.voice_batch(batch, "vo_batch", {scenevoice.NAMES[w]: GEMINI[w] for w in GEMINI})
        for k, path in got.items():
            os.replace(path, f"vo/L{gem[k]}_raw.wav"); open(f"vo/L{gem[k]}_model.txt", "w").write("gemini-batch:" + ",".join(scenevoice.MODELS))
        for k, i in enumerate(gem):
            if k in got: continue
            who = LINES[i][0]
            try:
                got1 = scenevoice.voice_batch([batch[k]], "vo_one", {scenevoice.NAMES[who]: GEMINI[who]})
                if 0 not in got1: raise RuntimeError("no take")
                os.replace(got1[0], f"vo/L{i}_raw.wav"); open(f"vo/L{i}_model.txt", "w").write("gemini-single:" + ",".join(scenevoice.MODELS))
            except Exception as e:
                print(f"  line {i}: Gemini failed ({e}) -> Sarvam for {who}", flush=True); sarvam(i, who)

def build():
    t, out = 0.0, []
    for i, (who, text, gap, act, say) in enumerate(LINES):
        raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
        m = open(f"vo/L{i}_model.txt").read()
        e = "eleven" if m.startswith("eleven") else "sarvam" if m.startswith("sarvam") else "gemini"
        af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        af += f",atempo={SPEED[e] * min(1.0, FIT.get(i, 1.0)):.4f}"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
        with wave.open(dst) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
        dur = len(a) / 44100; hop = 44100 // FPS
        env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
        mx = max(env) or 1; env = [round(min(1, x / mx * 1.4), 3) for x in env]
        t += gap
        out.append({"i": i, "who": who, "engine": e, "text": text, "spoken": TAGS.sub("", say).strip(), "start": round(t, 3), "dur": round(dur, 3), "env": env})
        t += dur
    json.dump({"fps": FPS, "countdown": COUNTDOWN, "flame": FLAME, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
    for l in out: print(l["i"], l["who"], l["engine"], l["start"], l["dur"])
    print("total", round(t + TAIL, 2))

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--build" not in args: voice_all([int(a) for a in args if a.isdigit()])
    build()
