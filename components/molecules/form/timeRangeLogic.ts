/**
 * Time range value format and parsing.
 * - h: store as "HH" (0-23), display number/select
 * - h:m: store as "HH:MM"
 * - h:m:s: store as "HH:MM:SS"
 */
export type TimeRangeFormat = 'h' | 'h:m' | 'h:m:s'

export type TimeRangeValue = { start: string; end: string }

/** Pad number to 2 digits */
export function pad2(n: number): string {
  return String(n).padStart(2, '0')
}

/** From "HH" or "HH:MM" or "HH:MM:SS" to parts */
export function parseTime(s: string): { h: number; m: number; s: number } {
  const parts = (s || '').split(':').map(Number)
  return {
    h: Math.min(23, Math.max(0, /* v8 ignore next */ parts[0] ?? 0)),
    m: Math.min(59, Math.max(0, parts[1] ?? 0)),
    s: Math.min(59, Math.max(0, parts[2] ?? 0))
  }
}

/** Build time string by format */
export function formatTime(h: number, m: number, s: number, format: TimeRangeFormat): string {
  const H = pad2(h)
  if (format === 'h') return H
  const M = pad2(m)
  if (format === 'h:m') return `${H}:${M}`
  return `${H}:${M}:${pad2(s)}`
}

/** Parse ISO datetime to date + time strings */
export function splitDateTime(iso: string | undefined): { date: string; time: string } {
  if (!iso) return { date: '', time: '00:00' }
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return { date: '', time: '00:00' }
  const date = d.toISOString().slice(0, 10)
  const time = d.toTimeString().slice(0, 8)
  return { date, time }
}

/** Join date (YYYY-MM-DD) + time (HH or HH:MM or HH:MM:SS) to ISO */
export function joinDateTime(date: string, time: string): string {
  if (!date) return ''
  const t = (time || '00:00').split(':')
  const h = (/* v8 ignore next */ t[0] ?? '0').padStart(2, '0')
  const m = (t[1] ?? '00').padStart(2, '0')
  const s = (t[2] ?? '00').padStart(2, '0')
  return `${date}T${h}:${m}:${s}`
}
