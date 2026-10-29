"""Editor: turn the owner's Flow clips into a finished Reel Rasam reel.

Inputs (content/<post>/): shots.json  ({"shots":[{"n":1,"lines":[{"who":"gopi","text":"..."}]}, ...]})
                          clips/shot1.mp4 … (downloaded from the Drive inbox)
Lines may carry an acting direction: {"who": "pinky", "text": "...", "act": "a trembling, frightened whisper"}.
Output: rendered/video.mp4 — 1080×1920, 30 fps, Telugu voices (Gemini TTS), music bed with ducking,
subtitle + speaker chips, brand header and end card. Clip audio is muted (Flow may add its own speech).
"""
from __future__ import annotations

import base64
import difflib
import json
import re
import subprocess
import wave
from functools import lru_cache
from pathlib import Path

import numpy as np
import requests

from . import config

SR = 44100
W, H = 1080, 1920
TTS_MODEL = "gemini-2.5-flash-tts"
CHECK_MODEL = "gemini-3-flash-preview"   # listens to each take and confirms it says only the line
SPEED = 1.05                             # owner: Gemini's acting is ~5% too slow
# character -> (Gemini voice, pitch factor, persona). Kids are pitched up.
CAST = {
    "gopi": ("Puck", 1.0, "Gopi, a lively young Telugu storyteller talking straight to the viewer, playful and punchy"),
    "chinna": ("Fenrir", 1.12, "Chinna, a cheeky 8-year-old boy who thinks he is a mass movie hero"),
    "pandu": ("Algenib", 1.1, "Pandu, a mischievous 9-year-old boy who loves pranks"),
    "pinky": ("Leda", 1.15, "Pinky, a sweet 5-year-old girl"),
    "amma": ("Kore", 1.0, "Lakshmi Amma, a warm but fierce Telugu mother"),
}
NAMES = {"gopi": "GOPI", "chinna": "CHINNA", "pandu": "PANDU", "pinky": "PINKY", "amma": "LAKSHMI AMMA"}
COLORS = {"gopi": "#F5B700", "chinna": "#64B5F6", "pandu": "#81C784", "pinky": "#F48FB1", "amma": "#CE93D8"}


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)


