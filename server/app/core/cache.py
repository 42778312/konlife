"""
Cache abstraction: in-memory (dev), optional on-disk persistence, Redis (production).

Entries have a fresh TTL and a longer stale window so the API can answer instantly
while a background refresh runs (stale-while-revalidate).
"""

from __future__ import annotations

import asyncio
import hashlib
import json
import time
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Any, Awaitable, Callable, Literal, Optional

from app.core.config import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

CacheState = Literal["fresh", "stale"]
CacheHit = tuple[Any, CacheState]


def _default_stale_ttl(ttl: int) -> int:
    return max(ttl * 8, 3600)


class CacheBackend(ABC):
    @abstractmethod
    async def get(self, key: str) -> Optional[Any]:
        ...

    @abstractmethod
    async def get_entry(self, key: str) -> Optional[CacheHit]:
        ...

    @abstractmethod
    async def set(self, key: str, value: Any, ttl: int, stale_ttl: Optional[int] = None) -> None:
        ...

    @abstractmethod
    async def delete(self, key: str) -> None:
        ...

    @abstractmethod
    async def clear_prefix(self, prefix: str) -> None:
        ...

    @abstractmethod
    async def close(self) -> None:
        ...


class MemoryCache(CacheBackend):
    """Process-local TTL cache with stale-while-revalidate."""

    def __init__(self) -> None:
        self._store: dict[str, tuple[Any, float, float]] = {}
        self._lock = asyncio.Lock()

    async def get(self, key: str) -> Optional[Any]:
        hit = await self.get_entry(key)
        if hit is None or hit[1] != "fresh":
            return None
        return hit[0]

    async def get_entry(self, key: str) -> Optional[CacheHit]:
        async with self._lock:
            entry = self._store.get(key)
            if entry is None:
                return None
            value, fresh_until, stale_until = entry
            now = time.time()
            if now >= stale_until:
                del self._store[key]
                return None
            if now >= fresh_until:
                return value, "stale"
            return value, "fresh"

    async def set(self, key: str, value: Any, ttl: int, stale_ttl: Optional[int] = None) -> None:
        stale = stale_ttl if stale_ttl is not None else _default_stale_ttl(ttl)
        now = time.time()
        async with self._lock:
            self._store[key] = (value, now + ttl, now + max(ttl, stale))

    async def delete(self, key: str) -> None:
        async with self._lock:
            self._store.pop(key, None)

    async def clear_prefix(self, prefix: str) -> None:
        async with self._lock:
            keys = [k for k in self._store if k.startswith(prefix)]
            for k in keys:
                del self._store[k]

    async def close(self) -> None:
        async with self._lock:
            self._store.clear()


class FileCache(CacheBackend):
    """JSON files so `--reload` and process restarts still hit cache."""

    def __init__(self, directory: Path) -> None:
        self.dir = directory
        self.dir.mkdir(parents=True, exist_ok=True)

    def _path(self, key: str) -> Path:
        digest = hashlib.sha256(key.encode("utf-8")).hexdigest()
        return self.dir / f"{digest}.json"

    def _read(self, key: str) -> Optional[dict[str, Any]]:
        path = self._path(key)
        if not path.exists():
            return None
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            return None
        if not isinstance(payload, dict) or "value" not in payload:
            return None
        return payload

    async def get(self, key: str) -> Optional[Any]:
        hit = await self.get_entry(key)
        if hit is None or hit[1] != "fresh":
            return None
        return hit[0]

    async def get_entry(self, key: str) -> Optional[CacheHit]:
        payload = await asyncio.to_thread(self._read, key)
        if payload is None:
            return None
        now = time.time()
        stale_until = float(payload.get("stale_until") or payload.get("fresh_until") or 0)
        fresh_until = float(payload.get("fresh_until") or 0)
        if now >= stale_until:
            await self.delete(key)
            return None
        if now >= fresh_until:
            return payload["value"], "stale"
        return payload["value"], "fresh"

    async def set(self, key: str, value: Any, ttl: int, stale_ttl: Optional[int] = None) -> None:
        stale = stale_ttl if stale_ttl is not None else _default_stale_ttl(ttl)
        now = time.time()
        payload = {
            "key": key,
            "value": value,
            "fresh_until": now + ttl,
            "stale_until": now + max(ttl, stale),
        }

        def _write() -> None:
            path = self._path(key)
            path.write_text(json.dumps(payload, default=str), encoding="utf-8")

        try:
            await asyncio.to_thread(_write)
        except OSError as exc:
            logger.warning("File cache SET failed for key=%s: %s", key, exc)

    async def delete(self, key: str) -> None:
        path = self._path(key)

        def _unlink() -> None:
            path.unlink(missing_ok=True)

        try:
            await asyncio.to_thread(_unlink)
        except OSError:
            pass

    async def clear_prefix(self, prefix: str) -> None:
        def _clear() -> None:
            for path in self.dir.glob("*.json"):
                try:
                    payload = json.loads(path.read_text(encoding="utf-8"))
                except (OSError, json.JSONDecodeError):
                    continue
                if str(payload.get("key") or "").startswith(prefix):
                    path.unlink(missing_ok=True)

        await asyncio.to_thread(_clear)

    async def close(self) -> None:
        return None


