# Meta setup checklist (Instagram + Facebook)

Goal: a **never-expiring Page access token** plus the **Page ID** and **Instagram
user ID**, so `python -m content_arena publish` can post approved rows.
Everything here is free. Do it on a laptop browser (developer pages are painful on a phone).

Checked against Meta's docs on 2026-10-27:
[Content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing),
[Long-lived tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived).
Meta renames menus often — if a label differs, look for the closest match.

---

## A. Accounts (phone is fine)

- [ ] **Brand Gmail** created (e.g. `reelrasam.official@gmail.com`), 2-step verification ON.
- [ ] **Facebook profile** you control (Meta requires a personal profile to own Pages/apps).
      Use your real one or create one with the brand Gmail; turn on 2FA.
- [ ] **Facebook Page** "Reel Rasam" — category *Media/News company* or *Entertainment website*.
- [ ] **Instagram account** `@reelrasam` with the brand Gmail → Settings → *Account type and tools*
      → **Switch to professional account → Business**.
- [ ] **Link Instagram to the Page**: Facebook Page → Settings → *Linked accounts* → Instagram → Connect
      (or Instagram → Settings → *Accounts Center*).
- [ ] **Warm-up (recommended):** for the first ~7 days, post 3–5 things manually from the app
      (profile photo, bio, highlights). Brand-new accounts that start with API posts are more
      likely to be flagged.

## B. Meta developer app

- [ ] Go to <https://developers.facebook.com> → log in with the Facebook profile → *Get started*
      (verify your phone/email when asked).
- [ ] **My Apps → Create app**. Name: `content-arena`. Use case: choose the one for
      **managing Instagram / Pages content** (Facebook Login for Business). App type *Business* if asked.
- [ ] In the app, add products: **Facebook Login for Business** and **Instagram** (API setup with Facebook Login).
- [ ] Leave the app in **Development mode**. You are an admin of the app *and* the owner of the
      Page/IG, so you can use these permissions on your own accounts **without App Review**
      or business verification.
- [ ] Note the **App ID** and **App Secret** (App settings → Basic). Store the secret in your
      password manager only — it's needed once for the token exchange, not by the publisher.

## C. Permissions and a short-lived token

- [ ] Open **Graph API Explorer**: <https://developers.facebook.com/tools/explorer/>
- [ ] Select your app; *User or Page* → **Get User Access Token** with these permissions:
  - `instagram_basic`
  - `instagram_content_publish`
  - `pages_show_list`
  - `pages_read_engagement`
  - `pages_manage_posts` (for Facebook Page posts)
  - `business_management` (only if the Page is inside a Meta Business portfolio)
- [ ] In the login popup, select **the Reel Rasam Page and the @reelrasam Instagram account**.
- [ ] You now have a **short-lived user token** (expires in ~1–2 hours). Don't save it anywhere.

## D. Long-lived user token → never-expiring Page token

Easiest path (no code):
- [ ] **Access Token Debugger** (<https://developers.facebook.com/tools/debug/accesstoken/>) → paste
      the short-lived token → **Debug** → **Extend Access Token** at the bottom.
      This gives a **long-lived user token** (~60 days).
- [ ] Back in Graph API Explorer, paste the long-lived user token into the token box and run:
      `GET me/accounts?fields=id,name,access_token`
- [ ] Find "Reel Rasam" in the result:
  - `id` → this is **`META_PAGE_ID`**
  - `access_token` → this is **`META_PAGE_ACCESS_TOKEN`**
- [ ] Paste that Page token into the Access Token Debugger and confirm **Expires: Never**.
      (Page tokens made from a long-lived user token don't expire; they're invalidated only if
      you change your password, remove the app, or lose your Page role.)

Command-line alternative (same result, run it yourself — never paste tokens into chat):
```bash
curl -s "https://graph.facebook.com/v23.0/oauth/access_token?grant_type=fb_exchange_token&client_id=APP_ID&client_secret=APP_SECRET&fb_exchange_token=SHORT_LIVED_TOKEN"
curl -s "https://graph.facebook.com/v23.0/me/accounts?fields=id,name,access_token&access_token=LONG_LIVED_USER_TOKEN"
```

## E. Instagram user ID

- [ ] In Graph API Explorer (with the Page token): `GET {META_PAGE_ID}?fields=instagram_business_account`
- [ ] The returned `instagram_business_account.id` → **`IG_USER_ID`**.
- [ ] Sanity check: `GET {IG_USER_ID}?fields=username` → should return `reelrasam`.
- [ ] Check publishing quota: `GET {IG_USER_ID}/content_publishing_limit` (limit is 100 API posts
      per 24 h; we post 2 per day).

## F. Store the values (never in chat, code or git)

| Name | Where |
|---|---|
| `META_PAGE_ACCESS_TOKEN`, `META_PAGE_ID`, `IG_USER_ID`, `GRAPH_API_VERSION` | `.env` on your laptop |
| same names | GitHub → `content-arena` → Settings → Secrets and variables → Actions → *Secrets* |
| App Secret | password manager only |

Set `GRAPH_API_VERSION` to the latest version shown in Graph API Explorer's version dropdown
(the code defaults to `v23.0`).

## G. First test (with Claude or on your own)

- [ ] `python -m content_arena publish` → **dry run**; shows which row would go out.
- [ ] Approve one test row, then `python -m content_arena publish --live` once, by hand.
- [ ] Check the post on Instagram/Facebook. If it's wrong, delete it in the app and tell Claude.
- [ ] Only after a good manual run: set the GitHub repo variable `PUBLISH_ENABLED=true` to turn on
      the twice-daily schedule.

## Rotating / revoking

- If a token leaks: Facebook → Settings → *Business integrations* → remove `content-arena`
  (kills all its tokens), then redo C–F.
- Changing your Facebook password invalidates the Page token — redo D–F afterwards.
