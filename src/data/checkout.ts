/** Business constants and test data, kept out of test files. */

/** saucedemo applies a flat 8% sales tax (observed behaviour, see README assumptions). */
export const SAUCE_TAX_RATE = 0.08;

/** Two products used by the checkout scenario. Chosen by name, prices are read from the UI. */
export const CHECKOUT_PRODUCTS = ['Sauce Labs Backpack', 'Sauce Labs Bike Light'] as const;

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/** Tiny factory: unique data per call so parallel tests never share state. */
export function buildCustomer(overrides: Partial<Customer> = {}): Customer {
  const suffix = Math.random().toString(36).slice(2, 7);
  return { firstName: `Test${suffix}`, lastName: `User${suffix}`, postalCode: '71000', ...overrides };
}
