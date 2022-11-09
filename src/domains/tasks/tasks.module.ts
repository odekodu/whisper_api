import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { JobsService } from '../../jobs/jobs.service';
import { Http2ServerRequest } from 'http2';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema }
    ]),
    HttpModule
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    JobsService
  ]
})
export class TasksModule {}
