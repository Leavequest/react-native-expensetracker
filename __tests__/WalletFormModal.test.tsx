import React from 'react';
import { Alert } from 'react-native';
import { toast } from 'sonner-native';
import { WalletFormModal } from '../src/components/wallets';
import { INITIAL_BUDGET } from '../src/constants';
import { useWallet } from '../src/context';
import { defaultWalletsFor } from '../src/utils';
import {
  createProbe,
  findButtonWithText,
  hasText,
  press,
  renderWithProviders,
  typeInto,
} from '../test-utils';

beforeEach(() => jest.clearAllMocks());

describe('WalletFormModal', () => {
  it('creates a wallet for the active member', async () => {
    const onClose = jest.fn();
    const { ref, Probe } = createProbe(useWallet);
    const { root } = await renderWithProviders(
      <>
        <WalletFormModal visible wallet={null} onClose={onClose} />
        <Probe />
      </>
    );

    await typeInto(root, 'Wallet name', 'Savings jar');
    await typeInto(root, 'Opening balance', '250');
    await press(findButtonWithText(root, 'Create wallet'));

    const created = ref.current!.walletsOf('u1').find(w => w.name === 'Savings jar');
    expect(created).toMatchObject({ type: 'cash', openingBalance: 250, ownerId: 'u1' });
    expect(onClose).toHaveBeenCalled();
  });

  it('requires a name', async () => {
    const { root } = await renderWithProviders(
      <WalletFormModal visible wallet={null} onClose={jest.fn()} />
    );
    await press(findButtonWithText(root, 'Create wallet'));
    expect(hasText(root, 'Please enter a wallet name.')).toBe(true);
  });

  it('archives a used wallet and explains why', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.[1]?.onPress?.();
    });
    const [cash, card] = defaultWalletsFor('u1');
    const { root } = await renderWithProviders(
      <WalletFormModal visible wallet={card} onClose={jest.fn()} />,
      {
        state: {
          expenses: {
            budget: INITIAL_BUDGET,
            expenses: [
              {
                id: 'e1',
                title: 'Shoes',
                amount: 40,
                category: 'Shopping',
                date: new Date().toISOString(),
                walletId: card.id,
                paidByUserId: 'u1',
              },
            ],
          },
          wallets: {
            // Opening balance covers the expense, so the wallet is empty but has history
            wallets: [cash, { ...card, openingBalance: 40 }],
            incomes: [],
            transfers: [],
          },
        },
      }
    );

    await press(findButtonWithText(root, 'Delete wallet'));
    expect(toast.success).toHaveBeenCalledWith('Wallet archived — its history is kept');
  });

  it('asks to move the money out before removing a wallet with a balance', async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.[1]?.onPress?.();
    });
    const [cash, card] = defaultWalletsFor('u1');
    const jar = { ...card, id: 'w-jar', name: 'Savings jar', openingBalance: 300 };
    const { root } = await renderWithProviders(
      <WalletFormModal visible wallet={jar} onClose={jest.fn()} />,
      { state: { wallets: { wallets: [cash, card, jar], incomes: [], transfers: [] } } }
    );

    await press(findButtonWithText(root, 'Delete wallet'));
    expect(toast.error).toHaveBeenCalledWith('Move the € 300.00 out of "Savings jar" first.');
  });

  it("refuses to delete the member's last wallet", async () => {
    jest.spyOn(Alert, 'alert').mockImplementation((_title, _message, buttons) => {
      buttons?.[1]?.onPress?.();
    });
    const [cash, card] = defaultWalletsFor('u1');
    const { root } = await renderWithProviders(
      <WalletFormModal visible wallet={cash} onClose={jest.fn()} />,
      { state: { wallets: { wallets: [cash, { ...card, archived: true }], incomes: [], transfers: [] } } }
    );

    await press(findButtonWithText(root, 'Delete wallet'));
    expect(toast.error).toHaveBeenCalledWith('You need at least one wallet.');
  });
});
