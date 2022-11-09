import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { expect } from 'chai';
import { TasksService } from '../../../src/domains/tasks/tasks.service';
import { taskStub } from '../../stubs/task.stubs';
import { JobsService } from '../../../src/jobs/jobs.service';

describe('Start Task', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let taskService: TasksService;
  let jobsService: JobsService;

  before(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();    
    await app.init();

    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getConnection();
    jobsService = moduleFixture.get<JobsService>(JobsService);
    taskService = moduleFixture.get<TasksService>(TasksService);
  });

  afterEach(async() => {
    jobsService.clearJobs();
  });

  after(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should start a task', async () => {
    const task = taskStub;
    await taskService.startTask({ ...task, active: true } as any);
  });
});