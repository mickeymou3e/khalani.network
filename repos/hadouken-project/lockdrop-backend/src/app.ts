import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule);

  const cors = process.env.CORS.split(';') || [];

  if (cors && cors.length > 0) {
    app.enableCors({
      origin: cors,
    });
  }

  return { app };
}

export async function createExpressApp() {
  const { app } = await createApp();
  await app.init();

  return app.getHttpAdapter().getInstance();
}
