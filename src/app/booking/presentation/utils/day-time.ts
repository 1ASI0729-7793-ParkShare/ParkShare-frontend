export type RelativeDay = 'yesterday' | 'today' | 'tomorrow';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const startOfDay = (date: Date): number =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

/** Returns yesterday/today/tomorrow when `date` is that close to `now`, otherwise null. */
export function relativeDay(date: Date, now: Date = new Date()): RelativeDay | null {
  const diff = Math.round((startOfDay(date) - startOfDay(now)) / MS_PER_DAY);
  if (diff === -1) return 'yesterday';
  if (diff === 0) return 'today';
  if (diff === 1) return 'tomorrow';
  return null;
}

/** Clock time such as "02:30 PM", in the given language. */
export function formatClock(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(lang, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .toUpperCase();
}

/** Calendar date such as "5 Oct", in the given language. */
export function formatShortDate(date: Date, lang: string): string {
  return new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'short' }).format(date);
}

/** Elapsed milliseconds as HH:MM:SS. */
export function formatElapsed(ms: number): string {
  const total = Math.floor(ms / 1000);
  const pad = (n: number): string => n.toString().padStart(2, '0');
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}
