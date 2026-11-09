# 2D animated reel engine (default format from 10 Nov 2026)
Code-drawn cast (Gopi host, Pinky, Chinna, Pandu, Lakshmi Amma) in the colony world, lip-synced to the voice
loudness, with a chalkboard, countdown clock, reveal and end card. Reference episode: Podupu Katha #1.

Per reel the Editor copies this folder to a scratch dir, adapts `voices.py` LINES (who, text, gap, acting note)
and the choreography in `ep.html` `render(t)` to the script, then:
`ln -s <repo>/brand/fonts fonts && mkdir vo && python voices.py && python mix.py && node render.js`
(`node render.js 3 12 20` renders stills to check layout first). Copy the mp4 to `content/<post>/rendered/video.mp4`
and keep the adapted `ep.html`/`voices.py` in `content/<post>/2d/`.

Voices: Gemini API (AI Studio key via the environment's network secret; Gopi=Puck, Pinky=Leda, +5% speed).
The free tier allows only ~10 TTS requests a day per model, so `voices.py` voices the reel in batches of up to
8 lines per request as a two-voice conversation (`src/content_arena/scenevoice.py`) and cuts it back into lines
at the pauses — about 2 requests per reel. Lines that can't be split are voiced one by one; if Gemini refuses
(quota), they fall back to Sarvam automatically (`VOICE=sarvam` forces Sarvam). The soundtrack in `mix.py` is synthesized (no film music).
