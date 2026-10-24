# SIS 2 — Toolshop Playwright tests

This repository contains five independent UI tests for
[Practice Software Testing - Toolshop](https://practicesoftwaretesting.com).
The tests use TypeScript, Playwright Test, and Chromium.

## Install and run

```powershell
npm install
npx playwright install chromium
npx playwright test
```

The `setup` project first tries the supplied secondary seeded account, then
creates and signs in a unique customer if that shared account is unavailable.
It saves browser state to `playwright/.auth/user.json`. The primary seeded
account displayed an account-lock message during verification, so setup does
not rely on it. Tests needing a signed-in customer use that state. The login, registration, and password-reset specs
explicitly start with an empty state.

Run the suite with four workers and full parallel scheduling:

```powershell
npx playwright test --workers=4 --fully-parallel
```

Repeat each test three times:

```powershell
npx playwright test --repeat-each=3
```

Run one spec on its own:

```powershell
npx playwright test tests/login.spec.ts
```

CI-style execution enables two retries:

```powershell
$env:CI = "true"
npx playwright test --workers=4 --fully-parallel
```

To run against another compatible deployment, including the deliberately
buggy build:

```powershell
$env:BASE_URL = "https://with-bugs.practicesoftwaretesting.com/#/"
npx playwright test
Remove-Item Env:BASE_URL
```

The buggy build uses hash-based routing, so its base URL override includes
`/#/`; page objects preserve that routing when they navigate to application
screens. Its registration screen also uses different, inspected selectors for
the combined address and postcode fields; the register page object uses those
variant selectors when the hash-based base URL is selected.

Test recordings are collected on the first retry. The generated storage state,
test results, and HTML reports are excluded from version control.

## What the five tests cover

1. **Register:** creates a new customer using a newly generated email address,
   submits the registration form, and checks that the app routes to the account
   or login page.
2. **Login:** registers a fresh customer as test data, checks that an
   unregistered unique email displays the observed authentication error
   without reaching the account, then logs in through the UI with the new
   customer's valid credentials and checks the account page.
3. **Buy a product:** adds two Pliers to the cart, verifies item, unit price,
   quantity, and calculated line total against the selected product's
   displayed price, then completes checkout using a fake bank-transfer record
   and checks the payment confirmation.
4. **Compare products:** reads the displayed name and price for Pliers and Bolt
   Cutters on their detail pages and asserts that Pliers is cheaper. This is an
   explicit numeric comparison performed by the test; it does not use the
   Toolshop's Compare control. Although the inspected live build displays a
   Compare control, this case remains an independent price comparison per the
   assignment's scope.
5. **Reset password:** submits a known customer email and an unknown but
   valid-looking email and checks the messages visible in the UI. The known
   address currently produces the untranslated text
   `page.forgot-password.confirm`; this is the site's observed behavior, not a
   claim that an email was sent.

## Structure and design

- `tests/` contains one spec for each assignment case. Specs describe outcomes
  and contain no locator construction.
- `pages/` keeps selectors and interactions in page objects. Methods describe
  business actions such as `signIn`, `register`, `addToCart`, and
  `completeBankTransfer`. The forgot-password actions share `LoginPage`
  because they are part of the same authentication flow.
- `fixtures/pages.fixture.ts` supplies the page objects to every test. Tests
  import both `test` and `expect` from this fixture rather than constructing
  page objects themselves.
- `data/user.factory.ts` creates a fresh registration user using a timestamp
  and random UUID. It also supplies fake checkout address and bank-transfer
  data, and defines the seeded account used for authentication and password
  reset. The login case creates its own valid account and uses a generated,
  unregistered email for the negative check; this avoids repeated failed
  attempts against shared seeded accounts.
- `auth.setup.ts` authenticates once and saves the browser storage state. It
  prefers the supplied secondary seeded account and falls back to a unique
  registered account if needed. The Chromium project depends on that setup.
  Specs whose subject is an unauthenticated flow override the state with empty
  cookies and origins. A valid saved state is checked and reused between
  invocations.
- `playwright.config.ts` sets the site's `data-test` attribute as the test ID,
  uses a configurable base URL, and configures a Desktop Chrome device profile.

## Deliberately not automated

- The hosted site cannot expose or deliver a password-reset email to this
  browser test, so the reset test checks only the visible UI result.
- The comparison case does not automate a compare feature. It compares the
  two prices itself, as required by the assignment.
- The tests do not assert global catalogue counts or depend on an assumed
  shared-user state. Registration uses a unique address, and checkout uses
  synthetic address and payment values.
