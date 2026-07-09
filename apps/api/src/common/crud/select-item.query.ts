export type SelectItemQueryDto = {
  key_field?: string
  name_fields?: string[]
  info_fields?: string[]
  page?: number
  per_page?: number
}

/**
 * Port of Laravel SelectItemQueryTrait — dropdown/search select options.
 */
export class SelectItemQuery<TEntity extends Record<string, unknown>> {
  constructor(
    private readonly repository: {
      findSelectItems: (options: Record<string, unknown>) => Promise<TEntity[]>
    }
  ) {}

  async getListSelectItems(dto: SelectItemQueryDto) {
    const keyField = dto.key_field ?? 'id'
    const nameFields = dto.name_fields?.length ? dto.name_fields : ['name']
    const infoFields = dto.info_fields ?? []

    return this.repository.findSelectItems({
      keyField,
      nameFields,
      infoFields,
      page: dto.page,
      per_page: dto.per_page
    })
  }
}
