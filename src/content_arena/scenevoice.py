"""Voice a whole reel in a few Gemini requests (the free tier allows only ~10 TTS requests a day per model).

Lines are sent in chunks of up to CHUNK lines as one conversation (multi-speaker when two characters speak,
e.g. Gopi=Puck + Pinky=Leda), with a director's note per line and a pause between lines. The returned audio
is cut back into one take per line at the pauses that best match each line's expected length.
"""
from __future__ import annotations

import base64
import subprocess
import time
import wave
from pathlib import Path

import numpy as np
import requests

API = "https://generativelanguage.googleapis.com/v1beta/models"
MODELS = ["gemini-2.5-flash-preview-tts", "gemini-2.5-pro-preview-tts"]  # both support two speakers in one call
CHUNK = 8
SR_IN = 24000
NAMES = {"gopi": "Gopi", "host": "Gopi", "pinky": "Pinky", "chinna": "Chinna", "pandu": "Pandu", "amma": "Amma"}
PERSONA = {"gopi": "a lively young Telugu storyteller talking straight to the viewer like a close friend",
           "host": "a lively young Telugu storyteller talking straight to the viewer like a close friend",
           "pinky": "a sweet, curious 6-year-old Telugu girl", "chinna": "a cheeky 8-year-old boy",
           "pandu": "a mischievous 9-year-old boy", "amma": "a warm but fierce Telugu mother"}


