import React from 'react';
import { AccountSheetProvider } from '../src/components/account';
import { useUser } from '../src/context';
import { CurrencyPickerModal } from '../src/screens/settings/CurrencyPickerModal';
import { HouseholdSection } from '../src/screens/settings/HouseholdSection';
import { createProbe, findByLabel, member, press, renderWithProviders, userState } from '../test-utils';

describe('CurrencyPickerModal', () => {
  it('switches the currency and closes', async () => {
    const onClose = jest.fn();
    const { ref, Probe } = createProbe(useUser);
    const { root } = await renderWithProviders(
      <>
        <CurrencyPickerModal visible onClose={onClose} />
        <Probe />
      </>
    );

    await press(findByLabel(root, 'US Dollar ($)'));
    expect(ref.current!.currency).toBe('USD');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('HouseholdSection', () => {
  it("opens a member's profile sheet", async () => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AccountSheetProvider onManageHousehold={jest.fn()}>{children}</AccountSheetProvider>
    );
    const { root } = await renderWithProviders(<HouseholdSection />, {
      state: {
        user: userState([member({ id: 'u1', name: 'You', role: 'owner' }), member({ id: 'u2', name: 'Maria' })]),
      },
      wrapper: Wrapper,
    });

    const profileSheet = () =>
      root.findAll(
        node => node.props.title === 'Household member' && typeof node.props.visible === 'boolean'
      )[0];
    expect(profileSheet().props.visible).toBe(false);

    await press(findByLabel(root, 'Maria'));
    expect(profileSheet().props.visible).toBe(true);
  });
});
