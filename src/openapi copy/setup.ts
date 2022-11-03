import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SwaggerDocumentOption } from "./swagger.document.options";

export const setupOpenAPI = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('occupy Documentation')
    .setDescription('The occupy API documentation')
    .setVersion('1.0')
    .addTag('occupy')
    .build();

  const options: SwaggerDocumentOption = {
    operationIdFactory: (
      controlKey: string,
      methodKey: string
    ) => methodKey
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('docs', app, document);
};