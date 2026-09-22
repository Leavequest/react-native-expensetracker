import { CurrencyCode, CurrencyConfig } from '../types';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    label: 'Euro (€)',
    position: 'before',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    label: 'US Dollar ($)',
    position: 'before',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    label: 'British Pound (£)',
    position: 'before',
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'EUR';
