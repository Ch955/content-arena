"""ElevenLabs voices (owner, 11 Nov 2026: use ElevenLabs whenever there are credits, else fall back).

The API key lives only as a network secret on the cloud environment (host api.elevenlabs.io, header xi-api-key):
the proxy injects it, so the code sends a placeholder. When the key's credits run out (or the key is missing),
`voice_line` raises `ElevenUnavailable` and the caller falls back to Gemini, then Sarvam.

Model eleven_v3 (supports Telugu, takes [audio tags] for acting). Cast: Gopi=Liam, Pinky=Jessica (pitched up by
the caller), others map to the closest built-in voice.
"""
from __future__ import annotations

import os
import re
import subprocess
from pathlib import Path

import requests

API = "https://api.elevenlabs.io/v1"
MODEL = os.environ.get("ELEVEN_MODEL", "eleven_v3")
VOICES = {  # built-in voices (no Voices permission needed)
    "gopi": "TX3LPaxmHKxFdv7VOQHJ",   # Liam — young, energetic male
    "host": "TX3LPaxmHKxFdv7VOQHJ",
    "chinna": "bIHbv24MWmeRgasZH58o",  # Will
    "pandu": "iP95p4xoKVk53GoZ742B",   # Chris
    "pinky": "cgSgspJ2msm6clMCkdW9",   # Jessica — playful female (caller pitches it up for a 6-year-old)
    "amma": "EXAVITQu4vr4xnSDxMaL",    # Sarah — warm female
}
HEADERS = {"xi-api-key": os.environ.get("ELEVEN_PLACEHOLDER", "proxy-injected")}


class ElevenUnavailable(Exception):
    """No credits left on the key, key missing/blocked, or ElevenLabs down: use the fallback voice."""


def tag_for(act: str | None) -> str:
    """Turn an acting note into a short v3 audio tag, e.g. 'urgent quiz-host energy, fast' -> '[urgent quiz-host energy]'."""
    if not act:
        return ""
    first = re.split(r"[,;(]", act)[0].strip()
    words = first.split()[:4]
    return f"[{' '.join(words)}] " if words else ""


def clean(text: str) -> str:
    return text.replace("…", "...").replace("✅", "").strip()


def voice_line(text: str, who: str, act: str | None, dest: Path, sr: int = 44100) -> Path:
    """Voice one line to `dest` (wav, mono). Raises ElevenUnavailable when the fallback should be used."""
    voice = VOICES.get(who, VOICES["gopi"])
    body = {"text": tag_for(act) + clean(text), "model_id": MODEL, "language_code": "te"}
    try:
        r = requests.post(f"{API}/text-to-speech/{voice}?output_format=mp3_44100_128", headers=HEADERS, json=body, timeout=120)
    except requests.RequestException as e:
        raise ElevenUnavailable(f"network: {e}") from e
    if r.status_code in (401, 402, 403, 429) or "quota" in r.text[:400].lower():
        raise ElevenUnavailable(f"{r.status_code}: {r.text[:200]}")
    if r.status_code != 200:
        raise ElevenUnavailable(f"{r.status_code}: {r.text[:200]}")
    dest = Path(dest)
    mp3 = dest.with_suffix(".mp3")
    mp3.write_bytes(r.content)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(mp3), "-ac", "1", "-ar", str(sr), str(dest)], check=True)
    mp3.unlink(missing_ok=True)
    return dest


def credits_left() -> int | None:
    """Account credits left (the key's own cap may be lower). None if unknown."""
    try:
        r = requests.get(f"{API}/user/subscription", headers=HEADERS, timeout=30)
        if r.status_code != 200:
            return None
        d = r.json()
        return int(d["character_limit"]) - int(d["character_count"])
    except (requests.RequestException, KeyError, ValueError):
        return None
