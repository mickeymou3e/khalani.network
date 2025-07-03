import { createApp } from './app';

export async function bootstrap() {
  const { app } = await createApp();

  await app.listen(3000);
}
bootstrap();
