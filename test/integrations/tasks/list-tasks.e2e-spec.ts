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

describe('List Tasks', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;``
  let fixture: Fixture;
  let redisCacheService: RedisCacheService
  let user: any;
  let task: any;
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
  });

  afterEach(async() => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('tasks').deleteMany({});
  });

  after(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should get 1 task', async () => {        
    const response = await request(httpServer)
      .get(`/tasks`)
      .set('token', token);     

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
  });

  it('should get 2 tasks', async () => {  
    await fixture.createTask(user, { title: 'Another' });      
    const response = await request(httpServer)
      .get(`/tasks`)
      .set('token', token);         

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(2);
  });

  it('should get reverse tasks when sort is asc', async () => {  
    await fixture.createTask(user, { title: 'Another' });      
    const response = await request(httpServer)
      .get(`/tasks?sort=${SortEnum.asc}`)
      .set('token', token);      
    
    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(2);
    expect(response.body.payload[0]._id).to.equal(task._id);
  });

  it('should get 1 task when limit is 1', async () => {  
    await fixture.createTask(user, { title: 'Another' });      
    const response = await request(httpServer)
      .get(`/tasks?limit=1`)
      .set('token', token);          

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
  });

  it('should get second task when offset is 1', async () => {  
    await fixture.createTask(user, { title: 'Another' });      
    const response = await request(httpServer)
      .get(`/tasks?limit=1&offset=1`)
      .set('token', token);   

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
    expect(response.body.payload[0]._id).to.equal(task._id);
  });

  it('should get only searched tasks', async () => {  
    await fixture.createTask(user, { title: 'Another' });      
    const response = await request(httpServer)
      .get(`/tasks?search=Another`)
      .set('token', token);

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
    expect(response.body.payload[0].title).to.equal('Another');
  });
});