import {
  formatDateEuropean,
  formatDateReadable,
  formatMonthName,
  getCurrentMonthKey,
  getMonthKey,
  isDateInMonth,
} from '../src/utils/dates';

describe('date utilities', () => {
  it('formats date strings in European DD/MM/YYYY format', () => {
    const isoString = '2026-09-22T14:30:00.000Z';
    // Use local or date object
    const date = new Date(isoString);
    const expectedDay = String(date.getDate()).padStart(2, '0');
    const expectedMonth = String(date.getMonth() + 1).padStart(2, '0');
    const expectedYear = date.getFullYear();

    expect(formatDateEuropean(isoString)).toBe(
      `${expectedDay}/${expectedMonth}/${expectedYear}`
    );
  });

  it('formats dates in readable European format', () => {
    const isoString = '2026-09-22T14:30:00.000Z';
    const result = formatDateReadable(isoString);
    expect(result).toContain('2026');
    expect(result).toContain('Sep');
  });

  it('returns current month key in YYYY-MM format', () => {
    const key = getCurrentMonthKey();
    expect(key).toMatch(/^\d{4}-\d{2}$/);
  });

  it('uses local time when checking which month a date belongs to', () => {
    // Midnight local time on the 1st: the UTC ISO string may still say the previous month
    const firstOfMonthLocal = new Date(2026, 9, 1, 0, 30);
    expect(getMonthKey(firstOfMonthLocal.toISOString())).toBe('2026-10');
    expect(isDateInMonth(firstOfMonthLocal.toISOString(), '2026-10')).toBe(true);
    expect(isDateInMonth(firstOfMonthLocal.toISOString(), '2026-09')).toBe(false);
    expect(isDateInMonth('not a date', '2026-10')).toBe(false);
  });

  it('formats month name from YYYY-MM key', () => {
    expect(formatMonthName('2026-09')).toBe('September 2026');
    expect(formatMonthName('2026-01')).toBe('January 2026');
    expect(formatMonthName('2026-12')).toBe('December 2026');
  });
});
