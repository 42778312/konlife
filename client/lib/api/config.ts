const DEFAULT_API_URL = 'http://localhost:8000';

export const API_BASE_URL = (
  (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_API_URL?.trim()) || DEFAULT_API_URL
).replace(/\/+$/, '');

/** Match the previous Party-Insider listing window. */
export const LISTING_DAYS = 56;
export const EVENTS_PER_PAGE = 100;
export const MAX_PAGES = 20;
export const CACHE_TTL_MS = 10 * 60 * 1000;
