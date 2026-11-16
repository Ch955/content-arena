"""Voice the film with Gemini in pooled batches (plan.plan2). Saves every raw batch to batches/b{N}.wav (24 kHz) and
records the model in batches/b{N}.json, so splitting can be redone offline without new requests.
Usage: python voice.py [batch numbers]   (default: every batch not yet on disk)."""
import base64, json, os, sys, time, wave
import numpy as np, requests
import plan

API = "https://generativelanguage.googleapis.com/v1beta/models"
MODELS = ["gemini-2.5-flash-preview-tts", "gemini-3.1-flash-tts-preview", "gemini-2.5-pro-preview-tts"]
VOICE = {"Narrator": "Charon", "Meera": "Leda", "Chintu": "Puck", "Thatayya": "Algenib", "Veerendra": "Fenrir",
         "Vriksha": "Aoede", "Villagers": "Kore"}
PERSONA = {
 "Narrator": "a warm, calm middle-aged Telugu storyteller telling a fairy tale to the whole family; rich, gentle, unhurried, natural",
 "Meera": "Meera, a brave, emotional 12-year-old Telugu village girl who loves nature; a young girl's voice",
 "Chintu": "Chintu, Meera's funny, slightly scared, loyal 12-year-old best friend; a young boy's voice",
 "Thatayya": "Thatayya, a wise, gentle 75-year-old Telugu grandfather; slow, soft, slightly aged voice",
 "Veerendra": "Veerendra, a greedy, harsh, arrogant 45-year-old rich timber businessman (remorseful at the end)",
 "Vriksha": "the ancient spirit of the last banyan tree, the forest goddess; a calm, kind, ethereal, ageless woman's voice",
 "Villagers": "a joyful villager cheering in the first rain after years of drought",
}
def body(chunk):
    spk = []
    for l in chunk:
        s = plan.SPK[l["who"]]
        if s not in spk: spk.append(s)
    cast = "\n".join(f"- {s}: {PERSONA[s]}" for s in spk)
    notes = "\n".join(f"{i + 1}. {plan.SPK[l['who']]}: {l['act']}" for i, l in enumerate(chunk))
    script = "\n".join(f"{plan.SPK[l['who']]}: {l['text']}" for l in chunk)
    prompt = ("Perform this Telugu storybook audio film (a fantasy story for a long YouTube video) as natural, warm, human "
              "storytelling, like a skilled audiobook narrator and voice actors acting the scene, never like reading aloud. "
              "Speak every Telugu line exactly as written, word for word: do not add, drop, repeat or change any word. "
              "Natural pace, never rushed; real pauses at '...'. Leave about one and a half seconds of silence between "
              "the numbered lines.\nCast:\n" + cast +
              "\nDirector's notes, one per line, NEVER read them aloud:\n" + notes + "\n\nScript:\n" + script)
    cfg = ({"multiSpeakerVoiceConfig": {"speakerVoiceConfigs": [
                {"speaker": s, "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE[s]}}} for s in spk]}}
           if len(spk) == 2 else {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": VOICE[spk[0]]}}})
    return {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": cfg}}

def call(b):
    for model in list(MODELS):
        for wait in (0, 25, 45, 70):
            time.sleep(wait)
            t1 = time.time(); r = requests.post(f"{API}/{model}:generateContent", json=b, timeout=300)
            if r.status_code != 429 or "PerDay" in r.text: break
            print("   rate-limited (per minute), waiting", flush=True)
        if r.status_code == 429 and "PerDay" in r.text:
            print(f"   {model}: daily quota used up", flush=True); MODELS.remove(model); continue
        if r.status_code != 200: print(f"   HTTP {r.status_code} after {time.time() - t1:.0f}s", r.text[:300], flush=True)
        r.raise_for_status()
        return r.json(), model
    raise SystemExit("all Gemini TTS models are out of daily quota")

if __name__ == "__main__":
    d, L = plan.load(); P = plan.plan2(L)
    os.makedirs("batches", exist_ok=True)
    want = [int(a) for a in sys.argv[1:]] or [n for n in range(len(P)) if not os.path.exists(f"batches/b{n}.wav")]
    log = json.load(open("requests.json")) if os.path.exists("requests.json") else []
    for k, n in enumerate(want):
        chunk = [L[i] for i in P[n]]
        t0 = time.time()
        res, model = call(body(chunk))
        log.append({"batch": n, "model": model, "time": time.strftime("%H:%M:%S")}); json.dump(log, open("requests.json", "w"), indent=1)
        try:
            pcm = base64.b64decode(res["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
        except (KeyError, IndexError):
            print(f"b{n}: no audio:", json.dumps(res)[:300]); continue
        with wave.open(f"batches/b{n}.wav", "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        json.dump({"batch": n, "lines": P[n], "model": model}, open(f"batches/b{n}.json", "w"))
        print(f"b{n}: {model} {len(pcm) / 48000:.1f}s audio for {len(chunk)} lines "
              f"({sum(len(l['text']) for l in chunk)} chars) in {time.time() - t0:.0f}s", flush=True)
        if k < len(want) - 1: time.sleep(21)
