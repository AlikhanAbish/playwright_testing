# Verified locators and observed outcomes (recorded with codegen on practicesoftwaretesting.com)

Config note: `testIdAttribute: 'data-test'` is set, so use `page.getByTestId('x')`
instead of `page.locator('[data-test="x"]')`. Codegen output is a recording, not a
test: ignore the stray clicks, the repeated fills and the `ControlOrMeta+м` presses
(those are paste keystrokes typed on a Russian keyboard layout).
All of this is for page objects only. No locator may appear in a spec file.

## 1. Shared header (base.page.ts)

| Purpose | Locator |
|---|---|
| Sign in link | getByTestId('nav-sign-in') |
| User menu (when signed in) | getByTestId('nav-menu') |
| Sign out | getByTestId('nav-sign-out') (inside nav-menu) |
| Home | getByTestId('nav-home') |
| Cart icon | getByTestId('nav-cart') |

Sign out flow: click nav-menu, then nav-sign-out.

## 2. Login (/auth/login)

| Purpose | Locator |
|---|---|
| Email | getByTestId('email') |
| Password | getByTestId('password') |
| Submit | getByTestId('login-submit') |
| Error message | getByTestId('login-error') |
| Forgot password link | getByTestId('forgot-password-link') |

Observed outcomes:
- Valid (customer@practicesoftwaretesting.com / welcome01): URL becomes
  https://practicesoftwaretesting.com/accounts (note the "s"; regex /\/account/ still matches).
  getByTestId('page-title') contains "My account".
  Paragraph text: "Here you can manage your profile, favorites and orders."
- Invalid (right email, password `wrong123`): getByTestId('login-error') contains
  "Invalid email or password". NOT YET CONFIRMED: that the URL stays on /auth/login.

## 3. Product detail

URL pattern: /product/<id>. The id is generated data and can change, so never hard-code it.
The catalogue card for "Pliers" is data-test="product-01M5N25DH6JNHAZR61KAC3KSAG" and its
id differs from the id in the product URL, so do NOT locate products by these ids.
Locate a card by its visible name instead (see page object below).

| Purpose | Locator |
|---|---|
| Product name | getByTestId('product-name') -> "Pliers" |
| Unit price | getByTestId('unit-price') -> "12.01" |
| Add to cart | getByTestId('add-to-cart') |
| Increase quantity | getByTestId('increase-quantity') |
| Added toast | getByRole('alert') -> "Product added to shopping cart." |

Quantity: click increase-quantity BEFORE add-to-cart to get quantity 2. The first
recording clicked add-to-cart twice by accident.

## 4. Cart (URL: /checkout, step 1)

| Purpose | Locator |
|---|---|
| Item name | getByTestId('product-title') -> "Pliers" |
| Unit price | getByTestId('product-price') -> "$12.01" |
| Quantity (an input) | getByTestId('product-quantity') — use toHaveValue('2'), not toContainText |
| Line total | getByTestId('line-price') -> "$24.02" for quantity 2 |
| Next step | getByTestId('proceed-1') |

## 5. Checkout steps (all on /checkout)

1. After proceed-1, if signed out, an inline login form appears with the same
   email / password / login-submit locators as the login page.
2. proceed-2 (confirms the signed-in step).
3. Billing address: country (select, values 'CA', 'KZ' work), postal_code,
   house_number, street, city, state; then proceed-3.
4. Payment: payment-method (select, value 'bank-transfer'), then bank_name,
   account_name, account_number (a 14-digit number was accepted); then finish.
5. Success: getByTestId('payment-success-message') contains "Payment was successful".

All locators in step 3 and 4 are getByTestId with exactly those names.
Use fake data only (do not commit real names or bank details); put the address and payment
values in data/ as constants or a factory.

## 6. Forgot password (/auth/forgot-password)

| Purpose | Locator |
|---|---|
| Form | getByTestId('forgot-password-form') |
| Email | getByTestId('email') |
| Submit | getByTestId('forgot-password-submit') |
| Client-side email error | getByTestId('email-error') |
| Result message | getByRole('alert') |

Observed outcomes:
- Known email (customer@practicesoftwaretesting.com): the page stays on
  /auth/forgot-password, the email field remains, and getByRole('alert') contains the raw
  text "page.forgot-password.confirm". This is an untranslated i18n key shown by the site,
  which looks like a site bug. Assert on this observed text, and mention in the README that
  it is the site's current behaviour.
- Unknown but valid-looking email (nobody-12345@example.com): getByRole('alert') contains
  "The selected email is invalid." (the site does distinguish known and unknown emails).
- "abc": an element getByTestId('email-error') appears. Its TEXT was not captured, and it is
  unknown whether submit was blocked.

## 7. Suggested page object methods

```ts
// base.page.ts
async signOut() {
  await this.page.getByTestId('nav-menu').click();
  await this.page.getByTestId('nav-sign-out').click();
}

// login.page.ts (add to the class from the brief)
async expectInvalidCredentialsError() {
  await expect(this.page.getByTestId('login-error')).toContainText('Invalid email or password');
  await expect(this.page).toHaveURL(/\/auth\/login/);
}
async expectSignedIn() {
  await expect(this.page).toHaveURL(/\/account/);
  await expect(this.page.getByTestId('page-title')).toContainText('My account');
}

// product.page.ts
async openByName(name: string) {
  // verify this card locator against the live listing before relying on it
  await this.page.getByRole('link').filter({ hasText: name }).first().click();
}
async expectDetails(name: string) {
  await expect(this.page.getByTestId('product-name')).toContainText(name);
}
async readNameAndPrice() {
  const name = (await this.page.getByTestId('product-name').textContent())?.trim() ?? '';
  const price = Number((await this.page.getByTestId('unit-price').textContent())?.replace(/[^0-9.]/g, ''));
  return { name, price };   // a query is fine here: it is data capture, not an assertion
}
async addToCart(quantity = 1) {
  for (let i = 1; i < quantity; i++) await this.page.getByTestId('increase-quantity').click();
  await this.page.getByTestId('add-to-cart').click();
  await expect(this.page.getByRole('alert')).toContainText('Product added to shopping cart.');
}

// cart.page.ts
async expectItem(name: string, unitPrice: string, quantity: number, lineTotal: string) {
  await expect(this.page.getByTestId('product-title')).toContainText(name);
  await expect(this.page.getByTestId('product-price')).toContainText(unitPrice);
  await expect(this.page.getByTestId('product-quantity')).toHaveValue(String(quantity));
  await expect(this.page.getByTestId('line-price')).toContainText(lineTotal);
}

// checkout.page.ts
async completeBankTransfer(addr: Address, bank: BankDetails) {
  await this.page.getByTestId('proceed-1').click();
  // if signed out: sign in through the inline form here
  await this.page.getByTestId('proceed-2').click();
  await this.page.getByTestId('country').selectOption(addr.country);
  // fill postal_code, house_number, street, city, state
  await this.page.getByTestId('proceed-3').click();
  await this.page.getByTestId('payment-method').selectOption('bank-transfer');
  // fill bank_name, account_name, account_number
  await this.page.getByTestId('finish').click();
  await expect(this.page.getByTestId('payment-success-message')).toContainText('Payment was successful');
}
```

## 8. Still missing (do not guess these)

1. Test 4 (compare two products): a SECOND product's name and price. product-name and
   unit-price exist; the second product and the comparison to assert are not yet recorded.
2. Test 1 (register): what happens after register-submit (final URL, signed in or login page).
3. Forgot password with "abc": the text of getByTestId('email-error') and whether the form submits.
4. Login invalid: that the URL stays on /auth/login.
