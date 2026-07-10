import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'

import { DatabaseModule } from './database/database.module'
import { ExampleModule } from './modules/example/example.module'
import { HealthController } from './health/health.controller'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, CqrsModule.forRoot(), ExampleModule],
  controllers: [HealthController]
})
export class AppModule {}
