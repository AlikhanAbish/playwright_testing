import { expect, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('/checkout');
  }

  async expectItem(
    name: string,
    unitPrice: string,
    quantity: number,
    lineTotal: string,
  ): Promise<void> {
    await expect(this.page.getByTestId('product-title')).toContainText(name);
    await expect(this.page.getByTestId('product-price')).toContainText(unitPrice);
    await expect(this.page.getByTestId('product-quantity')).toHaveValue(
      String(quantity),
    );
    await expect(this.page.getByTestId('line-price')).toContainText(lineTotal);
  }
}
