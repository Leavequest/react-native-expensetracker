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
 * Formats a month key "YYYY-MM" into "September 2026".
 */
export function formatMonthName(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return `${MONTH_NAMES[(month || 1) - 1]} ${year}`;
}
