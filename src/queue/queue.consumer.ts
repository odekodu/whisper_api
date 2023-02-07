import { MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { MailSchema } from "../mail/mail.schema";

@Processor('service_queue')
export class QueueConsumer {

    constructor(
        private mailerService: MailerService
    ){}

    @Process('mail_job')
    mailJob(job: Job<MailSchema>){        
        this.mailerService.sendMail(job.data);
    }
}