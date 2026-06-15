import { defineConfig, devices } from '@playwright/test'
import { loadDotenv, resolveE2eBaseUrl, resolveE2ePort } from './scripts/load-dotenv'

loadDotenv()

const e2ePort = resolveE2ePort()
const baseURL = resolveE2eBaseUrl()

process.env.PLAYWRIGHT_BASE_URL = baseURL
process.env.NUXT_E2E_PORT = e2ePort

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',
  timeout: 60_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: process.env.PLAYWRIGHT_SKIP_WEBSERVER
    ? undefined
    : {
        command: 'pnpm dev:test',
        url: baseURL,
        reuseExistingServer: false,
        timeout: 120_000,
        env: {
          ...process.env,
          NUXT_E2E_PORT: e2ePort,
          NUXT_BUILD_DIR: '.nuxt-e2e',
          NUXT_PUBLIC_API_BASE: baseURL,
          NUXT_API_BASE_SERVER: baseURL,
          NUXT_PUBLIC_E2E: '1',
          NUXT_DEVTOOLS: '0',
          NUXT_PORT: e2ePort
        }
      }
})
