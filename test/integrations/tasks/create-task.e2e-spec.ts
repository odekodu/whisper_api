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
import { createTaskStub, taskStub } from '../../stubs/task.stubs';
import { JobsService } from '../../../src/jobs/jobs.service';

describe('Create Task', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
  let redisCacheService: RedisCacheService;
  let configService: ConfigService;
  let jobsService: JobsService;
  let user = null;
  let token = null;

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
    jobsService = moduleFixture.get<JobsService>(JobsService);
    fixture = new Fixture(dbConnection, redisCacheService, configService);
  });

  beforeEach(async () => {
    user = await fixture.createUser();
    token = await fixture.login(user);
    await fixture.requestPassword(user.email);
  });

  afterEach(async() => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('tasks').deleteMany({});

    await jobsService.clearJobs();
  });

  after(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should fail when no title is provided', async () => {
    const { description } = createTaskStub;
    const response = await request(httpServer)
      .post('/tasks')
      .set('token', token)
      .send({ description });    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"title" is required'
    })  
  });

  it('should fail when no uri is provided', async () => {
    const { title } = createTaskStub;
    const response = await request(httpServer)
      .post('/tasks')
      .set('token', token)
      .send({ title });    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"uri" is required'
    })  
  });

  it('should fail when invalid uri is provided', async () => {
    const { title } = createTaskStub;
    const response = await request(httpServer)
      .post('/tasks')
      .set('token', token)
      .send({ title, uri: 'uri' });    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"uri" must be a valid uri'
    })  
  });

  it('should fail when no method is provided', async () => {
    const { title, uri } = createTaskStub;
    const response = await request(httpServer)
      .post('/tasks')
      .set('token', token)
      .send({ title, uri });    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"method" is required'
    })  
  });

  it('should fail when invalid method is provided', async () => {
    const { title, uri } = createTaskStub;
    const response = await request(httpServer)
      .post('/tasks')
      .set('token', token)
      .send({ title, uri, method: 'method' });    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"method" must be one of [get, post, put, patch, delete]'
    })  
  });

  it('should fail when no expression is provided', async () => {
    const { title, uri, method } = createTaskStub;
    const response = await request(httpServer)
      .post('/tasks')
      .set('token', token)
      .send({ title, uri, method });    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"when" is required'
    })  
  });

  it('should create the task', async () => {
    const { title, uri, method, when } = createTaskStub;
    const response = await request(httpServer)
      .post('/tasks')
      .set('token', token)
      .send({ title, uri, method, when });    

    expect(response.status).to.equal(HttpStatus.CREATED);  
    expect(response.body.payload).to.deep.include(taskStub);  
  });
});