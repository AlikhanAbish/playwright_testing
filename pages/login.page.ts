import { expect, type Page } from '@playwright/test';
import type { User } from '../data/user.factory';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.navigate('/auth/login');
  }

  async signIn(user: Pick<User, 'email' | 'password'>): Promise<void> {
    await this.page.getByTestId('email').fill(user.email);
    await this.page.getByTestId('password').fill(user.password);
    await this.page.getByTestId('login-submit').click();
  }

  async expectSignedIn(): Promise<void> {
    await expect(this.page).toHaveURL(/\/accounts?(?:\/|$)/);
    await expect(this.page.getByTestId('page-title')).toContainText('My account');
    await expect(this.page.getByTestId('nav-menu')).toBeVisible();
  }

  async expectInvalidCredentialsError(): Promise<void> {
    await expect(this.page.getByTestId('login-error')).toContainText(
      'Invalid email or password',
    );
    await expect(this.page).not.toHaveURL(/\/accounts?(?:\/|$)/);
  }

  async openForgotPassword(): Promise<void> {
    await this.navigate('/auth/forgot-password');
  }

  async requestPasswordReset(email: string): Promise<void> {
    await this.page.getByTestId('email').fill(email);
    await this.page.getByTestId('forgot-password-submit').click();
  }

  async expectPasswordResetResult(message: string): Promise<void> {
    await expect(
      this.page.getByRole('alert').filter({ hasText: message }),
    ).toContainText(message);
  }
}
