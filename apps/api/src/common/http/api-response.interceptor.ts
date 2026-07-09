import {
  type CallHandler,
  type ExecutionContext,
  Injectable,
  type NestInterceptor
} from '@nestjs/common'
import { type Observable, map } from 'rxjs'

import { successPayload } from './api-response'

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((value) => {
        if (value && typeof value === 'object' && 'success' in (value as object)) {
          return value
        }

        if (value && typeof value === 'object' && 'data' in (value as object) && 'meta' in (value as object)) {
          const envelope = value as { data: unknown; meta?: Record<string, unknown>; message?: string }
          return successPayload(envelope.data, envelope.message ?? 'Retrieved successfully', 200, envelope.meta ?? null)
        }

        return successPayload(value)
      })
    )
  }
}
