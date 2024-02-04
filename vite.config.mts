import { defineConfig } from "vite";

export default defineConfig({
  plugins: [],
  build: {
    sourcemap: true,
    outDir: "./dist",
    emptyOutDir: false,
    lib: {
      name: "linq",
      entry: "./src/index.ts",
      fileName: "index",
      formats: ["cjs", "es", "umd"],
    },
    rollupOptions: {
      treeshake: true,
      output: {
        exports: "auto",
      },
    },
  },
});
