import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export interface ProductDetails {
  name: string;
  price: number;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async openByName(name: string): Promise<void> {
    await this.navigate('/');
    const exactBeginning = new RegExp(`^${escapeRegExp(name)}(?:\\s|$)`);
    await this.page.getByRole('link', { name: exactBeginning }).click();
    await this.expectDetails(name);
  }

  async expectDetails(name: string): Promise<void> {
    await expect(this.page.getByTestId('product-name')).toContainText(name);
  }

  async readNameAndPrice(): Promise<ProductDetails> {
    const name = (await this.page.getByTestId('product-name').innerText()).trim();
    const priceText = await this.page.getByTestId('unit-price').innerText();
    const price = Number(priceText.replace(/[^0-9.]/g, ''));

    if (!name || !Number.isFinite(price)) {
      throw new Error('Product name or price was missing from the product detail page.');
    }

    return { name, price };
  }

  async addToCart(quantity = 1): Promise<void> {
    for (let count = 1; count < quantity; count += 1) {
      await this.page.getByTestId('increase-quantity').click();
    }
    await this.page.getByTestId('add-to-cart').click();
    await expect(this.page.getByRole('alert')).toContainText(
      'Product added to shopping cart.',
    );
  }
}
