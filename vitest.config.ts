import path from "node:path";
import { config as loadDotenv } from "dotenv";
import { defineConfig } from "vitest/config";

// Load local environment for tests
loadDotenv({ path: ".env.local" });
loadDotenv({ path: ".env" });

process.env.SKIP_ENV_VALIDATION = "1";
process.env.CRON_SECRET = process.env.CRON_SECRET || "mifaretech_cron_secret_test_32chars_long";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["src/__tests__/**/*.test.ts"],
    exclude: ["e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "server-only": path.resolve(__dirname, "./src/__tests__/__mocks__/server-only.ts"),
    },
  },
});
