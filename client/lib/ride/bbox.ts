/** Mirrors server/app/services/ride_geo.py — Konstanz plus lakeside home trips. */
export const RIDE_MIN_LAT = 47.6;
export const RIDE_MAX_LAT = 47.76;
export const RIDE_MIN_LNG = 9.0;
export const RIDE_MAX_LNG = 9.32;

export function inRideBbox(lat: number, lng: number): boolean {
  return RIDE_MIN_LAT <= lat && lat <= RIDE_MAX_LAT && RIDE_MIN_LNG <= lng && lng <= RIDE_MAX_LNG;
}
