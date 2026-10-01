import { MIN_RENTAL_DURATIONS, WEEKDAYS } from '../../types/landlord';

const DAY_ORDER = Object.keys(WEEKDAYS);

const WORKSPACE_STATUS_LABELS: Record<string, string> = {
  UNDER_REVIEW: 'На проверке',
};

const MIN_RENT_LABELS: Record<number, string> = {
  [MIN_RENTAL_DURATIONS.MINUTES_30]: '30 мин',
  [MIN_RENTAL_DURATIONS.MINUTES_60]: '1 час',
  [MIN_RENTAL_DURATIONS.MINUTES_120]: '2 часа',
};

export function formatTime(value: string) {
  return value.slice(0, 5);
}

export function formatWorkingDays(days: string[]) {
  return [...days]
    .sort((a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b))
    .map((day) => WEEKDAYS[day as keyof typeof WEEKDAYS] ?? day)
    .join(', ');
}

export function formatMinRent(minutes: number) {
  return MIN_RENT_LABELS[minutes] ?? `${minutes} мин`;
}

function parseCreatedAt(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatCreatedDate(value: string) {
  const date = parseCreatedAt(value);

  return date ? date.toLocaleDateString('ru-RU') : value;
}

export function formatCreatedAt(value: string) {
  const date = parseCreatedAt(value);

  return date ? date.toLocaleString('ru-RU') : value;
}

export function formatOptional(value: string | null) {
  return value && value.trim() ? value : '—';
}

export function formatWorkspaceStatus(status: string) {
  return WORKSPACE_STATUS_LABELS[status] ?? status;
}
