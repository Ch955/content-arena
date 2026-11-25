"""Moral dilemma 'Amma's chain' (2D animated, PIXEL skin for the whole reel: the pawn counter in Dilsukhnagar, Nikhil's
Dilsukhnagar home (hall + bureau, Keerthi's study corner, dining table), the CHOOSE A / B game screen, a sepia pixel
flashback window). Voices: Nikhil (28, cool -> Andhra), Narasimha (~65 pawnbroker, cool -> Andhra, NEW), Amma (~55,
emotional -> Andhra), Keerthi (22, emotional -> Andhra, NEW), Gopi (host). Built on the 24 Nov tiffin voices.py.

ALL GEMINI (Manager, 25 Nov: skip ElevenLabs, credits are tight): Nikhil=Charon, Narasimha=Schedar, Amma=Kore,
Keerthi=Achernar, Gopi=Puck. Three batch requests (scenevoice: <= 2 speakers per request): A = Nikhil + Narasimha
(L0 1 5 8), B = Amma + Keerthi (L2 6 7 9), C = Gopi (L3 4 10); each batch is cut back into lines at the pauses and every
take is checked with the Gemini listener (listen.py, several clips per request). Sarvam TTS is the last resort.
Speed: Gemini x1.15 (owner, 12 Nov 2026), never more. FIT: an extra atempo per line only to slow a take down (<= 1.0).
`python voices.py` voices what's missing and builds; `MAXP=0.3 KEEP=0.24 python tighten.py 0 1 ... 10` shrinks the long pauses (vo_fix -> vo);
`python voices.py --build` only rebuilds vo/L*.wav + timeline.json
from vo/L*_raw.wav; `python voices.py 3 4` re-takes lines 3 and 4 (one batch per speaker group)."""
import base64, json, os, re, subprocess, sys, wave
import numpy as np, requests

FPS = 30
COUNTDOWN = 5.0
TAIL = 2.65   # after Gopi's last word: end card hold (~1.15 s), then the SILENT loop shot (hard cut to the watch token, 1.5 s)
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
FIT = {}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with [tags])  -- from script.json
    ("nikhil", "చెల్లి పేరు మీద… అమ్మ chain?!", 0.25,
     "a calm young man frozen at a shop counter, a sharp intake of breath, then a stunned low whisper; stress on 'అమ్మ'",
     "[gasps] చెల్లి పేరు మీద… [whispers] అమ్మ chain?!"),                                                      # 0 hook
    ("narasimha", "Keerthi పెట్టింది బాబూ… ₹38,000. వడ్డీ పెరుగుతోంది.", 0.2,
     "an unhurried old pawnbroker of about 65, matter-of-fact and slightly tired, tapping the ledger; stress on 'వడ్డీ'",
     "[slowly] Keerthi పెట్టింది బాబూ… ముప్పై ఎనిమిది వేలు. [sighs] వడ్డీ పెరుగుతోంది."),                       # 1 stakes
    ("amma", "Keerthi పెళ్ళికి ఆ chain… locker లో భద్రం.", 0.75,      # the cut home (evening) plays in this gap
     "a contented mother of about 55 folding laundry, saying it casually and proudly, no idea anything is wrong",
     "[warmly] Keerthi పెళ్ళికి ఆ chain… [softly] locker లో భద్రం."),                                         # 2 irony + clues
    ("gopi", "A: అమ్మకి చెప్పాలా? B: గుట్టుగా విడిపించాలా?", 0.9,     # CHOOSE A / B screen boots in this gap
     "a game-show host presenting two doors, a weighty beat on A, then a sly hush on B; even weight, no hint",
     "[dramatic pause] ఏ… అమ్మకి చెప్పాలా? [whispers] బీ… గుట్టుగా విడిపించాలా?"),   # A/B spelt ఏ/బీ: the 1st take said "Aah"                              # 3 dilemma
    ("gopi", "మీరైతే A or B? Comment చేయండి… follow కొట్టండి!", 0.15,
     "an upbeat quick challenge to the viewer, then a cheeky nudge; fast and bright",
     "[excited] మీరైతే A or B? Comment చేయండి… [mischievously] follow కొట్టండి!"),                            # 4 comment + countdown + follow
    ("nikhil", "Chain విడిపించా. ఎందుకు పెట్టావ్ Keerthi?", 0.1 + COUNTDOWN + 2.3,   # cursor lands on B, SAVE FILE drains, chain out, cut home
     "an older brother holding the chain out, not angry, hurt and gentle; low and measured",
     "[quietly] Chain… విడిపించా. [softly] ఎందుకు పెట్టావ్ Keerthi?"),                                         # 5 reveal
    ("keerthi", "అమ్మ hospital bill అన్నయ్యా… call నాకే వచ్చింది.", 0.35,
     "a 22-year-old student, eyes down, voice catching, holding back tears; stress on 'hospital'",
     "[tearful] అమ్మ hospital bill అన్నయ్యా… [shaky] call నాకే వచ్చింది."),                                  # 6 twist
    ("keerthi", "అమ్మ మనిద్దరికీ చెప్పలేదు… నేనూ చెప్పలేకపోయా.", 0.25,
     "a guilty, small confession, half a sob on the last word; slow, no wailing",
     "[softly] అమ్మ మనిద్దరికీ చెప్పలేదు… [sniffles] నేనూ చెప్పలేకపోయా."),                                   # 7 twist
    ("nikhil", "ఇక మీద ఈ ఇంట్లో… ఎవరూ ఏదీ దాచకూడదు.", 0.8,           # cut to the dining table
     "calm and firm at the dining table, chain and receipt laid down, looking at both; a quiet family rule, not a lecture",
     "[firmly] ఇక మీద ఈ ఇంట్లో… [dramatic pause] ఎవరూ ఏదీ దాచకూడదు."),                                       # 8 resolution
    ("amma", "సరే నాన్నా… మరి నీ watch ఎక్కడ?", 0.45,
     "caught but tender, a knowing little chuckle, then a slow mock-stern question with raised eyebrows; stress on 'watch'",
     "[chuckles] సరే నాన్నా… [slowly] మరి నీ watch ఎక్కడ?"),                                                   # 9 turn
    ("gopi", "ఇలా గుట్టుగా కాపాడే sibling ఉన్నారా? Tag చేయండి!", 1.4,   # the 02 SEP inset + laugh + 'Comment లో ✅' play in this gap
     "a warm, heartfelt host question, then a bright nudge to tag; stress on 'sibling'",
     "[warmly] ఇలా గుట్టుగా కాపాడే sibling ఉన్నారా? [excited] Tag చేయండి!"),                                  # 10 tag + close
]
# Narasimha's 'say' reads Rs 38,000 as words; the subtitle shows ₹38,000.

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import elevenvoice, scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
PROFILE = {"nikhil": elevenvoice.profile_for("male", "young", "cool"),            # -> andhra-male-young (not used: Gemini only)
           "narasimha": elevenvoice.profile_for("male", "middle", "cool"),        # elder male -> andhra-male-middle
           "amma": elevenvoice.profile_for("female", "middle", "emotional"),      # -> andhra-female-middle
           "keerthi": elevenvoice.profile_for("female", "young", "emotional"),    # -> andhra-female-young
           "gopi": None}
