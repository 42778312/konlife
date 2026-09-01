"""
Async HTTP client for the Party-Insider (The Events Calendar) REST API.
Uses /tribe/events/v1 endpoints (public, stable).
"""

from __future__ import annotations

import asyncio
from typing import Any, Optional

import httpx

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class PartyInsiderError(Exception):
    """Base client error."""

    def __init__(self, message: str, status_code: Optional[int] = None):
        super().__init__(message)
        self.status_code = status_code


class PartyInsiderTimeout(PartyInsiderError):
    pass


class PartyInsiderUnavailable(PartyInsiderError):
    pass


class PartyInsiderNotFound(PartyInsiderError):
    pass


class PartyInsiderClient:
    """Reusable async client with retries, pagination and structured errors."""

    def __init__(self) -> None:
        settings = get_settings()
        self.base_url = settings.party_insider_base_url.rstrip("/")
        self.timeout = settings.http_timeout
        self.max_retries = settings.http_max_retries
        self.backoff_base = settings.http_backoff_base
        self.max_pages = settings.max_pages
        self.upstream_per_page = settings.upstream_per_page
        self._client: Optional[httpx.AsyncClient] = None

    async def __aenter__(self) -> "PartyInsiderClient":
        await self._ensure_client()
        return self

    async def __aexit__(self, *args: Any) -> None:
        await self.close()

    async def _ensure_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                base_url=self.base_url,
                timeout=httpx.Timeout(self.timeout),
                limits=httpx.Limits(max_keepalive_connections=10, max_connections=20),
                headers={
                    "Accept": "application/json",
                    "User-Agent": "PartyInsiderKonstanzAPI/1.0",
                },
                follow_redirects=True,
            )
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()
            self._client = None

    async def _request(
        self,
        method: str,
        path: str,
        params: Optional[dict[str, Any]] = None,
    ) -> dict[str, Any]:
        client = await self._ensure_client()
        last_exc: Optional[Exception] = None

        for attempt in range(self.max_retries + 1):
            try:
                response = await client.request(method, path, params=params)

                if response.status_code == 404:
                    raise PartyInsiderNotFound(
                        f"Resource not found: {path}", status_code=404
                    )

                if response.status_code >= 500:
                    # Retryable
                    if attempt < self.max_retries:
                        delay = self.backoff_base * (2**attempt)
                        logger.warning(
                            "Upstream %s %s returned %s – retry in %.1fs",
                            method,
                            path,
                            response.status_code,
                            delay,
                        )
                        await asyncio.sleep(delay)
                        continue
                    raise PartyInsiderUnavailable(
                        f"Upstream error {response.status_code}",
                        status_code=response.status_code,
                    )

                if response.status_code >= 400:
                    raise PartyInsiderError(
                        f"Upstream client error {response.status_code}: {response.text[:200]}",
                        status_code=response.status_code,
                    )

                try:
                    return response.json()
                except ValueError as exc:
                    raise PartyInsiderError(f"Invalid JSON from upstream: {exc}") from exc

            except httpx.TimeoutException as exc:
                last_exc = exc
                if attempt < self.max_retries:
                    delay = self.backoff_base * (2**attempt)
                    logger.warning("Timeout on %s %s – retry in %.1fs", method, path, delay)
                    await asyncio.sleep(delay)
                    continue
                raise PartyInsiderTimeout("Upstream request timed out") from exc

            except httpx.TransportError as exc:
                last_exc = exc
                if attempt < self.max_retries:
                    delay = self.backoff_base * (2**attempt)
                    logger.warning("Transport error on %s %s – retry in %.1fs", method, path, delay)
                    await asyncio.sleep(delay)
                    continue
                raise PartyInsiderUnavailable("Upstream unavailable") from exc

        raise PartyInsiderUnavailable("Upstream request failed") from last_exc

    # ── Venues ──────────────────────────────────────────────────────────────

    async def get_venues_page(
        self,
        page: int = 1,
        per_page: int = 50,
        search: Optional[str] = None,
        only_with_upcoming: bool = False,
        status: str = "publish",
    ) -> dict[str, Any]:
        params: dict[str, Any] = {
            "page": page,
            "per_page": per_page,
            "status": status,
        }
        if search:
            params["search"] = search
        if only_with_upcoming:
            params["only_with_upcoming"] = "true"
        return await self._request("GET", "/tribe/events/v1/venues", params=params)

    async def get_all_venues(
        self,
        search: Optional[str] = None,
        only_with_upcoming: bool = False,
    ) -> list[dict[str, Any]]:
        all_venues: list[dict[str, Any]] = []
        page = 1
        while page <= self.max_pages:
            data = await self.get_venues_page(
                page=page,
                per_page=self.upstream_per_page,
                search=search,
                only_with_upcoming=only_with_upcoming,
            )
            venues = data.get("venues") or []
            all_venues.extend(venues)
            total_pages = data.get("total_pages") or 1
            if page >= total_pages or not venues:
                break
            page += 1
        return all_venues

    # ── Events ──────────────────────────────────────────────────────────────

    async def get_events_page(
        self,
        page: int = 1,
        per_page: int = 50,
        *,
        status: str = "publish",
        venue: Optional[list[int] | int] = None,
        organizer: Optional[list[int] | int] = None,
        categories: Optional[list[int] | int] = None,
        tags: Optional[list[int] | int] = None,
        search: Optional[str] = None,
        starts_after: Optional[str] = None,
        starts_before: Optional[str] = None,
        ends_after: Optional[str] = None,
        ends_before: Optional[str] = None,
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
    ) -> dict[str, Any]:
        params: dict[str, Any] = {
            "page": page,
            "per_page": per_page,
            "status": status,
        }

        def _add_multi(key: str, value: Any) -> None:
            if value is None:
                return
            if isinstance(value, list):
                # TEC accepts repeated query params or comma-separated depending on version.
                # Using comma-separated IDs is widely supported.
                params[key] = ",".join(str(v) for v in value)
            else:
                params[key] = value

        _add_multi("venue", venue)
        _add_multi("organizer", organizer)
        _add_multi("categories", categories)
        _add_multi("tags", tags)

        if search:
            params["search"] = search
        if starts_after:
            params["starts_after"] = starts_after
        if starts_before:
            params["starts_before"] = starts_before
        if ends_after:
            params["ends_after"] = ends_after
        if ends_before:
            params["ends_before"] = ends_before
        if start_date:
            params["start_date"] = start_date
        if end_date:
            params["end_date"] = end_date

        return await self._request("GET", "/tribe/events/v1/events", params=params)

    async def get_events(
        self,
        *,
        max_items: Optional[int] = None,
        **filters: Any,
    ) -> list[dict[str, Any]]:
        """Fetch multiple pages until exhausted or max_items reached."""
        all_events: list[dict[str, Any]] = []
        page = 1
        while page <= self.max_pages:
            data = await self.get_events_page(
                page=page,
                per_page=self.upstream_per_page,
                **filters,
            )
            events = data.get("events") or []
            all_events.extend(events)
            if max_items and len(all_events) >= max_items:
                return all_events[:max_items]
            total_pages = data.get("total_pages") or 1
            if page >= total_pages or not events:
                break
            page += 1
        return all_events

    async def get_event(self, event_id: int) -> dict[str, Any]:
        data = await self._request("GET", f"/tribe/events/v1/events/{event_id}")
        # Single event responses may be the object itself or wrapped
        if "id" in data:
            return data
        events = data.get("events")
        if isinstance(events, list) and events:
            return events[0]
        raise PartyInsiderNotFound(f"Event {event_id} not found", status_code=404)

    # ── Categories / Tags / Organizers ──────────────────────────────────────

    async def get_categories(self) -> list[dict[str, Any]]:
        data = await self._request(
            "GET",
            "/tribe/events/v1/categories",
            params={"per_page": 100},
        )
        return data.get("categories") or data.get("items") or []

    async def get_tags(self) -> list[dict[str, Any]]:
        data = await self._request(
            "GET",
            "/tribe/events/v1/tags",
            params={"per_page": 100},
        )
        return data.get("tags") or data.get("items") or []

    async def get_organizers_page(
        self,
        page: int = 1,
        per_page: int = 50,
    ) -> dict[str, Any]:
        return await self._request(
            "GET",
            "/tribe/events/v1/organizers",
            params={"page": page, "per_page": per_page, "status": "publish"},
        )

    async def get_all_organizers(self) -> list[dict[str, Any]]:
        all_orgs: list[dict[str, Any]] = []
        page = 1
        while page <= self.max_pages:
            data = await self.get_organizers_page(page=page, per_page=self.upstream_per_page)
            orgs = data.get("organizers") or []
            all_orgs.extend(orgs)
            total_pages = data.get("total_pages") or 1
            if page >= total_pages or not orgs:
                break
            page += 1
        return all_orgs


_shared_client: Optional[PartyInsiderClient] = None
_shared_lock = asyncio.Lock()


async def get_shared_client() -> PartyInsiderClient:
    """Process-wide httpx client so TCP/TLS to Party-Insider is reused."""
    global _shared_client
    if _shared_client is not None and _shared_client._client is not None and not _shared_client._client.is_closed:
        return _shared_client
    async with _shared_lock:
        if _shared_client is None or _shared_client._client is None or _shared_client._client.is_closed:
            _shared_client = PartyInsiderClient()
            await _shared_client._ensure_client()
        return _shared_client


async def close_shared_client() -> None:
    global _shared_client
    if _shared_client is not None:
        await _shared_client.close()
        _shared_client = None
