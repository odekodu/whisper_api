import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { HttpErrorFilter } from './errors/http-error.filter';
import { LoggerInterceptor } from './logger/logger.interceptor';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { QueueModule } from './queue/queue.module';
import { RedisCacheInterceptor } from './redis-cache/redis-cache.interceptor';
import { MongoErrorFilter } from './errors/mongo-error.filter';
import { MailModule } from './mail/mail.module';
import { DomainsModule } from './domains/domains.module';
import { JobsModule } from './jobs/jobs.module';
import { RedisCacheClearInterceptor } from './redis-cache/redis-cache-clear.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    RedisCacheModule,
    QueueModule,
    MailModule,
    DomainsModule,
    JobsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor
    },
    {
      provide: APP_FILTER,
      useClass: HttpErrorFilter
    },
    {
      provide: APP_FILTER,
      useClass: MongoErrorFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisCacheClearInterceptor
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RedisCacheInterceptor
    }
  ],
})
export class AppModule {}
