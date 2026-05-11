import { appendFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

type ClientErrorLogPayload = {
  portal?: string
  context?: string
  requestUrl?: string
  status?: number
  backendMessage?: string
  technicalMessage?: string
  stack?: string
  occurredAt?: string
}

export default defineEventHandler(async (event) => {
  const payload = (await readBody<ClientErrorLogPayload>(event).catch(() => ({}))) || {}

  const logsDir = resolve(process.cwd(), 'logs')
  await mkdir(logsDir, { recursive: true })

  const record = {
    portal: payload.portal || 'portal',
    context: payload.context || 'unknown',
    requestUrl: payload.requestUrl || '',
    status: typeof payload.status === 'number' ? payload.status : null,
    backendMessage: payload.backendMessage || '',
    technicalMessage: payload.technicalMessage || '',
    stack: payload.stack || '',
    occurredAt: payload.occurredAt || new Date().toISOString()
  }

  await appendFile(resolve(logsDir, 'portal-errors.log'), `${JSON.stringify(record)}\n`, 'utf8')
  return { ok: true }
})
