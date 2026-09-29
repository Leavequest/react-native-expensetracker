import { Expense, Income, Transfer, Wallet, WalletType } from '../types';
import { AVATAR_COLORS } from './members';

/** Ids of the wallets every member starts with, e.g. "w-u1-cash". */
export const defaultWalletId = (userId: string, type: WalletType): string => `w-${userId}-${type}`;

export function defaultWalletsFor(userId: string): Wallet[] {
  return [
    {
      id: defaultWalletId(userId, 'cash'),
      ownerId: userId,
      name: 'Cash',
      type: 'cash',
      color: AVATAR_COLORS[0].color,
      openingBalance: 0,
    },
    {
      id: defaultWalletId(userId, 'card'),
      ownerId: userId,
      name: 'Card',
      type: 'card',
      color: AVATAR_COLORS[3].color,
      openingBalance: 0,
    },
  ];
}

const roundCents = (amount: number) => Math.round(amount * 100) / 100;

/**
 * Current balance of every wallet, computed from its opening balance and history.
 * Entries pointing at wallets that don't exist are ignored.
 */
export function computeBalances(
  wallets: Wallet[],
  expenses: Expense[],
  incomes: Income[],
  transfers: Transfer[]
): Record<string, number> {
  const totals: Record<string, number> = {};
  wallets.forEach(w => {
    totals[w.id] = w.openingBalance;
  });
  const add = (walletId: string, delta: number) => {
    if (walletId in totals) totals[walletId] += delta;
  };
  expenses.forEach(e => add(e.walletId, -e.amount));
  incomes.forEach(i => add(i.walletId, i.amount));
  transfers.forEach(t => {
    add(t.fromWalletId, -t.amount);
    add(t.toWalletId, t.amount);
  });
  Object.keys(totals).forEach(id => {
    totals[id] = roundCents(totals[id]);
  });
  return totals;
}

export function walletHasHistory(
  walletId: string,
  expenses: Expense[],
  incomes: Income[],
  transfers: Transfer[]
): boolean {
  return (
    expenses.some(e => e.walletId === walletId) ||
    incomes.some(i => i.walletId === walletId) ||
    transfers.some(t => t.fromWalletId === walletId || t.toWalletId === walletId)
  );
}

/** The carousel selection, falling back to "all" when that wallet is no longer shown. */
export function resolveSelectedWallet(selectedId: string, visibleWallets: Wallet[]): string {
  return selectedId !== 'all' && visibleWallets.some(w => w.id === selectedId) ? selectedId : 'all';
}
