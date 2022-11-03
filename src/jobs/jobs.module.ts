import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JobsService } from './jobs.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  providers: [JobsService]
})
export class JobsModule {}
