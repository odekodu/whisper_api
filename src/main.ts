import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { setRequestId } from './middlewares/setRequestId';
import { setupOpenAPI } from './openapi/setup';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(setRequestId);

  app.enableCors({ allowedHeaders: '*', origin: '*' });
  app.enableVersioning({ type: VersioningType.URI });
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  setupOpenAPI(app);

  const port = process.env.PORT;
  await app.listen(port);
  console.log(`Up and Running on ${await app.getUrl()}`);
}

bootstrap();
