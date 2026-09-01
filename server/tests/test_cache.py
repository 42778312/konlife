import pytest

from app.core.cache import MemoryCache


@pytest.mark.asyncio
async def test_memory_cache_serves_stale_after_fresh_ttl():
    cache = MemoryCache()
    await cache.set("k", ["event"], ttl=0, stale_ttl=60)
    assert await cache.get("k") is None
    hit = await cache.get_entry("k")
    assert hit is not None
    value, state = hit
    assert value == ["event"]
    assert state == "stale"
