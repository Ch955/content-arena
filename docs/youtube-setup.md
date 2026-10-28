# YouTube Shorts setup (@reel_rasam)

Goal: `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_REFRESH_TOKEN`, so the publisher can
upload approved reels as Shorts. Free. Uses the same Google Cloud project as the Sheet.

## ⚠️ The private-video rule (read first)

YouTube's docs: videos uploaded via the API from **unverified API projects created after
28 July 2020 are restricted to private viewing** until the project passes a **compliance audit**.
([videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert))
So until the audit is approved:
- Uploads succeed, but each Short lands **Private**. Open YouTube Studio → the video → set **Public**
  (10 seconds on the phone). Setting `privacyStatus=public` in the API doesn't override it.
- Apply for the audit once (step E). It's free; approval can take weeks.

## A. Enable the API
Google Cloud console (project **ReelRasam**) → APIs & Services → Library → **YouTube Data API v3** → Enable.

## B. OAuth consent screen
APIs & Services → **OAuth consent screen** (may be called *Google Auth Platform → Branding/Audience*):
- User type **External**, app name `Reel Rasam publisher`, support email = brand Gmail.
- Scopes: add `https://www.googleapis.com/auth/youtube.upload`.
- **Audience → Publish app → In production.** Important: in *Testing* status Google expires refresh
  tokens after **7 days**, which would break the schedule every week. An unverified app "in
  production" is fine for your own account — you'll just click *Advanced → Go to app (unsafe)* once.

## C. OAuth client
APIs & Services → **Credentials → Create credentials → OAuth client ID → Desktop app** →
name `content-arena` → copy **Client ID** and **Client secret** into `.env`:
```
YOUTUBE_CLIENT_ID=...
YOUTUBE_CLIENT_SECRET=...
```

## D. Connect the channel (laptop, once)
```bash
python -m content_arena youtube-auth
```
A browser opens → sign in with the brand Gmail → choose the **@reel_rasam** channel → allow.
The refresh token is written to `.env` as `YOUTUBE_REFRESH_TOKEN` (never printed).
Add all three values as GitHub secrets, and set the repo variable `PLATFORMS=instagram,youtube`.

## E. Apply for the API audit (removes the private lock)
Search "YouTube API Services Audit and Quota Extension Form" (Google support), fill it in for project
ReelRasam: use case "upload my own channel's original Shorts after manual approval", no other users.

## Limits
- Default quota: 10,000 units/day per project. Check the cost of `videos.insert` in Cloud Console →
  APIs → YouTube Data API v3 → Quotas (sources disagree: 100 vs 1,600 units). Even at 1,600 we can
  upload ~6 per day; we plan 1–2.
- Title ≤ 100 chars, no `<` `>`; hashtags: first 3 show above the title; more than 60 → all ignored
  (we cap at 15).
