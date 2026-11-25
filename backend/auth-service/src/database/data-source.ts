import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { AuditLog } from '../audit-logs/audit-log.entity';
import { Role } from '../roles/role.entity';
import { SystemSetting } from '../settings/system-setting.entity';
import { UserRole } from '../users/user-role.entity';
import { User } from '../users/user.entity';
import { InitAuthSchema1710000000000 } from './migrations/1710000000000-InitAuthSchema';

export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 1433),
  username: process.env.DB_USERNAME ?? 'sa',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'LibraryDB',
  schema: process.env.DB_SCHEMA ?? 'auth',
  entities: [User, Role, UserRole, SystemSetting, AuditLog],
  migrations: [InitAuthSchema1710000000000],
  synchronize: false,
  options: { encrypt: false, trustServerCertificate: true },
});
