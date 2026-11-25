import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reader } from './readers/reader.entity';
import { ReadersModule } from './readers/readers.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST ?? 'localhost',
      port: Number(process.env.DB_PORT ?? 1433),
      username: process.env.DB_USERNAME ?? 'sa',
      password: process.env.DB_PASSWORD ?? '',
      database: process.env.DB_DATABASE ?? 'LibraryDB',
      schema: 'reader',
      entities: [Reader],
      synchronize: false,
      options: { encrypt: false, trustServerCertificate: true },
    }),
    ReadersModule,
  ],
})
export class AppModule {}
