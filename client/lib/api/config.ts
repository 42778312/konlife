const DEFAULT_API_URL = 'http://localhost:8000';
const API_PORT = '8000';

function isLoopbackHost(host: string): boolean {
  return host === 'localhost' || host === '127.0.0.1' || host === '::1' || host === '[::1]';
}

function isPrivateLanHost(host: string): boolean {
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(host)) return true;
  return false;
}

function trimSlash(url: string): string {
  return url.replace(/\/+$/, '');
}

function originFromPage(host: string, protocol: string | undefined, port?: string): string {
  const scheme = protocol?.trim() || 'http:';
  const suffix = port ? `:${port}` : '';
  return trimSlash(`${scheme}//${host}${suffix}`);
}

/**
 * Dev phones on LAN must hit the API on the same machine (port 8000), not device localhost.
 * Production (Coolify) serves the web and `/api` on one origin, so a public host stays portless.
 */
export function resolveApiBaseUrl(options: {
  envUrl?: string;
  pageHost?: string;
  pageProtocol?: string;
}): string {
  const pageHost = options.pageHost?.trim();
  if (pageHost && isPrivateLanHost(pageHost)) {
    return originFromPage(pageHost, options.pageProtocol, API_PORT);
  }
  const env = options.envUrl?.trim();
  if (env) return trimSlash(env);
  if (pageHost && !isLoopbackHost(pageHost)) {
    return originFromPage(pageHost, options.pageProtocol);
  }
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
