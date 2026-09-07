export type TicketCorners = {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
};

/** Target diameter (px) of each little scalloped bump along the top/bottom edges. */
const SCALLOP_SIZE = 22;

/** Short edges (left/right ends) are much shorter, so give them fewer, bigger bumps so they actually read as notches. */
const SCALLOP_SIZE_EDGE = 32;

/** A run of small concave semicircle bumps from x0 to x1 (either direction) at a fixed y — the torn-paper edge. */
function scallopRun(x0: number, x1: number, y: number, targetSize = SCALLOP_SIZE): string {
  const span = x1 - x0;
  if (Math.abs(span) < 0.5) return '';
  const count = Math.max(1, Math.round(Math.abs(span) / targetSize));
  const step = span / count;
  const r = Math.abs(step) / 2;
  let cmd = '';
  let x = x0;
  for (let i = 0; i < count; i++) {
    const next = x + step;
    cmd += ` A ${r} ${r} 0 0 0 ${next} ${y}`;
    x = next;
  }
  return cmd;
}

/** Same as scallopRun but along a vertical run (fixed x, varying y) — used for the left/right ticket ends. */
function scallopRunV(y0: number, y1: number, x: number, targetSize = SCALLOP_SIZE_EDGE): string {
  const span = y1 - y0;
  if (Math.abs(span) < 0.5) return '';
  const count = Math.max(1, Math.round(Math.abs(span) / targetSize));
  const step = span / count;
  const r = Math.abs(step) / 2;
  let cmd = '';
  let y = y0;
  for (let i = 0; i < count; i++) {
    const next = y + step;
    cmd += ` A ${r} ${r} 0 0 0 ${x} ${next}`;
    y = next;
  }
  return cmd;
}

/**
 * Outline of a boarding-pass-style ticket: a rounded rect with a semicircular
 * notch bitten out of the top and bottom edges at `notchX` (for the dashed
 * divider), plus a run of small scalloped bumps along the rest of the top
 * and bottom edges, like a torn/perforated real ticket.
 */
export function ticketPath(
  width: number,
  height: number,
  notchX: number,
  notchRadius: number,
  corners: TicketCorners,
  /** false when the bottom edge attaches flush to something below it (e.g. an open accordion panel) — keeps the divider notch but drops the scalloped run either side of it. */
  scallopBottom = true,
): string {
  const tl = Math.min(corners.topLeft, height / 2, notchX - notchRadius);
  const tr = Math.min(corners.topRight, height / 2, width - notchX - notchRadius);
  const bl = Math.min(corners.bottomLeft, height / 2, notchX - notchRadius);
  const br = Math.min(corners.bottomRight, height / 2, width - notchX - notchRadius);
  const nx = notchX;
  const nr = notchRadius;
  const bottomRun = scallopBottom ? scallopRun : (x0: number, x1: number, y: number) => ` L ${x1} ${y}`;

  return [
    `M ${tl} 0`,
    scallopRun(tl, nx - nr, 0),
    `A ${nr} ${nr} 0 0 0 ${nx + nr} 0`,
    scallopRun(nx + nr, width - tr, 0),
    `A ${tr} ${tr} 0 0 1 ${width} ${tr}`,
    scallopRunV(tr, height - br, width),
    `A ${br} ${br} 0 0 1 ${width - br} ${height}`,
    bottomRun(width - br, nx + nr, height),
    `A ${nr} ${nr} 0 0 0 ${nx - nr} ${height}`,
    bottomRun(nx - nr, bl, height),
    `A ${bl} ${bl} 0 0 1 0 ${height - bl}`,
    scallopRunV(height - bl, tl, 0),
    `A ${tl} ${tl} 0 0 1 ${tl} 0`,
    'Z',
  ].join(' ');
}
