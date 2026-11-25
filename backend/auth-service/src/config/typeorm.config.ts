import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 1433),
  username: process.env.DB_USERNAME ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'LibraryDB',
  schema: process.env.DB_SCHEMA ?? 'auth',
  autoLoadEntities: true,
  synchronize: false,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
  extra: { trustServerCertificate: true },
});
