from app.models.event import Event, normalize_event
from app.services.party_classifier import PartyClassifier


def test_party_by_category():
    clf = PartyClassifier(keywords=["party", "techno", "club"])
    event = Event(
        id=1,
        title="Some Concert",
        categories=[{"id": 1, "name": "Party", "slug": "party"}],  # type: ignore
    )
    # Fix: use proper Category objects via normalize path
    raw = {
        "id": 1,
        "title": "Some Concert",
        "start_date": "2026-09-05 22:00:00",
        "end_date": "2026-09-06 04:00:00",
        "timezone": "Europe/Zurich",
        "categories": [{"id": 1, "name": "Party", "slug": "party"}],
        "tags": [],
        "venue": None,
        "organizer": [],
    }
    event = normalize_event(raw)
    event = clf.classify(event)
    assert event.is_party is True
    assert event.party_score >= 0.25


def test_party_by_title_keyword():
    clf = PartyClassifier(keywords=["rave", "techno"])
    raw = {
        "id": 2,
        "title": "Rapid Rave x Herzrasen",
        "start_date": "2026-09-05 22:00:00",
        "timezone": "Europe/Zurich",
        "categories": [],
        "tags": [],
        "venue": None,
        "organizer": [],
    }
    event = normalize_event(raw)
    event = clf.classify(event)
    assert event.is_party is True
    assert event.party_score > 0


def test_non_party_low_score():
    clf = PartyClassifier(keywords=["party", "club", "techno"])
    raw = {
        "id": 3,
        "title": "Classical Piano Recital",
        "description": "An evening of Mozart and Bach",
        "start_date": "2026-09-05 19:00:00",
        "timezone": "Europe/Zurich",
        "categories": [{"id": 9, "name": "Klassik", "slug": "klassik"}],
        "tags": [],
        "venue": None,
        "organizer": [],
    }
    event = normalize_event(raw)
    event = clf.classify(event)
    assert event.is_party is False
    assert event.party_score < 0.25


def test_deterministic():
    clf = PartyClassifier()
    raw = {
        "id": 4,
        "title": "House Club Night",
        "start_date": "2026-09-05 22:00:00",
        "timezone": "Europe/Zurich",
        "categories": [],
        "tags": [{"id": 1, "name": "House", "slug": "house"}],
        "venue": None,
        "organizer": [],
    }
    e1 = clf.classify(normalize_event(raw))
    e2 = clf.classify(normalize_event(raw))
    assert e1.is_party == e2.is_party
    assert e1.party_score == e2.party_score
