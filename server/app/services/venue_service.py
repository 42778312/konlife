"""Venue discovery and Konstanz city matching."""

from __future__ import annotations

import re
import unicodedata
from typing import Optional

from app.clients.party_insider import PartyInsiderClient
from app.core.cache import cache_get_entry, cache_set, singleflight, spawn_refresh
from app.core.config import get_settings
from app.core.logging import get_logger
from app.models.venue import Venue, has_coords, normalize_venue
from app.services.geocode import get_shared_geocoder

logger = get_logger(__name__)


def _normalize_city(value: Optional[str]) -> str:
    if not value:
        return ""
    text = unicodedata.normalize("NFKC", value)
    text = text.lower().strip()
    text = re.sub(r"\s+", " ", text)
    return text


def is_konstanz_city(city: Optional[str], target: str = "konstanz") -> bool:
    """
    Match venue.city against Konstanz.

    Accepts:
      - exact "konstanz"
      - "konstanz-fürstenberg", "konstanz am rhein", etc. (starts with target)
    Rejects unrelated cities that merely contain the substring in the middle.
    """
    norm = _normalize_city(city)
    target = _normalize_city(target)
    if not norm or not target:
        return False
    if norm == target:
        return True
    # Prefix match with separator (hyphen, space, comma)
    if norm.startswith(target) and len(norm) > len(target):
        next_char = norm[len(target)]
        if next_char in {"-", " ", ",", "/", "("}:
            return True
    return False


class VenueService:
    def __init__(self, client: Optional[PartyInsiderClient] = None) -> None:
        self.client = client or PartyInsiderClient()
        self.settings = get_settings()

    async def get_konstanz_venues(
        self,
        *,
        search: Optional[str] = None,
        upcoming_only: bool = False,
        force_refresh: bool = False,
    ) -> list[Venue]:
        cache_key = f"venues:konstanz:{search or ''}:{upcoming_only}"
        if not force_refresh:
            cached = await cache_get_entry(cache_key)
            if cached is not None:
                payload, state = cached
                venues = [Venue.model_validate(v) for v in payload]
                if state == "stale":
                    spawn_refresh(
                        cache_key,
                        lambda: self._load_konstanz_venues(
                            cache_key, search=search, upcoming_only=upcoming_only
                        ),
                    )
                return venues

        return await singleflight(
            cache_key,
            lambda: self._load_konstanz_venues(
                cache_key, search=search, upcoming_only=upcoming_only
            ),
        )

    async def _load_konstanz_venues(
        self,
        cache_key: str,
        *,
        search: Optional[str],
        upcoming_only: bool,
    ) -> list[Venue]:
        raw_venues = await self.client.get_all_venues(
            search=search or self.settings.default_city,
            only_with_upcoming=upcoming_only,
        )

        matched: list[Venue] = []
        for raw in raw_venues:
            venue = normalize_venue(raw)
            if is_konstanz_city(venue.city, self.settings.default_city):
                matched.append(venue)
            else:
                name_norm = _normalize_city(venue.name)
                city_target = _normalize_city(self.settings.default_city)
                if city_target in name_norm and not venue.city:
                    matched.append(venue)

        # Full catalog is expensive (up to max_pages of every city). Only use it
        # when the Konstanz search returned nothing usable.
        if not search and not matched:
            extra = await self.client.get_all_venues(only_with_upcoming=upcoming_only)
            seen = {v.id for v in matched}
            for raw in extra:
                venue = normalize_venue(raw)
                if venue.id in seen:
                    continue
                if is_konstanz_city(venue.city, self.settings.default_city):
                    matched.append(venue)
                    seen.add(venue.id)

        by_id = {v.id: v for v in matched}
        result = sorted(by_id.values(), key=lambda v: v.name.lower())

        await cache_set(
            cache_key,
            [v.model_dump(mode="json") for v in result],
            self.settings.venue_cache_ttl,
            self.settings.venue_cache_stale_ttl,
        )
        logger.info("Found %d Konstanz venues", len(result))
        return result

    async def get_konstanz_venue_ids(self) -> list[int]:
        venues = await self.get_konstanz_venues()
        return [v.id for v in venues]

    async def fill_coordinates(self, venues: list[Venue]) -> None:
        """Attach lat/lng for venues that have an address but no upstream geo."""
        pending: dict[int, Venue] = {}
        for venue in venues:
            if has_coords(venue) or not (venue.address or "").strip():
                continue
            pending.setdefault(venue.id, venue)

        if not pending:
            return

        geocoder = await get_shared_geocoder()
        found: dict[int, tuple[float, float]] = {}
        for venue in pending.values():
            hit = await geocoder.geocode_venue(venue)
            if hit is not None:
                found[venue.id] = hit
                logger.info("Geocoded %s -> %s,%s", venue.name, hit[0], hit[1])

        if not found:
            return

        for venue in venues:
            pair = found.get(venue.id)
            if pair is None or has_coords(venue):
                continue
            venue.latitude, venue.longitude = pair
