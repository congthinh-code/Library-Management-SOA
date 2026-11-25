
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Cho phép Frontend Angular truy cập Reader Service
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Giữ nguyên API Prefix
  app.setGlobalPrefix('api/v1');

  await app.listen(Number(process.env.PORT ?? 3003));
  console.log('Reader Service running on port 3003');
}

void bootstrap();
