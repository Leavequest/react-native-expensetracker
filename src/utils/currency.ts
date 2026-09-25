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
 * Returns the display symbol for a currency code (e.g. "EUR" -> "€").
 */
export function getCurrencySymbol(currencyCode: CurrencyCode): string {
  return (CURRENCIES[currencyCode] || CURRENCIES[DEFAULT_CURRENCY]).symbol;
}

/**
 * Parses user input string into a valid float number.
 * Handles both comma and period as decimal separators, stripping currency symbols.
 * Examples: "48,50" -> 48.5, "1,200.50" -> 1200.5, "1.234,56" -> 1234.56
 */
export function parseCurrencyInput(input: string): number {
  if (!input) return 0;
  // Strip any characters except digits, commas, periods, and minus
  let sanitized = input.replace(/[^0-9.,-]/g, '');
  if (!sanitized) return 0;

  const lastComma = sanitized.lastIndexOf(',');
  const lastDot = sanitized.lastIndexOf('.');

  if (lastComma !== -1 && lastDot !== -1) {
    // Both separators present: whichever comes last is the decimal separator
    sanitized =
      lastComma > lastDot
        ? sanitized.replace(/\./g, '').replace(',', '.')
        : sanitized.replace(/,/g, '');
  } else if (lastComma !== -1) {
    // Only commas: a single comma followed by 1-2 digits (e.g. "48,50") is decimal
    sanitized = /^[^,]*,\d{1,2}$/.test(sanitized)
      ? sanitized.replace(',', '.')
      : sanitized.replace(/,/g, '');
  } else if (sanitized.indexOf('.') !== lastDot) {
    // Multiple dots (e.g. "1.234.567") can only be thousands separators
    sanitized = sanitized.replace(/\./g, '');
  }

  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
}
