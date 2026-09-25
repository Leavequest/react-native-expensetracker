const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function toDate(dateInput: string | Date): Date {
  return typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
}

/**
 * Formats an ISO date string or Date into European DD/MM/YYYY format.
 * Example: "2026-09-22T14:30:00.000Z" -> "22/09/2026"
 */
export function formatDateEuropean(dateInput: string | Date): string {
  const date = toDate(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formats a date into a human readable European string.
 * Example: "22 Sep 2026"
 */
export function formatDateReadable(dateInput: string | Date): string {
  const date = toDate(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()].slice(0, 3);
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Returns the local-time month of a date in "YYYY-MM" format.
 */
export function getMonthKey(dateInput: string | Date): string {
  const date = toDate(dateInput);
  if (isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Returns current month in "YYYY-MM" format.
 */
export function getCurrentMonthKey(): string {
  return getMonthKey(new Date());
}

/**
 * Checks whether a date falls in the given "YYYY-MM" month, using local time.
 * Comparing the raw ISO string prefix would use UTC and misplace expenses
 * logged near midnight on the first/last day of a month.
 */
export function isDateInMonth(dateInput: string | Date, monthKey: string): boolean {
  return getMonthKey(dateInput) === monthKey;
}

/**
 * Returns the local-time day of a date in "YYYY-MM-DD" format.
 */
export function getDayKey(dateInput: string | Date): string {
  const date = toDate(dateInput);
  if (isNaN(date.getTime())) return '';
  return `${getMonthKey(date)}-${String(date.getDate()).padStart(2, '0')}`;
}

export interface DayGroup<T> {
  /** Local day as "YYYY-MM-DD" */
  key: string;
  /** "Today", "Yesterday" or e.g. "22 Sep 2026" */
  title: string;
  data: T[];
}

/**
 * Groups dated records by local day, newest day first and newest record first
 * within each day. Shape matches what SectionList expects.
 */
export function groupByDay<T extends { date: string }>(
  items: T[],
  now: Date = new Date()
): DayGroup<T>[] {
  const todayKey = getDayKey(now);
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterdayKey = getDayKey(yesterday);

  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const groups: DayGroup<T>[] = [];
  for (const item of sorted) {
    const key = getDayKey(item.date);
    let group = groups[groups.length - 1];
    if (!group || group.key !== key) {
      const title =
        key === todayKey
          ? 'Today'
          : key === yesterdayKey
          ? 'Yesterday'
          : formatDateReadable(item.date);
      group = { key, title, data: [] };
      groups.push(group);
    }
    group.data.push(item);
  }
  return groups;
}

/**
 * Formats a month key "YYYY-MM" into "September 2026".
 */
export function formatMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return `${MONTH_NAMES[(month || 1) - 1]} ${year}`;
}
