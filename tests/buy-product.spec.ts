import { test, expect } from '../fixtures/pages.fixture';
import { createCheckoutData } from '../data/user.factory';

test('buy two units of Pliers using bank transfer', async ({
  productPage,
  cartPage,
  checkoutPage,
  page,
}) => {
  await productPage.openByName('Pliers');
  const product = await productPage.readNameAndPrice();
  await productPage.addToCart(2);

  await cartPage.open();
  await cartPage.expectItem(
    product.name,
    `$${product.price.toFixed(2)}`,
    2,
    `$${(product.price * 2).toFixed(2)}`,
  );
  await expect(page).toHaveURL(/\/checkout/);
  await checkoutPage.completeBankTransfer(createCheckoutData());
});
