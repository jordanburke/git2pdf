// vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // Configure globals
    globals: true,

    // Environment setup
    environment: "node",

    // Include patterns
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],

    // Coverage settings
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "dist/", "**/*.d.ts", "**/*.test.{js,ts}", "**/*.config.{js,ts}"],
    },

    // Mock reset
    mockReset: true,
  },
})
