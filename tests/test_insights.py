"""Read-only Instagram dashboard: no network, a fake Graph client."""
import unittest
from datetime import date

from content_arena import insights
from content_arena.publish import PublishError


class FakeClient:
    def __init__(self, deny_insights=False):
        self.calls, self.deny = [], deny_insights

    def _call(self, method, path, **params):
        assert method == "GET", "insights must only read"
        self.calls.append((path, params))
        if path == "1":
            return {"username": "_reelrasam", "followers_count": 120, "follows_count": 3, "media_count": 40}
        if path == "1/insights":
            if self.deny:
                raise PublishError("Graph API 1/insights: Application does not have permission (code 10)")
            m = params["metric"]
            if params.get("metric_type") == "time_series":
                return {"data": [{"name": m, "values": [{"end_time": "2026-11-15T08:00:00+0000", "value": 4}]}]}
            if params.get("breakdown"):
                return {"data": [{"name": m, "total_value": {"breakdowns": [{"results": [
                    {"dimension_values": ["25-34"], "value": 60}, {"dimension_values": ["18-24"], "value": 30}]}]}}]}
            return {"data": [{"name": m, "total_value": {"value": 1000}}]}
        if path == "1/media":
            return {"data": [{"id": "9", "timestamp": "2026-11-16T04:50:00+0000", "media_product_type": "REELS",
                              "caption": "Twist | story\nline 2", "like_count": 5, "comments_count": 0}]}
        if path == "9/insights":
            return {"data": [{"name": "views", "values": [{"value": 163}]},
                             {"name": "ig_reels_avg_watch_time", "values": [{"value": 9100}]}]}
        raise AssertionError(path)


class InsightsTest(unittest.TestCase):
    def test_collects_and_renders(self):
        r = insights.collect(FakeClient(), "1", days=30, today=date(2026, 11, 16))
        self.assertEqual(r["profile"]["followers_count"], 120)
        self.assertEqual(r["account_totals"]["reach"], 1000)
        self.assertEqual(r["follower_demographics"]["age"], {"25-34": 60, "18-24": 30})
        self.assertEqual(r["media"][0]["views"], 163)
        self.assertEqual(r["errors"], {})
        md = insights.to_markdown(r)
        self.assertIn("@_reelrasam", md)
        self.assertIn("| 163 |", md)
        self.assertIn("Twist / story", md)          # '|' in captions can't break the table

    def test_missing_permission_is_reported_not_fatal(self):
        r = insights.collect(FakeClient(deny_insights=True), "1", today=date(2026, 11, 16))
        self.assertEqual(r["profile"]["username"], "_reelrasam")
        self.assertTrue(r["errors"])
        self.assertIn("instagram_business_manage_insights", r["hint"])
        self.assertIn("instagram_business_manage_insights", insights.to_markdown(r))


if __name__ == "__main__":
    unittest.main()
