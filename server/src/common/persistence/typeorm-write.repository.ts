import type { DeepPartial, ObjectLiteral, Repository } from 'typeorm'

import type { WriteRepository } from '../crud/base-write.handler'

export function createTypeormWriteRepository<T extends ObjectLiteral>(
  repository: Repository<T>
): WriteRepository<T> {
  return {
    create: async (attributes) => {
      const saved = await repository.save(attributes as DeepPartial<T>)
      return saved as T
    },
    update: async (id, attributes) => {
      await repository.update(id as never, attributes as never)
      return repository.findOneOrFail({ where: { id } as never })
    },
    delete: async (id) => {
      await repository.delete(id as never)
    },
    bulkDelete: async (ids) => {
      await repository.delete(ids as never)
      return true
    },
    syncRelation: async () => {
      // Relation sync wired per-entity when relationships.meta has writable relations
    }
  }
}
