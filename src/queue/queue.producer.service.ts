import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';
import { MailSchema } from '../mail/mail.schema';

@Injectable()
export class QueueProducerService {
  constructor(
    @InjectQueue('service_queue')
    readonly serviceQueue: Queue
  ){}

  async sendMail(mail: MailSchema){
    await this.serviceQueue.add('mail_job', mail, { delay: 10000 });
  }
}
