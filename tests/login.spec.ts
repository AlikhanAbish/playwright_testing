import { test, expect } from '../fixtures/pages.fixture';
import { createUser } from '../data/user.factory';

test.use({ storageState: { cookies: [], origins: [] } });

test('valid and invalid credentials produce the expected outcomes', async ({
  basePage,
  loginPage,
  registerPage,
  page,
}) => {
  const validUser = createUser();
  await registerPage.open();
  await registerPage.register(validUser);
  await expect(page).toHaveURL(/\/accounts?(?:\/|$)|\/auth\/login/);
  if (await basePage.isOnAccountPage()) {
    await basePage.signOut();
  }

  await loginPage.open();
  const invalidUser = createUser();
  await loginPage.signIn({
    email: invalidUser.email,
    password: 'wrong123',
  });
  await loginPage.expectInvalidCredentialsError();

  await loginPage.signIn(validUser);
  await loginPage.expectSignedIn();
  await expect(page).toHaveURL(/\/accounts?(?:\/|$)/);
});
