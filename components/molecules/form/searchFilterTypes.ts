/**
 * Types for search/filter form config (filters prop).
 * data options: { id, name } or { value, name } -> normalized to { value, label }.
 */
export type FilterOption = { id?: string; value?: string; name: string }

export type FilterType =
  | 'text_field'
  | 'number_field'
  | 'select'
  | 'checkbox'
  | 'autocomplete'
  | 'date'
  | 'time_range'
  | 'datetime_range'

export type TimeRangeFormatFilter = 'h' | 'h:m' | 'h:m:s'

export interface SearchFilterConfig {
  name: string
  label: string
  type: FilterType
  placeholder?: string
  /** Options for select, autocomplete, checkbox (multi). List of { id, name } or { value, name } */
  data?: FilterOption[]
  /** For select/checkbox: allow multiple */
  multiple?: boolean
  /** For time_range: 'h' | 'h:m' | 'h:m:s' */
  format?: TimeRangeFormatFilter
  /** For datetime_range: 'h' | 'h:m' | 'h:m:s' */
  timeFormat?: TimeRangeFormatFilter
}

export function normalizeOptions(data: FilterOption[] | undefined): { value: string; label: string }[] {
  if (!data?.length) return []
  return data.map((o) => ({
    value: String(o.id ?? o.value ?? o.name),
    label: o.name
  }))
}
