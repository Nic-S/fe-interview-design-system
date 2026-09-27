/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.test.{js,ts,tsx}", "docs/**/*.test.{js,ts,tsx}"],
    globals: true, //https://vitest.dev/guide/migration.html#globals-as-a-default
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
