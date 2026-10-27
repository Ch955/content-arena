"""Offline tests: no network, no accounts. Run: python -m unittest discover -s tests"""
import json
import shutil
import sys
import tempfile
import unittest
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "src"))

from content_arena import pipeline, publish, render  # noqa: E402
from content_arena.table import CsvTable, TransitionError  # noqa: E402

SAMPLE = ROOT / "content" / "2026-10-27-gross-net-share-baahubali2"


class TmpCase(unittest.TestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.table = CsvTable(self.tmp / "content.csv")

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def copy_sample(self, with_images=True) -> Path:
        post = self.tmp / SAMPLE.name
        shutil.copytree(SAMPLE, post, ignore=shutil.ignore_patterns("rendered"))
        if with_images:
            (post / "rendered").mkdir()
            for i in range(1, 7):
                (post / "rendered" / f"{i:02d}.jpg").write_bytes(b"jpg%d" % i)
        return post


def fake_upload(slug, paths):
    return [f"https://cdn.example/{slug}/{p.name}" for p in paths]


class TableTests(TmpCase):
    def test_transitions_enforced(self):
        self.table.insert({"id": "a", "status": "idea"})
        with self.assertRaises(TransitionError):
            self.table.update("a", status="approved")  # can't skip review
        self.table.update("a", status="drafted")
        self.table.update("a", status="rendered")
        self.table.update("a", status="approved")
        with self.assertRaises(TransitionError):
            self.table.update("a", status="posted")  # must pass through 'posting'

    def test_posted_is_terminal(self):
        self.table.insert({"id": "a", "status": "posted"})
        with self.assertRaises(TransitionError):
            self.table.update("a", status="approved")

    def test_unicode_roundtrip(self):
        self.table.insert({"id": "t", "status": "idea", "caption": "గ్రాస్ vs నెట్ 🎬"})
        self.assertEqual(CsvTable(self.table.path).get("t")["caption"], "గ్రాస్ vs నెట్ 🎬")


class PipelineTests(TmpCase):
    def test_parse_caption_splits_hashtags(self):
        body, tags = pipeline.parse_caption("Hello\n\nWorld\n\n#a #b")
        self.assertEqual(body, "Hello\n\nWorld")
        self.assertEqual(tags, ["#a", "#b"])

    def test_sample_caption_is_valid(self):
        body, tags = pipeline.parse_caption((SAMPLE / "caption.md").read_text(encoding="utf-8"))
        pipeline.validate_caption(body, tags)
        self.assertIn("#reelrasam", tags)

    def test_sync_creates_rendered_rows_for_both_platforms(self):
        rows = pipeline.sync(self.copy_sample(), self.table, upload=fake_upload)
        self.assertEqual({r["platform"] for r in rows}, {"instagram", "facebook"})
        self.assertTrue(all(r["status"] == "rendered" for r in rows))
        self.assertEqual(len(rows[0]["media_urls"].split()), 6)
        self.assertIn("IBTimes", rows[0]["facts_to_verify"])

    def test_sync_without_upload_stops_at_drafted(self):
        rows = pipeline.sync(self.copy_sample(), self.table, upload=None)
        self.assertTrue(all(r["status"] == "drafted" for r in rows))

    def test_sync_never_touches_approved_rows(self):
        post = self.copy_sample()
        pipeline.sync(post, self.table, upload=fake_upload)
        row_id = f"{post.name}-instagram"
        self.table.update(row_id, status="approved")
        before = self.table.get(row_id)
        (post / "caption.md").write_text("changed\n\n#x", encoding="utf-8")
        pipeline.sync(post, self.table, upload=fake_upload)
        after = self.table.get(row_id)
        self.assertEqual(after["status"], "approved")
        self.assertEqual(after["caption"], before["caption"])

    def test_sync_reworks_rejected_rows(self):
        post = self.copy_sample()
        pipeline.sync(post, self.table, upload=fake_upload)
        row_id = f"{post.name}-facebook"
        self.table.update(row_id, status="rejected")
        pipeline.sync(post, self.table, upload=fake_upload)
        self.assertEqual(self.table.get(row_id)["status"], "rendered")


class FakeResponse:
    def __init__(self, body, status=200):
        self.body, self.status_code = body, status
        self.content = json.dumps(body).encode()

    def json(self):
        return self.body


class FakeSession:
    """Records Graph API calls and returns canned responses."""

    def __init__(self, fail_on=None):
        self.headers, self.calls, self.n, self.fail_on = {}, [], 0, fail_on

    def request(self, method, url, data=None, params=None, timeout=None):
        self.calls.append((method, url.split("/", 4)[-1], data or params))
        if self.fail_on and self.fail_on in url:
            return FakeResponse({"error": {"message": "boom", "code": 100}}, 400)
        if method == "GET":
            return FakeResponse({"status_code": "FINISHED"})
        self.n += 1
        return FakeResponse({"id": f"id{self.n}"})


class PublishTests(TmpCase):
    def approved_rows(self):
        post = self.copy_sample()
        pipeline.sync(post, self.table, upload=fake_upload)
        for platform in ("instagram", "facebook"):
            self.table.update(f"{post.name}-{platform}", status="approved")
        return post

    def client(self, **kw):
        return publish.MetaClient("TOKEN", "v23.0", session=FakeSession(**kw), poll_interval=0)

    def test_dry_run_changes_nothing(self):
        self.approved_rows()
        client = self.client()
        publish.run(self.table, live=False, client=client, log=lambda *_: None)
        self.assertEqual(client.http.calls, [])
        self.assertEqual(len(self.table.by_status("approved")), 2)

    def test_live_posts_exactly_one_row(self):
        self.approved_rows()
        import os
        os.environ.update(IG_USER_ID="IG1", META_PAGE_ID="PG1")
        client = self.client()
        done = publish.run(self.table, live=True, client=client, log=lambda *_: None)
        self.assertEqual(done["status"], "posted")
        self.assertEqual(len(self.table.by_status("posted")), 1)
        self.assertEqual(len(self.table.by_status("approved")), 1)
        self.assertEqual(client.http.headers["Authorization"], "Bearer TOKEN")
        self.assertTrue(all("TOKEN" not in str(c) for c in client.http.calls))

    def test_instagram_carousel_call_sequence(self):
        client = self.client()
        media_id = client.instagram_carousel("IG1", ["https://x/1.jpg", "https://x/2.jpg"], "cap")
        posts = [(c[1], c[2]) for c in client.http.calls if c[0] == "POST"]
        self.assertEqual(posts[0][1]["is_carousel_item"], "true")
        self.assertEqual(posts[2][1]["media_type"], "CAROUSEL")
        self.assertEqual(posts[2][1]["children"], "id1,id2")
        self.assertEqual(posts[3], ("IG1/media_publish", {"creation_id": "id3"}))
        self.assertEqual(media_id, "id4")

    def test_facebook_multi_photo_attaches_unpublished_photos(self):
        client = self.client()
        client.facebook_multi_photo("PG1", ["https://x/1.jpg", "https://x/2.jpg"], "msg")
        photos = [c for c in client.http.calls if c[1].endswith("/photos")]
        self.assertTrue(all(c[2]["published"] == "false" for c in photos))
        feed = client.http.calls[-1][2]
        self.assertEqual(json.loads(feed["attached_media[1]"]), {"media_fbid": "id2"})

    def test_failure_marks_row_failed(self):
        self.approved_rows()
        import os
        os.environ.update(IG_USER_ID="IG1", META_PAGE_ID="PG1")
        with self.assertRaises(publish.PublishError):
            publish.run(self.table, live=True, client=self.client(fail_on="/media"), log=lambda *_: None)
        self.assertEqual(len(self.table.by_status("failed")) + len(self.table.by_status("posted")), 1)

    def test_future_schedule_is_skipped(self):
        self.approved_rows()
        later = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
        for r in self.table.by_status("approved"):
            self.table.update(r["id"], scheduled_for=later)
        self.assertIsNone(publish.pick_next(self.table))

    def test_naive_schedule_means_ist(self):
        self.assertEqual(publish.parse_when("2026-10-31 19:30").utcoffset(), timedelta(hours=5, minutes=30))


class RenderTests(unittest.TestCase):
    def test_sample_builds_one_page_per_slide(self):
        post = render.load_post(SAMPLE)
        pages = render.build_html(post, render.load_brand())
        self.assertEqual(len(pages), len(post["slides"]))
        self.assertIn("₹203.65 CR", pages[3])
        self.assertIn("IBTimes", pages[0])

    def test_rejects_unknown_slide_type(self):
        tmp = Path(tempfile.mkdtemp())
        (tmp / "slides.json").write_text(json.dumps({"slides": [{"type": "x"}, {"type": "cta"}]}))
        with self.assertRaises(ValueError):
            render.load_post(tmp)
        shutil.rmtree(tmp)


if __name__ == "__main__":
    unittest.main()
