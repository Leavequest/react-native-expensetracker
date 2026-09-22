export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  position: 'before' | 'after';
}

export interface UserProfile {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
  email: string;
  isCurrentUser: boolean;
}
