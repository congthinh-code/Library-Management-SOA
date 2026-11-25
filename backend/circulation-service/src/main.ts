import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { AppModule } from './app.module.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // 1. Kiểm tra trạng thái kết nối SQL Server ngay lúc khởi động
    const dataSource = app.get(DataSource);
    if (dataSource.isInitialized) {
      logger.log(
        `Kết nối SQL Server thành công -> Database: [${configService.get('DB_NAME', 'LibraryDB')}], Schema: [${configService.get('DB_SCHEMA', 'circulation')}]`,
      );
    }

    // 2. Cấu hình Global Prefix (/api/v1)
    const apiPrefix = 'api/v1';
    app.setGlobalPrefix(apiPrefix);

    // 3. Cấu hình CORS cho Angular (mặc định http://localhost:4200)
    const corsOriginsRaw = configService.get<string>(
      'CORS_ORIGINS',
      'http://localhost:4200',
    );
    const corsOrigins = corsOriginsRaw.split(',').map((origin) => origin.trim());

    app.enableCors({
      origin: corsOrigins,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      credentials: true,
    });

    // 4. Cấu hình Global ValidationPipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true, // Tự động loại bỏ các field không khai báo trong DTO
        forbidNonWhitelisted: true, // Báo lỗi 400 nếu client gửi thừa field lạ
        transform: true, // Tự động ép kiểu payload theo định nghĩa DTO
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    // 5. Cấu hình Swagger tại đường dẫn /api/docs
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Library Management System - Circulation Service')
      .setDescription(
        'API quản lý mượn sách, trả sách, đặt trước, gia hạn, vi phạm và tiền phạt',
      )
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);

    // 6. Kết nối Hybrid Microservice (TCP) để nhận lệnh từ API Gateway
    const tcpHost = configService.get<string>('TCP_HOST', '0.0.0.0');
    const tcpPort = Number(configService.get<string>('TCP_PORT', '3014'));

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.TCP,
      options: {
        host: tcpHost,
        port: tcpPort,
      },
    });

    await app.startAllMicroservices();
    logger.log(`TCP Microservice đang lắng nghe tại ${tcpHost}:${tcpPort}`);

    // 7. Khởi chạy HTTP Server tại PORT (mặc định 3004)
    const port = Number(configService.get<string>('PORT', '3004'));
    await app.listen(port);

    logger.log(`Circulation Service HTTP chạy tại: http://localhost:${port}/${apiPrefix}`);
    logger.log(`Swagger UI sẵn sàng tại: http://localhost:${port}/api/docs`);

    app.useGlobalFilters(new AllExceptionsFilter());
  } catch (error) {
    logger.error(
      'Khởi động Circulation Service thất bại! Chi tiết lỗi bên dưới:',
      error instanceof Error ? error.stack : String(error),
    );
    process.exit(1);
  }
}

void bootstrap();