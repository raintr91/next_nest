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

/**
 * Resolve filesystem / type namespace so chain-hotel and admin hotel do not collide.
 * Priority: codegen.namespace → distinct codegen.module → codegen.entity
 */
export function resolveCodegenNamespace(codegen = {}) {
  if (codegen.namespace) {
    return toKebabCase(codegen.namespace)
  }

  const entityKebab = toKebabCase(codegen.entity ?? 'entity')
  const moduleKebab = codegen.module ? toKebabCase(codegen.module) : pluralize(entityKebab)
  const entityPlural = pluralize(entityKebab)

  if (moduleKebab !== entityPlural) {
    if (moduleKebab.endsWith('s')) {
      return moduleKebab.slice(0, -1)
    }
    return moduleKebab
  }

  return entityKebab
}

/**
 * Build prototype mock rows from list endpoint response.data[0] when present.
 * @param {Record<string, unknown>} spec
 */
export function buildMockRowsFromSpec(spec, title = 'Item') {
  const listEp = listEndpoint(spec)
  const sample = listEp?.response?.data?.[0]
  if (!sample || typeof sample !== 'object' || isOpenApiShape(sample)) {
    return [
      { id: 1, name: `${title} A`, managers: [{ id: 101, full_name: 'Manager A' }] },
      { id: 2, name: `${title} B`, managers: [{ id: 102, full_name: 'Manager B' }] },
      { id: 3, name: `${title} C`, managers: [{ id: 103, full_name: 'Manager C' }] }
    ]
  }

  const clone = (suffix) => hydrateMockRow(sample, title, suffix)
  return [clone(1), clone(2), clone(3)]
}

function isOpenApiShape(sample) {
  return Object.values(sample).some((value) => {
    if (typeof value === 'string') {
      return ['number', 'string', 'boolean'].includes(value) || value.includes('|')
    }
    if (Array.isArray(value) && value[0] && typeof value[0] === 'object') {
      return isOpenApiShape(value[0])
    }
    return false
  })
}

function hydrateMockRow(sample, title, suffix) {
  const row = {}

  for (const [key, value] of Object.entries(sample)) {
    if (key === 'id') {
      row.id = suffix
      continue
    }
    if (key === 'name') {
      row.name = `${title} ${String.fromCharCode(64 + suffix)}`
      continue
    }
    if (key === 'managers' && Array.isArray(value)) {
      row.managers = value.map((manager, index) => ({
        id: suffix * 10 + index + 1,
        full_name: `Manager ${String.fromCharCode(64 + suffix)}${index + 1}`
      }))
      continue
    }
    if (typeof value === 'string') {
      row[key] = value.includes('|') ? null : value
      continue
    }
    row[key] = value
  }

  return row
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
  if (key === 'managers') {
    return 'z.array(z.object({ id: fields.id, full_name: fields.optionalNullableString }))'
  }
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
