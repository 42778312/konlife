"""Ride search bbox: Konstanz plus lakeside home trips (Kreuzlingen, Allensbach, Reichenau)."""

# Wider than venue geocode bbox on purpose — do not reuse geocode.py limits here.
MIN_LAT, MAX_LAT = 47.60, 47.76
MIN_LNG, MAX_LNG = 9.00, 9.32

KONSTANZ_LAT = 47.6602
KONSTANZ_LNG = 9.1758


def in_ride_bbox(lat: float, lng: float) -> bool:
    return MIN_LAT <= lat <= MAX_LAT and MIN_LNG <= lng <= MAX_LNG
