import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const host = configService.get<string>('DB_HOST');
  const port = Number(configService.get<string>('DB_PORT', '1433'));
  const username = configService.get<string>('DB_USERNAME');
  const password = configService.get<string>('DB_PASSWORD');
  const database = configService.get<string>('DB_NAME', 'LibraryDB');
  const schema = configService.get<string>('DB_SCHEMA', 'circulation');

  if (!host || !username || !password) {
    throw new Error(
      '[Database Config Error] Thiếu thông tin kết nối SQL Server (DB_HOST, DB_USERNAME hoặc DB_PASSWORD) trong biến môi trường.',
    );
  }

  return {
    type: 'mssql',
    host,
    port,
    username,
    password,
    database,
    schema,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [join(__dirname, '..', 'database', 'migrations', '*.{ts,js}')],
    migrationsTableName: 'circulation_migrations',
    // Tuyệt đối không bật synchronize: true để bảo vệ schema và dữ liệu
    synchronize: false,
    migrationsRun: false,
    logging: configService.get<string>('NODE_ENV') === 'development' ? ['error', 'warn', 'migration'] : ['error'],
    options: {
      encrypt: configService.get<string>('DB_ENCRYPT', 'false') === 'true',
      trustServerCertificate:
        configService.get<string>('DB_TRUST_SERVER_CERTIFICATE', 'true') === 'true',
      enableArithAbort: true,
    },
    extra: {
      connectionTimeout: 15000,
      requestTimeout: 15000,
    },
  };
};