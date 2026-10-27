/** "26 okt. 2026". Ongeldige datum → lege tekst. */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Korte relatieve tijd zoals in de wireframe: "net", "20 min", "3 u", "gisteren", "4 d".
 * Ouder dan een week → gewone datum.
 */
export function formatTimeAgo(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const minutes = Math.floor((now.getTime() - date.getTime()) / 60000);
  if (minutes < 1) return 'net';
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} u`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'gisteren';
  if (days < 7) return `${days} d`;

  return formatDate(iso);
}

const DAYS = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];

/** "Dinsdagavond": de dag plus het dagdeel (nacht 0–6, ochtend 6–12, middag 12–18, avond 18–24). */
export function formatDayPart(date: Date = new Date()): string {
  const hour = date.getHours();
  let part = 'avond';
  if (hour < 6) part = 'nacht';
  else if (hour < 12) part = 'ochtend';
  else if (hour < 18) part = 'middag';
  return `${DAYS[date.getDay()] ?? ''}${part}`;
}
