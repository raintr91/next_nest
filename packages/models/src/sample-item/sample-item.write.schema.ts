import { z } from 'zod'

import { fields } from '../common/fields.js'

export const SampleItemWriteSchema = z.object({
  name: fields.optionalNullableString,
})

export const SampleItemCreateRequestSchema = SampleItemWriteSchema
