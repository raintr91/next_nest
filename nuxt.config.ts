// https://nuxt.com/docs/api/configuration/nuxt-config
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))
const modelsDir = path.resolve(rootDir, 'packages/models/src')
const portEnv = process.env.NUXT_PORT?.trim()
const devPort = portEnv ? parseInt(portEnv, 10) : 0
const devServerPort = Number.isFinite(devPort) ? devPort : 3004

/** Polling chỉ khi cần (Docker volume / project trên /mnt/c). WSL ext4 mặc định: inotify. */
const watchPolling = process.env.NUXT_WATCH_POLLING === '1'
const watchPollingOpts = watchPolling
  ? {
      usePolling: true as const,
      interval: 300,
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100
      }
    }
  : { usePolling: false as const }

function resolvePublicApiBase(): string {
  const raw = process.env.NUXT_PUBLIC_API_BASE?.trim()
  return raw || '/api'
}

export default defineNuxtConfig({
  srcDir: '.',
  compatibilityDate: '2026-01-31',
  devtools: { enabled: process.env.NUXT_DEVTOOLS === '1' },
  watchers: {
    chokidar: watchPollingOpts
  },
  devServer: {
    host: '0.0.0.0',
    port: devServerPort
  },
  vite: {
    resolve: {
      alias: [
        { find: '~/models', replacement: modelsDir },
        { find: '@portal/models', replacement: modelsDir },
        { find: '~', replacement: rootDir },
        { find: '@', replacement: rootDir }
      ]
    },
    server: {
      watch: watchPollingOpts
    }
  },
  runtimeConfig: {
    public: {
      apiBase: resolvePublicApiBase(),
      portalKey: process.env.NUXT_PUBLIC_PORTAL_KEY || 'portal',
      serviceKey: process.env.NUXT_PUBLIC_SERVICE_KEY || 'PORTAL',
      e2e: process.env.NUXT_PUBLIC_E2E || '0'
    }
  },
  modules: ['@nuxt/eslint', '@pinia/nuxt', '@nuxtjs/tailwindcss', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components/ui', pathPrefix: false, pattern: '**/*.vue', extensions: ['vue'], ignore: ['**/index.ts'] },
    { path: '~/components/molecules', pathPrefix: false, prefix: 'Mo' },
    { path: '~/components/organisms', pathPrefix: false }
  ],
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: 'ja',
    detectBrowserLanguage: false,
    langDir: 'locales',
    locales: [
      {
        code: 'ja',
        iso: 'ja-JP',
        name: '日本語',
        file: 'ja.json'
      }
    ],
    vueI18n: './i18n.config'
  }
})
