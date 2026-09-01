from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.clients.party_insider import PartyInsiderTimeout, PartyInsiderUnavailable
from app.core.deps import get_venue_service
from app.models.venue import VenueListResponse
from app.services.venue_service import VenueService

router = APIRouter(prefix="/venues", tags=["venues"])


@router.get(
    "",
    response_model=VenueListResponse,
    summary="Konstanz venues",
)
async def list_venues(
    search: Optional[str] = Query(None),
    upcoming_only: bool = Query(False, description="Only venues with upcoming events"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    service: VenueService = Depends(get_venue_service),
) -> VenueListResponse:
    try:
        venues = await service.get_konstanz_venues(
            search=search, upcoming_only=upcoming_only
        )
    except PartyInsiderTimeout as exc:
        raise HTTPException(status_code=504, detail="Upstream request timed out") from exc
    except PartyInsiderUnavailable as exc:
        raise HTTPException(status_code=502, detail="Party-Insider unavailable") from exc

    total = len(venues)
    start = (page - 1) * per_page
    end = start + per_page
    items = venues[start:end]
    return VenueListResponse(
        items=items,
        page=page,
        per_page=per_page,
        total=total,
        has_next=end < total,
    )
