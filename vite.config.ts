/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, //https://vitest.dev/guide/migration.html#globals-as-a-default
    projects: [
      {
        // Behavior and accessibility, in jsdom: fast, no layout.
        extends: true,
        test: {
          name: "unit",
          include: ["src/**/*.test.{js,ts,tsx}", "docs/**/*.test.{js,ts,tsx}"],
          exclude: [...configDefaults.exclude, "**/*.browser.test.tsx"],
          environment: "jsdom",
          setupFiles: "./src/setupTests.ts",
        },
      },
      {
        // Layout, computed styles and real pointer and keyboard events, in Chrome.
        extends: true,
        test: {
          name: "browser",
          include: ["src/**/*.browser.test.tsx"],
          setupFiles: "./src/setupBrowserTests.ts",
          browser: {
            enabled: true,
            headless: true,
            // The Chrome installed on the machine (GitHub's runners have it too):
            // no browser to download.
            provider: playwright({ launchOptions: { channel: "chrome" } }),
            instances: [{ browser: "chromium" }],
            viewport: { width: 1024, height: 768 },
          },
        },
      },
    ],
  },
});
