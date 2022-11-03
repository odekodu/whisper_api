import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import * as mocha from 'mocha';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let httpServer: any;
  let moduleFixture: TestingModule;

  before(async () => {
    moduleFixture = await Test.createTestingModule({
      imports: [
        AppModule
      ],
    }).compile();

    app = moduleFixture.createNestApplication();    
    await app.init();

    httpServer = app.getHttpServer();
  });

  after(async () => {
    await app.close();
    await moduleFixture.close();
  });

  it('should succed when getting index', async () => {
    await request(httpServer)
      .get('/')
      .expect(200);
  });
});