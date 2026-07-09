import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const DEFAULT_WEB_PORT = 3000

/** @param {string} [cwd] */
export function resolveDevAppBaseUrl(cwd = process.cwd()) {
  const env = readEnvFile(resolve(cwd, '.env'))

  const explicit = (process.env.DOCS_APP_BASE_URL ?? env.DOCS_APP_BASE_URL)?.trim()
  if (explicit) return explicit.replace(/\/$/, '')

  const port = (process.env.PORT ?? env.PORT)?.trim()
  if (port) return `http://localhost:${port}`

  return `http://localhost:${DEFAULT_WEB_PORT}`
}

/** @param {string} filePath */
function readEnvFile(filePath) {
  if (!existsSync(filePath)) return {}

  const result = {}

  for (const line of readFileSync(filePath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const eq = trimmed.indexOf('=')
    if (eq === -1) continue

    const key = trimmed.slice(0, eq).trim()
    const raw = trimmed.slice(eq + 1).trim()
    result[key] = raw.replace(/^(['"])(.*)\1$/, '$2')
  }

  return result
}
