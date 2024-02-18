import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm", "iife"],
  dts: true,
  treeshake: true,
  clean: true,
  cjsInterop: true,
  globalName: "Linq",
  name: "Linq",
});
