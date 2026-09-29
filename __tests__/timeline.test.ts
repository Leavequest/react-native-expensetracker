import { buildTimeline, signedAmount, TimelineEntry } from '../src/utils/timeline';
import { Expense, Income, Transfer } from '../src/types';

const expense = (id: string, walletId: string, amount: number): Expense => ({
  id,
  title: id,
  amount,
  category: 'Groceries',
  date: '2026-09-20T10:00:00.000Z',
  walletId,
  paidByUserId: 'u1',
});
const income: Income = { id: 'salary', title: 'Salary', amount: 100, walletId: 'w-card', date: '2026-09-01T09:00:00.000Z' };
const atm: Transfer = { id: 'atm', fromWalletId: 'w-card', toWalletId: 'w-cash', amount: 20, date: '2026-09-10T09:00:00.000Z' };
const toOther: Transfer = { id: 'gift', fromWalletId: 'w-card', toWalletId: 'w-other', amount: 30, date: '2026-09-11T09:00:00.000Z' };

const source = {
  expenses: [expense('lunch', 'w-cash', 5), expense('theirs', 'w-other', 7)],
  incomes: [income],
  transfers: [atm, toOther],
};

const ids = (entries: TimelineEntry[]) => entries.map(e => `${e.kind}:${e.id}`).sort();

describe('buildTimeline', () => {
  it('keeps entries touching the given wallets, transfers on either side', () => {
    expect(ids(buildTimeline(source, { walletIds: ['w-cash'], kind: 'all' }))).toEqual([
      'expense:lunch',
      'transfer:atm',
    ]);
  });

  it('filters by kind', () => {
    expect(ids(buildTimeline(source, { walletIds: ['w-cash', 'w-card'], kind: 'income' }))).toEqual([
      'income:salary',
    ]);
    expect(ids(buildTimeline(source, { walletIds: ['w-cash', 'w-card'], kind: 'transfer' }))).toEqual([
      'transfer:atm',
      'transfer:gift',
    ]);
  });
});

describe('signedAmount', () => {
  const [lunchEntry] = buildTimeline(source, { walletIds: ['w-cash'], kind: 'expense' });
  const [incomeEntry] = buildTimeline(source, { walletIds: ['w-card'], kind: 'income' });
  const atmEntry = buildTimeline(source, { walletIds: ['w-cash'], kind: 'transfer' })[0];

  it('is negative for expenses and positive for income', () => {
    expect(signedAmount(lunchEntry, ['w-cash'])).toBe(-5);
    expect(signedAmount(incomeEntry, ['w-card'])).toBe(100);
  });

  it('signs transfers from the point of view of the viewed wallets', () => {
    expect(signedAmount(atmEntry, ['w-cash'])).toBe(20);
    expect(signedAmount(atmEntry, ['w-card'])).toBe(-20);
    expect(signedAmount(atmEntry, ['w-card', 'w-cash'])).toBe(0);
  });
});
