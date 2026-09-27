import { getInitials, isOwner, isPending, withMemberDefaults } from '../src/utils/members';
import { UserProfile } from '../src/types';

const base = (id: string, name: string): UserProfile => ({
  id,
  name,
  initials: name.slice(0, 2).toUpperCase(),
  avatarColor: '#059669',
  email: `${id}@example.com`,
  isCurrentUser: false,
});

describe('members', () => {
  it('makes the first member the owner and fills local/active defaults', () => {
    const [first, second] = withMemberDefaults([base('u1', 'You'), base('u2', 'Maria')]);
    expect([first.role, first.origin, first.status]).toEqual(['owner', 'local', 'active']);
    expect([second.role, second.origin, second.status]).toEqual(['member', 'local', 'active']);
  });

  it('keeps values that are already set', () => {
    const [first, second] = withMemberDefaults([
      { ...base('u1', 'You'), role: 'member' },
      { ...base('u2', 'Maria'), role: 'owner', origin: 'invited', status: 'pending' },
    ]);
    expect(first.role).toBe('member');
    expect([second.role, second.origin, second.status]).toEqual(['owner', 'invited', 'pending']);
  });

  it('computes initials from the name', () => {
    expect(getInitials('claudio rossi')).toBe('CR');
    expect(getInitials('   ')).toBe('U');
  });

  it('answers owner / pending questions', () => {
    expect(isOwner({ ...base('u1', 'You'), role: 'owner' })).toBe(true);
    expect(isOwner(base('u1', 'You'))).toBe(false);
    expect(isPending({ ...base('u1', 'You'), status: 'pending' })).toBe(true);
  });
});
