import { defineConfig, devices } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  testDir: './tests',
  workers: 4,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
