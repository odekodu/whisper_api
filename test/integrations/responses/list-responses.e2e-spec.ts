import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { Fixture } from '../../fixture';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { RedisCacheKeys } from '../../../src/redis-cache/redis-cache.keys';
import { SortEnum } from '../../../src/shared/sort.enum';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';

describe('List Responses', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;``
  let fixture: Fixture;
  let redisCacheService: RedisCacheService
  let user: any;
  let task: any;
  let taskResponse: any
  let token = null;
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
    await redisCacheService.del(RedisCacheKeys.LIST_TASKS, true);
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

  it('should get 1 response', async () => {            
    const response = await request(httpServer)
      .get(`/responses?task=${task._id}`)
      .set('token', token);     

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
  });

  it('should get 2 responses', async () => {  
    await fixture.createResponse(user, task);      
    const response = await request(httpServer)
      .get(`/responses?task=${task._id}`)
      .set('token', token);         

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(2);
  });

  it('should get reverse responses when sort is asc', async () => {  
    await fixture.createResponse(user, task);      
    const response = await request(httpServer)
      .get(`/responses?task=${task._id}&sort=${SortEnum.asc}`)
      .set('token', token);      
    
    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(2);
    expect(response.body.payload[0]._id).to.equal(taskResponse._id);
  });

  it('should get 1 task when limit is 1', async () => {  
    await fixture.createResponse(user, task);      
    const response = await request(httpServer)
      .get(`/responses?task=${task._id}&limit=1`)
      .set('token', token);          

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
  });

  it('should get second response when offset is 1', async () => {  
    await fixture.createResponse(user, task);      
    const response = await request(httpServer)
      .get(`/responses?task=${task._id}&limit=1&offset=1`)
      .set('token', token);   

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
    expect(response.body.payload[0]._id).to.equal(taskResponse._id);
  });
});