import { Expense, Income, Transfer } from '../types';

export type TimelineKind = 'expense' | 'income' | 'transfer';

export type TimelineEntry =
  | { kind: 'expense'; id: string; date: string; item: Expense }
  | { kind: 'income'; id: string; date: string; item: Income }
  | { kind: 'transfer'; id: string; date: string; item: Transfer };

export interface TimelineSource {
  expenses: Expense[];
  incomes: Income[];
  transfers: Transfer[];
}

export interface TimelineFilter {
  /** Entries touching any of these wallets are kept */
  walletIds: string[];
  kind: 'all' | TimelineKind;
}

/** Expenses, income and transfers as one list (unsorted; `groupByDay` sorts). */
export function buildTimeline(source: TimelineSource, filter: TimelineFilter): TimelineEntry[] {
  const ids = new Set(filter.walletIds);
  const wants = (kind: TimelineKind) => filter.kind === 'all' || filter.kind === kind;
  const entries: TimelineEntry[] = [];

  if (wants('expense')) {
    source.expenses.forEach(item => {
      if (ids.has(item.walletId)) entries.push({ kind: 'expense', id: item.id, date: item.date, item });
    });
  }
  if (wants('income')) {
    source.incomes.forEach(item => {
      if (ids.has(item.walletId)) entries.push({ kind: 'income', id: item.id, date: item.date, item });
    });
  }
  if (wants('transfer')) {
    source.transfers.forEach(item => {
      if (ids.has(item.fromWalletId) || ids.has(item.toWalletId)) {
        entries.push({ kind: 'transfer', id: item.id, date: item.date, item });
      }
    });
  }
  return entries;
}

/**
 * How an entry changes the money in the viewed wallets: expenses are negative, income positive,
 * and a transfer between two viewed wallets is 0 (money only moved).
 */
export function signedAmount(entry: TimelineEntry, walletIds: string[]): number {
  switch (entry.kind) {
    case 'expense':
      return -entry.item.amount;
    case 'income':
      return entry.item.amount;
    case 'transfer': {
      const fromViewed = walletIds.includes(entry.item.fromWalletId);
      const toViewed = walletIds.includes(entry.item.toWalletId);
      if (fromViewed && toViewed) return 0;
      return fromViewed ? -entry.item.amount : entry.item.amount;
    }
  }
}
