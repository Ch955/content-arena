"""Owner's posting plan: two posts a day.

From 9 Nov 2026 (NEW_PLAN_START) the channel moved off cinema:
Slot 1 (every day):   podupu       — a Telugu riddle / story-riddle; the answer is revealed in the same reel
Slot 2 (rotating):    book-story   — Mon/Wed/Fri/Sun: a story from a great book (Betala Kathalu, Panchatantra,
                                     Tenali Rama, big ideas from good non-fiction), ending with a question
                      life-lesson  — Tue/Thu/Sat: a premium, sourced life lesson with an A-or-B question

Before that date (28 Oct – 8 Nov 2026): comedy daily + ott-weekly Fridays / tfi-fact every 3rd day / quiz.
"""
from __future__ import annotations

from datetime import date, timedelta

from . import config

FRIDAY = 4
DEFAULT_FACT_ANCHOR = "2026-10-29"
NEW_PLAN_START = date(2026, 11, 9)
LESSON_DAYS = {1, 3, 5}  # Tue, Thu, Sat


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
    if day >= NEW_PLAN_START:
        return ["podupu", "life-lesson" if day.weekday() in LESSON_DAYS else "book-story"]
    if day.weekday() == FRIDAY:
        second = "ott-weekly"
    elif is_fact_day(day, anchor):
        second = "tfi-fact"
    else:
        second = "quiz"
    return ["comedy", second]


def plan(start: date, days: int = 7, anchor: date | None = None) -> list[tuple[date, list[str]]]:
    return [(start + timedelta(days=i), pillars_for(start + timedelta(days=i), anchor)) for i in range(days)]
