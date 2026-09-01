from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class Tag(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    count: Optional[int] = None


class TagListResponse(BaseModel):
    items: list[Tag]
    total: int = 0


def normalize_tag(raw: dict[str, Any]) -> Tag:
    return Tag(
        id=int(raw.get("id") or raw.get("term_taxonomy_id") or 0),
        name=raw.get("name") or "",
        slug=raw.get("slug"),
        description=raw.get("description") or None,
        count=raw.get("count"),
    )
