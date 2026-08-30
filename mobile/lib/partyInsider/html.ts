const NAMED: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
};

export function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/&#(\d+);/g, (_, n: string) => {
      const code = Number.parseInt(n, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : '';
    })
    .replace(/&([a-zA-Z]+);/g, (full, name: string) => NAMED[name.toLowerCase()] ?? full);
}

export function htmlToPlainText(html: string): string {
  const withBreaks = html
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\/\s*p\s*>/gi, '\n')
    .replace(/<\/\s*div\s*>/gi, '\n')
    .replace(/<\s*li\s*>/gi, '• ');
  const stripped = withBreaks.replace(/<[^>]+>/g, ' ');
  return decodeHtmlEntities(stripped)
    .replace(/\u00a0/g, ' ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Night title for cards: no HTML, no duplicated venue suffix, never a bare city name. */
export function cleanEventTitle(raw: string, venueName?: string): string {
  let title = htmlToPlainText(raw);
  title = title.replace(/\s*[–—-]\s*.*\bKonstanz\s*$/i, '').trim();
  if (venueName?.trim()) {
    const venue = venueName.trim();
    title = title.replace(new RegExp(`[\\s]*[–—-]\\s*${escapeRegExp(venue)}\\s*$`, 'i'), '').trim();
    title = title.replace(new RegExp(`\\s+${escapeRegExp(venue)}\\s*$`, 'i'), '').trim();
  }
  title = title.replace(/\s+Konstanz\s*$/i, '').trim();
  if (!title || /^konstanz$/i.test(title)) {
    const fromVenue = (venueName ?? '').replace(/\s+Konstanz\s*$/i, '').trim();
    return fromVenue || venueName?.trim() || 'Night out';
  }
  return title;
}

export function displayVenueName(venueName: string): string {
  const trimmed = venueName.trim();
  const withoutCity = trimmed.replace(/\s+Konstanz\s*$/i, '').trim();
  return withoutCity || trimmed;
}
