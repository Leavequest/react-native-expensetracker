/**
 * Generates a reasonably unique id for locally created records.
 * Example: generateId('exp') -> "exp-1727258400000-4821"
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}
