import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Cents, parseCents } from '../utils/money';

export interface OverviewSummary {
  itemPrices: Cents[];
  itemTotal: Cents;
  tax: Cents;
  total: Cents;
}

export class CheckoutOverviewPage extends BasePage {
  readonly title = this.byTest('title');
  readonly itemPrices = this.byTest('inventory-item-price');
  readonly subtotal = this.byTest('subtotal-label');
  readonly tax = this.byTest('tax-label');
  readonly total = this.byTest('total-label');

  async expectLoaded() {
    await expect(this.page).toHaveURL(/checkout-step-two\.html/);
    await expect(this.title).toHaveText('Checkout: Overview');
  }

  /** Reads everything the overview shows, already converted to cents. */
  async summary(): Promise<OverviewSummary> {
    const prices = await this.itemPrices.allInnerTexts();
    return {
      itemPrices: prices.map(parseCents),
      itemTotal: parseCents(await this.subtotal.innerText()),
      tax: parseCents(await this.tax.innerText()),
      total: parseCents(await this.total.innerText()),
    };
  }
}
