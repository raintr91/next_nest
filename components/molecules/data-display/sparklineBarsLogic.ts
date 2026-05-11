/**
 * Pure logic for SparklineBars. Used by SparklineBars.vue and tests.
 */
export function getSparklineMax(values: number[]): number {
  if (values.length === 0) return 1
  return Math.max(...values, 1)
}

export function getSparklineHeights(values: number[], max: number): number[] {
  return values.map((v) => (max > 0 ? (v / max) * 100 : 0))
}
