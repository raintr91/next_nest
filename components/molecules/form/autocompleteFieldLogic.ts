export type Option = { value: string; label: string }
export function getDisplayText(value: string, options: Option[]): string {
  const o = options.find((x) => x.value === value)
  return o?.label ?? value
}
