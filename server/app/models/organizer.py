from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class Organizer(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    email: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None


class OrganizerListResponse(BaseModel):
    items: list[Organizer]
    page: int = 1
    per_page: int = 20
    total: int = 0
    has_next: bool = False


def normalize_organizer(raw: dict[str, Any]) -> Organizer:
    name = raw.get("organizer") or raw.get("name") or ""
    return Organizer(
        id=int(raw["id"]),
        name=name,
        slug=raw.get("slug"),
        phone=raw.get("phone"),
        website=raw.get("website"),
        email=raw.get("email"),
        description=raw.get("description"),
        url=raw.get("url"),
    )
