import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { Fixture } from '../../../test/fixture';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { RedisCacheKeys } from '../../../src/redis-cache/redis-cache.keys';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';

describe('Request One time password', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
  let user: any;
  let redisCacheService: RedisCacheService;
  let configService: ConfigService

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
    await redisCacheService.del(RedisCacheKeys.LIMIT_REQUESTS, true);
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

  it('should fail when an invalid :email is sent', async () => {
    const response = await request(httpServer)
      .get('/auth/email');     

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);      
    expect(response.body).to.deep.include({
      success: false,
      message: '"value" must be a valid email'
    });
  });

  it('should fail when user does not exist', async () => {
    const response = await request(httpServer)
      .get('/auth/a@mail.com');     

    expect(response.status).to.equal(HttpStatus.NOT_FOUND);      
    expect(response.body).to.deep.include({
      success: false,
      message: 'User not found'
    });
  });

  it('should succeed when user exists', async () => {
    const response = await request(httpServer)
      .get(`/auth/${user.email}`);     

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body).to.deep.include({
      success: true,
      message: 'Your OTP has been sent to your mail'
    });
  });

  it('should fail when max request limit is passed', async () => {
    const limit = configService.get<number>('REQUEST_LIMIT');

    for(let i of Array(+limit).fill(1)){
      await request(httpServer)
        .get(`/auth/${user.email}`);
    }

    const response = await request(httpServer)
      .get(`/auth/${user.email}`);     

    expect(response.status).to.equal(HttpStatus.TOO_MANY_REQUESTS);      
    expect(response.body).to.deep.include({
      success: false,
      message: 'Too many request, please try again in 5mins'
    });
  });

  it('should succeed after request limit is passed', async () => {
    const limit = configService.get<number>('REQUEST_LIMIT');

    for(let i of Array(+limit).fill(1)){
      await request(httpServer)
        .get(`/auth/${user.email}`);
    }

    await redisCacheService.del(RedisCacheKeys.LIMIT_REQUESTS, true);

    const response = await request(httpServer)
      .get(`/auth/${user.email}`);     

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body).to.deep.include({
      success: true,
      message: 'Your OTP has been sent to your mail'
    });
  });
});