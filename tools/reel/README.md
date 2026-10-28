# Reel renderer (prototype, Phase 2)

How the intro reel (`content/2026-10-28-welcome-intro`) was made — HTML/CSS scenes rendered
frame-by-frame with headless Chromium, original synthesized music/SFX, Sarvam voiceover.

```bash
mkdir -p /tmp/reel && cp tools/reel/* /tmp/reel/ && cd /tmp/reel
mv intro.html reel.html && ln -s "$OLDPWD/brand/fonts" fonts && mkdir -p vo
python tts_sarvam.py      # needs SARVAM_API_KEY; writes vo/*.wav + durs.json (≈₹3 per reel)
python audio.py           # timeline.json + mix.wav (music bed, whooshes, ducking under voice)
node render.js            # needs Node + playwright; writes reel-rasam-intro.mp4
```
Then copy the MP4 to `content/<post>/rendered/video.mp4` and run `python -m content_arena sync`.
To be turned into a proper `python -m content_arena render-reel` command in Phase 2.
