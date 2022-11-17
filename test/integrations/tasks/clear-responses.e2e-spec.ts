import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { Fixture } from '../../fixture';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';
import { RedisCacheKeys } from '../../../src/redis-cache/redis-cache.keys';

describe('Clear Responses', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
  let user: any;
  let task: any;
  let taskResponse: any;
  let token = null;
  let redisCacheService: RedisCacheService;
  let configService: ConfigService;

  before(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();    
    await app.init();

    httpServer = app.getHttpServer();
    dbConnection = moduleFixture.get<DatabaseService>(DatabaseService).getConnection();
    redisCacheService = moduleFixture.get<RedisCacheService>(RedisCacheService);
    configService = moduleFixture.get<ConfigService>(ConfigService);
    fixture = new Fixture(dbConnection, redisCacheService, configService);
  });

  beforeEach(async () => {
    await redisCacheService.del(RedisCacheKeys.GET_TASK, true);
    user = await fixture.createUser();
    token = await fixture.login(user);
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

  it('should fail when invalid id is sent', async () => {        
    const response = await request(httpServer)
      .delete(`/tasks/${1}/responses`)
      .set('token', token);

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);      
    expect(response.body).to.deep.include({
      success: false,
      message: '"id" is not a valid uuid'
    });
  });

  it('should fail when task is not found', async () => {   
    const id = task._id.toString().split('').reverse().join('');      
    const response = await request(httpServer)
      .delete(`/tasks/${id}/responses`)
      .set('token', token);        
    
    expect(response.status).to.equal(HttpStatus.NOT_FOUND);      
    expect(response.body).to.deep.include({
      success: false,
      message: 'Task not found'
    });
  });

  it('should clear all task responses', async () => {        
    const response = await request(httpServer)
      .delete(`/tasks/${task._id}/responses`)
      .set('token', token);     

    expect(response.status).to.equal(HttpStatus.OK);      
  });
});