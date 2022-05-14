import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "app",
  plugins: [react()],
  test: {
    environment: "happy-dom",
    // NOTE: path is relative to `root: "app"`
    include: ["../src/**/*.test.{ts,tsx}", "**/*.test.{ts,tsx}"],
  },
});
