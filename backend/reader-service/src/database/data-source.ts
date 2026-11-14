import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Reader } from '../readers/reader.entity';
import { InitReaderSchema1710000000000 } from './migrations/1710000000000-InitReaderSchema';

export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 1433),
  username: process.env.DB_USERNAME ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'LibraryDB',
  schema: 'reader',
  entities: [Reader],
  migrations: [InitReaderSchema1710000000000],
  synchronize: false,
  options: { encrypt: false, trustServerCertificate: true },
});
