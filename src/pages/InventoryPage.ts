import { expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { Cents, parseCents } from '../utils/money';

export class InventoryPage extends BasePage {
  readonly title = this.byTest('title');
  readonly cartLink = this.byTest('shopping-cart-link');
  readonly cartBadge = this.byTest('shopping-cart-badge');

  async open() {
    await this.page.goto('/inventory.html');
    await expect(this.title).toHaveText('Products');
  }

  private item(name: string) {
    return this.byTest('inventory-item').filter({
      has: this.byTest('inventory-item-name').getByText(name, { exact: true }),
    });
  }

  async priceOf(name: string): Promise<Cents> {
    return parseCents(await this.item(name).locator(this.byTest('inventory-item-price')).innerText());
  }

  /** Adds the product and returns the price shown on the listing at that moment. */
  async addToCart(name: string): Promise<Cents> {
    const price = await this.priceOf(name);
    await this.item(name).getByRole('button', { name: 'Add to cart' }).click();
    return price;
  }

  async goToCart() {
    await this.cartLink.click();
  }
}
