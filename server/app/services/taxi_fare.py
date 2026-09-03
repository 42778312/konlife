"""Landkreis Konstanz taxi tariff (Rechtsverordnung, in force 1 July 2025)."""

from __future__ import annotations

from datetime import datetime
from decimal import ROUND_HALF_UP, Decimal
from zoneinfo import ZoneInfo

import holidays

from app.core.config import get_settings

# Standard taxi (up to 4 seats). Großraum is out of this first cut.
DAY_BASE = Decimal("4.90")
DAY_MINIMUM = Decimal("5.00")
NIGHT_BASE = Decimal("6.90")
NIGHT_MINIMUM = Decimal("7.00")
KM_FIRST = Decimal("3.00")
KM_REST = Decimal("2.80")
FIRST_BAND_KM = Decimal("5")

DISCLAIMER = "Meter is final; waiting can add €40/h."

_BW_HOLIDAYS = holidays.country_holidays("DE", subdiv="BW")


def local_now(when: datetime | None = None) -> datetime:
    tz = ZoneInfo(get_settings().timezone)
    if when is None:
        return datetime.now(tz)
    if when.tzinfo is None:
        return when.replace(tzinfo=tz)
    return when.astimezone(tz)


def is_night_tariff(when: datetime | None = None) -> bool:
    """Night / Sunday / Baden-Württemberg holiday (Tarifstufe 2)."""
    local = local_now(when)
    if local.weekday() == 6:
        return True
    if local.date() in _BW_HOLIDAYS:
        return True
    return local.hour >= 22 or local.hour < 6


def estimate_fare_eur(distance_m: float, *, night: bool) -> float:
    km = Decimal(str(max(0.0, float(distance_m)))) / Decimal("1000")
    base = NIGHT_BASE if night else DAY_BASE
    minimum = NIGHT_MINIMUM if night else DAY_MINIMUM
    first = min(km, FIRST_BAND_KM) * KM_FIRST
    rest = max(Decimal("0"), km - FIRST_BAND_KM) * KM_REST
    total = (base + first + rest) * 10
    stepped = total.to_integral_value(rounding=ROUND_HALF_UP) / 10
    return float(max(minimum, stepped))


def tariff_label(night: bool) -> str:
    return "Night tariff" if night else "Day tariff"
