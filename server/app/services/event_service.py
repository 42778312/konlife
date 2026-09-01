"""Business logic for event discovery, status classification and pagination."""

from __future__ import annotations

import asyncio
from datetime import datetime, timedelta, timezone
from typing import Any, Literal, Optional
from zoneinfo import ZoneInfo

from app.clients.party_insider import (
    PartyInsiderClient,
    PartyInsiderError,
    PartyInsiderNotFound,
)
from app.core.cache import cache_get, cache_get_entry, cache_set, singleflight, spawn_refresh
from app.core.config import get_settings
from app.core.logging import get_logger
from app.models.event import Event, EventListResponse, normalize_event
from app.services.party_classifier import PartyClassifier
from app.services.venue_service import VenueService

logger = get_logger(__name__)

EventStatusFilter = Literal["current", "upcoming", "all"]


class EventService:
    def __init__(
        self,
        client: Optional[PartyInsiderClient] = None,
        venue_service: Optional[VenueService] = None,
        classifier: Optional[PartyClassifier] = None,
    ) -> None:
        self.client = client or PartyInsiderClient()
        self.venue_service = venue_service or VenueService(self.client)
        self.classifier = classifier or PartyClassifier()
        self.settings = get_settings()
        self.tz = ZoneInfo(self.settings.timezone)

    def _now(self) -> datetime:
        return datetime.now(self.tz)

    def _aware(self, dt: Optional[datetime], event_tz: str) -> Optional[datetime]:
        if dt is None:
            return None
        if dt.tzinfo is not None:
            return dt.astimezone(self.tz)
        # Assume local event timezone from payload
        try:
            local_tz = ZoneInfo(event_tz or self.settings.timezone)
        except Exception:
            local_tz = self.tz
        return dt.replace(tzinfo=local_tz).astimezone(self.tz)

    def classify_temporal(self, event: Event, now: Optional[datetime] = None) -> Event:
        now = now or self._now()
        start = self._aware(event.start_date, event.timezone)
        end = self._aware(event.end_date, event.timezone)

        event.start_date = start
        event.end_date = end

        if start is None:
            event.status = "unknown"
            event.is_current = False
            event.is_upcoming = False
            event.is_past = False
            return event

        if end is not None and start <= now < end:
            event.status = "current"
            event.is_current = True
            event.is_upcoming = False
            event.is_past = False
        elif start > now:
            event.status = "upcoming"
            event.is_current = False
            event.is_upcoming = True
            event.is_past = False
        else:
            # end is None or now >= end
            if end is None:
                # Missing end_date: treat as current only at the exact start instant window
                # of one minute; otherwise past if start is before now.
                if start <= now < start + timedelta(minutes=1):
                    event.status = "current"
                    event.is_current = True
                    event.is_upcoming = False
                    event.is_past = False
                elif start > now:
                    event.status = "upcoming"
                    event.is_current = False
                    event.is_upcoming = True
                    event.is_past = False
                else:
                    event.status = "past"
                    event.is_current = False
                    event.is_upcoming = False
                    event.is_past = True
            else:
                event.status = "past"
                event.is_current = False
                event.is_upcoming = False
                event.is_past = True

        return event

    async def _fetch_raw_events_for_venues(
        self,
        venue_ids: list[int],
        *,
        starts_after: Optional[str] = None,
        starts_before: Optional[str] = None,
        ends_after: Optional[str] = None,
        search: Optional[str] = None,
        venue_id: Optional[int] = None,
        organizer_id: Optional[int] = None,
    ) -> list[dict[str, Any]]:
        if venue_id is not None:
            target_ids = [venue_id] if venue_id in venue_ids or not venue_ids else [venue_id]
        else:
            target_ids = venue_ids

        if not target_ids:
            return []

        # TEC accepts multiple venue IDs as comma-separated in many versions.
        # Fetch in one request first; fall back to concurrent batches if needed.
        filters: dict[str, Any] = {
            "status": "publish",
            "venue": target_ids,
        }
        if starts_after:
            filters["starts_after"] = starts_after
        if starts_before:
            filters["starts_before"] = starts_before
        if ends_after:
            filters["ends_after"] = ends_after
        if search:
            filters["search"] = search
        if organizer_id:
            filters["organizer"] = organizer_id

        try:
            events = await self.client.get_events(**filters)
            return events
        except PartyInsiderError as exc:
            logger.warning(
                "Bulk venue query failed (%s) – fetching the date window and filtering locally",
                exc,
            )

        # One paginated date-window fetch is cheaper than N per-venue round trips.
        date_filters = {k: v for k, v in filters.items() if k != "venue"}
        try:
            events = await self.client.get_events(**date_filters)
        except PartyInsiderError:
            return []
        allowed = set(target_ids)

        def _venue_id(raw: dict[str, Any]) -> Optional[int]:
            venue = raw.get("venue")
            if isinstance(venue, dict) and venue.get("id"):
                return int(venue["id"])
            if isinstance(venue, list) and venue and isinstance(venue[0], dict) and venue[0].get("id"):
                return int(venue[0]["id"])
            return None

        return [raw for raw in events if _venue_id(raw) in allowed]

    def _dedupe_and_sort(self, events: list[Event]) -> list[Event]:
        by_id: dict[int, Event] = {}
        for e in events:
            by_id[e.id] = e
        return sorted(
            by_id.values(),
            key=lambda e: (
                e.start_date or datetime.max.replace(tzinfo=timezone.utc),
                e.id,
            ),
        )

    def _apply_status_filter(
        self,
        events: list[Event],
        status: EventStatusFilter,
    ) -> list[Event]:
        if status == "current":
            return [e for e in events if e.is_current]
        if status == "upcoming":
            return [e for e in events if e.is_upcoming]
        # all = current + upcoming (exclude pure past)
        return [e for e in events if e.is_current or e.is_upcoming]

    def _paginate(
        self,
        items: list[Event],
        page: int,
        per_page: int,
    ) -> EventListResponse:
        total = len(items)
        start = (page - 1) * per_page
        end = start + per_page
        slice_ = items[start:end]
        return EventListResponse(
            items=slice_,
            page=page,
            per_page=per_page,
            total=total,
            has_next=end < total,
        )

    async def list_events(
        self,
        *,
        city: str = "Konstanz",
        status: EventStatusFilter = "all",
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        category: Optional[str] = None,
        tag: Optional[str] = None,
        venue_id: Optional[int] = None,
        organizer_id: Optional[int] = None,
        search: Optional[str] = None,
        party_only: bool = True,
        page: int = 1,
        per_page: int = 20,
        days: Optional[int] = None,
    ) -> EventListResponse:
        settings = self.settings
        per_page = max(1, min(per_page, settings.max_per_page))
        page = max(1, page)

        now = self._now()

        # Build date window for upstream query (reduce payload)
        starts_after: Optional[str] = None
        starts_before: Optional[str] = None
        ends_after: Optional[str] = None

        if status == "current":
            # Events that might still be running: started in last 7 days, end after now
            starts_after = (now - timedelta(days=7)).strftime("%Y-%m-%d %H:%M:%S")
            ends_after = now.strftime("%Y-%m-%d %H:%M:%S")
        elif status == "upcoming":
            horizon = days if days is not None else 30
            starts_after = now.strftime("%Y-%m-%d %H:%M:%S")
            starts_before = (now + timedelta(days=horizon)).strftime("%Y-%m-%d %H:%M:%S")
        else:
            starts_after = (now - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S")
            if days:
                starts_before = (now + timedelta(days=days)).strftime("%Y-%m-%d %H:%M:%S")
            else:
                starts_before = (now + timedelta(days=90)).strftime("%Y-%m-%d %H:%M:%S")

        if from_date:
            if from_date.tzinfo is None:
                from_date = from_date.replace(tzinfo=self.tz)
            starts_after = from_date.astimezone(self.tz).strftime("%Y-%m-%d %H:%M:%S")
        if to_date:
            if to_date.tzinfo is None:
                to_date = to_date.replace(tzinfo=self.tz)
            starts_before = to_date.astimezone(self.tz).strftime("%Y-%m-%d %H:%M:%S")

        cache_key = (
            f"events:{city}:{status}:{self._key_dt(from_date)}:{self._key_dt(to_date)}:"
            f"{category or ''}:{tag or ''}:{venue_id}:{organizer_id}:{search or ''}:"
            f"{party_only}:{days}"
        )
        cached = await cache_get_entry(cache_key)
        if cached is not None:
            payload, state = cached
            events = [Event.model_validate(e) for e in payload]
            if state == "stale":
                spawn_refresh(
                    cache_key,
                    lambda: self._load_list_events(
                        cache_key=cache_key,
                        city=city,
                        status=status,
                        starts_after=starts_after,
                        starts_before=starts_before,
                        ends_after=ends_after if status == "current" else None,
                        category=category,
                        tag=tag,
                        venue_id=venue_id,
                        organizer_id=organizer_id,
                        search=search,
                        party_only=party_only,
                    ),
                )
            logger.info("events cache %s key=%s items=%s", state.upper(), cache_key, len(events))
            return self._paginate(events, page, per_page)

        events = await singleflight(
            cache_key,
            lambda: self._load_list_events(
                cache_key=cache_key,
                city=city,
                status=status,
                starts_after=starts_after,
                starts_before=starts_before,
                ends_after=ends_after if status == "current" else None,
                category=category,
                tag=tag,
                venue_id=venue_id,
                organizer_id=organizer_id,
                search=search,
                party_only=party_only,
            ),
        )
        return self._paginate(events, page, per_page)

    def _key_dt(self, dt: Optional[datetime]) -> str:
        if dt is None:
            return ""
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=self.tz)
        return dt.astimezone(self.tz).strftime("%Y-%m-%d")

    async def _load_list_events(
        self,
        *,
        cache_key: str,
        city: str,
        status: EventStatusFilter,
        starts_after: Optional[str],
        starts_before: Optional[str],
        ends_after: Optional[str],
        category: Optional[str],
        tag: Optional[str],
        venue_id: Optional[int],
        organizer_id: Optional[int],
        search: Optional[str],
        party_only: bool,
    ) -> list[Event]:
        settings = self.settings
        now = self._now()
        t0 = asyncio.get_event_loop().time()

        if city.lower() != settings.default_city.lower():
            logger.info("City filter %s – using name-based venue match", city)

        venue_ids = await self.venue_service.get_konstanz_venue_ids()

        raw_events = await self._fetch_raw_events_for_venues(
            venue_ids,
            starts_after=starts_after,
            starts_before=starts_before,
            ends_after=ends_after,
            search=search,
            venue_id=venue_id,
            organizer_id=organizer_id,
        )

        events: list[Event] = []
        for raw in raw_events:
            event = normalize_event(raw)
            event = self.classify_temporal(event, now)
            event = self.classifier.classify(event)
            events.append(event)

        if category:
            cat_l = category.lower()
            events = [
                e
                for e in events
                if any(
                    cat_l in (c.name or "").lower() or cat_l == (c.slug or "").lower()
                    for c in e.categories
                )
            ]
        if tag:
            tag_l = tag.lower()
            events = [
                e
                for e in events
                if any(
                    tag_l in (t.name or "").lower() or tag_l == (t.slug or "").lower()
                    for t in e.tags
                )
            ]

        events = self._apply_status_filter(events, status)
        if party_only:
            events = [e for e in events if e.is_party]
        events = self._dedupe_and_sort(events)

        await cache_set(
            cache_key,
            [e.model_dump(mode="json") for e in events],
            settings.event_cache_ttl,
            settings.event_cache_stale_ttl,
        )
        elapsed_ms = (asyncio.get_event_loop().time() - t0) * 1000
        logger.info(
            "events cache MISS key=%s items=%s in %.0fms",
            cache_key,
            len(events),
            elapsed_ms,
        )
        return events

    async def get_current_events(
        self,
        *,
        party_only: bool = True,
        page: int = 1,
        per_page: int = 20,
    ) -> EventListResponse:
        return await self.list_events(
            status="current",
            party_only=party_only,
            page=page,
            per_page=per_page,
        )

    async def get_upcoming_events(
        self,
        *,
        days: int = 30,
        party_only: bool = True,
        page: int = 1,
        per_page: int = 20,
    ) -> EventListResponse:
        return await self.list_events(
            status="upcoming",
            days=days,
            party_only=party_only,
            page=page,
            per_page=per_page,
        )

    async def get_event(self, event_id: int) -> Event:
        cache_key = f"event:{event_id}"
        cached = await cache_get(cache_key)
        if cached is not None:
            return Event.model_validate(cached)

        try:
            raw = await self.client.get_event(event_id)
        except PartyInsiderNotFound:
            raise
        event = normalize_event(raw)
        event = self.classify_temporal(event)
        event = self.classifier.classify(event)

        await cache_set(
            cache_key,
            event.model_dump(mode="json"),
            self.settings.event_cache_ttl,
            self.settings.event_cache_stale_ttl,
        )
        return event
