import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],
  use: {
    baseURL: "https://demo.simplcommerce.com/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 60000,
    navigationTimeout: 120000,
    headless: process.env.CI ? true : false,
  },
  projects: [
    {
      name: "chromium",
      use: {
        viewport: process.env.CI ? { width: 1920, height: 1080 } : null,
        launchOptions: {
          args: ["--start-maximized"],
        },
      },
    },
  ],
});
