"""Twist story #1 'the voice note from my own number' (2D animated: NEON night bedroom, PAPER flashbacks, CLAY morning)
voices: Gopi (narrator/host), Nikhil (28, cool -> Andhra), Ananya (27, emotional -> Andhra).
Engine (15 Nov 2026): ALL LINES GEMINI (the ElevenLabs key is out of credits) -- Gopi=Puck, Nikhil=Charon, Ananya=Kore,
normal Gemini speed 1.15 (SPEED). Voiced in 2 batch requests via content_arena.scenevoice (lines regrouped by speaker
pair: Nikhil+Gopi lines in one request, Ananya+Gopi lines in the other) and cut back into lines at the pauses; bad
splits are fixed with recut.py, every take is verified with Sarvam STT (stt_check.py).
L1 (index 0) is Nikhil's own voice note playing from the phone: same Charon voice + a phone-speaker band-pass (PHONE_AF).
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
Re-take lines one by one with `python voices.py 3 4`; `VOICE=sarvam` forces Sarvam (last resort)."""
import base64, json, os, subprocess, sys, time, wave
import numpy as np, requests

FPS = 30
COUNTDOWN = 5.0
TAIL = 0.30   # after 'మళ్ళీ 11:58!' -> hard cut back to frame 1 (loop)
CAST = {"gopi": "Puck", "nikhil": "Charon", "ananya": "Kore"}
SPEED = {"gemini": 1.15, "sarvam": 1.05}
PHONE_AF = "highpass=f=420,lowpass=f=3300,equalizer=f=1800:t=q:w=1.2:g=5,acompressor=threshold=0.1:ratio=4:attack=5:release=60,volume=1.4"
LINES = [  # (who, subtitle text, gap before, acting direction, spoken text with [tags])  -- from script.json
    ('nikhil', 'రేపు 8:15… ఆ bus ఎక్కకు.', 0.40, "his own voice coming out of a phone speaker: low, slow, deadly serious, like a warning from someone who already knows; stress on ఎక్కకు", '[whispers] రేపు eight fifteen… [seriously] ఆ bus ఎక్కకు.'),  # 0 hook (voice note)
    ('gopi', 'రాత్రి 11:58. Sender — Nikhil number. Voice — Nikhil దే!', 0.20, 'a hushed late-night narrator building suspense, then a sharp punch on the last words', '[whispers] రాత్రి eleven fifty-eight. [dramatic pause] Sender — Nikhil number. [excited] Voice — Nikhil దే!'),  # 1 setup
    ('nikhil', 'నేను ఎప్పుడు అన్నా ఇది? 8:15… నా office bus!', 0.20, 'a calm man suddenly unsettled, half to himself, staring at the phone; stress on ఎప్పుడు', '[confused] నేను ఎప్పుడు అన్నా ఇది? [slowly] eight fifteen… [nervously] నా office bus!'),  # 2 problem
    ('gopi', 'ఎవరు పంపారు? ఎందుకు? Answer చివర్లో… clues మిస్ అవ్వకండి!', 0.15, 'a sly, teasing narrator leaning into the camera, quick then hushed', '[mischievously] ఎవరు పంపారు? ఎందుకు? [whispers] Answer చివర్లో… clues మిస్ అవ్వకండి!'),  # 3 hold
    ('nikhil', "Lunch లో Ananya నా phone తీసుకుంది… 'battery dead' అని.", 0.20, 'cool and thinking it through, the penny starting to drop; stress on Ananya', '[thoughtful] Lunch లో Ananya నా phone తీసుకుంది… [slowly] battery dead అని.'),  # 4 clue-1
    ('ananya', 'ఒక్క నిమిషం… Amma కి ఒక message, అంతే!', 0.15, 'a breezy, slightly too-innocent friend covering something with a smile', '[sweetly] ఒక్క నిమిషం… [quickly] Amma కి ఒక message, అంతే!'),  # 5 clue-2
    ('gopi', 'ఇలాంటి twist stories రోజూ కావాలంటే… follow చేయండి!', 0.20, 'a quick, bright aside, light and brisk', '[warmly] ఇలాంటి twist stories రోజూ కావాలంటే… [excited] follow చేయండి!'),  # 6 follow
    ('gopi', 'Calendar చూశారా? మీ theory ఏంటి? Comment చేయండి… 5 seconds!', 0.15, 'a slow, pointed question to the viewer, then urgent quiz-host energy', '[dramatic pause] Calendar చూశారా? మీ theory ఏంటి? [excited] Comment చేయండి… five seconds!'),  # 7 comment-countdown
    ('ananya', 'Last year నువ్వే నాకు పంపావ్… గుర్తుందా?', 0.1 + COUNTDOWN + 0.1, 'on a midnight phone call, gentle and emotional, a small smile in the voice; stress on నువ్వే', '[softly] Last year… నువ్వే నాకు పంపావ్. [warmly] గుర్తుందా?'),  # 8 reveal
    ('nikhil', 'Amma birthday రోజు… bus ఎక్కేశా. Amma ఒక్కతే tiffin చేసింది.', 0.20, 'the memory landing: quiet guilt, slow, the voice dropping on ఒక్కతే', '[sighs] Amma birthday రోజు… bus ఎక్కేశా. [softly] Amma ఒక్కతే tiffin చేసింది.'),  # 9 why
    ('ananya', 'అందుకే నీ మాట… నీకే పంపా. 12 అయింది — Amma కి wish!', 0.25, 'tender, then a happy, bossy push as the clock hits midnight', '[warmly] అందుకే నీ మాట… నీకే పంపా. [excited] twelve అయింది — Amma కి wish!'),  # 10 payoff
    ('gopi', 'Future నుంచి కాదు… last year Nikhil నుంచి! Correct ఆ? ✅', 0.25, 'a warm narrator letting the twist click, then a bright check-in with the viewer', '[warmly] Future నుంచి కాదు… [dramatic pause] last year Nikhil నుంచి! [excited] Correct ఆ?'),  # 11 twist-check
    ('gopi', 'ఇలాంటి friend ఉన్నారా? Tag చేయండి! Follow… అరె, మళ్ళీ 11:58!', 0.20, 'affectionate and playful, a warm sign-off cut short by a startled gasp', '[warmly] ఇలాంటి friend ఉన్నారా? Tag చేయండి! [laughs] Follow… [gasps] అరె, మళ్ళీ eleven fifty-eight!'),  # 12 share-close-loop
]
# 'say' spells the times out in English ("eight fifteen", "eleven fifty-eight") so Gemini never reads the digits oddly
GROUPS = [[0, 1, 2, 3, 4, 9], [5, 6, 7, 8, 10, 11, 12]]   # one request each: Nikhil+Gopi, Ananya+Gopi

