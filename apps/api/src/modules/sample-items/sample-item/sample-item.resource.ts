import { BaseResource } from '../../../common/crud/base-resource'

type SampleItemRow = {
  id: number
  name?: string | null
  managers?: Array<{
    id?: number
    full_name?: string | null
  }>
  created_at?: string | Date | null
  updated_at?: string | Date | null
}

export class SampleItemResource extends BaseResource<SampleItemRow> {
  fields(entity: SampleItemRow) {
    return {
      name: entity.name ?? null
    }
  }

  relations(entity: SampleItemRow) {
    const out: Record<string, unknown> = {}
    if (entity.managers) {
      out.managers = entity.managers.map((row) => ({
        id: row.id ?? null,
        full_name: row.full_name ?? null
      }))
    }
    return out
  }

  static toDto(entity: SampleItemRow) {
    return new SampleItemResource().toDto(entity)
  }
}
