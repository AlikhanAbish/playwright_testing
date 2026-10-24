import { expect, type Page } from '@playwright/test';
import type { CheckoutData } from '../data/user.factory';

export class CheckoutPage {
  constructor(private readonly page: Page) {}

  async completeBankTransfer(data: CheckoutData): Promise<void> {
    await this.page.getByTestId('proceed-1').click();
    await this.page.getByTestId('proceed-2').click();

    await this.page.getByTestId('country').selectOption(data.address.country);
    await this.page.getByTestId('postal_code').fill(data.address.postalCode);
    await this.page.getByTestId('house_number').fill(data.address.houseNumber);
    await this.page.getByTestId('street').fill(data.address.street);
    await this.page.getByTestId('city').fill(data.address.city);
    await this.page.getByTestId('state').fill(data.address.state);
    await this.page.getByTestId('proceed-3').click();

    await this.page.getByTestId('payment-method').selectOption('bank-transfer');
    await this.page.getByTestId('bank_name').fill(data.bank.name);
    await this.page.getByTestId('account_name').fill(data.bank.accountName);
    await this.page.getByTestId('account_number').fill(data.bank.accountNumber);
    await this.page.getByTestId('finish').click();

    await expect(this.page.getByTestId('payment-success-message')).toContainText(
      'Payment was successful',
    );
  }
}
