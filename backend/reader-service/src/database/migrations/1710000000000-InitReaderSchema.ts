import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitReaderSchema1710000000000 implements MigrationInterface {
  name = 'InitReaderSchema1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = 'reader')
      EXEC('CREATE SCHEMA reader');
    `);
    await queryRunner.query(`
      CREATE TABLE reader.readers (
        reader_id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        reader_code VARCHAR(30) NOT NULL UNIQUE,
        full_name NVARCHAR(150) NOT NULL,
        email VARCHAR(150) NULL,
        phone VARCHAR(20) NULL,
        reader_type VARCHAR(20) NOT NULL,
        card_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        user_id INT NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
        updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
      );
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("IF OBJECT_ID('reader.readers', 'U') IS NOT NULL DROP TABLE reader.readers;");
  }
}
