from contextlib import asynccontextmanager
import asyncio

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import api_router
from app.clients.party_insider import close_shared_client, get_shared_client
from app.core.cache import close_cache, get_cache
from app.core.config import get_settings
from app.core.deps import warm_catalog
from app.core.logging import setup_logging, get_logger

setup_logging()
logger = get_logger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    settings = get_settings()
    logger.info(
        "Starting %s v%s (cache=%s persist=%s)",
        settings.app_name,
        settings.app_version,
        settings.cache_backend,
        settings.persist_cache,
    )
    await get_cache()
    await get_shared_client()
    if settings.warm_on_startup:
        asyncio.create_task(warm_catalog())
    yield
    await close_shared_client()
    await close_cache()
    logger.info("Shutdown complete")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "Focused discovery API for current and upcoming **party events in Konstanz** "
            "sourced from [Party-Insider](https://www.party-insider.com).\n\n"
            "Venue matching uses the upstream `venue.city` field (not free-text title search). "
            "All times are handled in `Europe/Zurich`."
        ),
        lifespan=lifespan,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "OPTIONS"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    return app


app = create_app()
