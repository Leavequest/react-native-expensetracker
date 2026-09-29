import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { buildDemoData } from '../src/constants';
import { useAppData, useExpense, useShoppingList, useUser, useWallet } from '../src/context';
import { createProbe, member, renderWithProviders, userState } from '../test-utils';

const users = [member({ id: 'u1', name: 'You', role: 'owner' }), member({ id: 'u2', name: 'Maria' })];

describe('buildDemoData', () => {
  const demo = buildDemoData(users, 'u1', new Date(2026, 8, 15, 12));

  it('only references wallets that exist', () => {
    const ids = new Set(demo.wallets.wallets.map(w => w.id));
    demo.expenses.forEach(e => expect(ids.has(e.walletId)).toBe(true));
    demo.wallets.incomes.forEach(i => expect(ids.has(i.walletId)).toBe(true));
    demo.wallets.transfers.forEach(t => {
      expect(ids.has(t.fromWalletId)).toBe(true);
      expect(ids.has(t.toWalletId)).toBe(true);
    });
  });

  it('gives the active member a savings jar and a salary on the 1st', () => {
    expect(demo.wallets.wallets.filter(w => w.ownerId === 'u1').map(w => w.name)).toEqual([
      'Cash',
      'Card',
      'Savings jar',
    ]);
    expect(demo.wallets.incomes[0]).toMatchObject({
      title: 'Salary',
      date: new Date(2026, 8, 1, 9).toISOString(),
    });
    expect(demo.budget.month).toBe('2026-09');
  });
});

describe('useAppData', () => {
  async function setup() {
    const { ref, Probe } = createProbe(() => ({
      appData: useAppData(),
      expense: useExpense(),
      wallet: useWallet(),
      shopping: useShoppingList(),
      user: useUser(),
    }));
    await renderWithProviders(<Probe />, { state: { user: userState(users) } });
    const act = (fn: () => void) => ReactTestRenderer.act(async () => fn());
    return { ref, act };
  }

  it('loads demo data into every part of the app', async () => {
    const { ref, act } = await setup();
    await act(() => ref.current!.appData.loadDemoData());

    expect(ref.current!.expense.expenses.length).toBeGreaterThan(10);
    expect(ref.current!.expense.budget.totalLimit).toBe(900);
    expect(ref.current!.wallet.incomes).toHaveLength(1);
    expect(ref.current!.wallet.transfers).toHaveLength(1);
    expect(ref.current!.shopping.lists).toHaveLength(1);
  });

  it('deletes everything but keeps a Cash and a Card wallet per member', async () => {
    const { ref, act } = await setup();
    await act(() => {
      ref.current!.appData.loadDemoData();
      ref.current!.user.setCurrency('USD');
    });
    await act(() => ref.current!.appData.deleteAllData());

    expect(ref.current!.expense.expenses).toEqual([]);
    expect(ref.current!.expense.budget.totalLimit).toBe(0);
    expect(ref.current!.wallet.incomes).toEqual([]);
    expect(ref.current!.wallet.transfers).toEqual([]);
    expect(ref.current!.shopping.lists).toEqual([]);
    expect(ref.current!.wallet.wallets.map(w => w.id).sort()).toEqual([
      'w-u1-card',
      'w-u1-cash',
      'w-u2-card',
      'w-u2-cash',
    ]);
    expect(Object.values(ref.current!.wallet.balances).every(b => b === 0)).toBe(true);
    expect(ref.current!.user.currency).toBe('EUR');
  });
});
