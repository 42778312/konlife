from fastapi import APIRouter, HTTPException, Query

from app.core.cache import cache_get, cache_set, singleflight
from app.core.config import get_settings
from app.models.taxi import PlaceListResponse, TaxiQuoteResponse
from app.services.places import reverse_place, search_places
from app.services.ride_geo import in_ride_bbox
from app.services.routing import RouteNotFound, RouterUnavailable, driving_route
from app.services.taxi_fare import DISCLAIMER, estimate_fare_eur, is_night_tariff, tariff_label

router = APIRouter(tags=["taxi"])


@router.get(
    "/places/search",
    response_model=PlaceListResponse,
    summary="Konstanz place autocomplete",
)
async def places_search(
    q: str = Query(..., min_length=1, max_length=120),
    limit: int = Query(8, ge=1, le=12),
) -> PlaceListResponse:
    items = await search_places(q, limit=limit)
    return PlaceListResponse(items=items)


@router.get(
    "/places/reverse",
    response_model=PlaceListResponse,
    summary="Reverse geocode a Konstanz pickup",
)
async def places_reverse(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
) -> PlaceListResponse:
    if not in_ride_bbox(lat, lng):
        raise HTTPException(status_code=422, detail="Pickup is outside the Konstanz ride area")
    item = await reverse_place(lat, lng)
    return PlaceListResponse(items=[item] if item else [])


@router.get(
    "/taxi/quote",
    response_model=TaxiQuoteResponse,
    summary="Official Landkreis Konstanz taxi estimate",
)
async def taxi_quote(
    from_lat: float = Query(..., ge=-90, le=90),
    from_lng: float = Query(..., ge=-180, le=180),
    to_lat: float = Query(..., ge=-90, le=90),
    to_lng: float = Query(..., ge=-180, le=180),
) -> TaxiQuoteResponse:
    if not in_ride_bbox(from_lat, from_lng) or not in_ride_bbox(to_lat, to_lng):
        raise HTTPException(status_code=422, detail="Stay around Konstanz")
    if abs(from_lat - to_lat) < 1e-5 and abs(from_lng - to_lng) < 1e-5:
        raise HTTPException(status_code=400, detail="Pick a different drop-off")

    night = is_night_tariff()
    cache_key = (
        f"taxi:quote:{from_lat:.5f},{from_lng:.5f}:"
        f"{to_lat:.5f},{to_lng:.5f}:{'night' if night else 'day'}"
    )
    cached = await cache_get(cache_key)
    if isinstance(cached, dict):
        return TaxiQuoteResponse.model_validate(cached)

    async def _build() -> TaxiQuoteResponse:
        try:
            route = await driving_route(from_lng, from_lat, to_lng, to_lat)
        except RouteNotFound as exc:
            raise HTTPException(status_code=404, detail="No driving route for that trip") from exc
        except RouterUnavailable as exc:
            raise HTTPException(status_code=502, detail="Couldn’t find a drive") from exc

        quote = TaxiQuoteResponse(
            from_lat=from_lat,
            from_lng=from_lng,
            to_lat=to_lat,
            to_lng=to_lng,
            distance_m=int(round(route.distance_m)),
            duration_s=int(round(route.duration_s)),
            fare_eur=estimate_fare_eur(route.distance_m, night=night),
            tariff="night" if night else "day",
            tariff_label=tariff_label(night),
            path=route.path,
            disclaimer=DISCLAIMER,
        )
        settings = get_settings()
        await cache_set(cache_key, quote.model_dump(), ttl=settings.taxi_quote_cache_ttl)
        return quote

    return await singleflight(cache_key, _build)
