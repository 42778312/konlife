from fastapi import APIRouter, HTTPException

from app.clients.party_insider import PartyInsiderTimeout, PartyInsiderUnavailable, get_shared_client
from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.models.tag import TagListResponse, normalize_tag

router = APIRouter(prefix="/tags", tags=["tags"])


@router.get("", response_model=TagListResponse, summary="Event tags")
async def list_tags() -> TagListResponse:
    settings = get_settings()
    cache_key = "tags:all"
    cached = await cache_get(cache_key)
    if cached is not None:
        return TagListResponse.model_validate(cached)

    client = await get_shared_client()
    try:
        raw = await client.get_tags()
    except PartyInsiderTimeout as exc:
        raise HTTPException(status_code=504, detail="Upstream request timed out") from exc
    except PartyInsiderUnavailable as exc:
        raise HTTPException(status_code=502, detail="Party-Insider unavailable") from exc

    items = [normalize_tag(t) for t in raw]
    response = TagListResponse(items=items, total=len(items))
    await cache_set(cache_key, response.model_dump(mode="json"), settings.tag_cache_ttl)
    return response
