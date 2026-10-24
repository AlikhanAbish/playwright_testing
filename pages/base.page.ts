import type { Page } from '@playwright/test';

const defaultBaseURL = 'https://practicesoftwaretesting.com';

export class BasePage {
  constructor(protected readonly page: Page) {}

  async navigate(path: string): Promise<void> {
    const configuredBaseURL = process.env.BASE_URL ?? defaultBaseURL;
    const route = configuredBaseURL.includes('/#/')
      ? `/#${path}`
      : path;
    await this.page.goto(route);
  }

  async openHome(): Promise<void> {
    await this.navigate('/');
  }

  async isOnAccountPage(): Promise<boolean> {
    const currentURL = new URL(this.page.url());
    const route = currentURL.hash.startsWith('#/')
      ? currentURL.hash.slice(1)
      : currentURL.pathname;
    return /\/accounts?(?:\/|$)/.test(route);
  }

  async isSignedIn(): Promise<boolean> {
    return this.page.getByTestId('nav-menu').isVisible();
  }

  async signOut(): Promise<void> {
    await this.page.getByTestId('nav-menu').click();
    await this.page.getByTestId('nav-sign-out').click();
  }
}
