/**
 * Pure logic for RangeDatePickerField (format display). Used by RangeDatePickerField.vue and tests.
 */
export type DateRangeLike = { start?: string; end?: string }

export function formatDateRange(range: DateRangeLike | undefined): string {
  const s = range?.start
  const e = range?.end
  if (!s && !e) return 'Pick range'
  try {
    const a = s ? new Date(s).toLocaleDateString() : '…'
    const b = e ? new Date(e).toLocaleDateString() : '…'
    return `${a} – ${b}`
  } catch {
    return 'Pick range'
  }
}
