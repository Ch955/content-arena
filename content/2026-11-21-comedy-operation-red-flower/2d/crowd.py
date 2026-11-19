"""In-house studio-audience takes for the crowd cues (#16 'ooooh', #19 gasp, #27 laugh track, #28 HOORAY): no downloaded
or copied audio (rule 1). FOUR Gemini TTS requests, each a two-voice 'audience' (8 different prebuilt voices in total)
performing the four reactions in a fixed order with long silences: ooooh, ooooh, gasp, gasp, laugh, laugh, hooray, hooray.
The take is cut into the 4 reaction groups at the 3 longest pauses that best match the expected lengths, then each group
into its 2 voices. mix.py layers them (8 per reaction): 30-150 ms staggers, +-2 semitone shifts, stereo spread, a room
reverb and a pink-noise murmur bed; the applause is synthesized from noise bursts in mix.py.
`python crowd.py` fetches what's missing (crowd/raw_K.pcm, 24 kHz s16) and splits -> crowd/<kind>_<K><a|b>.wav;
`python crowd.py --split` only re-splits."""
import base64, json, os, subprocess, sys, time, wave
import numpy as np, requests
sys.path.insert(0, "/home/user/content-arena/src")
from content_arena import scenevoice

PAIRS = [("Orus", "Kore"), ("Enceladus", "Leda"), ("Iapetus", "Aoede"), ("Umbriel", "Zephyr")]   # none is a cast voice
NAMES = ("Ravi", "Lata")
KINDS = ["ooh", "gasp", "laugh", "hooray"]
EXPECT = {"ooh": 3.0, "gasp": 1.2, "laugh": 5.0, "hooray": 3.0}    # seconds per pair (weights for the split)
WORDS = {  # what each audience member 'says' (varied so they don't sound in unison)
    "ooh": ["Ooooooooh!", "Ooooooooooh!", "Uuuuuuuh!", "Ooooooh-hoooo!"],
    "gasp": ["Haah!", "Haaah!", "Ahh!", "Hah!"],
    "laugh": ["Hahahahaha! Hahahaha!", "Ha ha ha ha ha! Hahaha!", "Hehehehe! Hahahaha!", "Hahahaha ha ha!"],
    "hooray": ["Hooray! Yaaaay!", "Yaaaaay! Woohoo!", "Hooraaay!", "Woohoo! Hooray!"],
}
ACT = {
    "ooh": "a long, rising, teasing 'ooooooh' from an office crowd watching someone get into trouble",
    "gasp": "one sharp, shocked gasp, short and breathy",
    "laugh": "a big, hearty, helpless audience belly laugh, loud and real, no words",
    "hooray": "a joyful, loud victory cheer, like a studio audience celebrating",
}
SR = 24000

def body(k):
    a, b = PAIRS[k]
    order = [(NAMES[0], "ooh"), (NAMES[1], "ooh"), (NAMES[0], "gasp"), (NAMES[1], "gasp"),
             (NAMES[0], "laugh"), (NAMES[1], "laugh"), (NAMES[0], "hooray"), (NAMES[1], "hooray")]
    script = "\n".join(f"{n}: {WORDS[kind][(k + j) % 4]}" for j, (n, kind) in enumerate(order))
    notes = "\n".join(f"{j + 1}. {n}: {ACT[kind]}" for j, (n, kind) in enumerate(order))
    prompt = ("Two members of a TV studio audience react, one after the other. These are pure vocal reactions (no words "
              "beyond what is written), performed big and realistic. Leave about TWO seconds of complete silence between "
              "lines. Director's notes, one per line, NEVER read them aloud:\n" + notes + "\n\nScript:\n" + script)
    return {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": {"multiSpeakerVoiceConfig": {"speakerVoiceConfigs": [
                {"speaker": NAMES[0], "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": a}}},
                {"speaker": NAMES[1], "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": b}}}]}}}}

def wr(p, x, sr=SR):
    with wave.open(p, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes(x.astype(np.int16).tobytes())

def fetch():
    os.makedirs("crowd", exist_ok=True)
    for k in range(len(PAIRS)):
        p = f"crowd/raw_{k}.pcm"
        if os.path.exists(p): continue
        print("request", k, PAIRS[k], flush=True)
        res = scenevoice._call(body(k))
        open(p, "wb").write(base64.b64decode(res["candidates"][0]["content"]["parts"][0]["inlineData"]["data"]))
        json.dump({"voices": PAIRS[k], "model_order": scenevoice.MODELS}, open(f"crowd/raw_{k}.json", "w"))
        time.sleep(21)

def split():
    info = {}
    for k in range(len(PAIRS)):
        a = np.frombuffer(open(f"crowd/raw_{k}.pcm", "rb").read(), dtype=np.int16)
        groups = None
        for mp in (0.9, 0.7, 0.55, 0.4, 0.3):
            groups = scenevoice.split_by_pauses(a, SR, [EXPECT[x] for x in KINDS], min_pause=mp, floor=0.03)
            if groups: break
        if not groups: print("could not split", k); continue
        for kind, (s, e) in zip(KINDS, groups):
            g = a[s:e]
            two = None
            for mp in (0.5, 0.35, 0.25, 0.15):
                two = scenevoice.split_by_pauses(g, SR, [1, 1], min_pause=mp, floor=0.03)
                if two: break
            parts = two or [(0, len(g))]
            for j, (s2, e2) in enumerate(parts):
                nm = f"crowd/{kind}_{k}{'ab'[j]}.wav"; wr(nm, g[s2:e2])
                info[nm] = round((e2 - s2) / SR, 2)
            print(k, kind, round((e - s) / SR, 2), "->", [round((e2 - s2) / SR, 2) for s2, e2 in parts], flush=True)
    json.dump(info, open("crowd/split.json", "w"), indent=1)

if __name__ == "__main__":
    if "--split" not in sys.argv: fetch()
    split()

def chunks(min_gap=0.45, floor=0.03):
    """Alternative split (used): every voiced chunk between silences >= min_gap -> crowd/c<K>_<J>.wav, classified one by
    one by crowd_check.py (the 4-group split above drifted by one reaction in some takes)."""
    out = {}
    for k in range(len(PAIRS)):
        a = np.frombuffer(open(f"crowd/raw_{k}.pcm", "rb").read(), dtype=np.int16)
        hop = SR // 100; fr = len(a) // hop
        rms = np.sqrt(np.mean(a[:fr * hop].reshape(fr, hop).astype(float) ** 2, axis=1)); loud = rms > floor * rms.max()
        segs, on, low = [], None, 0
        for f in range(fr):
            if loud[f]:
                if on is None: on = f
                low = 0
            elif on is not None:
                low += 1
                if low >= int(min_gap * 100): segs.append((on, f - low + 1)); on = None
        if on is not None: segs.append((on, fr))
        for j, (s, e) in enumerate(segs):
            s, e = max(0, s - 3), min(fr, e + 6)
            nm = f"crowd/c{k}_{j:02d}.wav"; wr(nm, a[s * hop:e * hop]); out[nm] = round((e - s) / 100, 2)
    json.dump(out, open("crowd/chunks.json", "w"), indent=1); print(out)
