import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { createAsyncStorage } from '@react-native-async-storage/async-storage';
import { loadAppState, saveSlice } from '../src/storage/persistence';
import { ExpenseProvider, useExpense } from '../src/context/ExpenseContext';
import { Expense } from '../src/types';

// Same in-memory instance the persistence module uses (see jest.setup.js)
const storage = createAsyncStorage('finance-manager');

const sampleExpense: Expense = {
  id: 'exp-1',
  title: 'Lidl',
  amount: 42.1,
  category: 'Groceries',
  date: '2026-09-20T10:00:00.000Z',
  walletId: 'w-u1-cash',
  paidByUserId: 'u1',
};

describe('persistence', () => {
  beforeEach(async () => {
    await storage.clear();
  });

  it('returns empty state when nothing has been saved', async () => {
    expect(await loadAppState()).toEqual({
      user: undefined,
      expenses: undefined,
      shopping: undefined,
      theme: undefined,
      wallets: undefined,
    });
  });

  it('round-trips saved slices', async () => {
    await saveSlice('expenses', {
      expenses: [sampleExpense],
      budget: { month: '2026-09', totalLimit: 500, categoryLimits: {} },
    });
    await saveSlice('shopping', { lists: [] });

    const state = await loadAppState();
    expect(state.expenses?.expenses).toEqual([sampleExpense]);
    expect(state.expenses?.budget.totalLimit).toBe(500);
    expect(state.shopping?.lists).toEqual([]);
    expect(state.user).toBeUndefined();
  });

  it('ignores corrupt, malformed or outdated data', async () => {
    await storage.setItem('expenses', '{not json');
    await storage.setItem('shopping', JSON.stringify({ version: 1, data: { lists: 'nope' } }));
    await storage.setItem(
      'user',
      JSON.stringify({ version: 999, data: { users: [], activeUserId: 'u1', currency: 'EUR' } })
    );

    expect(await loadAppState()).toEqual({
      user: undefined,
      expenses: undefined,
      shopping: undefined,
      theme: undefined,
      wallets: undefined,
    });
  });

  it('round-trips the wallets slice', async () => {
    const wallet = {
      id: 'w-u1-cash',
      ownerId: 'u1',
      name: 'Cash',
      type: 'cash' as const,
      color: '#059669',
      openingBalance: 20,
    };
    await saveSlice('wallets', { wallets: [wallet], incomes: [], transfers: [] });
    expect((await loadAppState()).wallets).toEqual({ wallets: [wallet], incomes: [], transfers: [] });
  });

  it('ignores a malformed wallets slice', async () => {
    await storage.setItem(
      'wallets',
      JSON.stringify({ version: 1, data: { wallets: [], incomes: 'nope', transfers: [] } })
    );
    expect((await loadAppState()).wallets).toBeUndefined();
  });

  it('moves expenses saved with a payment method onto the default wallets', async () => {
    const legacy = (id: string, paymentMethod: string) => ({
      id,
      title: id,
      amount: 10,
      category: 'Groceries',
      date: '2026-09-20T10:00:00.000Z',
      paymentMethod,
      paidByUserId: 'u1',
    });
    await storage.setItem(
      'expenses',
      JSON.stringify({
        version: 1,
        data: {
          expenses: [legacy('coffee', 'Cash'), legacy('shoes', 'Credit Card')],
          budget: { month: '2026-09', totalLimit: 0, categoryLimits: {} },
        },
      })
    );

    const migrated = (await loadAppState()).expenses!.expenses;
    expect(migrated.map(e => e.walletId)).toEqual(['w-u1-cash', 'w-u1-card']);
    expect(migrated[0]).not.toHaveProperty('paymentMethod');
  });

  it('fills in member defaults for data saved before roles existed', async () => {
    await storage.setItem(
      'user',
      JSON.stringify({
        version: 1,
        data: {
          users: [
            { id: 'u1', name: 'You', initials: 'YO', avatarColor: '#059669', email: 'a@example.com', isCurrentUser: true },
            { id: 'u2', name: 'Maria', initials: 'MA', avatarColor: '#8B5CF6', email: 'm@example.com', isCurrentUser: false },
          ],
          activeUserId: 'u1',
          currency: 'EUR',
        },
      })
    );

    const state = await loadAppState();
    expect(state.user?.users.map(u => [u.role, u.origin, u.status])).toEqual([
      ['owner', 'local', 'active'],
      ['member', 'local', 'active'],
    ]);
    expect(state.user?.activeUserId).toBe('u1');
  });

  it('providers start from saved state and save their changes', async () => {
    let captured: ReturnType<typeof useExpense> | undefined;
    const Consumer = () => {
      captured = useExpense();
      return null;
    };

    await ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <ExpenseProvider
          initialState={{
            expenses: [sampleExpense],
            budget: { month: '2026-09', totalLimit: 300, categoryLimits: {} },
          }}
        >
          <Consumer />
        </ExpenseProvider>
      );
    });

    expect(captured!.expenses).toEqual([sampleExpense]);
    expect(captured!.budget.totalLimit).toBe(300);

    await ReactTestRenderer.act(async () => {
      captured!.deleteExpense('exp-1');
    });

    const state = await loadAppState();
    expect(state.expenses?.expenses).toEqual([]);
    expect(state.expenses?.budget.totalLimit).toBe(300);
  });
});
