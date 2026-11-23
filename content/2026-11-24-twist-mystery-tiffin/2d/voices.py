"""Twist story 'the mystery tiffin' (2D animated, FLAT: Nikhil's desk in Tower B, Hitech City, Day 6 1:00 PM; the
ground-floor cafeteria counter 1:15 PM; Day 7 12:40 PM at his desk; a paper/sepia torn-edge memory inset in L10).
Voices: Ananya (27, emotional -> Andhra), Nikhil (28, cool -> Andhra), Lakshmi aunty (~55, emotional -> Andhra, NEW),
Gopi (host). Built on the 19 Nov voices.py.

ALL GEMINI (Manager, 23 Nov: skip ElevenLabs, its key cap is ~51 credits): Nikhil=Charon, Ananya=Kore, Gopi=Puck,
Lakshmi=Vindemiatrix. To keep the TTS requests few, the 13 lines go in TWO batch requests, each a two-voice
conversation (scenevoice: <= 2 speakers per request): A = Ananya + Nikhil (L0 1 2 3 5 8 11), B = Lakshmi + Gopi
(L4 6 7 9 10 12); each batch is cut back into lines at the pauses and every take is checked with the Gemini listener
(listen.py, several clips per request). Sarvam TTS is the last resort (whole character).
Speed: Gemini x1.15 (owner, 12 Nov 2026), never more. FIT: an extra atempo per line only to slow a take down (<= 1.0).
`python voices.py` voices what's missing and builds; `python voices.py --build` only rebuilds vo/L*.wav + timeline.json
from vo/L*_raw.wav; `python voices.py 3 4` re-takes lines 3 and 4 (one batch per speaker pair)."""
import base64, json, os, re, subprocess, sys, wave
import numpy as np, requests

