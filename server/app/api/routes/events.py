from datetime import datetime
from typing import Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query

from app.clients.party_insider import (
    PartyInsiderNotFound,
    PartyInsiderTimeout,
    PartyInsiderUnavailable,
)
from app.core.deps import get_event_service
from app.models.event import Event, EventListResponse
from app.services.event_service import EventService

router = APIRouter(prefix="/events", tags=["events"])


def _handle_upstream(exc: Exception) -> None:
    if isinstance(exc, PartyInsiderTimeout):
        raise HTTPException(status_code=504, detail="Upstream request timed out") from exc
    if isinstance(exc, PartyInsiderUnavailable):
        raise HTTPException(status_code=502, detail="Party-Insider unavailable") from exc
    if isinstance(exc, PartyInsiderNotFound):
        raise HTTPException(status_code=404, detail="Event not found") from exc
    raise HTTPException(status_code=502, detail="Upstream error") from exc


@router.get(
    "",
    response_model=EventListResponse,
    summary="List Konstanz events",
    description=(
        "Returns current and/or upcoming events in Konstanz. "
        "Filtering is based on venue city, not free-text city search. "
        "By default only events classified as parties are returned."
    ),
)
async def list_events(
    city: str = Query("Konstanz", description="City filter (venue.city matching)"),
    status: Literal["current", "upcoming", "all"] = Query(
        "all", description="Temporal status filter"
    ),
    from_date: Optional[datetime] = Query(None, description="Earliest start (ISO-8601)"),
    to_date: Optional[datetime] = Query(None, description="Latest start (ISO-8601)"),
    category: Optional[str] = Query(None, description="Category name or slug"),
    tag: Optional[str] = Query(None, description="Tag name or slug"),
    venue_id: Optional[int] = Query(None, description="Restrict to a venue ID"),
    organizer_id: Optional[int] = Query(None, description="Restrict to an organizer ID"),
    search: Optional[str] = Query(None, description="Free-text search (upstream)"),
    party_only: bool = Query(True, description="Return only events classified as parties"),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    service: EventService = Depends(get_event_service),
) -> EventListResponse:
    if from_date and to_date and from_date > to_date:
        raise HTTPException(status_code=400, detail="from_date must be before to_date")

    try:
        return await service.list_events(
            city=city,
            status=status,
            from_date=from_date,
            to_date=to_date,
            category=category,
            tag=tag,
            venue_id=venue_id,
            organizer_id=organizer_id,
            search=search,
            party_only=party_only,
            page=page,
            per_page=per_page,
        )
    except (PartyInsiderTimeout, PartyInsiderUnavailable, PartyInsiderNotFound) as exc:
        _handle_upstream(exc)
    except Exception as exc:
        raise HTTPException(status_code=500, detail="Internal server error") from exc


@router.get(
    "/current",
    response_model=EventListResponse,
    summary="Currently happening parties in Konstanz",
)
async def current_events(
    party_only: bool = Query(True),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    service: EventService = Depends(get_event_service),
) -> EventListResponse:
    try:
        return await service.get_current_events(
            party_only=party_only, page=page, per_page=per_page
        )
    except (PartyInsiderTimeout, PartyInsiderUnavailable) as exc:
        _handle_upstream(exc)


@router.get(
    "/upcoming",
    response_model=EventListResponse,
    summary="Upcoming parties in Konstanz",
)
async def upcoming_events(
    days: int = Query(30, ge=1, le=365, description="Look-ahead window in days"),
    party_only: bool = Query(True),
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    service: EventService = Depends(get_event_service),
) -> EventListResponse:
    try:
        return await service.get_upcoming_events(
            days=days, party_only=party_only, page=page, per_page=per_page
        )
    except (PartyInsiderTimeout, PartyInsiderUnavailable) as exc:
        _handle_upstream(exc)


@router.get(
    "/{event_id}",
    response_model=Event,
    summary="Single event by ID",
)
async def get_event(
    event_id: int,
    service: EventService = Depends(get_event_service),
) -> Event:
    try:
        return await service.get_event(event_id)
    except (PartyInsiderTimeout, PartyInsiderUnavailable, PartyInsiderNotFound) as exc:
        _handle_upstream(exc)
