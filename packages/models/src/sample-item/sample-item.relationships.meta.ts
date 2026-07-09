/**
 * ORM-agnostic relationship metadata — consumed by nest:gen / CommandHandlers.
 * Default ORM hint: typeorm (override per field with persistence.orm: prisma).
 */
export const SampleItemRelationships = {
  managers: {
    entity: 'SampleItem',
    field: 'managers',
    kind: 'relation',
    type: 'hasMany',
    target: 'User',
    cardinality: 'many',
    fkField: null,
    pivot: null,
    orm: 'typeorm',
    writable: false,
    readEmbed: ['id', 'full_name']
  },
} as const

export type SampleItemRelationshipKey = keyof typeof SampleItemRelationships
