from datetime import datetime
from zoneinfo import ZoneInfo
from unittest.mock import AsyncMock, patch

import pytest

from app.models.event import normalize_event
from app.services.event_service import EventService
from app.services.venue_service import is_konstanz_city


TZ = ZoneInfo("Europe/Zurich")


def test_konstanz_city_matching():
    assert is_konstanz_city("Konstanz") is True
    assert is_konstanz_city("konstanz") is True
    assert is_konstanz_city("KONSTANZ") is True
    assert is_konstanz_city("Konstanz-Fürstenberg") is True
    assert is_konstanz_city("Konstanz am Rhein") is True
    assert is_konstanz_city("Winterthur") is False
    assert is_konstanz_city("Zürich") is False
    assert is_konstanz_city(None) is False
    assert is_konstanz_city("") is False


def test_deduplication():
    service = EventService()
    raw = {
        "id": 10,
        "title": "Dup Party",
        "start_date": "2026-09-10 22:00:00",
        "end_date": "2026-09-11 04:00:00",
        "timezone": "Europe/Zurich",
        "categories": [{"id": 1, "name": "Party", "slug": "party"}],
        "tags": [],
        "venue": None,
        "organizer": [],
    }
    e1 = normalize_event(raw)
    e2 = normalize_event(raw)
    e1 = service.classify_temporal(e1, now=datetime(2026, 9, 1, tzinfo=TZ))
    e2 = service.classify_temporal(e2, now=datetime(2026, 9, 1, tzinfo=TZ))
    result = service._dedupe_and_sort([e1, e2])
    assert len(result) == 1
    assert result[0].id == 10


def test_pagination():
    service = EventService()
    events = []
    for i in range(25):
        raw = {
            "id": i + 1,
            "title": f"Event {i}",
            "start_date": f"2026-09-{10 + (i % 15):02d} 22:00:00",
            "timezone": "Europe/Zurich",
            "categories": [],
            "tags": [],
            "venue": None,
            "organizer": [],
        }
        e = normalize_event(raw)
        e = service.classify_temporal(e, now=datetime(2026, 9, 1, tzinfo=TZ))
        events.append(e)
    events = service._dedupe_and_sort(events)
    page1 = service._paginate(events, page=1, per_page=20)
    assert len(page1.items) == 20
    assert page1.total == 25
    assert page1.has_next is True
    page2 = service._paginate(events, page=2, per_page=20)
    assert len(page2.items) == 5
    assert page2.has_next is False


@pytest.mark.asyncio
async def test_list_events_empty(monkeypatch):
    service = EventService()

    async def empty_venues(*args, **kwargs):
        return []

    monkeypatch.setattr(service.venue_service, "get_konstanz_venue_ids", empty_venues)

    result = await service.list_events(status="upcoming", party_only=False)
    assert result.total == 0
    assert result.items == []


@pytest.mark.asyncio
async def test_get_event_not_found(monkeypatch):
    from app.clients.party_insider import PartyInsiderNotFound

    service = EventService()

    async def raise_404(event_id):
        raise PartyInsiderNotFound("not found", status_code=404)

    monkeypatch.setattr(service.client, "get_event", raise_404)

    with pytest.raises(PartyInsiderNotFound):
        await service.get_event(999999)


@pytest.mark.asyncio
async def test_venue_search_does_not_walk_full_catalog(monkeypatch):
    from app.services.venue_service import VenueService

    calls: list[str | None] = []

    async def fake_venues(search=None, only_with_upcoming=False):
        calls.append(search)
        return [
            {
                "id": 14728,
                "venue": "K9 Konstanz",
                "city": "Konstanz",
                "country": "Switzerland",
            }
        ]

    service = VenueService()
    monkeypatch.setattr(service.client, "get_all_venues", fake_venues)
    venues = await service.get_konstanz_venues()
    assert len(venues) == 1
    assert calls == ["Konstanz"]


@pytest.mark.asyncio
async def test_list_events_coalesces_and_caches(monkeypatch):
    import asyncio

    fetches = {"n": 0}

    async def slow_events(**kwargs):
        fetches["n"] += 1
        await asyncio.sleep(0.05)
        return [
            {
                "id": 10,
                "title": "Club Night",
                "start_date": "2026-09-10 22:00:00",
                "end_date": "2026-09-11 04:00:00",
                "timezone": "Europe/Zurich",
                "categories": [{"id": 1, "name": "Party", "slug": "party"}],
                "tags": [],
                "venue": {"id": 1, "venue": "K9", "city": "Konstanz"},
                "organizer": [],
            }
        ]

    async def venue_ids():
        return [1]

    service = EventService()
    monkeypatch.setattr(service.venue_service, "get_konstanz_venue_ids", venue_ids)
    monkeypatch.setattr(service.client, "get_events", slow_events)

    first, second = await asyncio.gather(
        service.list_events(status="all", party_only=False),
        service.list_events(status="all", party_only=False),
    )
    assert fetches["n"] == 1
    assert first.total == 1
    assert second.total == 1

    third = await service.list_events(status="all", party_only=False)
    assert fetches["n"] == 1
    assert third.items[0].id == 10

