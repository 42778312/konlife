"""Driving route via public OSRM."""

from __future__ import annotations

from dataclasses import dataclass

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

USER_AGENT = "Konlife/1.0 (Konstanz nightlife map)"


class RouteNotFound(Exception):
    pass


class RouterUnavailable(Exception):
    pass


@dataclass(frozen=True)
class DrivingRoute:
    distance_m: float
    duration_s: float
    path: list[list[float]]


async def driving_route(from_lng: float, from_lat: float, to_lng: float, to_lat: float) -> DrivingRoute:
    settings = get_settings()
    coords = f"{from_lng},{from_lat};{to_lng},{to_lat}"
    url = f"{settings.osrm_base_url.rstrip('/')}/route/v1/driving/{coords}"
    try:
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(settings.http_timeout),
            headers={"Accept": "application/json", "User-Agent": USER_AGENT},
            follow_redirects=True,
        ) as client:
            response = await client.get(
                url,
                params={"overview": "full", "geometries": "geojson", "steps": "false"},
            )
            response.raise_for_status()
            payload = response.json()
    except Exception as exc:
        logger.warning("OSRM failed: %s", exc)
        raise RouterUnavailable("Driving router unavailable") from exc

    if not isinstance(payload, dict):
        raise RouterUnavailable("Driving router unavailable")
    if payload.get("code") != "Ok":
        raise RouteNotFound("No driving route")
    routes = payload.get("routes")
    if not isinstance(routes, list) or not routes:
        raise RouteNotFound("No driving route")
    row = routes[0]
    geometry = (row.get("geometry") or {}).get("coordinates")
    if not isinstance(geometry, list) or len(geometry) < 2:
        raise RouteNotFound("No driving route")
    path: list[list[float]] = []
    for pair in geometry:
        if not isinstance(pair, list) or len(pair) < 2:
            continue
        try:
            path.append([float(pair[0]), float(pair[1])])
        except (TypeError, ValueError):
            continue
    if len(path) < 2:
        raise RouteNotFound("No driving route")
    try:
        distance_m = float(row.get("distance") or 0)
        duration_s = float(row.get("duration") or 0)
    except (TypeError, ValueError):
        distance_m, duration_s = 0.0, 0.0
    return DrivingRoute(distance_m=distance_m, duration_s=duration_s, path=path)
