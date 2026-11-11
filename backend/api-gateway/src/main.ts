import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Cấu hình Global Prefix /api/v1 theo yêu cầu
  app.setGlobalPrefix('api/v1');
  
  await app.listen(process.env.PORT || 3000);
  console.log(`API Gateway is running on http://localhost:3000/api/v1`);
}
void bootstrap();
