import { defineConfig, devices } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: '.',
  testMatch: ['tests/**/*.spec.ts', 'auth.setup.ts'],
  // Run tests concurrently in both local and CI environments.
  fullyParallel: true,
  // Prevent focused tests in CI while allowing local debugging.
  forbidOnly: isCI,
  // Retry failed tests in CI, but keep local runs fail-fast.
  retries: isCI ? 2 : 0,
  // Limit CI parallelism for stable hosted runners.
  workers: isCI ? 2 : undefined,
  // Emit CI reports for merging and JUnit integration; preserve local HTML reporting.
  reporter: isCI
    ? [['list'], ['blob'], ['junit', { outputFile: 'reports/junit.xml' }]]
    : [['list'], ['html', { open: 'on-failure' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://practicesoftwaretesting.com',
    testIdAttribute: 'data-test',
    // Capture diagnostics only when needed and preserve failures for review.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
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
