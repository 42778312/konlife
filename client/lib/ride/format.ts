export function formatFare(eur: number): string {
  return `€${eur.toFixed(2)}`;
}

export function formatDuration(seconds: number): string {
  const min = Math.max(1, Math.round(seconds / 60));
  return `~${min} min`;
}
