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

describe('List Users', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
  let redisCacheService: RedisCacheService
  let user: any;
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
    await redisCacheService.del(RedisCacheKeys.LIST_USERS, true);
    user = await fixture.createUser();
  });

  afterEach(async() => {
    await dbConnection.collection('users').deleteMany({});
  });

  after(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should get 1 user', async () => {        
    const response = await request(httpServer)
      .get(`/users`);     
    
    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
  });

  it('should get 2 user', async () => {  
    await fixture.createUser({ email: 'some@mail.com', phone: '11111111111' });      
    const response = await request(httpServer)
      .get(`/users`);

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(2);
  });

  it('should get reverse users when sort is asc', async () => {  
    await fixture.createUser({ email: 'some@mail.com', phone: '11111111111' });      
    const response = await request(httpServer)
      .get(`/users?sort=${SortEnum.asc}`);      
    
    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(2);
    expect(response.body.payload[0]._id).to.equal(user._id);
  });

  it('should get 1 user when limit is 1', async () => {  
    await fixture.createUser({ email: 'some@mail.com', phone: '11111111111' });      
    const response = await request(httpServer)
      .get(`/users?limit=1`);

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
  });

  it('should get second user when offset is 1', async () => {  
    await fixture.createUser({ email: 'some@mail.com', phone: '11111111111' });      
    const response = await request(httpServer)
      .get(`/users?limit=1&offset=1`);

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
    expect(response.body.payload[0]._id).to.equal(user._id);
  });

  it('should get only searched users', async () => {  
    await fixture.createUser({ email: 'some@mail.com', phone: '11111111111' });      
    const response = await request(httpServer)
      .get(`/users?query=some`);

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.success).to.equal(true);
    expect(response.body.payload.length).to.equal(1);
    expect(response.body.payload[0].email).to.equal('some@mail.com');
  });
});