import { MailerModule } from '@nestjs-modules/mailer';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
import { MailService } from './mail.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: configService.get('MAIL_USER'),
              pass: configService.get('MAIL_PASSWORD'),
            }
          },
          defaults: {
            from: `"No Reply" <${configService.get('MAIL_FROM')}>`,
          },
          template: {
            dir: join(__dirname, 'templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true
            }
          }
        }
      },
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
