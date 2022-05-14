import { type Config } from "@playwright/test";

const config: Config = {
  webServer: {
    command: "pnpm run dev",
    url: "http://localhost:3000/",
    timeout: 10_000 /* ms */,
  },
  use: {
    baseUrl: "http://localhost:3000/",
    headless: true,
    viewport: { width: 800, height: 600 },
    ignoreHTTPSErrors: true,
  },
};

export default config;