def duration(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout
    return float(out.strip())


@lru_cache(maxsize=1)
def _google() -> tuple[str, str]:
    """(access token, project) for the service-account robot; needs the Vertex AI ("Agent Platform") User role."""
    from google.auth.transport.requests import Request
    from google.oauth2.service_account import Credentials

    from .table import parse_service_account

    info = parse_service_account(config.get("GOOGLE_SERVICE_ACCOUNT_JSON", required=True))
    creds = Credentials.from_service_account_info(info, scopes=["https://www.googleapis.com/auth/cloud-platform"])
    creds.refresh(Request())
    return creds.token, info["project_id"]


def _post(url: str, body: dict) -> dict:
    token, project = _google()
    for wait in (0, 15, 30, 45, 60, 90):  # new projects have a low per-minute TTS quota
        if wait:
            import time
            time.sleep(wait)
        r = requests.post(url, json=body, timeout=120,
                          headers={"Authorization": f"Bearer {token}", "x-goog-user-project": project})
        if r.status_code != 429:
            break
    r.raise_for_status()
    return r.json()


def direction(line: dict) -> str:
    persona = CAST[line["who"]][2]
    act = line.get("act") or "natural and expressive"
    return (f"You are {persona}. Speak natural Telugu (English words as an Indian kid would say them), "
            f"a little more animated and expressive than usual. The tone should be {act}. "
            f"Say only the line, nothing else.")


def heard_ok(expected: str, wav: Path) -> bool:
    """Ask a Gemini listener whether the take says just the line (it sometimes reads the direction aloud)."""
    _, project = _google()
    url = (f"https://aiplatform.googleapis.com/v1/projects/{project}/locations/global/"
           f"publishers/google/models/{CHECK_MODEL}:generateContent")
    try:
        out = _post(url, {"contents": [{"role": "user", "parts": [
            {"inlineData": {"mimeType": "audio/wav", "data": base64.b64encode(wav.read_bytes()).decode()}},
            {"text": "Transcribe exactly what is spoken. Reply with the transcript only."}]}]})
        heard = out["candidates"][0]["content"]["parts"][0]["text"]
    except (requests.RequestException, KeyError, IndexError):
        return True  # the check is best-effort; never block the reel on it
    norm = lambda t: re.sub(r"[\W_]+", "", t.lower())
    # Extra words (e.g. the direction read aloud) make the take much longer than the line.
    return len(norm(heard)) <= 1.5 * len(norm(expected)) + 6 or \
        difflib.SequenceMatcher(None, norm(heard), norm(expected)).ratio() > 0.7


def tts(line: dict, dest: Path, tries: int = 3) -> float:
    voice, pitch, _ = CAST[line["who"]]
    url = "https://texttospeech.googleapis.com/v1/text:synthesize"
    raw = dest.with_suffix(".raw.wav")
    for _ in range(tries):
        out = _post(url, {"input": {"prompt": direction(line), "text": line["text"]},
                          "voice": {"languageCode": "te-IN", "name": voice, "modelName": TTS_MODEL},
                          "audioConfig": {"audioEncoding": "LINEAR16", "sampleRateHertz": 24000}})
        raw.write_bytes(base64.b64decode(out["audioContent"]))
        # Too long for its text (a 1-word wail once ran 22 s) or extra words spoken -> take it again.
        if duration(raw) <= max(3.5, 0.16 * len(line["text"])) and heard_ok(line["text"], raw):
            break
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    af = f"{trim},asetrate=24000*{pitch},aresample={SR},atempo={SPEED / pitch:.4f}"
    run(["ffmpeg", "-y", "-i", str(raw), "-af", af, "-ac", "1", "-ar", str(SR), str(dest)])
    raw.unlink()
    return duration(dest)


def plan_timeline(shots: list[dict], clip_durs: list[float], voice_durs: list[list[float]]) -> list[dict]:
    """Each shot lasts max(clip, its lines + gaps); lines start 0.3 s into the shot, 0.25 s apart."""
    t, out = 0.0, []
    for shot, cd, vds in zip(shots, clip_durs, voice_durs):
        lines, lt = [], 0.3
        for line, vd in zip(shot.get("lines", []), vds):
            lines.append({**line, "start": round(t + lt, 3), "dur": vd})
            lt += vd + 0.25
        dur = max(cd, lt + 0.2)
        out.append({"n": shot["n"], "start": round(t, 3), "dur": round(dur, 3), "clip_dur": cd, "lines": lines})
        t += dur
    return out


def overlay_pngs(work: Path, timeline: list[dict], fonts: Path) -> list[tuple[Path, float, float]]:
    """Render subtitle/branding overlays as transparent PNGs with Chromium (handles Telugu shaping)."""
    from playwright.sync_api import sync_playwright

    css = f"""@font-face{{font-family:Anton;src:url({fonts.as_uri()}/Anton-Regular.ttf)}}
@font-face{{font-family:Rama;src:url({fonts.as_uri()}/Ramabhadra-Regular.ttf)}}
@font-face{{font-family:NotoTe;src:url({fonts.as_uri()}/NotoSansTelugu.ttf)}}
html,body{{margin:0;width:{W}px;height:{H}px;background:transparent}}
.sub{{position:absolute;left:60px;right:60px;bottom:230px;text-align:center;font-family:Rama,NotoTe;font-size:56px;
line-height:1.35;color:#fff;text-shadow:0 4px 0 #000,0 0 18px rgba(0,0,0,.9)}}
.who{{display:inline-block;font-family:Anton;font-size:34px;letter-spacing:2px;padding:4px 16px;border-radius:10px;
margin-bottom:10px;color:#0E0E12;text-shadow:none}}
.top{{position:absolute;top:70px;left:50px;right:50px;display:flex;justify-content:space-between;align-items:center}}
.brand{{font-family:Anton;font-size:38px;letter-spacing:3px;color:#fff;text-shadow:0 3px 0 #000}}
.tag{{font-family:Anton;font-size:28px;letter-spacing:2px;background:#E63946;color:#fff;padding:7px 16px;border-radius:8px}}
.end{{position:absolute;left:0;right:0;top:300px;text-align:center;font-family:Anton;font-size:72px;color:#F5B700;
text-shadow:0 5px 0 #000}}"""
    pages = [("brand", '<div class="top"><div class="brand">🍲 REEL RASAM</div><div class="tag">RASAM COMEDY</div></div>'),
             ("end", '<div class="end">FOLLOW @_REELRASAM</div>')]
    items = []
    for shot in timeline:
        for i, l in enumerate(shot["lines"]):
            name = f"sub_{shot['n']}_{i}"
            pages.append((name, f'<div class="sub"><span class="who" style="background:{COLORS[l["who"]]}">'
                                f'{NAMES[l["who"]]}</span><br>{l["text"].replace("…", "...")}</div>'))  # the font has no "…"
            items.append((work / f"{name}.png", l["start"] - 0.05, l["start"] + l["dur"] + 0.2))
    with sync_playwright() as p:
        b = p.chromium.launch(**config.chromium_launch_args())
        pg = b.new_page(viewport={"width": W, "height": H})
        for name, body in pages:
            html = work / f"{name}.html"
            html.write_text(f"<!doctype html><meta charset=utf-8><style>{css}</style>{body}", encoding="utf-8")
            pg.goto(html.as_uri())
            pg.evaluate("document.fonts.ready")
            pg.screenshot(path=str(work / f"{name}.png"), omit_background=True)
        b.close()
    total = timeline[-1]["start"] + timeline[-1]["dur"]
    return [(work / "brand.png", 0, total), (work / "end.png", total - 2.2, total)] + items


def music_bed(total: float, voice: np.ndarray) -> np.ndarray:
    n = int(total * SR); out = np.zeros(n); x = np.arange(n) / SR
    prog = [[48, 52, 55], [53, 57, 60], [55, 59, 62], [57, 60, 64]]
    for k in range(int(total / 0.5)):
        s = int(k * 0.5 * SR); d = np.arange(int(0.35 * SR)) / SR
        f = 440 * 2 ** ((prog[(k // 4) % 4][0] - 12 - 69) / 12)
        seg = np.sin(2 * np.pi * f * d) * np.exp(-d * 9) * (0.3 if k % 2 == 0 else 0.18)
        out[s:s + len(seg)] += seg[: max(0, n - s)]
    act = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(4410) / 4410, mode="same")
    return out * (1 - 0.6 * np.clip(act * 3, 0, 1)) * np.minimum(1, np.minimum(x / 0.5, (total - x) / 1.2))


def _cached(voice, line: dict, dest: Path) -> float:
    """Reuse a take from an earlier run of the same line (re-renders shouldn't pay for voices again)."""
    key = dest.with_suffix(".json")
    sig = json.dumps({k: line.get(k) for k in ("who", "text", "act")}, ensure_ascii=False)
    if dest.exists() and key.exists() and key.read_text(encoding="utf-8") == sig:
        return duration(dest)
    d = voice(line, dest)
    key.write_text(sig, encoding="utf-8")
    return d


def assemble(post_dir: Path, voice=tts) -> Path:
    post_dir = Path(post_dir).resolve()
    shots = json.loads((post_dir / "shots.json").read_text(encoding="utf-8"))["shots"]
    work = post_dir / "work"; work.mkdir(exist_ok=True)
    clips = [post_dir / "clips" / f"shot{s['n']}.mp4" for s in shots]
    missing = [c.name for c in clips if not c.exists()]
    if missing:
        raise FileNotFoundError(f"Missing clips: {', '.join(missing)}")
    clip_durs = [duration(c) for c in clips]
    voice_durs = [[_cached(voice, l, work / f"v_{s['n']}_{i}.wav") for i, l in enumerate(s.get("lines", []))]
                  for s in shots]
    tl = plan_timeline(shots, clip_durs, voice_durs)
    total = tl[-1]["start"] + tl[-1]["dur"]

    # video: normalise each clip to 1080x1920@30, hold the last frame if the voice runs longer
    parts = []
    for s, c in zip(tl, clips):
        out = work / f"n{s['n']}.mp4"
        hold = max(0.0, s["dur"] - s["clip_dur"])
        vf = (f"scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},fps=30,setsar=1,"
              f"tpad=stop_mode=clone:stop_duration={hold:.3f}")
        run(["ffmpeg", "-y", "-i", str(c), "-an", "-vf", vf, "-t", f"{s['dur']:.3f}", "-c:v", "libx264",
             "-pix_fmt", "yuv420p", "-crf", "20", str(out)])
        parts.append(out)
    (work / "list.txt").write_text("".join(f"file '{p}'\n" for p in parts))
    joined = work / "joined.mp4"
    run(["ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(work / "list.txt"), "-c", "copy", str(joined)])

    # audio: voices + ducked music
    n = int(total * SR); vtrack = np.zeros(n)
    for s in tl:
        for i, l in enumerate(s["lines"]):
            with wave.open(str(work / f"v_{s['n']}_{i}.wav")) as w:
                a = np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16) / 32768
            st = int(l["start"] * SR); vtrack[st:st + len(a)] += a[: max(0, n - st)]
    mix = vtrack + music_bed(total, vtrack)
    mix /= max(1e-9, np.abs(mix).max()) / 0.9
    with wave.open(str(work / "mix.wav"), "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((np.stack([mix, mix], 1) * 32767).astype(np.int16).tobytes())

    # overlays
    ovs = overlay_pngs(work, tl, config.ROOT / "brand" / "fonts")
    inputs = ["-i", str(joined), "-i", str(work / "mix.wav")]
    chain, last = [], "0:v"
    for k, (png, a, b) in enumerate(ovs):
        inputs += ["-i", str(png)]
        chain.append(f"[{last}][{k + 2}:v]overlay=0:0:enable='between(t,{a:.2f},{b:.2f})'[o{k}]")
        last = f"o{k}"
    out = post_dir / "rendered" / "video.mp4"; out.parent.mkdir(exist_ok=True)
    run(["ffmpeg", "-y", *inputs, "-filter_complex", ";".join(chain), "-map", f"[{last}]", "-map", "1:a",
         "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-c:a", "aac", "-b:a", "160k",
         "-shortest", "-movflags", "+faststart", str(out)])
    (work / "timeline.json").write_text(json.dumps(tl, ensure_ascii=False, indent=1), encoding="utf-8")
    return out
