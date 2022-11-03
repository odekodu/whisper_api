import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { testCheck } from '../shared/test.check';
import { MailSchema } from './mail.schema';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ){}

  async sendMail(mail: MailSchema){
    if (testCheck()) return;

    await this.mailerService.sendMail({
      to: mail.to,
      context: mail.context,
      template: mail.template,
      subject: mail.subject
    });
  }
}
