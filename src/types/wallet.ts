export type WalletType = 'cash' | 'card';

export interface Wallet {
  id: string;
  /** UserProfile.id of the member who owns the wallet */
  ownerId: string;
  name: string;
  type: WalletType;
  color: string;
  /** Balance before any recorded transaction (may be negative) */
  openingBalance: number;
  /** Hidden from pickers and the carousel; kept so history and balances stay correct */
  archived?: boolean;
}

export interface Income {
  id: string;
  title: string;
  amount: number;
  walletId: string;
  date: string; // ISO string
  notes?: string;
}

export interface Transfer {
  id: string;
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  date: string; // ISO string
  notes?: string;
}
