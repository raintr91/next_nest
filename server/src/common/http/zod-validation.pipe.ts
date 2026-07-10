import {
  type ArgumentMetadata,
  BadRequestException,
  type PipeTransform
} from '@nestjs/common'
import type { ZodSchema } from 'zod'

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, _metadata: ArgumentMetadata) {
    const parsed = this.schema.safeParse(value)
    if (!parsed.success) {
      throw new BadRequestException({
        message: 'Invalid input data',
        errors: parsed.error.flatten()
      })
    }
    return parsed.data
  }
}
