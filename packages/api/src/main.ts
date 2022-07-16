import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from '@findmytube/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [`https://www.${Config.host}`, `https://${Config.host}`],
    methods: ['GET', 'POST'],
  });

  await app.listen(Config.apiPort);
}

bootstrap();
