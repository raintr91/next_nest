import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import type { Response } from 'express'

import { ApiError, errorLabelFromStatus, errorPayload } from './api-response'

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const body = exception.getResponse()
      const message = typeof body === 'string'
        ? body
        : (body as { message?: string | string[] }).message

      response.status(status).json(
        errorPayload(
          status,
          errorLabelFromStatus(status),
          Array.isArray(message) ? message.join(', ') : message ?? exception.message,
          typeof body === 'object' ? body : undefined
        )
      )
      return
    }

    const message = exception instanceof Error ? exception.message : ApiError.INTERNAL_SERVER_ERROR
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
      errorPayload(
        HttpStatus.INTERNAL_SERVER_ERROR,
        ApiError.INTERNAL_SERVER_ERROR,
        message
      )
    )
  }
}
