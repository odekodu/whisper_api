import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { Fixture } from '../../fixture';
import { ErrorResponse } from '../../../src/errors/error.response';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { ConfigService } from '@nestjs/config';
import { UserResponse } from '../../../src/domains/users/responses/user.response';
import { userStub } from '../../stubs/user.stubs';
import { expect } from 'chai';

describe('Update Profile', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;
  let dbConnection: Connection;
  let fixture: Fixture;
  let redisCacheService: RedisCacheService;
  let configService: ConfigService;
  let user = null;
  let token: string;

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
    fixture = new Fixture(dbConnection, redisCacheService, configService, );
  });

  beforeEach(async () => {
    user = await fixture.createUser();
    token = await fixture.login(user);
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

  it('should fail when no token is provided', async () => {
    const response = await request(httpServer)
      .patch('/profile')
      .send();   

    expect(response.status).to.equal(HttpStatus.UNAUTHORIZED);  
    expect(response.body).to.deep.include({
      success: false,
      message: 'You are not authorized'
    })  
  });

  it('should fail when invalid token is provided', async () => {
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', 'token')
      .send();   

    expect(response.status).to.equal(HttpStatus.UNAUTHORIZED);  
    expect(response.body).to.deep.include({
      success: false,
      message: 'Invalid token'
    });  
  });

  it('should fail when no password is provided', async () => {
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', token)
      .send(); 
    
      expect(response.status).to.equal(HttpStatus.UNAUTHORIZED);  
      expect(response.body).to.deep.include({
        success: false,
        message: 'You are not authorized'
      }); 
  });

  it('should fail when wrong password is provided', async () => {
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', token)
      .set('password', '11223')
      .send(); 
    
      expect(response.status).to.equal(HttpStatus.UNAUTHORIZED);  
      expect(response.body).to.deep.include({
        success: false,
        message: 'Wrong password, please try again'
      }); 
  });

  it('should fail when invalid email is provided', async () => {
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', token)
      .set('password', fixture.password)
      .send({ email: 'email' }); 
    
      expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
      expect(response.body).to.deep.include({
        success: false,
        message: '"email" must be a valid email'
      }); 
  });

  it('should fail when invalid phone is provided', async () => {
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', token)
      .set('password', fixture.password)
      .send({ phone: 'phone' }); 
    
      expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
      expect(response.body).to.deep.include({
        success: false,
        message: '"phone" must be a valid phone number'
      }); 
  });

  it('should fail when email is taken', async () => {
    await fixture.createUser({ email: 'user@mail.com', phone: '11111111111' });
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', token)
      .set('password', fixture.password)
      .send({ email: 'user@mail.com' });  

    expect(response.status).to.equal(HttpStatus.CONFLICT);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"email" is already in use'
    });
  });

  it('should fail when phone is taken', async () => {    
    await fixture.createUser({ email: 'user@mail.com', phone: '11111111111' });
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', token)
      .set('password', fixture.password)
      .send({ phone: '11111111111' });  

    expect(response.status).to.equal(HttpStatus.CONFLICT);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"phone" is already in use'
    });
  });

  it('should succeed when valid data is sent', async () => {    
    const response = await request(httpServer)
      .patch('/profile')
      .set('token', token)
      .set('password', fixture.password)
      .send({ phone: '11111111111' });  

    expect(response.status).to.equal(HttpStatus.OK);      
    expect(response.body.payload).to.deep.include({ ...userStub, phone: '11111111111' });
  });
});