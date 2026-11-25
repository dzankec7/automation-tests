import { Page } from '@playwright/test';

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  /** saucedemo exposes stable `data-test` attributes; we select only by them. */
  protected byTest(id: string) {
    return this.page.locator(`[data-test="${id}"]`);
  }
}
