import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { ResponseSchema } from '../../../src/shared/response.schema';
import { createUserStub, userStub } from '../../stubs/user.stubs';
import { Fixture } from '../../fixture';
import { ErrorResponse } from '../../../src/errors/error.response';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { ConfigService } from '@nestjs/config';
import { expect } from 'chai';

describe('Create User', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
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

  afterEach(async() => {
    await dbConnection.collection('users').deleteMany({});
  });

  after(async () => {
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should fail when no email is provided', async () => {
    const response = await request(httpServer)
      .post('/users')
      .send({});    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"email" is required'
    })  
  });

  it('should fail when invalid email is provided', async () => {
    const response = await request(httpServer)
      .post('/users')
      .send({ email: 'sample' });

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"email" must be a valid email'
    })  
  });

  it('should fail when phone number is not valid', async () => {
    const response = await request(httpServer)
      .post('/users')
      .send({ email: createUserStub.email });    

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"phone" must be a valid phone number'
    })  
  });

  it('should fail when no firstname is provided', async () => {
    const response = await request(httpServer)
      .post('/users')
      .send({ email: createUserStub.email, phone: createUserStub.phone });

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"firstname" is required'
    })  
  });

  it('should fail when no lastname is provided', async () => {
    const response = await request(httpServer)
      .post('/users')
      .send({ email: createUserStub.email, phone: createUserStub.phone, firstname: createUserStub.firstname });

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"lastname" is required'
    })  
  });

  it('should fail when email is taken', async () => {
    await fixture.createUser();

    const response = await request(httpServer)
      .post('/users')
      .send({ ...createUserStub });    

    expect(response.status).to.equal(HttpStatus.CONFLICT);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"email" is already in use'
    });
  });

  it('should fail when phone is taken', async () => {
    await fixture.createUser({ email: 'user@mail.com' });

    const response = await request(httpServer)
      .post('/users')
      .send({ ...createUserStub });    

    expect(response.status).to.equal(HttpStatus.CONFLICT);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"phone" is already in use'
    });
  });

  it('should succeed when valid data is provided', async () => {
    const response = await request(httpServer)
      .post('/users')
      .send({...createUserStub});      

    expect(response.status).to.equal(HttpStatus.CREATED); 
    expect(response.body.success).to.equal(true);                           
    expect(response.body.payload).to.deep.include(userStub);
  });
});