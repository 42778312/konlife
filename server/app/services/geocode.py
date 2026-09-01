"""Geocode venue addresses when Party-Insider omits geo_lat/geo_lng."""

from __future__ import annotations

import asyncio
import re
import time
from typing import Optional

import httpx

from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.core.logging import get_logger
from app.models.venue import Venue

logger = get_logger(__name__)

NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"
USER_AGENT = "Konlife/1.0 (Konstanz nightlife map)"

# Konstanz + immediate lakeside (Kreuzlingen). Reject wild Nominatim misses.
MIN_LAT, MAX_LAT = 47.62, 47.72
MIN_LNG, MAX_LNG = 9.10, 9.25

_WHITESPACE = re.compile(r"\s+")
_DASHES = re.compile(r"[–—−]")
_STR_DOT = re.compile(r"(?i)str\.(?=\s|$|,)")
_STR_TAIL = re.compile(r"(?i)(?<=[A-Za-zÄÖÜäöüß])str(?=\s|$|,)")


def in_konstanz_bbox(lat: float, lng: float) -> bool:
    return MIN_LAT <= lat <= MAX_LAT and MIN_LNG <= lng <= MAX_LNG


def _clean_address(value: str) -> str:
    text = _DASHES.sub("-", value)
    text = _WHITESPACE.sub(" ", text).strip(" ,")
    return text


def expand_street(address: str) -> str:
    expanded = _STR_DOT.sub("straße", address)
    return _STR_TAIL.sub("straße", expanded)


def build_venue_queries(venue: Venue) -> list[str]:
    """Most-specific Nominatim queries first; country forced to Germany for Konstanz."""
    address = _clean_address(venue.address or "")
    zipc = (venue.zip or "").strip()
    city = _clean_address(venue.city or "") or "Konstanz"
    name = _clean_address(venue.name or "")
    queries: list[str] = []

    def add(query: str) -> None:
        compact = _WHITESPACE.sub(" ", query).strip(" ,")
        if compact and compact not in queries:
            queries.append(compact)

    if address:
        add(f"{address}, {zipc} {city}, Germany")
        expanded = expand_street(address)
        if expanded != address:
            add(f"{expanded}, {zipc} {city}, Germany")
        if "konstanz" not in city.lower():
            add(f"{address}, {zipc} Konstanz, Germany")
        add(f"{address}, Konstanz, Germany")
        if expanded != address:
            add(f"{expanded}, Konstanz, Germany")

    if name and address:
        add(f"{name}, {address}, Konstanz, Germany")
    elif name and zipc:
        add(f"{name}, {zipc} Konstanz, Germany")

    return queries


class Geocoder:
    def __init__(self, min_interval: Optional[float] = None) -> None:
        settings = get_settings()
        self.min_interval = (
            settings.geocode_min_interval if min_interval is None else min_interval
        )
        self._lock = asyncio.Lock()
        self._last_request = 0.0
        self._client: Optional[httpx.AsyncClient] = None

    async def _client_obj(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=httpx.Timeout(get_settings().http_timeout),
                headers={
                    "Accept": "application/json",
                    "User-Agent": USER_AGENT,
                },
                follow_redirects=True,
            )
        return self._client

    async def close(self) -> None:
        if self._client is not None and not self._client.is_closed:
            await self._client.aclose()
        self._client = None

    async def geocode_venue(self, venue: Venue) -> Optional[tuple[float, float]]:
        for query in build_venue_queries(venue):
            hit = await self.geocode_query(query)
            if hit is not None:
                return hit
        return None

    async def geocode_query(self, query: str) -> Optional[tuple[float, float]]:
        cache_key = f"geocode:{query.lower()}"
        cached = await cache_get(cache_key)
        if isinstance(cached, dict) and "lat" in cached:
            lat, lng = cached.get("lat"), cached.get("lng")
            if lat is None or lng is None:
                return None
            return float(lat), float(lng)

        hit = await self._nominatim(query)
        settings = get_settings()
        if hit is None:
            await cache_set(
                cache_key,
                {"lat": None, "lng": None},
                ttl=settings.geocode_negative_ttl,
                stale_ttl=settings.geocode_negative_ttl,
            )
            return None

        await cache_set(
            cache_key,
            {"lat": hit[0], "lng": hit[1]},
            ttl=settings.geocode_cache_ttl,
            stale_ttl=settings.geocode_cache_stale_ttl,
        )
        return hit

    async def _nominatim(self, query: str) -> Optional[tuple[float, float]]:
        async with self._lock:
            wait = self._last_request + self.min_interval - time.monotonic()
            if wait > 0:
                await asyncio.sleep(wait)
            self._last_request = time.monotonic()
            try:
                client = await self._client_obj()
                response = await client.get(
                    NOMINATIM_URL,
                    params={
                        "q": query,
                        "format": "json",
                        "limit": "1",
                        "countrycodes": "de,ch",
                    },
                )
                response.raise_for_status()
                payload = response.json()
            except Exception as exc:
                logger.warning("Nominatim failed for %r: %s", query, exc)
                return None

        if not isinstance(payload, list) or not payload:
            return None
        row = payload[0]
        try:
            lat = float(row["lat"])
            lng = float(row["lon"])
        except (KeyError, TypeError, ValueError):
            return None
        if not in_konstanz_bbox(lat, lng):
            logger.info("Nominatim hit outside Konstanz for %r: %s,%s", query, lat, lng)
            return None
        return lat, lng


_shared_geocoder: Optional[Geocoder] = None
_geocoder_lock = asyncio.Lock()


async def get_shared_geocoder() -> Geocoder:
    global _shared_geocoder
    if _shared_geocoder is None:
        async with _geocoder_lock:
            if _shared_geocoder is None:
                _shared_geocoder = Geocoder()
    return _shared_geocoder