GEMINI = {"gopi": "Puck", "nikhil": "Charon", "narasimha": "Schedar", "amma": "Kore", "keerthi": "Achernar"}
SARVAM = {"gopi": "shubh", "nikhil": "rahul", "narasimha": "aditya", "amma": "roopa", "keerthi": "kavya"}
BATCHES = [["nikhil", "narasimha"], ["amma", "keerthi"], ["gopi"]]
scenevoice.NAMES.update({"narasimha": "Narasimha", "keerthi": "Keerthi"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
    "amma": "Amma, Nikhil's warm mother of about 55, speaking standard Andhra Telugu, gentle and affectionate",
    "keerthi": "Keerthi, a soft-spoken 22-year-old Telugu college girl, guilty and close to tears, speaking standard Andhra Telugu",
    "narasimha": "Narasimha, an unhurried Telugu pawnbroker of about 65, matter-of-fact, speaking standard Andhra Telugu"})

def sarvam(i, who):
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": TAGS.sub("", LINES[i][4]).strip(), "target_language_code": "te-IN", "model": "bulbul:v3",
                            "speaker": SARVAM[who], "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status(); open(f"vo/L{i}_raw.wav", "wb").write(base64.b64decode(r.json()["audios"][0]))
    open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")

def voice_all(only):
    os.makedirs("vo", exist_ok=True)
    redo = set(only)
    for pair in BATCHES:
        gem = [i for i in range(len(LINES)) if LINES[i][0] in pair and (i in redo or not os.path.exists(f"vo/L{i}_raw.wav"))]
        if not gem: continue
        batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": LINES[i][4]} for i in gem]
        print("batch", pair, gem, flush=True)
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
    json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
    for l in out: print(l["i"], l["who"], l["engine"], l["start"], l["dur"])
    print("total", round(t + TAIL, 2))

if __name__ == "__main__":
    args = sys.argv[1:]
    if "--build" not in args: voice_all([int(a) for a in args if a.isdigit()])
    build()
