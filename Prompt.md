
## Prompt used for *Claude Sonnet 5.5 and GPT-6 Luna*

````text
You are helping me complete assignment, "SIS 2", for the course
Software Testing and Debugging. The full brief is in the attached file
SIS_2_Week6_summary.md. Read it completely before doing anything. It is the
source of truth; if this prompt and the file disagree, follow the file and
tell me about the conflict.

## Goal
Create a Playwright + TypeScript test suite with five automated
tests against https://practicesoftwaretesting.com (the Toolshop), meeting
every requirement in the brief.

## Setup
- Initialise a new project with @playwright/test (TypeScript), chromium only.
- Delete the demo tests that the installer generates.
- Add a .gitignore that excludes node_modules, test-results, playwright-report
  and playwright/.auth.

## Required structure (exactly)
tests/register.spec.ts
tests/login.spec.ts
tests/buy-product.spec.ts
tests/compare-products.spec.ts
tests/reset-password.spec.ts
pages/base.page.ts, login.page.ts, register.page.ts, product.page.ts,
      cart.page.ts, checkout.page.ts
fixtures/pages.fixture.ts
data/user.factory.ts
playwright.config.ts
README.md
AI_APPENDIX.md

## Configuration (playwright.config.ts)
- baseURL: https://practicesoftwaretesting.com, so tests use relative goto()
- testIdAttribute: 'data-test'
- trace: 'on-first-retry'
- retries: process.env.CI ? 2 : 0
- chromium project using devices['Desktop Chrome']
- Optional: allow overriding the base URL with an env variable so the suite
  can also run against the deliberately buggy build
  (with-bugs.practicesoftwaretesting.com).
- Login-once setup: an auth.setup.ts project saves storageState to
  playwright/.auth/user.json using the seeded account
  customer@practicesoftwaretesting.com / welcome01. Tests that need a signed-in
  user depend on it. The login, register and reset-password tests must start
  signed out (override storageState to empty for them), and the login test
  must log in through the UI.

## The five tests
1. Register a new customer: a unique new account is created and the user ends
   up signed in or on the login page.
2. Log in: valid credentials reach the account page; invalid ones show the
   error and do not reach it.
3. Buy a product: add to cart, the cart shows the right item and quantity,
   checkout completes.
4. Compare two products: open two products, capture name and price, and
   assert the comparison I state. The Toolshop has no compare feature, so the
   test performs the comparison itself. Choose a clear, explicit comparison
   (for example, which product is cheaper, or that the two prices differ)
   and document the choice in the README.
5. Reset a password: the forgot-password flow shows the expected confirmation
   for a known email and an error for an invalid one. The hosted site cannot
   show a reset email, so assert only the observable UI outcome.

Each test must be independent, create its own data, and pass when run alone, in
any order, and in parallel.

## Hard rules (each one costs marks if broken)
- No locator of any kind in a spec file. All locators live in page objects.
- Page objects expose business actions (e.g. signIn(user), addToCart()), not
  one getter per element.
- Specs import `test` and `expect` from fixtures/pages.fixture.ts. No spec
  writes `new SomePage(page)`.
- At least one fixture; fixtures provide the page objects.
- No waitForTimeout anywhere. Use web-first assertions instead.
- No CSS class selectors and no positional XPath. Prefer getByRole and
  getByTestId. Prefer filter() over nth().
- Every test has at least one meaningful assertion that could actually fail.
  Use await on every assertion. Do not assert with a query
  (expect(await x.textContent())...).
- Do not assert on global state such as "there are exactly N products". Assert
  on what the test itself created or selected.
- Registration data comes from data/user.factory.ts and must be unique on
  every run (timestamp or faker). Never hard-code a new account.
- This is a shared public site: never assume I am the only user.
- Seeded accounts for tests that need an existing user:
  customer@practicesoftwaretesting.com / welcome01 and
  customer2@practicesoftwaretesting.com / welcome01.

## Locators: do not guess
The data-test attribute names change between sprints and must not be copied
from tutorials. Find the real names by inspecting the live site (browse it,
use `npx playwright codegen https://practicesoftwaretesting.com`, or fetch the
page DOM). If you have no internet access or cannot inspect the site, STOP and
tell me exactly which locators you could not verify. Do not invent them. I
will supply them from codegen/DevTools.

## Verification (do this and report the output)
1. `npm install` then `npx playwright test` from a clean state: all green.
2. Run with `--workers=4 --fully-parallel` and again with `--repeat-each=3`:
   still green.
3. Run each spec file alone: still green.
4. Run against the buggy build if the base URL override is in place, and tell
   me which tests fail, which shows whether the assertions really assert.
5. Grep the repo and confirm: no waitForTimeout, no locator calls in tests/,
   no CSS class selectors, no positional XPath.

## README.md must contain
How to install and run (including CI-style run), what each of the five tests
covers, the structure and why (page objects, fixtures, data factory, login
once), what I chose not to automate and why, and the explicit comparison used
in test 4.

## AI_APPENDIX.md
This course allows AI at Level 1, which requires the prompts used and my
corrections to be attached. Create AI_APPENDIX.md containing: this prompt
verbatim, a short log of what you generated, and an empty "My review and
corrections" section with headings for each file. I will fill in that section
myself. Do not write my corrections for me.

## Working style
Work step by step: setup, config, data factory, page objects, fixtures, then
specs one at a time, running each spec as you finish it. At the end, give me a
summary of every file created and anything you were unsure about.
````

## Generation log

- Initialized the npm project and added Playwright Test, TypeScript, the
  Chromium configuration, and ignore rules.
- Added a timestamp-and-UUID user factory and synthetic checkout data.
- Implemented page objects, shared fixtures, and a one-time authentication
  setup that tries the supplied secondary seeded account and falls back to a
  fresh account when the shared account is unavailable.
- Added the five requested specs and this README.
- Used the supplied observed locator/outcome notes and checked the live
  Toolshop where available; assertions are limited to observable UI outcomes.
- The primary seeded account displayed a lockout message. The setup tries the
  supplied secondary seeded account, falls back to a fresh account if needed,
  and reuses a valid saved state between runs.

