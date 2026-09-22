import { CURRENCIES, DEFAULT_CURRENCY } from '../constants';
import { CurrencyCode } from '../types';

/**
 * Formats a numeric amount with the selected currency symbol and 2 decimal places.
 * Example: 48.5 -> "€ 48.50" (or "$ 48.50" / "£ 48.50")
 */
export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode = DEFAULT_CURRENCY
): string {
  const config = CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY];
  const safeAmount = isNaN(amount) ? 0 : amount;
  const isNegative = safeAmount < 0;
  const absAmount = Math.abs(safeAmount);

  // Format with thousands separator and 2 decimal places
  const parts = absAmount.toFixed(2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formattedNumber = `${integerPart}.${parts[1]}`;

  const prefix = isNegative ? '-' : '';

  if (config.position === 'after') {
    return `${prefix}${formattedNumber} ${config.symbol}`;
  }
  return `${prefix}${config.symbol} ${formattedNumber}`;
}

/**
 * Parses user input string into a valid float number.
 * Handles both comma and period as decimal separators, stripping currency symbols.
 */
export function parseCurrencyInput(input: string): number {
  if (!input) return 0;
  // Strip any characters except digits, commas, periods, and minus
  let sanitized = input.replace(/[^0-9.,-]/g, '').trim();
  if (!sanitized) return 0;

  // If there's a comma followed by 1 or 2 digits at the end (e.g. "48,50"), treat comma as decimal
  if (/,\d{1,2}$/.test(sanitized) && !sanitized.includes('.')) {
    sanitized = sanitized.replace(',', '.');
  } else {
    // Otherwise remove commas as thousand separators
    sanitized = sanitized.replace(/,/g, '');
  }

  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}
