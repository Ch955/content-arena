"""Owner's posting plan: two posts a day.

From 9 Nov 2026 (NEW_PLAN_START) the channel moved off cinema:
Slot 1 (every day):   podupu       — a Telugu riddle / story-riddle; the answer is revealed in the same reel
Slot 2 (rotating):    book-story   — Mon/Wed/Fri/Sun: a story from a great book (Betala Kathalu, Panchatantra,
                                     Tenali Rama, big ideas from good non-fiction), ending with a question
                      life-lesson  — Tue/Thu/Sat: a premium, sourced life lesson with an A-or-B question

From 13 Nov 2026 the owner switched to ONE entertainment reel a day (ONE_A_DAY_START, ROTATION below: what-if →
moral-dilemma → modern-dilemma → twist-story, repeating; no fact videos). The two-slot plan below was never used:
From 13 Nov 2026 (STORY_PLAN_START, owner: adult storylines, not small-children stories) the two daily slots are:
Slot 1 (07:30): what-if (Mon/Wed/Fri/Sun) or moral-dilemma (Tue/Thu/Sat) — short, comment-driving
Slot 2 (18:30): micro-doc (Mon/Wed/Fri) or modern-dilemma (Tue/Thu/Sat/Sun)

Before that date (28 Oct – 8 Nov 2026): comedy daily + ott-weekly Fridays / tfi-fact every 3rd day / quiz.
"""
from __future__ import annotations

from datetime import date, timedelta

from . import config

FRIDAY = 4
DEFAULT_FACT_ANCHOR = "2026-10-29"
NEW_PLAN_START = date(2026, 11, 9)
LESSON_DAYS = {1, 3, 5}  # Tue, Thu, Sat
STORY_PLAN_START = date(2026, 11, 13)
DILEMMA_DAYS = {1, 3, 5}  # Tue, Thu, Sat: moral-dilemma + modern-dilemma
# Series weeks (owner, 12 Nov 2026): one story told over 6 reels, Mon–Sat in the 18:30 slot; each episode answers its
# own question, the big mystery resolves in episode 6. Add a week's Monday here to schedule a series.
SERIES_WEEKS: set[date] = set()   # paused (owner, 12 Nov 2026: one reel a day); add a Monday to run a series week
# One entertainment reel a day from 13 Nov 2026 (owner, 12 Nov: "one video per day is more than enough… only
# entertainment, no fact videos"): the four types repeat in this order. Festivals/special days add a reel on request.
ONE_A_DAY_START = date(2026, 11, 13)
ROTATION = ["what-if", "moral-dilemma", "modern-dilemma", "twist-story"]


def series_episode(day: date) -> int | None:
    """1–6 if `day` is a series day (Mon–Sat of a series week), else None."""
    monday = day - timedelta(days=day.weekday())
    return day.weekday() + 1 if monday in SERIES_WEEKS and day.weekday() < 6 else None


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
    if day >= ONE_A_DAY_START:
        if series_episode(day):
            return ["series"]
        return [ROTATION[(day - ONE_A_DAY_START).days % len(ROTATION)]]
    if day >= STORY_PLAN_START:
        wd = day.weekday()
        if series_episode(day):
            return ["moral-dilemma" if wd in DILEMMA_DAYS else "what-if", "series"]
        if wd in DILEMMA_DAYS:
            return ["moral-dilemma", "modern-dilemma"]
        return ["what-if", "modern-dilemma" if wd == 6 else "micro-doc"]
    if day >= NEW_PLAN_START:
        return ["podupu", "life-lesson" if day.weekday() in LESSON_DAYS else "book-story"]
    if day.weekday() == FRIDAY:
        second = "ott-weekly"
    elif is_fact_day(day, anchor):
        second = "tfi-fact"
    else:
        second = "quiz"
    return ["comedy", second]


# Owner, 11 Nov 2026: a different art style per reel (tools/anim2d/skins.js), not only flat 2D. The two reels of
# a day never share a style. The Editor may swap to a style that suits the script better.
STYLES = ["neon", "clay", "paper", "pixel", "flat"]
STYLE_START = date(2026, 11, 12)


def style_for(day: date, slot: int) -> str:
    """Default art style for slot 0 (riddle) or 1 (story/lesson) on `day`."""
    return STYLES[((day - STYLE_START).days * 2 + slot) % len(STYLES)]


def plan(start: date, days: int = 7, anchor: date | None = None) -> list[tuple[date, list[str]]]:
    return [(start + timedelta(days=i), pillars_for(start + timedelta(days=i), anchor)) for i in range(days)]
