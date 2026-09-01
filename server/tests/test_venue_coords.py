import pytest

from app.models.venue import Venue
from app.services.event_service import EventService
from app.services.venue_service import VenueService


class FakeGeocoder:
    def __init__(self, mapping: dict[int, tuple[float, float]]):
        self.mapping = mapping
        self.calls: list[str] = []

    async def geocode_venue(self, venue: Venue):
        self.calls.append(venue.name)
        return self.mapping.get(venue.id)


@pytest.mark.asyncio
async def test_fill_coordinates_geocodes_address_only(monkeypatch):
    geocoder = FakeGeocoder({2644: (47.6599, 9.1715)})

    async def fake_shared():
        return geocoder

    monkeypatch.setattr("app.services.venue_service.get_shared_geocoder", fake_shared)

    k9 = Venue(id=2644, name="K9 Konstanz", address="Hieronymusgasse 3", city="Konstanz")
    city = Venue(id=12236, name="Stadt Konstanz", city="Konstanz")
    already = Venue(
        id=13070,
        name="Fähre",
        address="Hafen",
        city="Konstanz",
        latitude=47.66,
        longitude=9.18,
    )
    service = VenueService()
    await service.fill_coordinates([k9, city, already, k9])

    assert k9.latitude == 47.6599
    assert k9.longitude == 9.1715
    assert city.latitude is None
    assert already.latitude == 47.66
    assert geocoder.calls == ["K9 Konstanz"]


@pytest.mark.asyncio
async def test_list_events_attaches_geocoded_coords(monkeypatch):
    geocoder = FakeGeocoder({2644: (47.6599, 9.1715)})

    async def fake_shared():
        return geocoder

    monkeypatch.setattr("app.services.venue_service.get_shared_geocoder", fake_shared)

    async def fake_events(**kwargs):
        return [
            {
                "id": 10,
                "title": "Club Night",
                "start_date": "2026-09-10 22:00:00",
                "end_date": "2026-09-11 04:00:00",
                "timezone": "Europe/Zurich",
                "categories": [{"id": 1, "name": "Party", "slug": "party"}],
                "tags": [],
                "venue": {
                    "id": 2644,
                    "venue": "K9 Konstanz",
                    "address": "Hieronymusgasse 3",
                    "city": "Konstanz",
                    "zip": "78462",
                },
                "organizer": [],
            }
        ]

    async def venue_ids():
        return [2644]

    service = EventService()
    monkeypatch.setattr(service.venue_service, "get_konstanz_venue_ids", venue_ids)
    monkeypatch.setattr(service.client, "get_events", fake_events)

    result = await service.list_events(status="all", party_only=False)
    assert result.total == 1
    assert result.items[0].venue is not None
    assert result.items[0].venue.latitude == 47.6599
    assert result.items[0].venue.longitude == 9.1715
