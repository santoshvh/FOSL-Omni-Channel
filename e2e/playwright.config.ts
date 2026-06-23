import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const storefrontDir = path.join(__dirname, "..", "apps", "storefront");

export default defineConfig({
  testDir: path.join(__dirname),
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  timeout: 60_000,
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npx next start --port 3001",
    cwd: storefrontDir,
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NODE_ENV: "production",
    },
  },
});
