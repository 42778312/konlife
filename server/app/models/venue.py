from typing import Any, Optional

from pydantic import BaseModel, Field, ConfigDict


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


def normalize_venue(raw: dict[str, Any]) -> Venue:
    """Convert a Party-Insider venue payload into our model."""
    name = raw.get("venue") or raw.get("name") or ""
    geo_lat = raw.get("geo_lat")
    geo_lng = raw.get("geo_lng")

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
        latitude=float(geo_lat) if geo_lat is not None else None,
        longitude=float(geo_lng) if geo_lng is not None else None,
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
