// @ts-check
const { defineConfig, devices } = require('@playwright/test');

const FRONTEND_PORT = process.env.FRONTEND_PORT || process.env.PORT || 3000;
const BACKEND_PORT = process.env.BACKEND_PORT || 3030;

module.exports = defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${FRONTEND_PORT}`,
    trace: 'on-first-retry',
    actionTimeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npm run start --workspace=backend',
      port: Number(BACKEND_PORT),
      reuseExistingServer: !process.env.CI,
      env: { PORT: String(BACKEND_PORT) },
      timeout: 60_000,
    },
    {
      command: 'npm run start --workspace=frontend',
      port: Number(FRONTEND_PORT),
      reuseExistingServer: !process.env.CI,
      env: { PORT: String(FRONTEND_PORT), BROWSER: 'none' },
      timeout: 120_000,
    },
  ],
});
