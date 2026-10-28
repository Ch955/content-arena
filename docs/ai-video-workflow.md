# 3D-animated episodes with Google Flow (free tier)

| Step | Who | Tool | Cost |
|---|---|---|---|
| Story, shot list, image + video prompts | Claude | — | ₹0 |
| Character + scene images | Owner | Google Flow (image generation: no credits) | ₹0 |
| Image → 8 s clips | Owner | Google Flow (daily free credits; limits change — check in app) | ₹0 |
| Upload clips | Owner | R2 bucket `incoming/<post>/shotN.mp4` | ₹0 |
| Edit: Telugu voices, music, SFX, subtitles, branding | Claude | Gemini TTS (acted, per-line directions) + ffmpeg | ~₹2 (trial credit) |
| Approve → publish | Owner → GitHub Actions | Sheet | ₹0 |

Consistency: always paste the locked descriptions from `brand/cast.md` and add the saved character
reference images as ingredients. Expect occasional re-dos; no model is perfectly consistent yet.
Rules: original cast only — no star lookalikes, no real names, no film footage/music (see CLAUDE.md).
Paid fallback for full automation: Veo API (no free API tier) — confirm pricing with the owner first.