import re
TAGS = re.compile(r"\[[^\]]{1,40}\]\s*")
sys.path.insert(0, os.path.join(os.environ.get("CONTENT_ARENA", "/home/user/content-arena"), "src"))
from content_arena import scenevoice
PERSONA = {"gopi": "Gopi, a warm young Telugu narrator talking straight to the viewer like a close friend",
           "nikhil": "Nikhil, a 28-year-old Hyderabad software engineer, thoughtful and a little introverted, speaking standard Andhra Telugu with a medium-low voice",
           "ananya": "Ananya, a warm, confident 27-year-old woman, Nikhil's close friend, speaking standard Andhra Telugu, clear and expressive"}
scenevoice.PERSONA.update(PERSONA)

def dur_of(path):
    with wave.open(path) as w: return w.getnframes() / w.getframerate()

def tts_one(text, who, act):
    """One line, one Gemini request (only for retakes): scenevoice's single-chunk call."""
    got = scenevoice.voice_batch([{"who": who, "text": text, "act": act, "say": text}], "vo_one", {scenevoice.NAMES[who]: CAST[who]})
    if 0 not in got: raise RuntimeError("no take")
    return open(got[0], "rb").read()

SARVAM = {"gopi": "shubh", "nikhil": "rahul", "ananya": "kavya"}
def tts_sarvam(text, who):
    r = requests.post("https://api.sarvam.ai/text-to-speech", timeout=60, headers={"api-subscription-key": os.environ["SARVAM_API_KEY"]},
                      json={"text": TAGS.sub("", text).strip(), "target_language_code": "te-IN", "model": "bulbul:v3", "speaker": SARVAM[who],
                            "pace": 1.18, "temperature": 0.9, "speech_sample_rate": 44100})
    r.raise_for_status(); return base64.b64decode(r.json()["audios"][0])

