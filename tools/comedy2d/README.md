# 2D comedy fallback (Episode 1 "Mass Entry" engine)
Code-drawn cast (Chinna, Pandu, Pinky, Gopi badge, Lakshmi Amma) with lip-sync from voice loudness.
Per episode the Editor adapts `voices.py` (LINES) and the choreography in `ep.html` `render(t)`.
Run in a scratch dir: copy these files, `ln -s <repo>/brand/fonts fonts`, `mkdir vo`, then
`python voices.py` (Sarvam, ~₹5) → `python mix.py` → `node render.js` (or `node render.js 2 10 18` for stills).
