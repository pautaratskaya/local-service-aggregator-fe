function parseDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | null): string {
  if (!value) {
    return '';
  }

  const date = parseDate(value);

  return date ? date.toLocaleDateString('ru-RU') : value;
}

export function formatDateTime(value: string | null): string {
  if (!value) {
    return '';
  }

  const date = parseDate(value);

  return date ? date.toLocaleString('ru-RU') : value;
}

export function formatOptional(value: string | null): string {
  return value && value.trim() ? value : '—';
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
