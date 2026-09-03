from functools import lru_cache
from typing import List

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Upstream
    party_insider_base_url: str = "https://www.party-insider.com/wp-json"
    default_city: str = "Konstanz"
    timezone: str = "Europe/Zurich"

    # Cache
    cache_backend: str = Field(default="memory", description="memory | redis")
    redis_url: str = "redis://localhost:6379/0"
    event_cache_ttl: int = 900
    event_cache_stale_ttl: int = 21600
    venue_cache_ttl: int = 3600
    venue_cache_stale_ttl: int = 86400
    category_cache_ttl: int = 3600
    tag_cache_ttl: int = 3600
    organizer_cache_ttl: int = 3600
    persist_cache: bool = True
    cache_dir: str = ".cache"
    warm_on_startup: bool = True

    # Pagination / limits
    max_pages: int = 20
    default_per_page: int = 20
    max_per_page: int = 100
    upstream_per_page: int = 50
    max_concurrent_venue_requests: int = 5

    # Geocode missing venue coordinates (Nominatim)
    geocode_min_interval: float = 1.1
    geocode_cache_ttl: int = 2592000
    geocode_cache_stale_ttl: int = 15552000
    geocode_negative_ttl: int = 86400

    # Ride home: Photon autocomplete + OSRM driving + Landkreis tariff
    photon_base_url: str = "https://photon.komoot.io"
    osrm_base_url: str = "https://router.project-osrm.org"
    places_cache_ttl: int = 3600
    taxi_quote_cache_ttl: int = 120

    # Party filter
    party_only_default: bool = True
    party_keywords: str = (
        "party,parties,club,clubnight,club night,nacht,night,disco,dj,dance,"
        "techno,house,electro,electronic,hip hop,rap,rave,festival,event,"
        "feiern,tanz,nachtleben,afterhour,open air,openair"
    )

    # HTTP client
    http_timeout: float = 15.0
    http_max_retries: int = 2
    http_backoff_base: float = 0.3

    # CORS
    cors_origins: str = (
        "http://localhost:8081,http://127.0.0.1:8081,"
        "http://localhost:19006,http://localhost:3000,http://localhost:5173"
    )
    # Phones opening Expo web via a LAN IP (http://192.168.x.x:8081).
    cors_origin_regex: str = (
        r"https?://("
        r"localhost|127\.0\.0\.1|"
        r"192\.168\.\d{1,3}\.\d{1,3}|"
        r"10\.\d{1,3}\.\d{1,3}\.\d{1,3}|"
        r"172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}"
        r")(:\d+)?$"
    )

    # App
    app_name: str = "Party-Insider Konstanz API"
    app_version: str = "1.0.0"
    debug: bool = False
    log_level: str = "INFO"

    @field_validator("cache_backend")
    @classmethod
    def validate_cache_backend(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in {"memory", "redis"}:
            raise ValueError("cache_backend must be 'memory' or 'redis'")
        return v

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def party_keywords_list(self) -> List[str]:
        return [k.strip().lower() for k in self.party_keywords.split(",") if k.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
