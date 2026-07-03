import { fileURLToPath } from 'node:url'
import path from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '~': __dirname,
      '@': __dirname
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/unit/_helpers/nuxtGlobals.ts'],
    include: ['tests/unit/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      reportsDirectory: './coverage'
    }
  }
})
