"""Podupu Katha #1 (2D animated prototype) voices: Gemini TTS (AI Studio key), Gopi=Puck + Pinky=Leda.
Writes vo/L*.wav and timeline.json (line timings + 30fps loudness envelope for lip sync).
Temperature 1.0 / pace 1.1 for livelier modulation (Gemini TTS unavailable: Google billing disabled)."""
import base64, json, os, subprocess, sys, wave
import numpy as np, requests

FPS = 30
PACE, TEMP = 1.1, 1.0
COUNTDOWN = 5.0
CAST = {  # character -> (Gemini voice, pitch factor)
    "gopi":  ("Puck", 1.0),      # host
    "pinky": ("Leda", 1.12),     # little sister, the guesser
}
PERSONA = {"gopi": "You are Gopi, a lively young Telugu storyteller talking straight to the viewer like a close friend.",
           "pinky": "You are Pinky, a sweet, curious 6-year-old Telugu girl."}
LINES = [  # (who, subtitle text, gap before, acting direction)
    ("gopi",  "Hey! ఆగండి… 90% మంది ఈ పొడుపు కథ విప్పలేరు!", 0.6, "a bright, urgent hook with a teasing smile, a real pause after ఆగండి"),
    ("gopi",  "తెల్లని పొలంలో… నల్లని విత్తనాలు.", 0.45, "slow, mysterious, storyteller voice, dropping low"),
    ("gopi",  "చేత్తో చల్లుతారు… నోటితో ఏరుతారు! ఏంటది?", 0.35, "mysterious, then a playful challenge on ఏంటది"),
    ("pinky", "అన్నయ్యా… నువ్వులా?", 0.7, "unsure, thinking out loud, a hopeful guess with a little pause"),
    ("gopi",  "ఉహూ! Five seconds… మీరు కూడా ఆలోచించండి!", 0.75, "a playful 'no' (ఉహూ, like shaking the head), then excited quiz-host energy"),
    ("gopi",  "Answer… అక్షరాలు!", 0.35 + COUNTDOWN + 0.4, "dramatic pause after Answer, then a big satisfied reveal"),
    ("gopi",  "తెల్ల కాగితమే పొలం… నల్ల అక్షరాలే విత్తనాలు!", 0.6, "explaining with delight, an aha feeling"),
    ("gopi",  "చేత్తో రాస్తాం… నోటితో చదువుతాం!", 0.45, "warm, satisfied conclusion"),
    ("pinky", "అబ్బా! భలే ఉంది!", 0.5, "genuinely amazed and happy, clapping"),
    ("gopi",  "మీకు ముందే తెలుసా? Comment లో చెప్పండి! Follow చేయండి… YouTube లో subscribe!", 0.55, "friendly, energetic, smiling call to action"),
]

import time
def tts(text, voice, who, act):
    body = {"contents": [{"parts": [{"text": f"{PERSONA[who]} Speak natural Telugu (English words as Indians say them), "
                                             f"expressive and human, with natural pauses at '…'. The tone should be {act}. "
                                             f"Say only this line:\n{text}"}]}],
            "generationConfig": {"responseModalities": ["AUDIO"],
                                 "speechConfig": {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voice}}}}}
    for wait in (0, 20, 40, 60, 90):
        time.sleep(wait)
        r = requests.post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent",
                          json=body, timeout=120)
        if r.status_code != 429: break
        print("  rate-limited, waiting", flush=True)
    r.raise_for_status()
    pcm = base64.b64decode(r.json()["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
    open("vo/_tmp.pcm", "wb").write(pcm)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", "24000", "-ac", "1", "-i", "vo/_tmp.pcm",
                    "-ar", "44100", "vo/_tmp.wav"], check=True)
    return open("vo/_tmp.wav", "rb").read()

only = {int(a) for a in sys.argv[1:]}   # re-take only these line numbers (keeps the other takes)
t, out = 0.0, []
for i, (who, text, gap, act) in enumerate(LINES):
    spk, pitch = CAST[who]
    raw, dst = f"vo/L{i}_raw.wav", f"vo/L{i}.wav"
    if not os.path.exists(raw) or i in only:
        parts = [text]
        if len(parts) == 1: open(raw, "wb").write(tts(text, spk, who, act)); time.sleep(21)
        else:
            segs = []
            for j, ptxt in enumerate(parts):
                open(f"vo/L{i}_p{j}.wav", "wb").write(tts(ptxt, spk))
                subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f"vo/L{i}_p{j}.wav", "-af",
                                "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                                "-ac", "1", "-ar", "44100", f"vo/L{i}_t{j}.wav"], check=True)
                with wave.open(f"vo/L{i}_t{j}.wav") as w: segs.append(np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16))
            sil = np.zeros(int(0.32 * 44100), dtype=np.int16)
            pcm = np.concatenate([x for s_ in segs for x in (s_, sil)][:-1])
            with wave.open(raw, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(44100); w.writeframes(pcm.tobytes())
    # trim leading/trailing silence, then pitch the kid voice up (same length)
    af = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    af += f",asetrate=44100*{pitch},aresample=44100,atempo={1.05/pitch:.4f}"  # owner: 5% faster
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", af, "-ac", "1", "-ar", "44100", dst], check=True)
    with wave.open(dst) as w:
        a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16).astype(float) / 32768
    dur = len(a) / 44100
    hop = 44100 // FPS
    env = [float(np.sqrt(np.mean(a[k:k + hop] ** 2))) for k in range(0, len(a), hop)]
    m = max(env) or 1
    env = [round(min(1, e / m * 1.4), 3) for e in env]
    t += gap
    out.append({"i": i, "who": who, "text": text, "start": round(t, 3), "dur": round(dur, 3), "env": env})
    t += dur
json.dump({"fps": FPS, "countdown": COUNTDOWN, "lines": out, "dur": round(t + 2.6, 2)}, open("timeline.json", "w"), ensure_ascii=False)
for l in out: print(l["i"], l["who"], l["start"], l["dur"])
print("total", round(t + 2.6, 2))
