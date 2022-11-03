import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('service-queue')
    readonly serviceQueue: Queue
  ){}
}
