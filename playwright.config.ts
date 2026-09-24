import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 1,
  reporter: "html",
  use: {
    baseURL: "https://thefourdeuces.nl",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Tablet iPad",
      use: { ...devices["iPad Pro 11"] },
    },
    {
      name: "Mobile iPhone",
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "Mobile Android",
      use: { ...devices["Pixel 7"] },
    },
  ],
});