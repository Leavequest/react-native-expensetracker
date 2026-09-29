import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { useExpense, useRemoveHouseholdMember, useUser, useWallet } from '../src/context';
import { createProbe, member, renderWithProviders, userState } from '../test-utils';

const users = [member({ id: 'u1', name: 'You', role: 'owner' }), member({ id: 'u2', name: 'Maria' })];

async function setup() {
  const { ref, Probe } = createProbe(() => ({
    wallet: useWallet(),
    user: useUser(),
    expense: useExpense(),
    removeMember: useRemoveHouseholdMember(),
  }));
  await renderWithProviders(<Probe />, { state: { user: userState(users) } });
  const act = (fn: () => void) => ReactTestRenderer.act(async () => fn());
  return { ref, act };
}

describe('WalletContext', () => {
  it('gives every member a Cash and a Card wallet', async () => {
    const { ref } = await setup();
    expect(ref.current!.wallet.walletsOf('u1').map(w => w.id)).toEqual(['w-u1-cash', 'w-u1-card']);
    expect(ref.current!.wallet.walletsOf('u2').map(w => w.id)).toEqual(['w-u2-cash', 'w-u2-card']);
    expect(ref.current!.wallet.balances['w-u1-cash']).toBe(0);
  });

  it('gives members added later their default wallets', async () => {
    const { ref, act } = await setup();
    let newId = '';
    await act(() => {
      newId = ref.current!.user.addUser('Luca').id;
    });
    expect(ref.current!.wallet.walletsOf(newId)).toHaveLength(2);
  });

  it('deletes empty wallets, archives used ones, and never removes the last one', async () => {
    const { ref, act } = await setup();
    let jarId = '';
    await act(() => {
      jarId = ref.current!.wallet.addWallet({
        ownerId: 'u1',
        name: 'Jar',
        type: 'cash',
        color: '#059669',
        openingBalance: 0,
      }).id;
      ref.current!.expense.addExpense({
        title: 'Shoes',
        amount: 40,
        category: 'Shopping',
        date: new Date().toISOString(),
        walletId: 'w-u1-card',
        paidByUserId: 'u1',
      });
      // History, but the money is back to zero, so the wallet can be archived
      ref.current!.wallet.addIncome({
        title: 'Refund',
        amount: 40,
        walletId: 'w-u1-card',
        date: new Date().toISOString(),
      });
    });

    let result = '';
    await act(() => {
      result = ref.current!.wallet.removeWallet(jarId);
    });
    expect(result).toBe('deleted');
    expect(ref.current!.wallet.wallets.some(w => w.id === jarId)).toBe(false);

    await act(() => {
      result = ref.current!.wallet.removeWallet('w-u1-card');
    });
    expect(result).toBe('archived');
    expect(ref.current!.wallet.wallets.find(w => w.id === 'w-u1-card')?.archived).toBe(true);
    expect(ref.current!.wallet.balances['w-u1-card']).toBe(0);

    await act(() => {
      result = ref.current!.wallet.removeWallet('w-u1-cash');
    });
    expect(result).toBe('blocked');
    expect(ref.current!.wallet.walletsOf('u1').map(w => w.id)).toEqual(['w-u1-cash']);
  });

  it('refuses to remove a wallet that still holds money', async () => {
    const { ref, act } = await setup();
    await act(() => {
      ref.current!.wallet.addIncome({
        title: 'Gift',
        amount: 300,
        walletId: 'w-u1-card',
        date: new Date().toISOString(),
      });
    });

    let result = '';
    await act(() => {
      result = ref.current!.wallet.removeWallet('w-u1-card');
    });
    expect(result).toBe('hasBalance');
    expect(ref.current!.wallet.walletsOf('u1').map(w => w.id)).toEqual(['w-u1-cash', 'w-u1-card']);
  });

  it('restores both balances when a deleted transfer is undone', async () => {
    const { ref, act } = await setup();
    let transfer: ReturnType<ReturnType<typeof useWallet>['addTransfer']> | undefined;
    await act(() => {
      ref.current!.wallet.addIncome({
        title: 'Salary',
        amount: 500,
        walletId: 'w-u1-card',
        date: new Date().toISOString(),
      });
      transfer = ref.current!.wallet.addTransfer({
        fromWalletId: 'w-u1-card',
        toWalletId: 'w-u1-cash',
        amount: 100,
        date: new Date().toISOString(),
      });
    });
    expect(ref.current!.wallet.balances).toMatchObject({ 'w-u1-card': 400, 'w-u1-cash': 100 });

    await act(() => ref.current!.wallet.deleteTransfer(transfer!.id));
    expect(ref.current!.wallet.balances).toMatchObject({ 'w-u1-card': 500, 'w-u1-cash': 0 });

    await act(() => {
      ref.current!.wallet.restoreTransfer(transfer!);
      ref.current!.wallet.restoreTransfer(transfer!);
    });
    expect(ref.current!.wallet.transfers).toHaveLength(1);
    expect(ref.current!.wallet.balances).toMatchObject({ 'w-u1-card': 400, 'w-u1-cash': 100 });
  });

  it("archives a removed member's wallets", async () => {
    const { ref, act } = await setup();
    await act(() => {
      ref.current!.removeMember('u2');
    });
    expect(ref.current!.wallet.walletsOf('u2')).toEqual([]);
    expect(ref.current!.wallet.wallets.filter(w => w.ownerId === 'u2').every(w => w.archived)).toBe(true);
  });
});
