import math
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class VenueBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    zip: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    url: Optional[str] = None


class Venue(VenueBase):
    """Normalized venue returned by our API."""

    pass


class VenueListResponse(BaseModel):
    items: list[Venue]
    page: int = 1
    per_page: int = 20
    total: int = 0
    has_next: bool = False


def parse_coord(value: Any) -> Optional[float]:
    """Read a map coordinate; empty strings and 0 (TEC missing) are absent."""
    if value is None or value is False:
        return None
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return None
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    if not math.isfinite(number) or number == 0:
        return None
    return number


def first_coord(*values: Any) -> Optional[float]:
    for value in values:
        parsed = parse_coord(value)
        if parsed is not None:
            return parsed
    return None


def has_coords(venue: Venue) -> bool:
    return venue.latitude is not None and venue.longitude is not None


def normalize_venue(raw: dict[str, Any]) -> Venue:
    """Convert a Party-Insider venue payload into our model."""
    name = raw.get("venue") or raw.get("name") or ""

    return Venue(
        id=int(raw["id"]),
        name=name,
        slug=raw.get("slug"),
        address=raw.get("address"),
        city=raw.get("city"),
        country=raw.get("country"),
        zip=raw.get("zip"),
        phone=raw.get("phone"),
        website=raw.get("website"),
        latitude=first_coord(raw.get("geo_lat"), raw.get("latitude"), raw.get("lat")),
        longitude=first_coord(raw.get("geo_lng"), raw.get("longitude"), raw.get("lng")),
        description=_strip_html(raw.get("description")),
        url=raw.get("url"),
    )


def _strip_html(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    # Lightweight strip – keep readable text
    import re
    text = re.sub(r"<[^>]+>", " ", value)
    text = re.sub(r"\s+", " ", text).strip()
    return text or None