def split_by_pauses(audio: np.ndarray, sr: int, weights: list[float], min_pause: float = 0.28,
                    floor: float = 0.02) -> list[tuple[int, int]] | None:
    """Cut `audio` into len(weights) parts at silent gaps, choosing the gaps whose cuts best match the
    expected relative lengths (`weights`, e.g. characters per line). Returns sample ranges, or None."""
    n = len(weights)
    hop = sr // 100  # 10 ms frames
    frames = len(audio) // hop
    if frames == 0:
        return None
    rms = np.sqrt(np.mean(audio[: frames * hop].reshape(frames, hop).astype(float) ** 2, axis=1))
    loud = rms > max(floor * rms.max(), 1e-4)
    voiced = np.flatnonzero(loud)
    if len(voiced) == 0:
        return None
    first, last = voiced[0], voiced[-1] + 1
    # silent runs inside the speech
    gaps, k = [], first
    while k < last:
        if not loud[k]:
            j = k
            while j < last and not loud[j]:
                j += 1
            if (j - k) / 100 >= min_pause:
                gaps.append(((k + j) // 2, (j - k) / 100))
            k = j
        else:
            k += 1
    if n == 1:
        return [(first * hop, last * hop)]
    if len(gaps) < n - 1:
        return None
    total = last - first
    expect = np.cumsum(np.array(weights, float))[:-1] / sum(weights) * total + first  # ideal cut frames
    # DP: pick n-1 increasing gaps minimising distance to the ideal cuts (longer gaps get a small bonus)
    g = len(gaps)
    inf = float("inf")
    cost = np.full((n - 1, g), inf)
    back = np.zeros((n - 1, g), int)
    for j in range(g):
        cost[0, j] = abs(gaps[j][0] - expect[0]) - 20 * gaps[j][1]
    for i in range(1, n - 1):
        for j in range(i, g):
            prev = cost[i - 1, :j]
            b = int(np.argmin(prev))
            cost[i, j] = prev[b] + abs(gaps[j][0] - expect[i]) - 20 * gaps[j][1]
            back[i, j] = b
    j = int(np.argmin(cost[n - 2]))
    if cost[n - 2, j] == inf:
        return None
    cuts = [j]
    for i in range(n - 2, 0, -1):
        j = back[i, j]
        cuts.append(j)
    cuts = [gaps[c][0] for c in reversed(cuts)]
    bounds = [first] + cuts + [last]
    parts = [(bounds[i] * hop, bounds[i + 1] * hop) for i in range(n)]
    # sanity: every part within a factor of ~2.5 of its expected share
    for (a, b), w in zip(parts, weights):
        share = (b - a) / hop / total * sum(weights)
        if not (w / 2.5 <= share <= w * 2.5 + 3):
            return None
    return parts


def split_robust(audio: np.ndarray, sr: int, weights: list[float]) -> list[tuple[int, int]] | None:
    """split_by_pauses with a few silence thresholds (takes differ in breath noise and pause length)."""
    for floor in (0.02, 0.05, 0.08):
        for min_pause in (0.28, 0.2):
            parts = split_by_pauses(audio, sr, weights, min_pause, floor)
            if parts:
                return parts
    return None


def _call(body: dict) -> dict:
    for model in list(MODELS):
        for wait in (0, 20, 40, 60):
            time.sleep(wait)
            r = requests.post(f"{API}/{model}:generateContent", json=body, timeout=180)
            if r.status_code != 429 or "PerDay" in r.text:
                break
        if r.status_code == 429 and "PerDay" in r.text:
            continue  # this model's daily quota is gone: try the next one
        r.raise_for_status()
        return r.json()
    r.raise_for_status()
    return r.json()


def _chunk_body(chunk: list[dict], voices: dict[str, str]) -> dict:
    speakers = sorted({NAMES[l["who"]] for l in chunk})
    notes = "\n".join(f"{i + 1}. {NAMES[l['who']]} ({PERSONA[l['who']]}): {l.get('act') or 'natural, expressive'}"
                      for i, l in enumerate(chunk))
    script = "\n".join(f"{NAMES[l['who']]}: {l.get('say') or l['text']}" for l in chunk)
    prompt = ("Perform this short Telugu reel script as natural, expressive, human speech (Tenglish: English words as "
              "Indians say them), with real pauses at '…'. Leave about one second of silence between lines. "
              "Director's notes, one per line, NEVER read them aloud:\n" + notes + "\n\nScript:\n" + script)
    cfg = ({"multiSpeakerVoiceConfig": {"speakerVoiceConfigs": [
                {"speaker": s, "voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voices[s]}}} for s in speakers]}}
           if len(speakers) == 2 else
           {"voiceConfig": {"prebuiltVoiceConfig": {"voiceName": voices[speakers[0]]}}})
    return {"contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"responseModalities": ["AUDIO"], "speechConfig": cfg}}


def _chunks(lines: list[dict]) -> list[list[int]]:
    """Index groups of ≤ CHUNK lines with at most two distinct speakers each."""
    out, cur, who = [], [], set()
    for i, l in enumerate(lines):
        w = NAMES[l["who"]]
        if cur and (len(cur) >= CHUNK or (w not in who and len(who) == 2)):
            out.append(cur); cur, who = [], set()
        cur.append(i); who.add(w)
    if cur:
        out.append(cur)
    return out


def voice_batch(lines: list[dict], out_dir: Path, voices: dict[str, str], sr_out: int = 44100) -> dict[int, Path]:
    """Write out_dir/L{i}_raw.wav for every line it could voice; returns {line index: path}.
    Lines missing from the result should be voiced one by one (or by the fallback voice)."""
    out_dir = Path(out_dir); out_dir.mkdir(parents=True, exist_ok=True)
    done: dict[int, Path] = {}
    for idx in _chunks(lines):
        chunk = [lines[i] for i in idx]
        weights = [max(4, len(l.get("say") or l["text"])) for l in chunk]
        parts = None
        for attempt in range(2):  # a second take if the first runs lines together
            try:
                res = _call(_chunk_body(chunk, voices))
                pcm = base64.b64decode(res["candidates"][0]["content"]["parts"][0]["inlineData"]["data"])
            except (requests.RequestException, KeyError, IndexError) as e:
                print(f"  batch voice failed for lines {idx[0]}–{idx[-1]}: {e}", flush=True)
                break
            audio = np.frombuffer(pcm, dtype=np.int16)
            parts = split_robust(audio, SR_IN, weights)
            if parts:
                break
            time.sleep(21)
        if parts is None:
            print(f"  could not split lines {idx[0]}–{idx[-1]} cleanly; voicing them one by one", flush=True)
            continue
        for i, (a, b) in zip(idx, parts):
            tmp = out_dir / f"L{i}_b.pcm"; tmp.write_bytes(audio[a:b].tobytes())
            dst = out_dir / f"L{i}_raw.wav"
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-f", "s16le", "-ar", str(SR_IN), "-ac", "1", "-i", str(tmp),
                            "-ar", str(sr_out), str(dst)], check=True)
            tmp.unlink()
            done[i] = dst
        time.sleep(21)  # stay under the free tier's per-minute limit
    return done


def wav_seconds(path: Path) -> float:
    with wave.open(str(path)) as w:
        return w.getnframes() / w.getframerate()
