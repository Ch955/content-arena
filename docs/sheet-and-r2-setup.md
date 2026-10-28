# Google Sheet + Cloudflare R2 setup

## Why a Google Sheet for the content table

- **Approve from your phone** — the Sheets app, tap the status cell, pick `approved`. No laptop needed.
- GitHub Actions can read/write it with a service account (free Sheets API).
- Readable as a table, filterable, with history (File → Version history).

SQLite would be stronger relationally, but it lives on one machine — approvals would need the
laptop or a git push. Notion works too but its API and free-tier limits add friction for no gain here.
The code keeps a `csv` backend for offline testing (`TABLE_BACKEND=csv`).

## Google Sheet (with the brand Gmail)

1. Google Cloud Console → create project `content-arena` (your free-trial credits sit here; the
   Sheets API itself is free).
2. **APIs & Services → Library** → enable **Google Sheets API**.
3. **IAM & Admin → Service accounts → Create** `content-arena-bot` (no roles needed).
   Open it → **Keys → Add key → JSON** → a file downloads. Keep it outside the repo
   (or name it `service-account.json` in the repo root — it's git-ignored).
4. Create a Google Sheet "Reel Rasam — content". Copy its ID from the URL
   (`docs.google.com/spreadsheets/d/<THIS_PART>/edit`).
5. **Share** the Sheet with the service account's email (`…@….iam.gserviceaccount.com`) as **Editor**.
6. `.env`: `TABLE_BACKEND=sheet`, `GOOGLE_SHEET_ID=…`, `GOOGLE_SERVICE_ACCOUNT_FILE=path/to/key.json`.
7. `python -m content_arena list` (creates the `content` tab + headers), then
   `python -m content_arena init-sheet` (adds the status dropdown).
8. GitHub Actions secrets: `GOOGLE_SHEET_ID`, and `GOOGLE_SERVICE_ACCOUNT_JSON` = the whole JSON file contents.
   Settings screens that only take `NAME=value` lines (e.g. Claude's environment settings) can mangle JSON —
   paste it **base64-encoded** instead. Windows PowerShell (copies to clipboard, prints nothing):
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes("C:\path\service-account.json")) | Set-Clipboard`

Approving on the phone: open the Sheet → find rows with status `rendered` → open the
`media_urls` links to see the slides, read `caption` and `facts_to_verify` → set status to
`approved` (or `rejected`). Optional: put a time in `scheduled_for` (e.g. `2026-10-31 19:30`, IST).

## Cloudflare R2 (image hosting)

1. Sign up at cloudflare.com (free plan) → **R2 Object Storage** → enable (free tier; Cloudflare
   asks for a card even for the free tier — check current limits on their pricing page).
2. **Create bucket** `reelrasam-media`.
3. Bucket → **Settings → Public access → R2.dev subdomain → Allow**. Copy the public URL
   (`https://pub-….r2.dev`) → `R2_PUBLIC_BASE_URL`.
4. R2 → **Manage API tokens → Create API token** → *Object Read & Write*, limited to this bucket.
   Copy the **Access Key ID** and **Secret Access Key** (shown once) → `.env`.
5. `R2_ACCOUNT_ID` is on the R2 overview page.

Note: images are public once uploaded (unlisted, random-looking URLs). Don't put anything private on slides.
