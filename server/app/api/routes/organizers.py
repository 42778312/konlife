from fastapi import APIRouter, HTTPException, Query

from app.clients.party_insider import PartyInsiderTimeout, PartyInsiderUnavailable, get_shared_client
from app.core.cache import cache_get, cache_set
from app.core.config import get_settings
from app.core.deps import get_event_service
from app.models.organizer import Organizer, OrganizerListResponse, normalize_organizer

router = APIRouter(prefix="/organizers", tags=["organizers"])


@router.get(
    "",
    response_model=OrganizerListResponse,
    summary="Organizers associated with Konstanz events",
)
async def list_organizers(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
) -> OrganizerListResponse:
    """
    Returns organizers that appear on current/upcoming Konstanz events.
    Falls back to the global organizer list if no events are available.
    """
    settings = get_settings()
    cache_key = "organizers:konstanz"
    cached = await cache_get(cache_key)
    if cached is not None:
        items = [Organizer.model_validate(o) for o in cached]
    else:
        # Collect from upcoming Konstanz events
        service = await get_event_service()
        try:
            result = await service.list_events(
                status="all", party_only=False, page=1, per_page=100, days=90
            )
        except (PartyInsiderTimeout, PartyInsiderUnavailable) as exc:
            if isinstance(exc, PartyInsiderTimeout):
                raise HTTPException(status_code=504, detail="Upstream request timed out") from exc
            raise HTTPException(status_code=502, detail="Party-Insider unavailable") from exc

        by_id: dict[int, Organizer] = {}
        for event in result.items:
            for org in event.organizers:
                by_id[org.id] = org

        if not by_id:
            client = await get_shared_client()
            raw = await client.get_all_organizers()
            for r in raw:
                org = normalize_organizer(r)
                by_id[org.id] = org

        items = sorted(by_id.values(), key=lambda o: o.name.lower())
        await cache_set(
            cache_key,
            [o.model_dump(mode="json") for o in items],
            settings.organizer_cache_ttl,
        )

    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    return OrganizerListResponse(
        items=items[start:end],
        page=page,
        per_page=per_page,
        total=total,
        has_next=end < total,
    )
