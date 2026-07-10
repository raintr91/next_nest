import 'reflect-metadata'

import { ValidationPipe } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { ApiExceptionFilter } from './common/http/api-exception.filter'
import { ApiResponseInterceptor } from './common/http/api-response.interceptor'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api')
  app.useGlobalInterceptors(new ApiResponseInterceptor())
  app.useGlobalFilters(new ApiExceptionFilter())
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Portal API')
    .setDescription('NestJS API — shared Zod contracts via @portal/models')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('api/docs', app, document)

  const port = Number(process.env.PORT ?? 4000)
  await app.listen(port)
  console.log(`API http://localhost:${port}/api`)
  console.log(`Swagger http://localhost:${port}/api/docs`)
}

bootstrap()
