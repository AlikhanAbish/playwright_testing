import { existsSync, mkdirSync } from 'node:fs';
import { test, expect } from './fixtures/pages.fixture';
import { createUser, seededCustomer } from './data/user.factory';
import { LoginPage } from './pages/login.page';
import { BasePage } from './pages/base.page';

const authFile = 'playwright/.auth/user.json';
const baseURL = process.env.BASE_URL || 'https://practicesoftwaretesting.com';

test.setTimeout(60_000);

test('prepare signed-in browser state', async ({
  browser,
  basePage,
  loginPage,
  registerPage,
  page,
}) => {
  if (existsSync(authFile)) {
    const cachedContext = await browser.newContext({
      baseURL,
      storageState: authFile,
    });
    try {
      const cachedPage = await cachedContext.newPage();
      const cachedBasePage = new BasePage(cachedPage);
      await cachedBasePage.navigate('/account');
      if (
        (await cachedBasePage.isOnAccountPage()) &&
        (await cachedBasePage.isSignedIn())
      ) {
        await new LoginPage(cachedPage).expectSignedIn();
        return;
      }
    } finally {
      await cachedContext.close();
    }
  }

  await loginPage.open();
  await loginPage.signIn(seededCustomer);
  if (!(await basePage.isSignedIn())) {
    const authUser = createUser();
    await registerPage.open();
    await registerPage.register(authUser);
    await expect(page).toHaveURL(/\/accounts?(?:\/|$)|\/auth\/login/);
    if (!(await basePage.isSignedIn())) {
      await loginPage.open();
      await loginPage.signIn(authUser);
    }
  }
  await loginPage.expectSignedIn();

  mkdirSync('playwright/.auth', { recursive: true });
  await page.context().storageState({ path: authFile });
});
