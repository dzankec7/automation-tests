import { expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly items = this.byTest('inventory-item');
  readonly checkoutButton = this.byTest('checkout');

  async expectItemCount(count: number) {
    await expect(this.items).toHaveCount(count);
  }

  async checkout() {
    await this.checkoutButton.click();
  }
}
