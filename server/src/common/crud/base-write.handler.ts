export type RelationSyncMeta = {
  field: string
  type: string
  writable: boolean
}

export type WriteRepository<TEntity> = {
  create: (attributes: Record<string, unknown>) => Promise<TEntity>
  update: (id: number | string, attributes: Record<string, unknown>) => Promise<TEntity>
  delete: (id: number | string) => Promise<void>
  bulkDelete: (ids: Array<number | string>) => Promise<boolean>
  syncRelation: (
    entity: TEntity,
    relation: RelationSyncMeta,
    value: unknown
  ) => Promise<void>
}

/**
 * Port of Laravel BaseAction — write + relation sync for CommandHandlers.
 */
export abstract class BaseWriteHandler<TEntity> {
  protected abstract repository: WriteRepository<TEntity>

  protected splitPayload(
    payload: Record<string, unknown>,
    relations: RelationSyncMeta[]
  ) {
    const relationKeys = new Set(
      relations.filter((r) => r.writable).map((r) => r.field)
    )
    const attributes: Record<string, unknown> = {}
    const relationPayload: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(payload)) {
      if (relationKeys.has(key)) relationPayload[key] = value
      else attributes[key] = value
    }

    return { attributes, relationPayload }
  }

  async create(payload: Record<string, unknown>, relations: RelationSyncMeta[] = []) {
    const { attributes, relationPayload } = this.splitPayload(payload, relations)
    let entity = await this.repository.create(attributes)

    for (const relation of relations) {
      if (!relation.writable || relationPayload[relation.field] === undefined) continue
      await this.repository.syncRelation(entity, relation, relationPayload[relation.field])
      entity = await this.refresh(entity)
    }

    return entity
  }

  async update(id: number | string, payload: Record<string, unknown>, relations: RelationSyncMeta[] = []) {
    const { attributes, relationPayload } = this.splitPayload(payload, relations)
    let entity = await this.repository.update(id, attributes)

    for (const relation of relations) {
      if (!relation.writable || relationPayload[relation.field] === undefined) continue
      await this.repository.syncRelation(entity, relation, relationPayload[relation.field])
      entity = await this.refresh(entity)
    }

    return entity
  }

  async delete(id: number | string) {
    await this.repository.delete(id)
  }

  async bulkDelete(ids: Array<number | string>) {
    return this.repository.bulkDelete(ids)
  }

  protected abstract refresh(entity: TEntity): Promise<TEntity>
}
