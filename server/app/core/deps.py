from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from app.clients.party_insider import get_shared_client
from app.core.config import get_settings
from app.core.logging import get_logger
from app.services.event_service import EventService
from app.services.venue_service import VenueService

logger = get_logger(__name__)


async def get_event_service() -> EventService:
    client = await get_shared_client()
    return EventService(client=client)


async def get_venue_service() -> VenueService:
    client = await get_shared_client()
    return VenueService(client=client)


async def warm_catalog() -> None:
    """Prefetch the same window the Expo app asks for so the first paint is cached."""
    settings = get_settings()
    if not settings.warm_on_startup:
        return
    tz = ZoneInfo(settings.timezone)
    start = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=56, hours=23, minutes=59, seconds=59)
    service = await get_event_service()
    try:
        result = await service.list_events(
            city=settings.default_city,
            status="all",
            party_only=False,
            from_date=start,
            to_date=end,
            page=1,
            per_page=settings.max_per_page,
        )
        logger.info("Warmed event catalog (%s items)", result.total)
    except Exception as exc:
        logger.warning("Catalog warmup failed: %s", exc)