class MemoryThenFileCache(CacheBackend):
    def __init__(self, memory: MemoryCache, disk: FileCache) -> None:
        self.memory = memory
        self.disk = disk

    async def get(self, key: str) -> Optional[Any]:
        hit = await self.get_entry(key)
        if hit is None or hit[1] != "fresh":
            return None
        return hit[0]

    async def get_entry(self, key: str) -> Optional[CacheHit]:
        hit = await self.memory.get_entry(key)
        if hit is not None:
            return hit
        hit = await self.disk.get_entry(key)
        if hit is None:
            return None
        value, state = hit
        ttl = 0 if state == "stale" else 300
        await self.memory.set(key, value, ttl=ttl, stale_ttl=3600)
        return hit

    async def set(self, key: str, value: Any, ttl: int, stale_ttl: Optional[int] = None) -> None:
        await self.memory.set(key, value, ttl, stale_ttl)
        await self.disk.set(key, value, ttl, stale_ttl)

    async def delete(self, key: str) -> None:
        await self.memory.delete(key)
        await self.disk.delete(key)

    async def clear_prefix(self, prefix: str) -> None:
        await self.memory.clear_prefix(prefix)
        await self.disk.clear_prefix(prefix)

    async def close(self) -> None:
        await self.memory.close()
        await self.disk.close()


class RedisCache(CacheBackend):
    """Production Redis cache using redis.asyncio."""

    def __init__(self, url: str) -> None:
        self._url = url
        self._client: Any = None
        self._lock = asyncio.Lock()

    async def _get_client(self):
        if self._client is None:
            async with self._lock:
                if self._client is None:
                    try:
                        import redis.asyncio as redis

                        self._client = redis.from_url(
                            self._url,
                            encoding="utf-8",
                            decode_responses=True,
                            socket_connect_timeout=2,
                            socket_timeout=2,
                            retry_on_timeout=True,
                        )
                        await self._client.ping()
                        logger.info("Connected to Redis at %s", self._url)
                    except Exception as exc:
                        logger.error("Failed to connect to Redis: %s", exc)
                        raise
        return self._client

    def _serialize(self, value: Any) -> str:
        return json.dumps(value, default=str)

    def _deserialize(self, raw: str) -> Any:
        return json.loads(raw)

    def _unwrap(self, raw: Any) -> Optional[CacheHit]:
        now = time.time()
        if isinstance(raw, dict) and "value" in raw and "fresh_until" in raw:
            stale_until = float(raw.get("stale_until") or raw["fresh_until"])
            fresh_until = float(raw["fresh_until"])
            if now >= stale_until:
                return None
            if now >= fresh_until:
                return raw["value"], "stale"
            return raw["value"], "fresh"
        return raw, "fresh"

    async def get(self, key: str) -> Optional[Any]:
        hit = await self.get_entry(key)
        if hit is None or hit[1] != "fresh":
            return None
        return hit[0]

    async def get_entry(self, key: str) -> Optional[CacheHit]:
        try:
            client = await self._get_client()
            raw = await client.get(key)
            if raw is None:
                return None
            return self._unwrap(self._deserialize(raw))
        except Exception as exc:
            logger.warning("Redis GET failed for key=%s: %s", key, exc)
            return None

    async def set(self, key: str, value: Any, ttl: int, stale_ttl: Optional[int] = None) -> None:
        stale = stale_ttl if stale_ttl is not None else _default_stale_ttl(ttl)
        now = time.time()
        payload = {
            "value": value,
            "fresh_until": now + ttl,
            "stale_until": now + max(ttl, stale),
        }
        try:
            client = await self._get_client()
            await client.set(key, self._serialize(payload), ex=max(ttl, stale))
        except Exception as exc:
            logger.warning("Redis SET failed for key=%s: %s", key, exc)

    async def delete(self, key: str) -> None:
        try:
            client = await self._get_client()
            await client.delete(key)
        except Exception as exc:
            logger.warning("Redis DELETE failed for key=%s: %s", key, exc)

    async def clear_prefix(self, prefix: str) -> None:
        try:
            client = await self._get_client()
            cursor = 0
            while True:
                cursor, keys = await client.scan(cursor=cursor, match=f"{prefix}*", count=100)
                if keys:
                    await client.delete(*keys)
                if cursor == 0:
                    break
        except Exception as exc:
            logger.warning("Redis clear_prefix failed for prefix=%s: %s", prefix, exc)

    async def close(self) -> None:
        if self._client is not None:
            try:
                await self._client.aclose()
            except Exception as exc:
                logger.warning("Redis close error: %s", exc)
            finally:
                self._client = None


