import { test, expect } from '../fixtures/pages.fixture';
import { createUser, seededCustomer } from '../data/user.factory';

test.use({ storageState: { cookies: [], origins: [] } });

test('forgot-password flow distinguishes known and unknown emails', async ({
  loginPage,
  page,
}) => {
  await loginPage.openForgotPassword();
  await loginPage.requestPasswordReset(seededCustomer.email);
  await loginPage.expectPasswordResetResult('page.forgot-password.confirm');
  await expect(page).toHaveURL(/\/auth\/forgot-password/);

  const unknownUser = createUser();
  await loginPage.requestPasswordReset(unknownUser.email);
  await loginPage.expectPasswordResetResult('The selected email is invalid.');
  await expect(page).toHaveURL(/\/auth\/forgot-password/);
});