if __name__ == "__main__":
    only = [int(a) for a in sys.argv[1:] if a.isdigit()]
    os.makedirs("vo", exist_ok=True)
    engine = "sarvam" if os.environ.get("VOICE") == "sarvam" else "gemini"
    todo = [i for i in range(len(LINES)) if not os.path.exists(f"vo/L{i}_raw.wav")]
    if engine == "gemini" and todo and not only:
        # 2 requests: lines regrouped by speaker pair (scenevoice allows two voices per request)
        order = [i for g in GROUPS for i in g if i in todo]
        batch = [{"who": LINES[i][0], "text": LINES[i][1], "act": LINES[i][3], "say": LINES[i][4]} for i in order]
        print("batch order", order, [scenevoice.NAMES[LINES[i][0]] for i in order], flush=True)
        got = scenevoice.voice_batch(batch, "vo_batch", {scenevoice.NAMES[w]: CAST[w] for w in CAST})
        for k, path in got.items():
            os.replace(path, f"vo/L{order[k]}_raw.wav"); open(f"vo/L{order[k]}_model.txt", "w").write("gemini-batch:" + ",".join(scenevoice.MODELS))
        todo = [i for i in todo if not os.path.exists(f"vo/L{i}_raw.wav")]
    for i in sorted(set(todo) | set(only)):
        who, text, gap, act, say = LINES[i]
        if engine == "sarvam":
            open(f"vo/L{i}_raw.wav", "wb").write(tts_sarvam(say, who)); open(f"vo/L{i}_model.txt", "w").write("sarvam:bulbul:v3")
        else:
            print("  voicing one by one:", i, flush=True)
            open(f"vo/L{i}_raw.wav", "wb").write(tts_one(say, who, act)); open(f"vo/L{i}_model.txt", "w").write("gemini-single:" + ",".join(scenevoice.MODELS))
    json.dump({w: engine for w in CAST}, open("vo/engine.json", "w"))
    # trim, speed, phone EQ on the voice note -> vo/L{i}.wav + timeline.json
    t, out = 0.0, []
    for i, (who, text, gap, act, say) in enumerate(LINES):
        raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
        eng = "sarvam" if open(f"vo/L{i}_model.txt").read().startswith("sarvam") else "gemini"
        af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
        af += f",atempo={SPEED[eng]:.4f}"
        if i == 0: af += "," + PHONE_AF
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
        with wave.open(dst) as w:
            a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
        dur = len(a) / 44100; hop = 44100 // FPS
        env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
        m = max(env) or 1; env = [round(min(1, e / m * 1.4), 3) for e in env]
        t += gap
        out.append({"i": i, "who": who, "text": text, "spoken": TAGS.sub("", say).strip(), "start": round(t, 3), "dur": round(dur, 3), "env": env})
        t += dur
    json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(t + TAIL, 2)}, open("timeline.json", "w"), ensure_ascii=False)
    for l in out: print(l["i"], l["who"], l["start"], l["dur"])
    print("total", round(t + TAIL, 2))
