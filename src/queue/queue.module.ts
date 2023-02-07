import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueProducerService } from './queue.producer.service';
import { QueueConsumer } from './queue.consumer';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        }
      })
    }),
    BullModule.registerQueue({
      name: 'service_queue'
    })
  ],
  providers: [QueueProducerService, QueueConsumer],
  exports: [QueueProducerService]
})
export class QueueModule {}
