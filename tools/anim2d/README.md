# 2D animated reel engine (default format from 10 Nov 2026)
Code-drawn cast (Gopi host, Pinky, Chinna, Pandu, Lakshmi Amma) in the colony world, lip-synced to the voice
loudness, with a chalkboard, countdown clock, reveal and end card. Reference episode: Podupu Katha #1.

Per reel the Editor copies this folder to a scratch dir, adapts `voices.py` LINES (who, text, gap, acting note)
and the choreography in `ep.html` `render(t)` to the script, then:
`ln -s <repo>/brand/fonts fonts && mkdir vo && python voices.py && python mix.py && node render.js`
(`node render.js 3 12 20` renders stills to check layout first). Copy the mp4 to `content/<post>/rendered/video.mp4`
and keep the adapted `ep.html`/`voices.py` in `content/<post>/2d/`.

Voices: Gemini API (AI Studio key via the environment's network secret; Gopi=Puck, Pinky=Leda, +5% speed).
Free tier = a few requests a minute (voices.py waits out 429s). If Gemini refuses, swap `tts()` for Sarvam
(see `content/2026-11-03-comedy-last-jamun/2d/voices.py`). The soundtrack in `mix.py` is synthesized (no film music).
