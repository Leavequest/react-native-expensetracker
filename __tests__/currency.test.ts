import { formatCurrency, parseCurrencyInput } from '../src/utils/currency';

describe('currency utilities', () => {
  describe('formatCurrency', () => {
    it('formats EUR currency with European defaults correctly', () => {
      expect(formatCurrency(48.5, 'EUR')).toBe('€ 48.50');
      expect(formatCurrency(0, 'EUR')).toBe('€ 0.00');
      expect(formatCurrency(1250, 'EUR')).toBe('€ 1,250.00');
      expect(formatCurrency(14999.99, 'EUR')).toBe('€ 14,999.99');
    });

    it('formats USD currency correctly', () => {
      expect(formatCurrency(48.5, 'USD')).toBe('$ 48.50');
      expect(formatCurrency(1200, 'USD')).toBe('$ 1,200.00');
    });

    it('formats GBP currency correctly', () => {
      expect(formatCurrency(48.5, 'GBP')).toBe('£ 48.50');
      expect(formatCurrency(250.75, 'GBP')).toBe('£ 250.75');
    });

    it('handles negative values cleanly', () => {
      expect(formatCurrency(-25.5, 'EUR')).toBe('-€ 25.50');
    });

    it('handles NaN gracefully', () => {
      expect(formatCurrency(NaN, 'EUR')).toBe('€ 0.00');
    });
  });

  describe('parseCurrencyInput', () => {
    it('parses European comma decimal notation (e.g., 48,50)', () => {
      expect(parseCurrencyInput('48,50')).toBe(48.5);
      expect(parseCurrencyInput('12,99')).toBe(12.99);
      expect(parseCurrencyInput('3,5')).toBe(3.5);
    });

    it('parses standard dot decimal notation (e.g., 48.50)', () => {
      expect(parseCurrencyInput('48.50')).toBe(48.5);
      expect(parseCurrencyInput('1250.00')).toBe(1250);
    });

    it('strips currency symbols and whitespace', () => {
      expect(parseCurrencyInput('€ 48.50')).toBe(48.5);
      expect(parseCurrencyInput('€48,50')).toBe(48.5);
      expect(parseCurrencyInput('$1,200.50')).toBe(1200.5);
      expect(parseCurrencyInput('£ 99.00')).toBe(99);
    });

    it('returns 0 for invalid inputs', () => {
      expect(parseCurrencyInput('')).toBe(0);
      expect(parseCurrencyInput('abc')).toBe(0);
    });
  });
});
