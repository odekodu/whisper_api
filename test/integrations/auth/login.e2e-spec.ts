import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { Fixture } from '../../../test/fixture';
import { ErrorResponse } from '../../../src/errors/error.response';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { ConfigService } from '@nestjs/config';
import { userStub } from '../../../test/stubs/user.stubs';
import { RedisCacheKeys } from '../../../src/redis-cache/redis-cache.keys';
import { expect } from 'chai';

describe('Request One time password', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
  let redisCacheService: RedisCacheService;
  let configService: ConfigService;
  let user = null;

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
    user = await fixture.createUser();
    await fixture.requestPassword(user.email);
  });

  afterEach(async() => {
    await dbConnection.collection('users').deleteMany({});
  });

  after(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should fail when no email is sent', async () => {
    const response = await request(httpServer)
      .post('/auth');     

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);      
    expect(response.body).to.deep.include({
      success: false,
      message: '"email" is required'
    });
  });

  it('should fail when an invalid email is sent', async () => {
    const response = await request(httpServer)
      .post('/auth')
      .send({ email: 'mail' })     

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);      
    expect(response.body).to.deep.include({
      success: false,
      message: '"email" must be a valid email'
    });
  });

  it('should fail when no password is sent', async () => {
    const response = await request(httpServer)
      .post('/auth')
      .send({ email: userStub.email })     

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);      
    expect(response.body).to.deep.include({
      success: false,
      message: '"password" is required'
    });
  });

  it('should fail wrong password is provided', async () => {
    const response = await request(httpServer)
      .post('/auth')
      .send({ email: userStub.email, password: '22139' })     

    expect(response.status).to.equal(HttpStatus.UNAUTHORIZED);      
    expect(response.body).to.deep.include({
      success: false,
      message: 'Wrong password, please try again'
    });
  });

  it('should fail when user does not exist', async () => {    
    const response = await request(httpServer)
      .post('/auth')
      .send({ email: 'user@mail.com', password: fixture.password })     

    expect(response.status).to.equal(HttpStatus.NOT_FOUND);      
    expect(response.body).to.deep.include({
      success: false,
      message: 'User not found'
    });
  });

  it('should succeed when valid data is sent', async () => {
    const response = await request(httpServer)
      .post('/auth')
      .send({ email: userStub.email, password: fixture.password })     

    expect(response.status).to.equal(HttpStatus.CREATED);      
    expect(response.body.payload).to.be.a('string')
  });
});