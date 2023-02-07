import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueueProducerService } from '../queue/queue.producer.service';
import { testCheck } from '../shared/test.check';
import { MailSchema } from './mail.schema';

@Injectable()
export class MailService {
  constructor(
    private readonly queueProducerService: QueueProducerService,
    private readonly configService: ConfigService
  ){}

  async sendMail(mail: MailSchema){
    if (testCheck()) return;

    await this.queueProducerService.sendMail({
      to: mail.to,
      context: mail.context,
      template: mail.template,
      subject: mail.subject
    });
  }
}
