import { test as setup } from '../src/fixtures';
import { env, authFile, UserKey } from '../src/config/env';

/**
 * Logs in once per user and saves the browser state (cookies + localStorage).
 * UI tests start already authenticated, so no test logs in by itself.
 */
for (const user of Object.keys(env.users) as UserKey[]) {
  setup(`authenticate ${env.users[user]}`, async ({ page, loginPage }) => {
    await loginPage.open();
    await loginPage.login(env.users[user], env.password);
    await page.context().storageState({ path: authFile(user) });
  });
}
