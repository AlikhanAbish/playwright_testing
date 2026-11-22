import type { Page } from '@playwright/test';
import type { User } from '../data/user.factory';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('/auth/register');
  }

  async register(user: User): Promise<void> {
    await this.page.getByTestId('first-name').fill(user.firstName);
    await this.page.getByTestId('last-name').fill(user.lastName);
    await this.page.getByTestId('dob').fill(user.dateOfBirth);
    await this.page.getByTestId('country').selectOption(user.country);
    if ((process.env.BASE_URL || '').includes('/#/')) {
      await this.page
        .getByTestId('address')
        .fill(`${user.houseNumber} ${user.street}`);
      await this.page.getByTestId('postcode').fill(user.postalCode);
    } else {
      await this.page.getByTestId('postal_code').fill(user.postalCode);
      await this.page.getByTestId('house_number').fill(user.houseNumber);
      await this.page.getByTestId('street').fill(user.street);
    }
    await this.page.getByTestId('city').fill(user.city);
    await this.page.getByTestId('state').fill(user.state);
    await this.page.getByTestId('phone').fill(user.phone);
    await this.page.getByTestId('email').fill(user.email);
    await this.page.getByTestId('password').fill(user.password);
    await this.page.getByTestId('register-submit').click();
  }
}
