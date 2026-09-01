from typing import Any, Optional

from pydantic import BaseModel, ConfigDict


class Category(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    slug: Optional[str] = None
    description: Optional[str] = None
    count: Optional[int] = None


class CategoryListResponse(BaseModel):
    items: list[Category]
    total: int = 0


def normalize_category(raw: dict[str, Any]) -> Category:
    return Category(
        id=int(raw.get("id") or raw.get("term_taxonomy_id") or 0),
        name=raw.get("name") or "",
        slug=raw.get("slug"),
        description=raw.get("description") or None,
        count=raw.get("count"),
    )
