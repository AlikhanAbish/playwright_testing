import { test, expect } from '../fixtures/pages.fixture';

test('Pliers costs less than Bolt Cutters', async ({ productPage }) => {
  await productPage.openByName('Pliers');
  const pliers = await productPage.readNameAndPrice();

  await productPage.openByName('Bolt Cutters');
  const boltCutters = await productPage.readNameAndPrice();

  await expect(pliers.name).toBe('Pliers');
  await expect(boltCutters.name).toBe('Bolt Cutters');
  await expect(pliers.price).toBeLessThan(boltCutters.price);
});
