from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

import pytest

from app.models.event import normalize_event
from app.services.event_service import EventService


TZ = ZoneInfo("Europe/Zurich")


def _event_raw(start: str, end: str | None = None, **kwargs):
    base = {
        "id": 1,
        "title": "Test",
        "start_date": start,
        "end_date": end,
        "timezone": "Europe/Zurich",
        "all_day": False,
        "categories": [],
        "tags": [],
        "venue": None,
        "organizer": [],
    }
    base.update(kwargs)
    return base


def test_current_event_detection():
    service = EventService()
    now = datetime(2026, 9, 5, 23, 0, tzinfo=TZ)
    raw = _event_raw("2026-09-05 22:00:00", "2026-09-06 04:00:00")
    event = normalize_event(raw)
    event = service.classify_temporal(event, now=now)
    assert event.is_current is True
    assert event.is_upcoming is False
    assert event.status == "current"


def test_upcoming_event_detection():
    service = EventService()
    now = datetime(2026, 9, 5, 12, 0, tzinfo=TZ)
    raw = _event_raw("2026-09-05 22:00:00", "2026-09-06 04:00:00")
    event = normalize_event(raw)
    event = service.classify_temporal(event, now=now)
    assert event.is_upcoming is True
    assert event.is_current is False
    assert event.status == "upcoming"


def test_past_event():
    service = EventService()
    now = datetime(2026, 9, 6, 12, 0, tzinfo=TZ)
    raw = _event_raw("2026-09-05 22:00:00", "2026-09-06 04:00:00")
    event = normalize_event(raw)
    event = service.classify_temporal(event, now=now)
    assert event.is_past is True
    assert event.status == "past"


def test_missing_end_date_before_start():
    service = EventService()
    now = datetime(2026, 9, 5, 12, 0, tzinfo=TZ)
    raw = _event_raw("2026-09-05 22:00:00", None)
    event = normalize_event(raw)
    event = service.classify_temporal(event, now=now)
    assert event.is_upcoming is True


def test_missing_end_date_after_start():
    service = EventService()
    now = datetime(2026, 9, 6, 12, 0, tzinfo=TZ)
    raw = _event_raw("2026-09-05 22:00:00", None)
    event = normalize_event(raw)
    event = service.classify_temporal(event, now=now)
    assert event.is_past is True


def test_cross_midnight():
    service = EventService()
    now = datetime(2026, 9, 6, 2, 0, tzinfo=TZ)
    raw = _event_raw("2026-09-05 22:00:00", "2026-09-06 04:00:00")
    event = normalize_event(raw)
    event = service.classify_temporal(event, now=now)
    assert event.is_current is True


def test_timezone_aware_comparison():
    service = EventService()
    # now in Zurich
    now = datetime(2026, 9, 5, 23, 0, tzinfo=TZ)
    raw = _event_raw("2026-09-05 22:00:00", "2026-09-06 04:00:00")
    event = normalize_event(raw)
    event = service.classify_temporal(event, now=now)
    assert event.start_date.tzinfo is not None
    assert event.end_date.tzinfo is not None
