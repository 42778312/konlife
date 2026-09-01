import pytest

from app.core.cache import MemoryCache
from app.services.party_classifier import PartyClassifier


@pytest.fixture(autouse=True)
def isolate_cache():
    from app.core import cache as cache_mod

    cache_mod._cache = MemoryCache()
    cache_mod._inflight.clear()
    yield
    cache_mod._cache = None
    cache_mod._inflight.clear()


@pytest.fixture
def memory_cache():
    return MemoryCache()


@pytest.fixture
def classifier():
    return PartyClassifier(
        keywords=["party", "club", "techno", "house", "rave", "dj", "nacht", "dance"]
    )


@pytest.fixture
def sample_venue_raw():
    return {
        "id": 14763,
        "venue": "King Schulz Konstanz",
        "slug": "king-schulz-konstanz",
        "address": "Neugasse 23",
        "city": "Konstanz",
        "country": "Germany",
        "zip": "78462",
        "geo_lat": 47.66,
        "geo_lng": 9.17,
    }


@pytest.fixture
def sample_event_raw(sample_venue_raw):
    return {
        "id": 15105,
        "title": "Techno Night – King Schulz",
        "slug": "techno-night-king-schulz",
        "description": "<p>Club night with live DJ</p>",
        "excerpt": "",
        "url": "https://www.party-insider.com/event/techno-night",
        "start_date": "2026-09-05 22:00:00",
        "end_date": "2026-09-06 04:00:00",
        "timezone": "Europe/Zurich",
        "all_day": False,
        "cost": "15€",
        "website": "",
        "image": {"url": "https://example.com/img.jpg"},
        "categories": [{"id": 1, "name": "Party", "slug": "party"}],
        "tags": [{"id": 2, "name": "Techno", "slug": "techno"}],
        "venue": sample_venue_raw,
        "organizer": [],
        "featured": False,
        "ticketed": False,
        "is_virtual": False,
        "status": "publish",
    }
