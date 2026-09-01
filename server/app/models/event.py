from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.category import Category, normalize_category
from app.models.organizer import Organizer, normalize_organizer
from app.models.tag import Tag, normalize_tag
from app.models.venue import Venue, normalize_venue


class SourceInfo(BaseModel):
    name: str = "Party-Insider"
    url: str = "https://www.party-insider.com"


class Event(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    slug: Optional[str] = None
    description: Optional[str] = None
    excerpt: Optional[str] = None
    url: Optional[str] = None

    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    timezone: str = "Europe/Zurich"
    all_day: bool = False

    status: Literal["current", "upcoming", "past", "unknown"] = "unknown"
    is_current: bool = False
    is_upcoming: bool = False
    is_past: bool = False

    is_party: bool = False
    party_score: float = 0.0

    cost: Optional[str] = None
    website: Optional[str] = None
    image: Optional[str] = None

    venue: Optional[Venue] = None
    organizers: list[Organizer] = Field(default_factory=list)
    categories: list[Category] = Field(default_factory=list)
    tags: list[Tag] = Field(default_factory=list)

    featured: bool = False
    ticketed: bool = False
    is_virtual: bool = False

    source: SourceInfo = Field(default_factory=SourceInfo)


class EventListResponse(BaseModel):
    items: list[Event]
    page: int = 1
    per_page: int = 20
    total: int = 0
    has_next: bool = False


def _parse_dt(value: Any) -> Optional[datetime]:
    if value is None:
        return None
    if isinstance(value, datetime):
        return value
    if not isinstance(value, str) or not value.strip():
        return None
    # Party-Insider returns "YYYY-MM-DD HH:MM:SS" (local) or ISO
    text = value.strip().replace(" ", "T")
    try:
        # Prefer fromisoformat
        return datetime.fromisoformat(text)
    except ValueError:
        pass
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"):
        try:
            return datetime.strptime(value.strip(), fmt)
        except ValueError:
            continue
    return None


def _strip_html(value: Optional[str]) -> Optional[str]:
    if not value:
        return None
    import re
    import html

    text = html.unescape(value)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text or None


def normalize_event(raw: dict[str, Any]) -> Event:
    """Convert a Party-Insider event payload into our normalized model."""
    title = raw.get("title") or ""
    if isinstance(title, dict):
        title = title.get("rendered") or title.get("raw") or ""

    image = None
    img = raw.get("image")
    if isinstance(img, dict):
        image = img.get("url")
    elif isinstance(img, str):
        image = img

    venue_raw = raw.get("venue")
    venue = None
    if isinstance(venue_raw, dict) and venue_raw.get("id"):
        venue = normalize_venue(venue_raw)
    elif isinstance(venue_raw, list) and venue_raw:
        venue = normalize_venue(venue_raw[0])

    organizers: list[Organizer] = []
    org_raw = raw.get("organizer") or []
    if isinstance(org_raw, dict):
        org_raw = [org_raw]
    for o in org_raw:
        if isinstance(o, dict) and o.get("id"):
            organizers.append(normalize_organizer(o))

    categories = [
        normalize_category(c)
        for c in (raw.get("categories") or [])
        if isinstance(c, dict)
    ]
    tags = [
        normalize_tag(t)
        for t in (raw.get("tags") or [])
        if isinstance(t, dict)
    ]

    cost = raw.get("cost") or None
    if cost == "":
        cost = None

    return Event(
        id=int(raw["id"]),
        title=_strip_html(str(title)) or "",
        slug=raw.get("slug"),
        description=_strip_html(raw.get("description")),
        excerpt=_strip_html(raw.get("excerpt")) or None,
        url=raw.get("url"),
        start_date=_parse_dt(raw.get("start_date")),
        end_date=_parse_dt(raw.get("end_date")),
        timezone=raw.get("timezone") or "Europe/Zurich",
        all_day=bool(raw.get("all_day", False)),
        cost=cost,
        website=raw.get("website") or None,
        image=image,
        venue=venue,
        organizers=organizers,
        categories=categories,
        tags=tags,
        featured=bool(raw.get("featured", False)),
        ticketed=bool(raw.get("ticketed", False)),
        is_virtual=bool(raw.get("is_virtual", False)),
    )
