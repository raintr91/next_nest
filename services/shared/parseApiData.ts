import type { z } from 'zod'

import { parseSchema } from '~/models/common/parse'

/** Lenient runtime parse — returns raw value when schema does not match. */
export function parseApiData<T extends z.ZodTypeAny>(schema: T, value: unknown): z.infer<T> {
  return parseSchema(schema, value) as z.infer<T>
}
