import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { Fixture } from '../../fixture';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';
import { RedisCacheKeys } from '../../../src/redis-cache/redis-cache.keys';
import { ResponsesService } from '../../../src/domains/responses/responses.service';
import { createResponseStub, responseStub } from '../../stubs/response.stubs';
import { strict as assert } from 'assert';

describe('Clear responses()', () => {
  let app: INestApplication;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
  let user: any;
  let task: any;
  let taskResponse: any;
  let redisCacheService: RedisCacheService;
  let configService: ConfigService;
  let responseService: ResponsesService;

  before(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();    
    await app.init();

    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getConnection();
    redisCacheService = moduleFixture.get<RedisCacheService>(RedisCacheService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    responseService = moduleFixture.get<ResponsesService>(ResponsesService);
    fixture = new Fixture(dbConnection, redisCacheService, configService);
  });

  beforeEach(async () => {
    await redisCacheService.del(RedisCacheKeys.GET_TASK, true);
    user = await fixture.createUser();
    await fixture.requestPassword(user.email);
    task = await fixture.createTask(user);
    taskResponse = await fixture.createResponse(user, task);
  });

  afterEach(async() => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('tasks').deleteMany({});
    await dbConnection.collection('responses').deleteMany({});
  });
  
  after(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should delete all responses of task', async () => {  
    const responsesBefore = await responseService.listResponses(task._id);  
    expect(responsesBefore.payload.length).to.equal(1);

    await responseService.clearResponses(task._id);
    const responsesAfter = await responseService.listResponses(task._id);
    expect(responsesAfter.payload.length).to.equal(0);
  });
});