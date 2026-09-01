from app.models.venue import Venue, first_coord, normalize_venue, parse_coord
from app.services.geocode import build_venue_queries, expand_street, in_konstanz_bbox


def test_parse_coord_rejects_missing_and_zero():
    assert parse_coord(None) is None
    assert parse_coord("") is None
    assert parse_coord("  ") is None
    assert parse_coord(0) is None
    assert parse_coord("0") is None
    assert parse_coord("0.0") is None
    assert parse_coord("not-a-number") is None


def test_parse_coord_reads_numbers_and_strings():
    assert parse_coord(47.6602) == 47.6602
    assert parse_coord("9.1758") == 9.1758
    assert first_coord("", 0, "47.66") == 47.66


def test_normalize_venue_reads_geo_and_lat_aliases():
    from_geo = normalize_venue(
        {"id": 1, "venue": "K9", "geo_lat": "47.66", "geo_lng": "9.17"}
    )
    assert from_geo.latitude == 47.66
    assert from_geo.longitude == 9.17

    from_lat = normalize_venue(
        {"id": 2, "name": "Grey", "lat": 47.67, "lng": 9.15}
    )
    assert from_lat.latitude == 47.67
    assert from_lat.longitude == 9.15

    empty = normalize_venue(
        {"id": 3, "venue": "Stadt", "geo_lat": "", "geo_lng": ""}
    )
    assert empty.latitude is None
    assert empty.longitude is None


def test_expand_street_and_queries():
    assert "straße" in expand_street("Max-Stromeyerstr. 33")
    venue = Venue(
        id=360,
        name="Grey Konstanz",
        address="Max-Stromeyerstr. 33",
        city="Konstanz",
        zip="78467",
        country="Switzerland",
    )
    queries = build_venue_queries(venue)
    assert queries[0].startswith("Max-Stromeyerstr. 33")
    assert "Germany" in queries[0]
    assert any("Max-Stromeyerstraße" in query for query in queries)


def test_konstanz_bbox():
    assert in_konstanz_bbox(47.6599, 9.1715) is True
    assert in_konstanz_bbox(48.1, 11.5) is False
