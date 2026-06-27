/**
 * Naming helpers for portal-gen (entity hotel → Hotel, hotels, useHotelList).
 */

export function toPascalCase(value) {
  return String(value)
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, (m) => m.toUpperCase())
}

export function toCamelCase(value) {
  const pascal = toPascalCase(value)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

export function toKebabCase(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

export function pluralize(entity) {
  if (entity.endsWith('y') && !/[aeiou]y$/i.test(entity)) {
    return `${entity.slice(0, -1)}ies`
  }
  if (entity.endsWith('s')) return entity
  return `${entity}s`
}

export function routeToPagePath(routePath) {
  const trimmed = routePath.replace(/^\//, '').replace(/\/$/, '')
  return `pages/${trimmed}/index.vue`
}

export function zodFieldForColumn(column) {
  const key = column.key
  if (key === 'id') return 'fields.id'
  if (key === 'email') return 'fields.email'
  if (key === 'status') return 'fields.status.optional()'
  if (key.endsWith('_at') || key.includes('date')) return 'fields.createdAt'
  if (column.type === 'number') return 'z.number()'
  return 'fields.optionalNullableString'
}

export function zodFieldForFormField(field) {
  if (field.key === 'email') return 'fields.email'
  if (field.type === 'number') return 'z.number()'
  if (field.required) return 'z.string().min(1)'
  return 'fields.optionalNullableString'
}

export function listEndpoint(spec) {
  const endpoints = spec.api?.endpoints ?? []
  return (
    endpoints.find((e) => e.action === 'list') ??
    endpoints.find((e) => /search|list/i.test(e.path ?? '')) ??
    endpoints[0]
  )
}

export function createEndpoint(spec) {
  const endpoints = spec.api?.endpoints ?? []
  return endpoints.find((e) => e.action === 'create') ?? endpoints.find((e) => e.method === 'POST')
}