FPS = 30
COUNTDOWN = 5.0
TAIL = 2.65   # after Gopi's last word: end card hold (~1.15 s), then the SILENT loop shot (hard cut to the dented lid, 1.5 s)
SPEED = {"gemini": 1.15, "eleven": 1.05, "sarvam": 1.05}
FIT = {}
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with [tags])  -- from script.json
    ("ananya", "ఆరో రోజు! ఈ tiffin ఎవరు పెడుతున్నారు Nikhil?!", 0.25,
     "a confident 27-year-old friend bursting in, half thrilled, half suspicious, tapping the steel lid; punch on 'ఆరో'",
     "[excited] ఆరో రోజు! [curious] ఈ tiffin ఎవరు పెడుతున్నారు… Nikhil?!"),                                  # 0 hook
    ("nikhil", "పెసరట్టు-ఉప్మా… నా favourite. పేరు కూడా లేదు.", 0.2,
     "a calm, introverted young man lifting the lid, pleased for a second, then uneasy; low and measured",
     "[quietly] పెసరట్టు-ఉప్మా… నా favourite. [uneasy] పేరు కూడా… లేదు."),                                    # 1 problem
    ("ananya", "Secret admirer! Party ఎప్పుడు?", 0.15,
     "playful teasing, eyebrows up, a quick laugh; light and fast",
     "[teasing] Secret admirer! [laughs] Party ఎప్పుడు?"),                                                     # 2 red herring
    ("nikhil", "అమ్మ రాజమండ్రిలో… మరి నాకు ఎవరు వండుతారు?", 0.2,
     "not amused; a quiet, slightly lonely worry, stress on 'ఎవరు'",
     "[softly] అమ్మ రాజమండ్రిలో… [uneasy] మరి నాకు… ఎవరు వండుతారు?"),                                       # 3 problem
    ("lakshmi", "అన్నం తిన్నావా నాన్నా?", 0.75,          # the cut to the cafeteria (1:15 PM card) plays in this gap
     "a warm cafeteria aunty of about 55 at her counter, a habitual motherly question, slow and soft",
     "[warmly] అన్నం తిన్నావా… నాన్నా?"),                                                                    # 4 clue
    ("ananya", "ఈ పోపు వాసన… ఎక్కడో తెలిసినట్టుందే!", 0.2,
     "sniffing the air at the counter, puzzled, half to herself, a small frown",
     "[sniffs] ఈ పోపు వాసన… [curious] ఎక్కడో తెలిసినట్టుందే!"),                                             # 5 clue
    ("gopi", "Clues అన్నీ screen మీదే… ఇలాంటి twists కి follow కొట్టండి!", 0.2,
     "a sly young host leaning into the camera, teasing, then a bright quick CTA",
     "[mischievously] Clues అన్నీ… screen మీదే! [excited] ఇలాంటి twists కి… follow కొట్టండి!"),             # 6 follow
    ("gopi", "Tiffin ఎవరిది? మీ guess comment చేయండి… five seconds!", 0.15,
     "a game-show challenge, a beat of suspense on the question, then upbeat and quick",
     "[dramatic pause] Tiffin ఎవరిది? [excited] మీ guess comment చేయండి… five seconds!"),                    # 7 comment + countdown
    ("nikhil", "Aunty… మీరా?!", 0.1 + COUNTDOWN + 1.6,   # NEXT DAY 12:40 PM card, he walks in, she freezes (beat of silence)
     "caught off guard, a stunned soft whisper, not angry",
     "[gasps] Aunty… [softly] మీరా?!"),                                                                        # 8 reveal
    ("lakshmi", "ఈ box మా బాబుది… America వెళ్ళి రెండేళ్ళు. Phone కూడా తక్కువే.", 0.6,
     "embarrassed, thumb on the dented lid, a mother's quiet ache; slow, no crying",
     "[sighs] ఈ box మా బాబుది… [softly] America వెళ్ళి రెండేళ్ళు. [slowly] Phone కూడా… తక్కువే."),          # 9 twist (memory inset)
    ("lakshmi", "అలవాటుగా వాడికి వండుతా… నువ్వు అచ్చం వాడిలాగే నాన్నా.", 0.3,
     "a small shy smile through the sadness, tender, stress on 'అచ్చం'",
     "[nostalgic] అలవాటుగా… వాడికి వండుతా. [warmly] నువ్వు అచ్చం వాడిలాగే… నాన్నా."),                     # 10 twist
    ("nikhil", "అమ్మా… ఊరికే చేశా. అన్నం తిన్నావా?", 1.3,  # he pulls a second chair, dials; the call rings in this gap
     "on a video call, voice catching slightly, then a gentle smile; the same question the aunty asks him",
     "[warmly] అమ్మా… [softly] ఊరికే చేశా. అన్నం తిన్నావా?"),                                               # 11 ending
    ("gopi", "మీకూ office లో ఒక 'అమ్మ' ఉన్నారా? వాళ్ళని tag చేయండి!", 0.55,
     "a warm, heartfelt host question, then a bright nudge to tag; stress on 'అమ్మ'",
     "[warmly] మీకూ office లో… ఒక 'అమ్మ' ఉన్నారా? [excited] వాళ్ళని tag చేయండి!"),                         # 12 comment + tag + close
]
# 'say' reads the countdown as "five seconds" (English); on screen 5-4-3-2-1.

sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import elevenvoice, scenevoice
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
PROFILE = {"lakshmi": elevenvoice.profile_for("female", "middle", "emotional"),   # -> andhra-female-middle (Seeta) if ElevenLabs is ever used
           "ananya": elevenvoice.profile_for("female", "young", "emotional"),    # -> andhra-female-young
           "nikhil": elevenvoice.profile_for("male", "young", "cool"),           # -> andhra-male-young
           "gopi": None}
GEMINI = {"gopi": "Puck", "nikhil": "Charon", "ananya": "Kore", "lakshmi": "Vindemiatrix"}
SARVAM = {"gopi": "shubh", "nikhil": "rahul", "ananya": "kavya", "lakshmi": "roopa"}
BATCHES = [["ananya", "nikhil"], ["lakshmi", "gopi"]]
scenevoice.NAMES.update({"lakshmi": "Lakshmi"})
scenevoice.PERSONA.update({
    "gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
    "nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
    "ananya": "Ananya, a warm, confident 27-year-old woman, Nikhil's close friend, speaking standard Andhra Telugu, clear and expressive",
    "lakshmi": "Lakshmi, a warm, shy Telugu cafeteria aunty of about 55, motherly, slow and soft-spoken, speaking standard Andhra Telugu"})

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
