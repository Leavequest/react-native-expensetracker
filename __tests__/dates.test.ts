import {
  formatDateEuropean,
  formatDateReadable,
  formatMonthName,
  getCurrentMonthKey,
  getDayKey,
  getMonthKey,
  groupByDay,
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

describe('groupByDay', () => {
  const now = new Date(2026, 8, 25, 12, 0); // 25 Sep 2026, local time
  const at = (day: number, hour: number) => new Date(2026, 8, day, hour, 0).toISOString();

  it('groups by local day, newest first, with friendly titles', () => {
    const groups = groupByDay(
      [
        { id: 'a', date: at(23, 9) },
        { id: 'b', date: at(25, 8) },
        { id: 'c', date: at(24, 20) },
        { id: 'd', date: at(25, 18) },
      ],
      now
    );

    expect(groups.map(g => g.title)).toEqual(['Today', 'Yesterday', '23 Sep 2026']);
    expect(groups.map(g => g.key)).toEqual(['2026-09-25', '2026-09-24', '2026-09-23']);
    expect(groups[0].data.map(i => i.id)).toEqual(['d', 'b']);
  });

  it('returns no groups for no items', () => {
    expect(groupByDay([], now)).toEqual([]);
  });

  it('builds local day keys', () => {
    expect(getDayKey(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });
});
