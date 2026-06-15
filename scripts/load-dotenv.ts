import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

/** Load .env into process.env without overriding existing vars. */
export function loadDotenv(cwd = process.cwd()) {
  const path = resolve(cwd, '.env')
  if (!existsSync(path)) return

  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    const raw = trimmed.slice(eq + 1).trim()
    const value = raw.replace(/^(['"])(.*)\1$/, '$2')

    if (!(key in process.env)) {
      process.env[key] = value
    }
  }
}

export function resolveE2ePort() {
  return process.env.NUXT_E2E_PORT?.trim() || '3005'
}

export function resolveE2eBaseUrl() {
  const fromEnv = process.env.PLAYWRIGHT_BASE_URL?.trim()
  if (fromEnv) return fromEnv.replace(/\/$/, '')
  return `http://127.0.0.1:${resolveE2ePort()}`
}
