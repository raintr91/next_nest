import { BaseResource } from '../../../common/crud/base-resource'

type SampleItemRow = {
  id: number
  name?: string | null
  created_at?: string | Date | null
  updated_at?: string | Date | null
  managers?: Array<{ id: number; full_name?: string | null }>
}

export class SampleItemResource extends BaseResource<SampleItemRow> {
  fields(entity: SampleItemRow) {
    return {
      name: entity.name ?? null
    }
  }

  relations(entity: SampleItemRow) {
    if (!entity.managers) return {}
    return {
      managers: entity.managers.map((m) => ({ id: m.id, full_name: m.full_name ?? null }))
    }
  }

  static toDto(entity: SampleItemRow) {
    return new SampleItemResource().toDto(entity)
  }
}
