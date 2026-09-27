import React from 'react';
import { toast } from 'sonner-native';
import { ProfileSheet } from '../src/components/account';
import { useUser } from '../src/context';
import {
  createProbe,
  findByLabel,
  findPressable,
  hasText,
  member,
  press,
  renderWithProviders,
  typeInto,
  userState,
} from '../test-utils';
import { Text } from 'react-native';

const owner = member({ id: 'u1', name: 'You', role: 'owner' });
const maria = member({ id: 'u2', name: 'Maria' });
const state = { user: userState([owner, maria]) };

const findSave = (root: Parameters<typeof hasText>[0]) =>
  findPressable(root, node => node.findAllByType(Text).some(t => t.props.children === 'Save'));

beforeEach(() => jest.clearAllMocks());

describe('ProfileSheet', () => {
  it('saves name, email and colour and recomputes initials', async () => {
    const user = createProbe(useUser);
    const onClose = jest.fn();
    const { root } = await renderWithProviders(
      <>
        <ProfileSheet member={owner} onClose={onClose} />
        <user.Probe />
      </>,
      { state }
    );

    await typeInto(root, 'Name', 'Claudio Rossi');
    await typeInto(root, 'Email', 'claudio@example.com');
    await press(findByLabel(root, 'Avatar colour, blue'));
    await press(findSave(root));

    const saved = user.ref.current!.activeUser;
    expect(saved.name).toBe('Claudio Rossi');
    expect(saved.initials).toBe('CR');
    expect(saved.email).toBe('claudio@example.com');
    expect(saved.avatarColor).toBe('#3B82F6');
    expect(toast.success).toHaveBeenCalledWith('Profile saved');
    expect(onClose).toHaveBeenCalled();
  });

  it('rejects an empty or whitespace-only name', async () => {
    const user = createProbe(useUser);
    const onClose = jest.fn();
    const { root } = await renderWithProviders(
      <>
        <ProfileSheet member={owner} onClose={onClose} />
        <user.Probe />
      </>,
      { state }
    );

    await typeInto(root, 'Name', '   ');
    await press(findSave(root));

    expect(hasText(root, 'Name is required')).toBe(true);
    expect(user.ref.current!.activeUser.name).toBe('You');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('keeps a legacy avatar colour that is not in the swatch list', async () => {
    const user = createProbe(useUser);
    const legacy = member({ id: 'u1', name: 'You', role: 'owner', avatarColor: '#123456' });
    const { root } = await renderWithProviders(
      <>
        <ProfileSheet member={legacy} onClose={jest.fn()} />
        <user.Probe />
      </>,
      { state: { user: userState([legacy]) } }
    );

    const swatches = root.findAll(
      node => node.props.accessibilityRole === 'radio' && typeof node.props.onPress === 'function'
    );
    expect(swatches.some(s => s.props.accessibilityState?.selected)).toBe(false);

    await press(findSave(root));
    expect(user.ref.current!.activeUser.avatarColor).toBe('#123456');
  });

  it("doesn't offer removal for yourself", async () => {
    const { root } = await renderWithProviders(
      <ProfileSheet member={owner} onClose={jest.fn()} />,
      { state }
    );
    expect(findByLabel(root, 'Remove member')).toBeUndefined();
  });

  it('disables removing the owner', async () => {
    const { root } = await renderWithProviders(
      <ProfileSheet member={owner} onClose={jest.fn()} />,
      { state: { user: userState([owner, maria], 'u2') } }
    );

    expect(findByLabel(root, 'Remove member').props.disabled).toBe(true);
    expect(hasText(root, "The household owner can't be removed.")).toBe(true);
  });

  it('removes another member after confirmation', async () => {
    const user = createProbe(useUser);
    const onClose = jest.fn();
    const { root } = await renderWithProviders(
      <>
        <ProfileSheet member={maria} onClose={onClose} />
        <user.Probe />
      </>,
      { state }
    );

    await press(findByLabel(root, 'Remove member'));
    expect(onClose).toHaveBeenCalled();

    await press(
      findPressable(root, node =>
        node.findAllByType(Text).some(t => t.props.children === 'Delete Member')
      )
    );
    expect(user.ref.current!.householdUsers.map(u => u.id)).toEqual(['u1']);
  });

  it('shows member tags', async () => {
    const { root } = await renderWithProviders(
      <ProfileSheet member={owner} onClose={jest.fn()} />,
      { state }
    );
    expect(hasText(root, 'Owner')).toBe(true);
  });
});
