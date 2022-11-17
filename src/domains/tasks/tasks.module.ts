import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './entities/task.entity';
import { JobsService } from '../../jobs/jobs.service';
import { ResponsesService } from '../responses/responses.service';
import { Response, ResponseSchema } from '../responses/entities/response.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema }
    ]),
    MongooseModule.forFeature([
      { name: Response.name, schema: ResponseSchema }
    ]),
    HttpModule
  ],
  controllers: [TasksController],
  providers: [
    TasksService,
    JobsService,
    ResponsesService
  ]
})
export class TasksModule {}
