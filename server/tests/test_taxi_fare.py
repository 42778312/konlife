from datetime import datetime
from zoneinfo import ZoneInfo

from app.services.ride_geo import in_ride_bbox
from app.services.taxi_fare import estimate_fare_eur, is_night_tariff

TZ = ZoneInfo("Europe/Zurich")


def test_day_fare_bands():
    assert estimate_fare_eur(2000, night=False) == 10.90
    assert estimate_fare_eur(5000, night=False) == 19.90
    assert estimate_fare_eur(6000, night=False) == 22.70


def test_minimum_fare():
    assert estimate_fare_eur(0, night=False) == 5.00
    assert estimate_fare_eur(0, night=True) == 7.00
    assert estimate_fare_eur(100, night=False) == 5.20


def test_rounds_to_ten_cents():
    assert estimate_fare_eur(1751, night=False) == 10.20
    day = estimate_fare_eur(3000, night=False)
    night = estimate_fare_eur(3000, night=True)
    assert night - day == 2.0


def test_weekday_afternoon_is_day():
    when = datetime(2026, 9, 3, 15, 0, tzinfo=TZ)  # Thursday
    assert is_night_tariff(when) is False


def test_weekday_late_and_sunday_are_night():
    assert is_night_tariff(datetime(2026, 9, 3, 22, 0, tzinfo=TZ)) is True
    assert is_night_tariff(datetime(2026, 9, 4, 5, 59, tzinfo=TZ)) is True
    assert is_night_tariff(datetime(2026, 9, 6, 14, 0, tzinfo=TZ)) is True  # Sunday


def test_bw_holiday_is_night():
    assert is_night_tariff(datetime(2026, 1, 1, 12, 0, tzinfo=TZ)) is True


def test_ride_bbox_covers_lakeside_not_munich():
    assert in_ride_bbox(47.6602, 9.1758) is True
    assert in_ride_bbox(47.715, 9.07) is True  # Allensbach
    assert in_ride_bbox(47.645, 9.175) is True  # Kreuzlingen
    assert in_ride_bbox(48.14, 11.58) is False
