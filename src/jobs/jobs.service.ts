import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class JobsService {
  private logger = new Logger(JobsService.name);

  constructor(
  ){}
}
