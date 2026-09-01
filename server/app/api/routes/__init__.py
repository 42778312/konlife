from fastapi import APIRouter

from app.api.routes import health, events, venues, categories, tags, organizers

api_router = APIRouter(prefix="/api")

api_router.include_router(health.router)
api_router.include_router(events.router)
api_router.include_router(venues.router)
api_router.include_router(categories.router)
api_router.include_router(tags.router)
api_router.include_router(organizers.router)
