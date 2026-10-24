# SIS 2 — Web automation with Playwright

---

## 1. At a glance

| Item | Detail |
|---|---|
| **Assignment** | SIS 2 — five Playwright tests on a real application |
| **Application under test** | https://practicesoftwaretesting.com (the Toolshop) |
| **Language / runner** | TypeScript with @playwright/test |
| **Submission** | A repository; the link goes in the course chat |
| **AI policy** | Level 1: allowed, with prompts and corrections attached as an appendix |


## 2. Where SIS 2 appears in the session plan

*Slides 2 and 3*

- Learning outcome (last item on "By 22:00 you will be able to"): Start SIS 2 tonight, not the evening before the deadline.
- Tonight's agenda, final item: SIS 2 brief — five tests on a real application.
- Preceding agenda items that feed into SIS 2: languages, project anatomy and configuration; elements and methods (actions, queries, assertions); codegen, UI mode, trace viewer; structuring a real suite (page objects, fixtures, login once).

## 3. The brief — the application

*Slide 27*

- https://practicesoftwaretesting.com — the Toolshop. An Angular front end over a real REST API, built specifically for practising testing.
- It has registration, login, password reset, a product catalogue with filters and sorting, a cart, a checkout, favourites and an account area.
- Seeded accounts: customer@practicesoftwaretesting.com / welcome01, and customer2@practicesoftwaretesting.com / welcome01.
- Elements are marked with data-test attributes, which is why the config sets testIdAttribute. Find the real names yourself with codegen or DevTools. Do not copy them from a tutorial; they change between sprints.
- There is also a deliberately buggy build at with-bugs.practicesoftwaretesting.com. Not required, but running your suite against it is the best way to prove your assertions actually assert something.

## 4. The five tests

*Slide 28*

| # | Test case | What it must prove |
|---|---|---|
| 1 | Register a new customer | A unique new account is created and the user ends up signed in or on the login page |
| 2 | Log in | Valid credentials reach the account page; invalid ones show the error and do not |
| 3 | Buy a product | Add to cart → cart shows the right item and quantity → checkout completes |
| 4 | Compare two products | Open two products, capture name and price, assert the comparison you state |
| 5 | Reset a password | The forgot-password flow gives the expected confirmation for a known email, and an error for an invalid one |

> Each test is independent and creates whatever data it needs. No test may depend on another having run first.

## 5. The structure you will submit

*Slide 20*

```
tests/
  register.spec.ts
  login.spec.ts
  buy-product.spec.ts
  compare-products.spec.ts
  reset-password.spec.ts
pages/
  base.page.ts
  login.page.ts
  register.page.ts
  product.page.ts
  cart.page.ts
  checkout.page.ts
fixtures/
  pages.fixture.ts
data/
  user.factory.ts
playwright.config.ts
```

| Element | Requirement |
|---|---|
| **One spec per test case** | Five cases, five files. Easy to find, easy to grade. |
| **One page object per screen** | Business actions, not element wrappers. |
| **A fixture layer** | So no test ever writes "new LoginPage(page)". |
| **A data factory** | Registration needs a unique email every single run. |
| **A README** | How to run it, what it covers, what you chose not to automate. |

## 6. How it is graded

*Slide 29*

| Criterion | What is checked |
|---|---|
| **It runs** | Clean clone, npm install, npx playwright test — and it goes green without your laptop. If it cannot be run, it scores zero. This is not a formality. |
| **It is structured** | Page objects used by the specs. No locator anywhere in a spec file. At least one fixture. Unique data generated per run where required. |
| **It asserts** | Every test has an assertion that could fail. A test with no meaningful assertion scores nothing, however neat the code. |
| **Plus** | The README, and the AI appendix — Level 1: prompts and your corrections attached. |

## 7. Rules, deadline, and the things that cost marks

*Slide 30*

- Deadline: week 8. Submitted as a repository — the link goes in the course chat.
- No waitForTimeout anywhere. Not one. If you think you need it, you need a web-first assertion instead.
- No CSS classes and no positional XPath in locators.
- Tests must pass when run in any order and in parallel.
- AI is Level 1: allowed, with prompts and corrections in an appendix. Undisclosed use is treated as plagiarism — and a model will happily write you a suite with no assertions, which fails on the third criterion anyway.
- The README explains each decision, with md files containing the prompts you used and why, your review and your corrections. That section carries real marks.

## 8. Supporting material the SIS 2 requirements rely on

### 8.1 Test data — the part that will break your suite (slide 25)

- Registration needs an email nobody has used. Generate a fresh one every run — a timestamp suffix, or faker.
- Never reuse a hard-coded new account between runs. The second run fails with "email already exists" and you will blame Playwright.
- For tests that need an existing account, use the seeded ones: customer@practicesoftwaretesting.com / welcome01.
- Keep data out of the spec. A factory function in data/ returns a fresh user object; the test just asks for one.
- This is a shared public application. Other people are using it at the same time as you — never write a test that assumes it is the only user.

