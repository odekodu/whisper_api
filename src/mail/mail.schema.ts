import { MailEnum } from "./mail.enum";

export interface MailSchema {
  to: string,
  context?: any,
  subject: string,
  template: MailEnum
}