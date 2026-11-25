import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { DataSource } from 'typeorm';

dotenv.config();

const rootDir = process.cwd();

export const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  username: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'LibraryDB',
  schema: process.env.DB_SCHEMA || 'circulation',
  entities: [join(rootDir, 'dist', '**', '*.entity.js')],
  migrations: [join(rootDir, 'dist', 'database', 'migrations', '*.js')],
  migrationsTableName: 'circulation_migrations',
  synchronize: false,
  logging: ['error', 'warn', 'migration'],
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_SERVER_CERTIFICATE !== 'false',
    enableArithAbort: true,
  },
});