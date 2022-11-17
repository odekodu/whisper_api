import { Module } from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { ResponsesController } from './responses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Response, ResponseSchema } from './entities/response.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Response.name, schema: ResponseSchema }
    ]),
  ],
  controllers: [ResponsesController],
  providers: [ResponsesService]
})
export class ResponsesModule {}
