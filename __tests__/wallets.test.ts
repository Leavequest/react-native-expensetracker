import {
  computeBalances,
  defaultWalletsFor,
  resolveSelectedWallet,
  walletHasHistory,
} from '../src/utils/wallets';
import { Expense, Income, Transfer, Wallet } from '../src/types';

const cash: Wallet = { id: 'w-cash', ownerId: 'u1', name: 'Cash', type: 'cash', color: '#059669', openingBalance: 50 };
const card: Wallet = { id: 'w-card', ownerId: 'u1', name: 'Card', type: 'card', color: '#3B82F6', openingBalance: 0 };

const expense = (walletId: string, amount: number): Expense => ({
  id: `e-${walletId}-${amount}`,
  title: 'Shop',
  amount,
  category: 'Groceries',
  date: '2026-09-20T10:00:00.000Z',
  walletId,
  paidByUserId: 'u1',
});
const income = (walletId: string, amount: number, id = `i-${amount}`): Income => ({
  id,
  title: 'Salary',
  amount,
  walletId,
  date: '2026-09-01T09:00:00.000Z',
});
const transfer = (fromWalletId: string, toWalletId: string, amount: number): Transfer => ({
  id: `t-${amount}`,
  fromWalletId,
  toWalletId,
  amount,
  date: '2026-09-10T09:00:00.000Z',
});

describe('computeBalances', () => {
  it('starts from the opening balance and applies every kind of entry', () => {
    const balances = computeBalances(
      [cash, card],
      [expense('w-cash', 20), expense('w-card', 35.5)],
      [income('w-card', 1000)],
      [transfer('w-card', 'w-cash', 100)]
    );
    expect(balances).toEqual({ 'w-cash': 130, 'w-card': 864.5 });
  });

  it('allows negative balances', () => {
    expect(computeBalances([card], [expense('w-card', 12.3)], [], [])).toEqual({ 'w-card': -12.3 });
  });

  it('rounds to cents', () => {
    const balances = computeBalances([card], [], [income('w-card', 0.1, 'a'), income('w-card', 0.2, 'b')], []);
    expect(balances['w-card']).toBe(0.3);
  });

  it('ignores entries for wallets that do not exist', () => {
    expect(
      computeBalances([cash], [expense('w-gone', 99)], [], [transfer('w-gone', 'w-cash', 10)])
    ).toEqual({ 'w-cash': 60 });
  });
});

describe('defaultWalletsFor', () => {
  it('creates a Cash and a Card wallet with deterministic ids', () => {
    const wallets = defaultWalletsFor('u7');
    expect(wallets.map(w => [w.id, w.type, w.name, w.openingBalance, w.ownerId])).toEqual([
      ['w-u7-cash', 'cash', 'Cash', 0, 'u7'],
      ['w-u7-card', 'card', 'Card', 0, 'u7'],
    ]);
  });
});

describe('walletHasHistory', () => {
  it('is true when any expense, income or transfer touches the wallet', () => {
    expect(walletHasHistory('w-cash', [expense('w-cash', 1)], [], [])).toBe(true);
    expect(walletHasHistory('w-cash', [], [], [transfer('w-card', 'w-cash', 5)])).toBe(true);
    expect(walletHasHistory('w-cash', [], [income('w-card', 5)], [])).toBe(false);
  });
});

describe('resolveSelectedWallet', () => {
  it('keeps a visible selection and falls back to "all" otherwise', () => {
    expect(resolveSelectedWallet('w-cash', [cash, card])).toBe('w-cash');
    expect(resolveSelectedWallet('w-cash', [card])).toBe('all');
    expect(resolveSelectedWallet('all', [cash])).toBe('all');
  });
});
