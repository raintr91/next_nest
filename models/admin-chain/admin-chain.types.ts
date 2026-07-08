import type { z } from 'zod'

import type {
  AdminChainCreateRequestSchema,
  AdminChainSchema
} from '~/models/admin-chain/admin-chain.schema'

export type AdminChainCreateRequest = z.infer<typeof AdminChainCreateRequestSchema>
export type AdminChain = z.infer<typeof AdminChainSchema>
