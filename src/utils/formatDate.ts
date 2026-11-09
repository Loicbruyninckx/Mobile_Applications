export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('nl-BE', { day: 'numeric', month: 'short', year: 'numeric' });
}

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

export function formatDayPart(date: Date = new Date()): string {
  const hour = date.getHours();
  let part = 'avond';
  if (hour < 6) part = 'nacht';
  else if (hour < 12) part = 'ochtend';
  else if (hour < 18) part = 'middag';
  return `${DAYS[date.getDay()] ?? ''}${part}`;
}
