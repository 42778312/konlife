from typing import Literal, Optional

from pydantic import BaseModel, Field


class PlaceItem(BaseModel):
    id: str
    label: str
    detail: Optional[str] = None
    lat: float
    lng: float


class PlaceListResponse(BaseModel):
    items: list[PlaceItem]


class TaxiQuoteResponse(BaseModel):
    from_lat: float
    from_lng: float
    to_lat: float
    to_lng: float
    distance_m: int
    duration_s: int
    fare_eur: float
    tariff: Literal["day", "night"]
    tariff_label: str
    vehicle: Literal["standard"] = "standard"
    path: list[list[float]] = Field(description="GeoJSON [lng, lat] vertices")
    disclaimer: str
