import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { toast } from 'sonner-native';
import { AccountSheet, AccountSheetProvider } from '../src/components/account';
import { Header } from '../src/components/common';
import { useUser } from '../src/context';
import {
  Instance,
  createProbe,
  findByLabel,
  hasText,
  member,
  press,
  renderWithProviders,
  userState,
} from '../test-utils';

const owner = member({ id: 'u1', name: 'You', role: 'owner' });
const maria = member({ id: 'u2', name: 'Maria' });
const pendingPaolo = member({ id: 'u3', name: 'Paolo', origin: 'invited', status: 'pending' });

beforeEach(() => jest.clearAllMocks());

function renderSheet(users = [owner, maria]) {
  const handlers = { onClose: jest.fn(), onEditProfile: jest.fn(), onManageHousehold: jest.fn() };
  const user = createProbe(useUser);
  const rendered = renderWithProviders(
    <>
      <AccountSheet visible {...handlers} />
      <user.Probe />
    </>,
    { state: { user: userState(users) } }
  );
  return { rendered, handlers, user };
}

// Simulates the bottom sheet finishing its close animation
async function finishDismiss(root: Instance) {
  const sheet = root.findAll(node => typeof node.props.onDismiss === 'function')[0];
  await ReactTestRenderer.act(async () => {
    sheet.props.onDismiss();
  });
}

describe('AccountSheet', () => {
  it('shows the current member with their tags', async () => {
    const { rendered } = renderSheet();
    const { root } = await rendered;
    expect(hasText(root, 'You')).toBe(true);
    expect(hasText(root, 'Owner')).toBe(true);
  });

  it('switches member, closes and confirms with a toast', async () => {
    const { rendered, handlers, user } = renderSheet();
    const { root } = await rendered;

    await press(findByLabel(root, 'Switch to Maria'));

    expect(user.ref.current!.activeUser.id).toBe('u2');
    expect(handlers.onClose).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith('Switched to Maria');
  });

  it('hides "Switch to" when there is only one member', async () => {
    const { rendered } = renderSheet([owner]);
    const { root } = await rendered;
    expect(hasText(root, 'Switch to')).toBe(false);
  });

  it("doesn't let you switch to a pending member", async () => {
    const { rendered } = renderSheet([owner, pendingPaolo]);
    const { root } = await rendered;
    const row = findByLabel(root, 'Switch to Paolo');
    expect(row.props.disabled).toBe(true);
    expect(hasText(root, 'Pending')).toBe(true);
  });

  it('opens the profile of the current member', async () => {
    const { rendered, handlers } = renderSheet();
    const { root } = await rendered;
    await press(findByLabel(root, 'Edit profile'));
    expect(handlers.onEditProfile).toHaveBeenCalledWith(expect.objectContaining({ id: 'u1' }));
  });

  it('navigates to Settings only after the sheet has closed', async () => {
    const { rendered, handlers } = renderSheet();
    const { root } = await rendered;

    await press(findByLabel(root, 'Manage household'));
    expect(handlers.onClose).toHaveBeenCalled();
    expect(handlers.onManageHousehold).not.toHaveBeenCalled();

    await finishDismiss(root);
    expect(handlers.onManageHousehold).toHaveBeenCalledTimes(1);
  });

  it("doesn't navigate when the sheet is dragged closed", async () => {
    const { rendered, handlers } = renderSheet();
    const { root } = await rendered;
    await finishDismiss(root);
    expect(handlers.onManageHousehold).not.toHaveBeenCalled();
  });
});

describe('Header', () => {
  it('opens the account sheet from the avatar', async () => {
    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AccountSheetProvider onManageHousehold={jest.fn()}>{children}</AccountSheetProvider>
    );
    const { root } = await renderWithProviders(<Header title="Expenses" />, {
      state: { user: userState([owner]) },
      wrapper: Wrapper,
    });

    const accountSheet = () =>
      root.findAll(node => node.props.title === 'Account' && typeof node.props.visible === 'boolean')[0];
    expect(accountSheet().props.visible).toBe(false);

    await press(findByLabel(root, 'Account, You'));
    expect(accountSheet().props.visible).toBe(true);
  });
});
