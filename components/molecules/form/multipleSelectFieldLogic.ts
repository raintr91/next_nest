export type Option = { value: string; label: string }
export function getDisplayText(selected: string[], options: Option[], placeholder: string): string {
  if (selected.length === 0) return placeholder
  if (selected.length === 1) {
    const o = options.find((opt) => opt.value === selected[0])
    return o?.label ?? selected[0]
  }
  return `${selected.length} selected`
}
export function toggleSelection(selected: string[], value: string, checked: boolean): string[] {
  if (checked) return selected.includes(value) ? selected : [...selected, value]
  return selected.filter((x) => x !== value)
}
