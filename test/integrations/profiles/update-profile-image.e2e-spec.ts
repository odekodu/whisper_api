import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Connection } from 'mongoose';
import { DatabaseService } from '../../../src/database/database.service';
import { AppModule } from '../../../src/app.module';
import { Fixture } from '../../fixture';
import { RedisCacheService } from '../../../src/redis-cache/redis-cache.service';
import { ConfigService } from '@nestjs/config';
import { Storage } from '../../../src/shared/storage';
import { expect } from 'chai';

describe('Update Profile Image', () => {
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
    Storage.reset();
    await dbConnection.dropDatabase();
    await app.close();
    await moduleFixture.close();
  });

  it('should fail when no image is sent', async () => {    
    const response = await request(httpServer)
      .patch('/profile/image')
      .set('authorization', 'Bearer ' + token);

    expect(response.status).to.equal(HttpStatus.BAD_REQUEST);  
    expect(response.body).to.deep.include({
      success: false,
      message: '"file" is not valid'
    });
  });

  it('should succeed when valid data is sent', async () => {    
    const response = await request(httpServer)
      .patch('/profile/image')
      .attach('image', './test/sample.png')
      .set('authorization', 'Bearer ' + token)
      .set('Content-Type', 'multipart/form-data')

    expect(response.status).to.equal(HttpStatus.OK);          
  });
});