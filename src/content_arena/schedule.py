"""Owner's posting plan (set 28 Oct 2026): two posts a day.

Slot 1 (every day):   comedy   — original animated TFI spoof reel
Slot 2 (rotating):    ott-weekly on Fridays;
                      tfi-fact every 3rd day (from FACT_ANCHOR), moved to the next day if it lands on a Friday;
                      quiz on every other day.
"""
from __future__ import annotations

from datetime import date, timedelta

from . import config

FRIDAY = 4
DEFAULT_FACT_ANCHOR = "2026-10-29"


def fact_anchor() -> date:
    return date.fromisoformat(config.get("FACT_ANCHOR", DEFAULT_FACT_ANCHOR))


def is_fact_day(day: date, anchor: date | None = None) -> bool:
    anchor = anchor or fact_anchor()
    if day.weekday() == FRIDAY or day < anchor:
        return False
    if (day - anchor).days % 3 == 0:
        return True
    yesterday = day - timedelta(days=1)  # fact slot bumped off a Friday lands on Saturday
    return yesterday.weekday() == FRIDAY and yesterday >= anchor and (yesterday - anchor).days % 3 == 0


def pillars_for(day: date, anchor: date | None = None) -> list[str]:
    if day.weekday() == FRIDAY:
        second = "ott-weekly"
    elif is_fact_day(day, anchor):
        second = "tfi-fact"
    else:
        second = "quiz"
    return ["comedy", second]


def plan(start: date, days: int = 7, anchor: date | None = None) -> list[tuple[date, list[str]]]:
    return [(start + timedelta(days=i), pillars_for(start + timedelta(days=i), anchor)) for i in range(days)]