_cache: Optional[CacheBackend] = None
_cache_lock = asyncio.Lock()
_inflight: dict[str, asyncio.Task[Any]] = {}


async def get_cache() -> CacheBackend:
    global _cache
    if _cache is not None:
        return _cache

    async with _cache_lock:
        if _cache is not None:
            return _cache

        settings = get_settings()
        memory = MemoryCache()
        persist = FileCache(Path(settings.cache_dir)) if settings.persist_cache else None

        if settings.cache_backend == "redis":
            logger.info("Using Redis cache backend")
            redis_cache = RedisCache(settings.redis_url)
            try:
                await redis_cache._get_client()  # type: ignore[attr-defined]
                _cache = redis_cache
                return _cache
            except Exception:
                logger.error(
                    "Redis unavailable – falling back to in-memory cache. "
                    "Set CACHE_BACKEND=memory or start Redis (docker compose)."
                )

        logger.info(
            "Using in-memory cache backend%s",
            " + disk" if persist is not None else "",
        )
        _cache = MemoryThenFileCache(memory, persist) if persist is not None else memory
        return _cache


async def close_cache() -> None:
    global _cache
    if _cache is not None:
        await _cache.close()
        _cache = None
    _inflight.clear()


async def cache_get(key: str) -> Optional[Any]:
    cache = await get_cache()
    return await cache.get(key)


async def cache_get_entry(key: str) -> Optional[CacheHit]:
    cache = await get_cache()
    return await cache.get_entry(key)


async def cache_set(key: str, value: Any, ttl: int, stale_ttl: Optional[int] = None) -> None:
    cache = await get_cache()
    await cache.set(key, value, ttl, stale_ttl)


async def cache_delete(key: str) -> None:
    cache = await get_cache()
    await cache.delete(key)


async def singleflight(key: str, factory: Callable[[], Awaitable[Any]]) -> Any:
    """Coalesce concurrent work for the same key into one upstream fetch."""
    existing = _inflight.get(key)
    if existing is not None and not existing.done():
        return await existing

    task = asyncio.create_task(factory())
    _inflight[key] = task
    try:
        return await task
    finally:
        if _inflight.get(key) is task:
            _inflight.pop(key, None)


async def spawn_refresh(key: str, factory: Callable[[], Awaitable[Any]]) -> None:
    """Fire-and-forget singleflight refresh; errors are logged, not raised."""

    async def _run() -> None:
        try:
            await singleflight(key, factory)
        except Exception as exc:
            logger.warning("Background refresh failed for %s: %s", key, exc)

    asyncio.create_task(_run())

