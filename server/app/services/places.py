"""Photon autocomplete / reverse, biased to the Konstanz ride bbox."""

from __future__ import annotations

from typing import Any, Optional

import httpx

from app.core.cache import cache_get, cache_set, singleflight
from app.core.config import get_settings
from app.core.logging import get_logger
from app.models.taxi import PlaceItem
from app.services.ride_geo import KONSTANZ_LAT, KONSTANZ_LNG, MAX_LAT, MAX_LNG, MIN_LAT, MIN_LNG, in_ride_bbox

logger = get_logger(__name__)

USER_AGENT = "Konlife/1.0 (Konstanz nightlife map)"


def _client() -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=settings.photon_base_url.rstrip("/"),
        timeout=httpx.Timeout(settings.http_timeout),
        headers={"Accept": "application/json", "User-Agent": USER_AGENT},
        follow_redirects=True,
    )


def _label(props: dict[str, Any]) -> str:
    name = str(props.get("name") or "").strip()
    if name:
        return name
    street = str(props.get("street") or "").strip()
    number = str(props.get("housenumber") or "").strip()
    if street and number:
        return f"{street} {number}"
    if street:
        return street
    return str(props.get("city") or props.get("locality") or "Place").strip() or "Place"


def _detail(props: dict[str, Any]) -> Optional[str]:
    parts = [
        str(props.get("street") or "").strip(),
        str(props.get("postcode") or "").strip(),
        str(props.get("city") or props.get("locality") or "").strip(),
    ]
    name = str(props.get("name") or "").strip()
    if name and parts[0] and parts[0].lower() != name.lower():
        text = ", ".join(p for p in parts if p)
    else:
        text = ", ".join(p for p in parts[1:] if p) or str(props.get("country") or "").strip()
    return text or None


def _parse_feature(feature: dict[str, Any]) -> Optional[PlaceItem]:
    geometry = feature.get("geometry") or {}
    coords = geometry.get("coordinates")
    props = feature.get("properties") or {}
    if not isinstance(coords, list) or len(coords) < 2:
        return None
    try:
        lng = float(coords[0])
        lat = float(coords[1])
    except (TypeError, ValueError):
        return None
    if not in_ride_bbox(lat, lng):
        return None
    osm_id = props.get("osm_id")
    osm_type = props.get("osm_type") or "place"
    place_id = f"{osm_type}:{osm_id}" if osm_id is not None else f"{lat:.5f},{lng:.5f}"
    return PlaceItem(id=str(place_id), label=_label(props), detail=_detail(props), lat=lat, lng=lng)


def _dedupe(items: list[PlaceItem]) -> list[PlaceItem]:
    seen: set[str] = set()
    unique: list[PlaceItem] = []
    for item in items:
        key = f"{item.lat:.4f}|{item.lng:.4f}|{item.label.lower()}"
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)
    return unique


async def search_places(query: str, limit: int = 8) -> list[PlaceItem]:
    q = " ".join(query.split())
    if len(q) < 2:
        return []
    cap = max(1, min(limit, 12))
    cache_key = f"places:search:{q.lower()}:{cap}"
    cached = await cache_get(cache_key)
    if isinstance(cached, list):
        return [PlaceItem.model_validate(row) for row in cached]

    async def _fetch() -> list[PlaceItem]:
        settings = get_settings()
        try:
            async with _client() as client:
                response = await client.get(
                    "/api",
                    params={
                        "q": q,
                        "lat": KONSTANZ_LAT,
                        "lon": KONSTANZ_LNG,
                        "limit": cap * 2,
                        "lang": "de",
                        "bbox": f"{MIN_LNG},{MIN_LAT},{MAX_LNG},{MAX_LAT}",
                    },
                )
                response.raise_for_status()
                payload = response.json()
        except Exception as exc:
            logger.warning("Photon search failed for %r: %s", q, exc)
            return []

        features = payload.get("features") if isinstance(payload, dict) else None
        if not isinstance(features, list):
            return []
        items = _dedupe([item for row in features if (item := _parse_feature(row))])
        trimmed = items[:cap]
        await cache_set(cache_key, [item.model_dump() for item in trimmed], ttl=settings.places_cache_ttl)
        return trimmed

    return await singleflight(cache_key, _fetch)


async def reverse_place(lat: float, lng: float) -> Optional[PlaceItem]:
    if not in_ride_bbox(lat, lng):
        return None
    cache_key = f"places:reverse:{lat:.5f},{lng:.5f}"
    cached = await cache_get(cache_key)
    if isinstance(cached, dict):
        return PlaceItem.model_validate(cached)

    async def _fetch() -> Optional[PlaceItem]:
        settings = get_settings()
        try:
            async with _client() as client:
                response = await client.get("/reverse", params={"lat": lat, "lon": lng, "lang": "de"})
                response.raise_for_status()
                payload = response.json()
        except Exception as exc:
            logger.warning("Photon reverse failed for %s,%s: %s", lat, lng, exc)
            return None

        features = payload.get("features") if isinstance(payload, dict) else None
        if not isinstance(features, list) or not features:
            fallback = PlaceItem(id=f"{lat:.5f},{lng:.5f}", label="Current location", lat=lat, lng=lng)
            await cache_set(cache_key, fallback.model_dump(), ttl=settings.places_cache_ttl)
            return fallback
        item = _parse_feature(features[0])
        if item is None:
            item = PlaceItem(id=f"{lat:.5f},{lng:.5f}", label="Current location", lat=lat, lng=lng)
        await cache_set(cache_key, item.model_dump(), ttl=settings.places_cache_ttl)
        return item

    return await singleflight(cache_key, _fetch)
