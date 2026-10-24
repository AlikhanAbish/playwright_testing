import { test, expect } from '../fixtures/pages.fixture';
import { createUser } from '../data/user.factory';

test.use({ storageState: { cookies: [], origins: [] } });

test('register a new customer', async ({ registerPage, page }) => {
  const newUser = createUser();

  await registerPage.open();
  await registerPage.register(newUser);
  await expect(page).toHaveURL(/\/accounts?(?:\/|$)|\/auth\/login/);
});
