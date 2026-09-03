# Party-Insider Konstanz API

Production-oriented FastAPI backend that discovers **current and upcoming party events in Konstanz, Germany** from the public [Party-Insider](https://www.party-insider.com) REST API (The Events Calendar).

This is **not** a generic WordPress proxy. It is a focused event-discovery service:

1. Resolves Konstanz venues via `venue.city` (normalized matching)
2. Fetches published events for those venue IDs
3. Classifies temporal status (`current` / `upcoming`) in `Europe/Zurich`
4. Annotates party likelihood (`is_party`, `party_score`)
5. Serves a clean, paginated JSON API with caching

---

## Features

| Feature | Details |
|--------|---------|
| Current events | `start_date <= now < end_date` |
| Upcoming events | `start_date > now` (configurable horizon) |
| Venue filter | City field matching, not title keyword search |
| Party classifier | Configurable keywords + category/tag scoring |
| Caching | In-memory (dev) or **Redis** (production) |
| Timezone | `Europe/Zurich` via `zoneinfo` |
| Pagination | Backend-owned `page` / `per_page` / `total` / `has_next` |
| Error mapping | 502 upstream down, 504 timeout, 404 missing event |

---

## Quick start (local)

```bash
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env – for local use without Redis:
# CACHE_BACKEND=memory

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Open http://localhost:8000/docs

---

## Docker (production-style with Redis)

```bash
docker compose up --build
```

Services:

- **api** – FastAPI on port `8000`
- **redis** – Redis 7 with AOF persistence

Environment is injected via `docker-compose.yml`. Override with a local `.env` if needed.

```bash
# Health
curl http://localhost:8000/api/health

# Upcoming parties (default 30 days)
curl http://localhost:8000/api/events/upcoming

# Current parties
curl http://localhost:8000/api/events/current

# All Konstanz events (party filter on)
curl "http://localhost:8000/api/events?city=Konstanz"

# Next 7 days
curl "http://localhost:8000/api/events/upcoming?days=7"

# Disable party filter
curl "http://localhost:8000/api/events/upcoming?party_only=false"
```

---

## Configuration

All settings are environment variables (see `.env.example`).

### Cache (Redis for production)

| Variable | Default | Description |
|----------|---------|-------------|
| `CACHE_BACKEND` | `memory` | `memory` or `redis` |
| `REDIS_URL` | `redis://localhost:6379/0` | Redis connection URL |
| `EVENT_CACHE_TTL` | `300` | Event query cache (seconds) |
| `VENUE_CACHE_TTL` | `1800` | Venue list cache |
| `CATEGORY_CACHE_TTL` | `3600` | Categories |
| `TAG_CACHE_TTL` | `3600` | Tags |
| `ORGANIZER_CACHE_TTL` | `3600` | Organizers |

When `CACHE_BACKEND=redis` and Redis is unreachable at startup, the app **falls back to in-memory** and logs a warning so it still boots.

### Other important settings

| Variable | Description |
|----------|-------------|
| `PARTY_INSIDER_BASE_URL` | Upstream base (`…/wp-json`) |
| `DEFAULT_CITY` | City used for venue matching |
| `TIMEZONE` | `Europe/Zurich` |
| `PARTY_KEYWORDS` | Comma-separated classifier keywords |
| `CORS_ORIGINS` | Comma-separated allowed origins (no `*` in prod) |
| `MAX_PAGES` | Upstream pagination safety limit |
| `HTTP_TIMEOUT` / `HTTP_MAX_RETRIES` | Client behaviour |

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Liveness |
| GET | `/api/events` | List (filters: `status`, `from_date`, `to_date`, `party_only`, …) |
| GET | `/api/events/current` | Currently happening |
| GET | `/api/events/upcoming` | Upcoming (`?days=7\|30\|90`) |
| GET | `/api/events/{id}` | Single event |
| GET | `/api/venues` | Konstanz venues |
| GET | `/api/categories` | Categories |
| GET | `/api/tags` | Tags |
| GET | `/api/organizers` | Organizers linked to Konstanz events |
| GET | `/api/places/search?q=` | Konstanz place autocomplete (Photon) |
| GET | `/api/places/reverse?lat=&lng=` | Reverse geocode a pickup |
| GET | `/api/taxi/quote` | Driving route + Landkreis Konstanz taxi estimate |

Interactive docs: `/docs` and `/redoc`.

---

## Architecture

```
app/
  main.py                 # FastAPI app + lifespan (cache connect/close)
  api/routes/             # Thin HTTP layer
  services/               # Business logic (events, venues, classifier)
  clients/party_insider.py# httpx AsyncClient + retries + pagination
  models/                 # Pydantic response models + normalizers
  core/
    config.py             # pydantic-settings
    cache.py              # MemoryCache | RedisCache abstraction
    logging.py
```

**Request flow (events):**

1. Load / cache Konstanz venue IDs (`venue.city` match)
2. Query upstream events filtered by those venue IDs
3. Normalize → temporal status → party score
4. Filter, dedupe by ID, sort by `start_date`
5. Cache result, paginate, return

---

## Caching design

```text
CacheBackend (ABC)
├── MemoryCache   – process-local dict + TTL (dev / single worker)
└── RedisCache    – redis.asyncio, JSON serialization, SCAN-based prefix clear
```

- Same interface for both backends → services call `cache_get` / `cache_set`.
- Keys are deterministic strings (e.g. `events:Konstanz:upcoming:…`).
- Values are JSON-serializable (`model_dump(mode="json")`).
- Redis failures on get/set are logged and treated as cache misses (no hard crash).

Switch to Redis:

```bash
export CACHE_BACKEND=redis
export REDIS_URL=redis://localhost:6379/0
```

Or use Docker Compose (already wired).

---

## Date & time behaviour

- All comparisons use **timezone-aware** datetimes in `Europe/Zurich`.
- Upstream `start_date` / `end_date` are interpreted in the event’s `timezone` field (usually `Europe/Zurich`).
- Returned dates are ISO-8601 with offset.
- Cross-midnight events and missing `end_date` are handled without inventing durations.
- Recurring series: the API surfaces the occurrence data that the upstream payload already contains; it does **not** expand series itself when occurrence details are incomplete.

---

## Konstanz filtering

Venues are fetched from `/tribe/events/v1/venues` (paginated). A venue is Konstanz when its normalized `city` field:

- equals `konstanz`, or
- starts with `konstanz` followed by a separator (`-`, space, …) — e.g. `Konstanz-Fürstenberg`.

Event queries then use the collected venue IDs. Free-text “Konstanz” in titles is **not** used as the primary filter.

---

## Party classification

Configurable keyword list (`PARTY_KEYWORDS`). Scoring is deterministic:

| Signal | Weight (approx.) |
|--------|------------------|
| Category / tag name match | 0.35–0.45 |
| Title keyword | 0.25 |
| Description keyword | 0.10 |
| Venue name hint | 0.05 |

`is_party = party_score >= 0.25`. Events below the threshold are still returned when `party_only=false`.

---

## Limitations

- Only **GET** against Party-Insider (read-only proxy).
- City support is implemented for Konstanz; other cities would need the same venue-matching pattern.
- `/tec/v1/events` is experimental on this site and requires an acknowledgement header; the client uses the stable `/tribe/events/v1` endpoints.
- Recurring events are not expanded beyond what the upstream response already provides.
- In-memory cache is per-process (not shared across multiple uvicorn workers). Use Redis in production multi-worker setups.

---

## Tests

```bash
pip install -r requirements.txt
pytest -q
```

Tests cover temporal logic, timezone handling, Konstanz matching, pagination, deduplication, party scoring, and empty / error paths. Upstream HTTP is mocked; no live network calls in unit tests.

---

## Example responses

```json
{
  "items": [
    {
      "id": 15105,
      "title": "L’Aperitivo – Historische Fähre Konstanz",
      "start_date": "2026-09-02T17:00:00+02:00",
      "end_date": "2026-09-02T22:00:00+02:00",
      "timezone": "Europe/Zurich",
      "status": "upcoming",
      "is_current": false,
      "is_upcoming": true,
      "is_party": true,
      "party_score": 0.55,
      "venue": {
        "id": 13070,
        "name": "Historische Fähre Konstanz",
        "city": "Konstanz",
        "country": "Switzerland"
      },
      "categories": [{"id": 34, "name": "Pane E Amore", "slug": "paneeamore"}],
      "source": {"name": "Party-Insider", "url": "https://www.party-insider.com"}
    }
  ],
  "page": 1,
  "per_page": 20,
  "total": 1,
  "has_next": false
}
```

---

## License

Use freely for your frontend / internal tools. Respect Party-Insider’s terms when scraping or high-frequency polling; this backend’s cache is intended to keep upstream load low.
