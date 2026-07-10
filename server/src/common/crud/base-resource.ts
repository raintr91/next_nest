/**
 * Port of Laravel BaseResource — map entity → contract JSON keys.
 */
export abstract class BaseResource<TEntity extends { id?: number | string }> {
  abstract fields(entity: TEntity): Record<string, unknown>

  relations(_entity: TEntity): Record<string, unknown> {
    return {}
  }

  timestamps(entity: TEntity): Record<string, unknown> {
    const row = entity as Record<string, unknown>
    const serialize = (value: unknown) => (value instanceof Date ? value.toISOString() : value)

    return {
      ...(row.created_at !== undefined ? { created_at: serialize(row.created_at) } : {}),
      ...(row.updated_at !== undefined ? { updated_at: serialize(row.updated_at) } : {})
    }
  }

  toDto(entity: TEntity): Record<string, unknown> {
    const payload = {
      id: entity.id,
      ...this.fields(entity),
      ...this.relations(entity),
      ...this.timestamps(entity)
    }

    return Object.fromEntries(
      Object.entries(payload).filter(([, value]) => value !== undefined)
    )
  }
}