### 8.2 The four config settings that matter (slide 19)

```ts
export default defineConfig({
  use: {
    baseURL: 'https://practicesoftwaretesting.com',   // 1. relative goto()
    testIdAttribute: 'data-test',                     // 2. getByTestId maps here
    trace: 'on-first-retry',                          // 3. a recording when it fails
  },
  retries: process.env.CI ? 2 : 0,                    // 4. retry in CI only
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
  ],
});
```

- Setting 2 is the one nobody knows about. The application marks elements with data-test, not data-testid — one line of config and getByTestId works throughout.
- Setting 3 costs nothing on a green run and saves an hour on a red one.

### 8.3 A page object, concretely (slide 22)

`pages/login.page.ts`

```ts
import { Page, Locator } from '@playwright/test';
export class LoginPage {
  private email: Locator;
  private password: Locator;
  private submit: Locator;
  constructor(private page: Page) {
    this.email = page.getByTestId('email');
    this.password = page.getByTestId('password');
    this.submit = page.getByTestId('login-submit');
  }
  async open() { await this.page.goto('/auth/login'); }
  async signIn(user: User) {
    await this.email.fill(user.email);
    await this.password.fill(user.password);
    await this.submit.click();
  }
}
```

`tests/login.spec.ts`

```ts
test('valid credentials open the account page',
  async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.signIn(existingCustomer);
    await expect(page).toHaveURL(/\/account/);
  });
// Note what is NOT here:
//   no locators
//   no page.goto with a raw path
//   no knowledge of how login works
//
// The test says what. The page object says how.
```

Reference link on slide 21: https://playwright.dev/docs/pom

### 8.4 Fixtures: handing page objects to every test (slide 23)

`fixtures/pages.fixture.ts`

```ts
import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});
export { expect } from '@playwright/test';
```

- Every spec imports test from your fixture file instead of from Playwright, and page objects arrive ready to use.
- Fixtures are also where you put setup and teardown that several tests share — seeding data, creating a user, cleaning up afterwards. Anything you were about to put in beforeEach in three files belongs here instead.

### 8.5 Log in once, not forty times (slide 24)

```ts
// auth.setup.ts — runs once, before everything else
setup('authenticate', async ({ page }) => {
  await page.goto('/auth/login');
  // … sign in …
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});
// playwright.config.ts
projects: [
  { name: 'setup', testMatch: /auth\.setup\.ts/ },
  { name: 'chromium', dependencies: ['setup'],
    use: { storageState: 'playwright/.auth/user.json' } },
]
```

- Logging in through the UI in every test is slow, and it makes forty tests fail when the login page breaks.
- Do it once, save the cookies and local storage, and every later test starts already signed in. Your login test still logs in through the UI — that is the one test whose subject is login.

### 8.6 Tools for building and debugging the tests (slides 15–17)

- Codegen: `npx playwright codegen https://practicesoftwaretesting.com` (add `--save-storage=auth.json` to save a session). Good as a locator finder and first draft; it produces no assertions, no structure, hard-coded data and a generic test name. Record in two minutes, spend ten making it a test.
- UI mode: `npx playwright test --ui` — watch mode with time travel and a locator picker.
- Trace viewer: `npx playwright show-trace trace.zip` — produced automatically with trace: on-first-retry.
- Also: `--debug` for stepping, `--headed` to watch, `page.pause()` to stop where you choose.

## 9. Speaker notes that mention SIS

*Notes attached to the slides, written for the lecturer; included here because they clarify the SIS requirements.*

| Slide | Note |
|---|---|
| **2** | The syllabus outcome for this week is "apply test automation to a web application". The SIS brief at the end is where that gets assessed. |
| **20** | This exact structure is the one required by the SIS brief, so photograph this slide. |
| **27** | The buggy build is the optional extra worth mentioning twice: a suite that goes green against the buggy version has no assertions. |
| **28** | (1) The Toolshop has no built-in "compare" feature — case 4 is a comparison your test performs, not a feature it exercises; the handout gives students two acceptable shapes. (2) The hosted version cannot show students a reset email, so case 5 is scoped to the observable UI outcome. |
| **29** | Say the middle card out loud twice. The no-locators-in-specs rule is objective, easy to check, and it forces the architecture. |
| **30** | The shuffled-order run is worth announcing: it catches the single most common structural failure, tests that only pass because an earlier test logged in. |
| **25** | Assert on what your test created, not on global state: a test that asserts "there are exactly 9 products" may be true today and false next month. |
| **24** | Add playwright/.auth to .gitignore — never commit a session. |
| **22** | A locator may never appear in a spec file. Also avoid the opposite failure — a page object with a getter for every element and no business actions is just a slower way to write locators. |


https://practicesoftwaretesting.com/accounts
https://practicesoftwaretesting.com/product/01M5N25DGY9ZN6MFAREZF4MGZP
https://practicesoftwaretesting.com/checkout

https://practicesoftwaretesting.com/auth/forgot-password
поле email осталось на странице