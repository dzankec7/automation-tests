/**
 * Money is handled in integer cents so that sums and rounding never suffer from
 * floating-point errors (0.1 + 0.2 !== 0.3).
 */
export type Cents = number;

/** "$29.99", "Item total: $29.99", "Tax: $2.40" -> 2999 */
export function parseCents(text: string): Cents {
  const match = text.match(/\$\s*(\d+(?:\.\d{1,2})?)/);
  if (!match) throw new Error(`No price found in "${text}"`);
  return Math.round(parseFloat(match[1]) * 100);
}

export const sum = (values: Cents[]): Cents => values.reduce((a, b) => a + b, 0);

/** Tax rounded half-up to whole cents, as a cashier would. */
export const taxFor = (amount: Cents, rate: number): Cents => Math.round(amount * rate);
