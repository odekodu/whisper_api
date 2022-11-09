import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronCommand, CronJob } from 'cron';

@Injectable()
export class JobsService {
  private logger = new Logger(JobsService.name);

  constructor(
    private scheduleRegistry: SchedulerRegistry
  ){}

  createJob(
    id: string, 
    expression: CronExpression, 
    command: CronCommand,
  ){
    const job = new CronJob(expression, command);    
    this.scheduleRegistry.addCronJob(id, job);
    job.start();    
    this.logger.log(`Job ${id} with expression '${expression}' started`);    
  }

  listJobs(){
    return this.scheduleRegistry.getCronJobs();
  }

  getJob(id: string){
    return this.scheduleRegistry.getCronJob(id);
  }

  deleteJob(id: string){
    this.scheduleRegistry.deleteCronJob(id);
  }

  clearJobs(){
    const jobs = this.scheduleRegistry.getCronJobs();
    jobs.forEach(job => job.stop());
  }
}
