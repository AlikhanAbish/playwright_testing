import { defineConfig, devices } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts', 'auth.setup.ts'],
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: 'auth.setup.ts',
      use: {
        ...devices['Desktop Chrome'],
        storageState: { cookies: [], origins: [] },
      },
    },
    {
      name: 'chromium',
      testMatch: 'tests/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...devices['Desktop Chrome'],
        storageState: authFile,
      },
    },
  ],
});
