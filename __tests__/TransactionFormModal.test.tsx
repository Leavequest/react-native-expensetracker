import React from 'react';
import { TransactionFormModal } from '../src/components/expenses';
import { useExpense, useWallet } from '../src/context';
import {
  createProbe,
  findButtonWithText,
  hasText,
  press,
  renderWithProviders,
  typeInto,
} from '../test-utils';

async function renderForm() {
  const onClose = jest.fn();
  const { ref, Probe } = createProbe(() => ({ expense: useExpense(), wallet: useWallet() }));
  const { root } = await renderWithProviders(
    <>
      <TransactionFormModal visible onClose={onClose} />
      <Probe />
    </>
  );
  return { root, ref, onClose };
}

describe('TransactionFormModal', () => {
  it('opens without focusing any field, so the keyboard stays down', async () => {
    const { root } = await renderForm();
    const inputs = root.findAll(node => typeof node.props.onChangeText === 'function');
    expect(inputs.length).toBeGreaterThan(0);
    expect(inputs.some(node => node.props.autoFocus)).toBe(false);
  });

  it('records an expense in the chosen wallet, reading a comma as decimal separator', async () => {
    const { root, ref, onClose } = await renderForm();
    await typeInto(root, 'Amount in EUR', '12,50');
    await typeInto(root, 'Description', 'Lunch');
    await press(findButtonWithText(root, 'Card'));
    await press(findButtonWithText(root, 'Add Expense'));

    expect(ref.current!.expense.expenses[0]).toMatchObject({
      title: 'Lunch',
      amount: 12.5,
      walletId: 'w-u1-card',
      paidByUserId: 'u1',
    });
    expect(ref.current!.wallet.balances['w-u1-card']).toBe(-12.5);
    expect(onClose).toHaveBeenCalled();
  });

  it('records income into the first wallet by default', async () => {
    const { root, ref } = await renderForm();
    await press(findButtonWithText(root, 'Income'));
    await typeInto(root, 'Amount in EUR', '1000');
    await typeInto(root, 'Description', 'Salary');
    await press(findButtonWithText(root, 'Add Income'));

    expect(ref.current!.wallet.incomes[0]).toMatchObject({ title: 'Salary', walletId: 'w-u1-cash' });
    expect(ref.current!.wallet.balances['w-u1-cash']).toBe(1000);
  });

  it('rejects a transfer into the same wallet', async () => {
    const { root, ref } = await renderForm();
    await press(findButtonWithText(root, 'Transfer'));
    await typeInto(root, 'Amount in EUR', '5');
    // The "To" row is rendered after "From", so the last "Cash" chip belongs to it
    await press(findButtonWithText(root, 'Cash'));
    await press(findButtonWithText(root, 'Add Transfer'));

    expect(hasText(root, 'Choose two different wallets.')).toBe(true);
    expect(ref.current!.wallet.transfers).toHaveLength(0);
  });

  it('moves money between two wallets', async () => {
    const { root, ref } = await renderForm();
    await press(findButtonWithText(root, 'Transfer'));
    await typeInto(root, 'Amount in EUR', '40');
    await press(findButtonWithText(root, 'Add Transfer'));

    expect(ref.current!.wallet.transfers[0]).toMatchObject({
      fromWalletId: 'w-u1-cash',
      toWalletId: 'w-u1-card',
      amount: 40,
    });
  });
});
