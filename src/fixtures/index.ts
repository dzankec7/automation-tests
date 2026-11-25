import { test as base, expect, request as playwrightRequest } from '@playwright/test';
import { env } from '../config/env';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutInfoPage } from '../pages/CheckoutInfoPage';
import { CheckoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { UsersClient } from '../api/UsersClient';
import { PostsClient } from '../api/PostsClient';

type Pages = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutInfoPage: CheckoutInfoPage;
  checkoutOverviewPage: CheckoutOverviewPage;
};

type Api = {
  usersClient: UsersClient;
  postsClient: PostsClient;
};

/**
 * Tests ask for what they need by name; fixtures build and dispose it.
 * Every test gets fresh instances, so tests stay independent and parallel-safe.
 */
export const test = base.extend<Pages & Api & { apiContext: Awaited<ReturnType<typeof playwrightRequest.newContext>> }>({
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  inventoryPage: async ({ page }, use) => use(new InventoryPage(page)),
  cartPage: async ({ page }, use) => use(new CartPage(page)),
  checkoutInfoPage: async ({ page }, use) => use(new CheckoutInfoPage(page)),
  checkoutOverviewPage: async ({ page }, use) => use(new CheckoutOverviewPage(page)),

  // Own request context with the API base URL, independent of the UI baseURL.
  apiContext: async ({}, use) => {
    const context = await playwrightRequest.newContext({ baseURL: env.apiBaseUrl });
    await use(context);
    await context.dispose();
  },
  usersClient: async ({ apiContext }, use) => use(new UsersClient(apiContext)),
  postsClient: async ({ apiContext }, use) => use(new PostsClient(apiContext)),
});

export { expect };
