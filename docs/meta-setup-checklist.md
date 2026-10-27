# Meta setup checklist (Instagram now, Facebook later)

**Current path: Instagram API with Instagram Login** — Meta's docs: *"This API setup does not
require a Facebook Page to be linked to the Instagram professional account."*
Goal: an **Instagram User access token** (`IG_ACCESS_TOKEN`) and your **Instagram user ID**
(`IG_USER_ID`), so `python -m content_arena publish` can post approved rows.
Everything here is free. Use a laptop browser (developer pages are painful on a phone).

Checked against Meta's docs on 2026-10-27:
[Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login),
[Content publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing),
[Refresh token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token).
Meta renames menus often — if a label differs, look for the closest match.

---

## A. Accounts

- [ ] **Brand Gmail**, 2-step verification ON.
- [ ] **Instagram** `@_reelrasam` → Settings → *Account type and tools* →
      **Switch to professional account → Business** (Creator also works).
- [ ] **YouTube** `@reel_rasam` (Phase 2 — reserved).
- [ ] **Facebook Page — paused.** Not needed for this path. See section F when you want it.
- [ ] **Warm-up (recommended):** for the first ~7 days, set profile photo + bio and post
      3–5 times manually from the app. Brand-new accounts that start with API posts are more
      likely to be flagged.

## B. Meta developer account + app

- [ ] Go to <https://developers.facebook.com> and register as a developer. As far as I know
      this still needs a Facebook login (a personal profile — *not* a Page). If your personal
      Facebook login works, you're fine even though Page creation failed. If the site offers
      another login option, that works too. If you can't log in at all, stop and tell Claude.
- [ ] **My Apps → Create app**, name `content-arena`. Pick the use case for **Instagram**
      (manage messages and content / "Instagram API"). App type *Business* if asked.
- [ ] Keep the app in **Development mode**. You'll only post to your own account, so no
      App Review or business verification is needed.
- [ ] Note the **Instagram App ID / App Secret** shown on the Instagram product page.
      Secret → password manager only.

## C. Connect @_reelrasam and get a token

- [ ] App dashboard → **App roles → Roles → Add people → Instagram Tester** → enter `_reelrasam`.
- [ ] In the Instagram app (logged in as @_reelrasam): Settings → *Website permissions /
      Apps and websites* → **Tester invites** → **Accept**.
- [ ] App dashboard → **Instagram → API setup with Instagram login** → *Generate access tokens* →
      **Add account** → log in as @_reelrasam → allow the permissions
      `instagram_business_basic` and `instagram_business_content_publish`.
- [ ] Copy the generated token **straight into `.env`** as `IG_ACCESS_TOKEN` (never into chat).
      It should be a **long-lived token (60 days)** — the dashboard shows its expiry. If it says
      ~1 hour, tell Claude and we'll add the exchange step.

## D. Instagram user ID + checks

Run these yourself in a terminal (they print only your account ID/username, not the token):
```bash
source .env   # or set the variables in your shell
curl -s -H "Authorization: Bearer $IG_ACCESS_TOKEN" \
  "https://graph.instagram.com/v23.0/me?fields=user_id,username"
```
- [ ] `username` should be `_reelrasam`. Put `user_id` into `.env` as `IG_USER_ID`.
- [ ] Quota check: `.../v23.0/$IG_USER_ID/content_publishing_limit` — limit is 100 API posts per
      24 h (carousels count as one); we post 2 per day.

## E. Store the values and keep the token alive

| Name | Where |
|---|---|
| `IG_ACCESS_TOKEN`, `IG_USER_ID` | `.env` on your laptop |
| same names | GitHub → `content-arena` → Settings → Secrets and variables → Actions → **Secrets** |
| `GH_SECRETS_TOKEN` | Secret: a GitHub fine-grained token for **this repo only** with **Secrets: Read and write** (lets the refresh workflow save the new IG token) |
| `PUBLISH_ENABLED=true`, `GRAPH_API_VERSION` | GitHub → **Variables** (set `PUBLISH_ENABLED` only after a good manual test) |

The token lasts 60 days. It can be refreshed once it's at least 24 hours old:
- Laptop: `python -m content_arena refresh-ig-token` (updates `.env`, never prints the token).
- GitHub: `.github/workflows/refresh-ig-token.yml` refreshes on the 1st and 15th and saves the
  new token into the `IG_ACCESS_TOKEN` secret automatically.

First live test:
- [ ] `python -m content_arena publish` → dry run; shows which row would go out.
- [ ] Approve one row, run `python -m content_arena publish --live` once by hand, check the post.
- [ ] Then set `PUBLISH_ENABLED=true` to turn on the twice-daily schedule.

If the token leaks: Instagram → Settings → *Apps and websites* → remove `content-arena`, then redo C–E.

---

## F. Later: adding Facebook (when a Page can be created)

1. Create the Page "Reel Rasam" and link @_reelrasam to it (Page → Settings → Linked accounts).
2. In the app, add **Facebook Login for Business**. In Graph API Explorer get a user token with
   `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`,
   `pages_manage_posts` (+ `business_management` if the Page is in a business portfolio).
3. Access Token Debugger → **Extend Access Token** (long-lived user token, ~60 days) →
   Graph API Explorer `GET me/accounts?fields=id,name,access_token` → the Page's `access_token`
   is a Page token that **doesn't expire**; `id` is `META_PAGE_ID`.
   ([Long-lived tokens](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived))
4. `GET {META_PAGE_ID}?fields=instagram_business_account` → that id is `IG_USER_ID` for this mode.
5. Set `META_AUTH=facebook_login`, `PLATFORMS=instagram,facebook`, `META_PAGE_ID`,
   `META_PAGE_ACCESS_TOKEN` in `.env` and GitHub (secrets/variables).

### Facebook Page creation troubleshooting
- Try from a laptop browser at <https://www.facebook.com/pages/create> instead of the app.
- New or recently changed Facebook profiles are often limited for a few days — wait 24–48 h.
- Make sure the personal profile has a confirmed email/phone and 2FA on.
- Try a slightly different Page name ("Reel Rasam Telugu"); some names get silently blocked.
