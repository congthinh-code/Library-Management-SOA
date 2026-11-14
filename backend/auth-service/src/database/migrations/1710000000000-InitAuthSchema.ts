import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitAuthSchema1710000000000 implements MigrationInterface {
  name = 'InitAuthSchema1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'auth') EXEC(N'CREATE SCHEMA auth')`);
    await queryRunner.query(`
      IF OBJECT_ID(N'auth.users', N'U') IS NULL
      CREATE TABLE auth.users (
        user_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_auth_users PRIMARY KEY,
        username NVARCHAR(50) NOT NULL,
        email NVARCHAR(150) NULL,
        password_hash NVARCHAR(255) NOT NULL,
        is_active BIT NOT NULL CONSTRAINT DF_auth_users_is_active DEFAULT 1,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_auth_users_created_at DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2 NOT NULL CONSTRAINT DF_auth_users_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_auth_users_username UNIQUE(username)
      )`);
    await queryRunner.query(`
      IF OBJECT_ID(N'auth.roles', N'U') IS NULL
      CREATE TABLE auth.roles (
        role_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_auth_roles PRIMARY KEY,
        role_name NVARCHAR(30) NOT NULL,
        description NVARCHAR(255) NULL,
        CONSTRAINT UQ_auth_roles_role_name UNIQUE(role_name)
      )`);
    await queryRunner.query(`
      IF OBJECT_ID(N'auth.user_roles', N'U') IS NULL
      CREATE TABLE auth.user_roles (
        user_id BIGINT NOT NULL,
        role_id INT NOT NULL,
        CONSTRAINT PK_auth_user_roles PRIMARY KEY(user_id, role_id),
        CONSTRAINT FK_auth_user_roles_users FOREIGN KEY(user_id) REFERENCES auth.users(user_id) ON DELETE CASCADE,
        CONSTRAINT FK_auth_user_roles_roles FOREIGN KEY(role_id) REFERENCES auth.roles(role_id) ON DELETE CASCADE
      )`);
    await queryRunner.query(`
      IF OBJECT_ID(N'auth.system_settings', N'U') IS NULL
      CREATE TABLE auth.system_settings (
        setting_id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_auth_system_settings PRIMARY KEY,
        setting_key NVARCHAR(100) NOT NULL,
        setting_value NVARCHAR(MAX) NULL,
        description NVARCHAR(255) NULL,
        updated_at DATETIME2 NOT NULL CONSTRAINT DF_auth_settings_updated_at DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_auth_system_settings_key UNIQUE(setting_key)
      )`);
    await queryRunner.query(`
      IF OBJECT_ID(N'auth.audit_logs', N'U') IS NULL
      CREATE TABLE auth.audit_logs (
        log_id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_auth_audit_logs PRIMARY KEY,
        user_id BIGINT NULL,
        action NVARCHAR(100) NOT NULL,
        resource NVARCHAR(150) NULL,
        request_id NVARCHAR(100) NULL,
        details NVARCHAR(MAX) NULL,
        created_at DATETIME2 NOT NULL CONSTRAINT DF_auth_audit_logs_created_at DEFAULT SYSUTCDATETIME()
      )`);
    await queryRunner.query(`IF NOT EXISTS (SELECT 1 FROM auth.roles WHERE role_name = N'ADMIN') INSERT INTO auth.roles(role_name, description) VALUES (N'ADMIN', N'System administrator')`);
    await queryRunner.query(`IF NOT EXISTS (SELECT 1 FROM auth.roles WHERE role_name = N'STAFF') INSERT INTO auth.roles(role_name, description) VALUES (N'STAFF', N'Library staff')`);
    await queryRunner.query(`IF NOT EXISTS (SELECT 1 FROM auth.roles WHERE role_name = N'READER') INSERT INTO auth.roles(role_name, description) VALUES (N'READER', N'Library reader')`);
    await queryRunner.query(`IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = N'IX_auth_audit_logs_created_at' AND object_id = OBJECT_ID(N'auth.audit_logs')) CREATE INDEX IX_auth_audit_logs_created_at ON auth.audit_logs(created_at DESC)`);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS auth.user_roles`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth.audit_logs`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth.system_settings`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth.users`);
    await queryRunner.query(`DROP TABLE IF EXISTS auth.roles`);
  }
}
