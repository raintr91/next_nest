import type { z } from 'zod'

import type {
  AdminChainCreateRequestSchema,
  AdminChainSchema
} from './admin-chain.schema.js'

export type AdminChainCreateRequest = z.infer<typeof AdminChainCreateRequestSchema>
export type AdminChain = z.infer<typeof AdminChainSchema>
