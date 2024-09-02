/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  webServer: {
    command: "NODE_TLS_REJECT_UNAUTHORIZED=0 bun run build && bun run preview",
    port: 4173,
  },
  testDir: "tests",
  testMatch: /(.+\.)?(test|spec)\.[jt]s/,
  use: {
    screenshot: "only-on-failure",
  },
};

export default config;
