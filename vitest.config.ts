import { defineConfig } from "vitest/config";

export default defineConfig({
  root: "./tests",
  test: {
    globals: true,
    clearMocks: true,
    environment: "node",
  },
});
