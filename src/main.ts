import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

const PORT = process.env.PORT || 3000;

bootstrap();

console.log(`Backend running on port ${PORT}`);