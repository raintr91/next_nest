/**
 * Pure logic for DataIterator (totalPages). Used by DataIterator.vue and tests.
 */
export function getTotalPages(total: number | undefined, pageSize: number): number {
  if (total == null || total <= 0 || pageSize <= 0) return 0
  return Math.ceil(total / pageSize)
}
