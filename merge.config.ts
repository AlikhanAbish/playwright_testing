export default {
  testDir: './tests', // Use the tests directory from the main Playwright config.
  reporter: [
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'reports/junit-merged.xml' }],
  ],
};
