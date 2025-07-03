import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestApplicationOptions } from '@nestjs/common/interfaces/nest-application-options.interface';
import { NestExpressApplication } from '@nestjs/platform-express/interfaces/nest-express-application.interface';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';

import { AppModule } from './app.module';

export const createApp = async (nestOptions?: NestApplicationOptions) => {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    nestOptions,
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('EVM arbiter')
    .setDescription('Api')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  return app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );
};
