const DEFAULT_API_URL = 'http://localhost:8000';
const API_PORT = '8000';

function isLoopbackHost(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

/** Prefer the page/debugger host so a phone on LAN does not call its own localhost. */
export function resolveApiBaseUrl(options: {
  envUrl?: string;
  pageHost?: string;
  pageProtocol?: string;
}): string {
  const pageHost = options.pageHost?.trim();
  if (pageHost && !isLoopbackHost(pageHost)) {
    const protocol = options.pageProtocol?.trim() || 'http:';
    return trimSlash(`${protocol}//${pageHost}:${API_PORT}`);
  }
  const env = options.envUrl?.trim();
  if (env) return trimSlash(env);
  return DEFAULT_API_URL;
}

export function getApiBaseUrl(): string {
  const envUrl = typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_API_URL : undefined;
  const pageHost = typeof window !== 'undefined' ? window.location.hostname : undefined;
  const pageProtocol = typeof window !== 'undefined' ? window.location.protocol : undefined;
  return resolveApiBaseUrl({ envUrl, pageHost, pageProtocol });
}

export const API_BASE_URL = getApiBaseUrl();

/** Match the previous Party-Insider listing window. */
export const LISTING_DAYS = 56;
export const EVENTS_PER_PAGE = 100;
export const MAX_PAGES = 20;
export const CACHE_TTL_MS = 10 * 60 * 1000;
