from fastapi import APIRouter, HTTPException

from app.clients.party_insider import PartyInsiderTimeout, PartyInsiderUnavailable, get_shared_client
from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.models.category import CategoryListResponse, normalize_category

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=CategoryListResponse, summary="Event categories")
async def list_categories() -> CategoryListResponse:
    settings = get_settings()
    cache_key = "categories:all"
    cached = await cache_get(cache_key)
    if cached is not None:
        return CategoryListResponse.model_validate(cached)

    client = await get_shared_client()
    try:
        raw = await client.get_categories()
    except PartyInsiderTimeout as exc:
        raise HTTPException(status_code=504, detail="Upstream request timed out") from exc
    except PartyInsiderUnavailable as exc:
        raise HTTPException(status_code=502, detail="Party-Insider unavailable") from exc

    items = [normalize_category(c) for c in raw]
    response = CategoryListResponse(items=items, total=len(items))
    await cache_set(cache_key, response.model_dump(mode="json"), settings.category_cache_ttl)
    return response
