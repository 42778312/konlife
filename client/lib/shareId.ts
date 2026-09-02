/** Letter-only so a night code never collides with a raw numeric id. */
const ALPHABET = 'abcdefghjkmnpqrstuvwxyz';
const BASE = ALPHABET.length;
/** Mix sequential Party-Insider IDs into compact, non-sequential codes. */
const XOR = 0x9e377;
const MIN_LEN = 4;

function toAlphabet(n: number): string {
  let value = n;
  let out = '';
  while (value > 0) {
    out = ALPHABET[value % BASE] + out;
    value = Math.floor(value / BASE);
  }
  if (!out) out = ALPHABET[0];
  while (out.length < MIN_LEN) out = ALPHABET[0] + out;
  return out;
}

function fromAlphabet(code: string): number {
  let n = 0;
  for (const ch of code) {
    n = n * BASE + ALPHABET.indexOf(ch);
  }
  return n;
}

function isShareAlphabet(code: string): boolean {
  if (!code) return false;
  for (const ch of code) {
    if (ALPHABET.indexOf(ch) < 0) return false;
  }
  return true;
}

export function encodeEventShareId(id: string): string {
  const trimmed = id.trim();
  if (!/^\d+$/.test(trimmed)) return trimmed;
  return toAlphabet(Number(trimmed) ^ XOR);
}

export function decodeEventShareId(code: string): string | null {
  const raw = code.trim();
  if (!raw) return null;
  let value = raw;
  try {
    value = decodeURIComponent(raw);
  } catch {
    value = raw;
  }
  if (/^\d+$/.test(value)) return value;
  const lower = value.toLowerCase();
  if (!isShareAlphabet(lower)) return value;
  const id = fromAlphabet(lower) ^ XOR;
  if (!Number.isInteger(id) || id < 1) return value;
  return String(id);
}

export function eventSharePath(eventId: string): string {
  return `/e/${encodeEventShareId(eventId)}`;
}

export function shareOrigin(options?: { envOrigin?: string; pageOrigin?: string }): string {
  const env = (options?.envOrigin ?? (typeof process !== 'undefined' ? process.env.EXPO_PUBLIC_SHARE_ORIGIN : undefined))
    ?.trim()
    .replace(/\/+$/, '');
  if (env) return env;
  const page = (options?.pageOrigin ?? (typeof window !== 'undefined' ? window.location.origin : undefined))?.trim().replace(/\/+$/, '');
  if (page) return page;
  return '';
}

export function eventShareUrl(eventId: string, origin = shareOrigin()): string {
  const path = eventSharePath(eventId);
  if (!origin) return path;
  return `${origin}${path}`;
}

export function firstSearchParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}
