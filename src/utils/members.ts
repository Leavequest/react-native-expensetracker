import { UserProfile } from '../types';

/** Colours a member can pick for their avatar; `name` is read out by screen readers. */
export const AVATAR_COLORS: ReadonlyArray<{ color: string; name: string }> = [
  { color: '#059669', name: 'Green' },
  { color: '#8B5CF6', name: 'Purple' },
  { color: '#F59E0B', name: 'Amber' },
  { color: '#3B82F6', name: 'Blue' },
  { color: '#EC4899', name: 'Pink' },
  { color: '#10B981', name: 'Mint' },
];

export function getInitials(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .map(part => part[0] ?? '')
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'U'
  );
}

/**
 * Fills in the member fields that older saved data doesn't have.
 * The first member is the household owner.
 */
export function withMemberDefaults(users: UserProfile[]): UserProfile[] {
  return users.map((user, index) => ({
    ...user,
    role: user.role ?? (index === 0 ? 'owner' : 'member'),
    origin: user.origin ?? 'local',
    status: user.status ?? 'active',
  }));
}

export const isOwner = (user: UserProfile): boolean => user.role === 'owner';

export const isPending = (user: UserProfile): boolean => user.status === 'pending';
