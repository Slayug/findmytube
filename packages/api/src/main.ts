import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from '@fy/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(Config.apiPort);
}
bootstrap();
