export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  position: 'before' | 'after';
}

export type MemberRole = 'owner' | 'member';
export type MemberOrigin = 'local' | 'invited';
export type MemberStatus = 'active' | 'pending';

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  email: string;
  isCurrentUser: boolean;
  /** Filled with defaults when saved data is loaded; a future backend supplies real values */
  role?: MemberRole;
  origin?: MemberOrigin;
  status?: MemberStatus;
}
