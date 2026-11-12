"""ElevenLabs voices (owner, 11 Nov 2026: use ElevenLabs whenever there are credits, else fall back).

The API key lives only as a network secret on the cloud environment (host api.elevenlabs.io, header xi-api-key):
the proxy injects it, so the code sends a placeholder. When the key's credits run out (or the key is missing),
`voice_line` raises `ElevenUnavailable` and the caller falls back to Gemini, then Sarvam.

Model eleven_v3 (supports Telugu, takes [audio tags] for acting). Cast: Gopi=Liam, Pinky=Jessica (pitched up by
the caller), others map to the closest built-in voice.

Modulation (owner, 12 Nov 2026: "excellent modulation, according to the age"):
- Scripts may put v3 audio tags *inside* the spoken text where they belong, e.g. `say: "[gasps] Hey! [whispers] ఆగండి…"`.
  Then the text is sent as written; otherwise one tag is made from the line's acting note.
- Each character has a delivery setting (`stability`: 0.0 creative/most expressive, 0.5 natural, 1.0 steady):
  kids are the most expressive, the host natural, elders steady and warm.
- Gemini/Sarvam never see the tags (`strip_tags`).
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
    "ammamma": "XrExE9yKIg1WjnnlVkGX", # Matilda — warm, mature female (grandmother; caller may pitch down a little)
    "thatha": "JBFqnCBsd6RMkjVDRZzb",  # George — warm, older male storyteller (grandfather)
    # Recurring adult leads (owner, 12 Nov 2026: Telangana Telugu voices from ElevenLabs). Library voices need a
    # paid ElevenLabs plan; on the free plan the call falls back to FALLBACK (built-in) automatically.
    "nikhil": "9ebvxK9znS3l7PfpMK9l",  # Kaka — "natural Telangana Telugu pronunciation", warm young male
    "ananya": "eh5YJlyB5bmWfcmcEsLN",  # Vandana — young, warm, relatable Telugu conversation
}
FALLBACK = {"nikhil": "TX3LPaxmHKxFdv7VOQHJ", "ananya": "cgSgspJ2msm6clMCkdW9"}  # Liam / Jessica
STABILITY = {"pinky": 0.0, "chinna": 0.0, "pandu": 0.0, "gopi": 0.5, "host": 0.5, "amma": 0.5,
             "nikhil": 0.5, "ananya": 0.5,
             "ammamma": 1.0, "thatha": 1.0}
TAG_RE = re.compile(r"\[[^\]]{1,40}\]\s*")
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


def strip_tags(text: str) -> str:
    """Remove v3 audio tags like [giggles] (for engines that would read them aloud)."""
    return TAG_RE.sub("", text).strip()


def has_tags(text: str) -> bool:
    return bool(TAG_RE.search(text))


def clean(text: str) -> str:
    return text.replace("…", "...").replace("✅", "").strip()


def voice_line(text: str, who: str, act: str | None, dest: Path, sr: int = 44100) -> Path:
    """Voice one line to `dest` (wav, mono). Raises ElevenUnavailable when the fallback should be used."""
    voice = VOICES.get(who, VOICES["gopi"])
    spoken = clean(text) if has_tags(text) else tag_for(act) + clean(text)
    body = {"text": spoken, "model_id": MODEL, "language_code": "te",
            "voice_settings": {"stability": STABILITY.get(who, 0.5)}}
    try:
        r = requests.post(f"{API}/text-to-speech/{voice}?output_format=mp3_44100_128", headers=HEADERS, json=body, timeout=120)
        if r.status_code == 402 and "paid_plan_required" in r.text and who in FALLBACK:  # library voice on free plan
            r = requests.post(f"{API}/text-to-speech/{FALLBACK[who]}?output_format=mp3_44100_128", headers=HEADERS,
                              json=body, timeout=120)
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
