import { test, expect } from '../../src/fixtures';
import { authFile, UserKey } from '../../src/config/env';
import { CHECKOUT_PRODUCTS, SAUCE_TAX_RATE, buildCustomer } from '../../src/data/checkout';
import { sum, taxFor } from '../../src/utils/money';

interface Scenario {
  user: UserKey;
  tags: string[];
  /** Set when the scenario is blocked by a known, tracked product defect. */
  knownDefect?: string;
}

const scenarios: Scenario[] = [
  { user: 'standard', tags: ['@smoke', '@regression'] },
  {
    user: 'problem',
    tags: ['@regression'],
    knownDefect:
      'KNOWN DEFECT (problem_user): typing into "Last Name" on checkout step one does not keep the value, ' +
      'so Continue fails with "Last Name is required" and the overview is never reached.',
  },
];

for (const { user, tags, knownDefect } of scenarios) {
  test.describe(`checkout as ${user}_user`, () => {
    test.use({ storageState: authFile(user) });

    test(
      'overview item total, tax and total agree with the item prices',
      {
        tag: tags,
        annotation: knownDefect ? [{ type: 'issue', description: knownDefect }] : [],
      },
      async ({ inventoryPage, cartPage, checkoutInfoPage, checkoutOverviewPage }) => {
        // Expected failure: visible in the report, keeps the build green, and turns
        // red ("unexpected pass") once the defect is fixed, forcing us to remove it.
        test.fail(!!knownDefect, knownDefect);

        await inventoryPage.open();
        const listedPrices = [];
        for (const product of CHECKOUT_PRODUCTS) {
          listedPrices.push(await inventoryPage.addToCart(product));
        }
        await expect(inventoryPage.cartBadge).toHaveText(String(CHECKOUT_PRODUCTS.length));

        await inventoryPage.goToCart();
        await cartPage.expectItemCount(CHECKOUT_PRODUCTS.length);
        await cartPage.checkout();

        await checkoutInfoPage.fill(buildCustomer());
        await checkoutInfoPage.continue();
        await checkoutOverviewPage.expectLoaded();

        const summary = await checkoutOverviewPage.summary();
        const expectedItemTotal = sum(listedPrices);
        const expectedTax = taxFor(expectedItemTotal, SAUCE_TAX_RATE);

        expect.soft(summary.itemPrices.toSorted(), 'overview prices = listed prices').toEqual(listedPrices.toSorted());
        expect.soft(summary.itemTotal, 'item total = sum of item prices').toBe(expectedItemTotal);
        expect.soft(summary.tax, `tax = ${Math.round(SAUCE_TAX_RATE * 100)}% of item total`).toBe(expectedTax);
        expect.soft(summary.total, 'total = item total + tax').toBe(expectedItemTotal + expectedTax);
      },
    );
  });
}
