import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * If the machine routes traffic through an HTTP(S) proxy (e.g. a sandbox
 * or corporate network), Playwright needs the proxy credentials explicitly:
 * Chromium does not pick them up from environment variables on its own.
 * The proxy URL is read from the environment at runtime only — no
 * credentials are stored in this repo. On a normal machine (no proxy env
 * vars) this is undefined and the browser connects directly.
 */
function proxyFromEnv(): { server: string; username?: string; password?: string } | undefined {
  const raw = process.env.HTTPS_PROXY ?? process.env.HTTP_PROXY;
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const server = `${url.protocol}//${url.hostname}:${url.port}`;
    const username = decodeURIComponent(url.username) || undefined;
    const password = decodeURIComponent(url.password) || undefined;
    return { server, username, password };
  } catch {
    return { server: raw };
  }
}

const proxy = proxyFromEnv();

/**
 * Demo Playwright config.
 * Target: the public SauceDemo demo store (https://www.saucedemo.com).
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 1,
  workers: isCI ? 2 : undefined,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: 'https://www.saucedemo.com',
    // SauceDemo marks elements with `data-test="..."` (not `data-testid`),
    // so point Playwright's getByTestId at that attribute.
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    ...(proxy ? { proxy } : {}),
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
  ],
});
