import type { z } from 'zod'

import {
  SampleItemListResponseSchema,
  SampleItemReadSchema
} from './sample-item.read.schema.js'
import type { SampleItemWriteSchema } from './sample-item.write.schema.js'

export type SampleItem = z.infer<typeof SampleItemReadSchema>
export type SampleItemListResponse = z.infer<typeof SampleItemListResponseSchema>
export type SampleItemCreateRequest = z.infer<typeof SampleItemWriteSchema>
