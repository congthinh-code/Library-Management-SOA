import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCirculationSchema1732500000000 implements MigrationInterface {
  name = 'InitCirculationSchema1732500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 0. Đảm bảo schema [circulation] đã tồn tại
    await queryRunner.query(`
      IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'circulation')
      BEGIN
        EXEC('CREATE SCHEMA [circulation]');
      END
    `);

    // 1. Tạo bảng [circulation].[reservations]
    await queryRunner.query(`
      CREATE TABLE [circulation].[reservations] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [reservation_code] VARCHAR(30) NOT NULL,
        [reader_id] INT NOT NULL,
        [book_id] BIGINT NOT NULL,
        [book_copy_id] BIGINT NULL,
        [reserved_at] DATETIME2(0) NOT NULL,
        [expires_at] DATETIME2(0) NULL,
        [fulfilled_at] DATETIME2(0) NULL,
        [cancelled_at] DATETIME2(0) NULL,
        [status] VARCHAR(25) NOT NULL CONSTRAINT [DF_reservations_status] DEFAULT 'PENDING',
        [notes] NVARCHAR(500) NULL,
        [created_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_reservations_created_at] DEFAULT SYSDATETIME(),
        [updated_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_reservations_updated_at] DEFAULT SYSDATETIME(),
        CONSTRAINT [PK_reservations] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_reservations_reservation_code] UNIQUE ([reservation_code])
      );
    `);

    // 2. Tạo bảng [circulation].[loans]
    await queryRunner.query(`
      CREATE TABLE [circulation].[loans] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [loan_code] VARCHAR(30) NOT NULL,
        [reader_id] INT NOT NULL,
        [reservation_id] BIGINT NULL,
        [staff_id] INT NULL,
        [borrow_date] DATETIME2(0) NOT NULL,
        [due_date] DATETIME2(0) NOT NULL,
        [status] VARCHAR(20) NOT NULL CONSTRAINT [DF_loans_status] DEFAULT 'BORROWED',
        [notes] NVARCHAR(500) NULL,
        [created_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_loans_created_at] DEFAULT SYSDATETIME(),
        [updated_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_loans_updated_at] DEFAULT SYSDATETIME(),
        CONSTRAINT [PK_loans] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_loans_loan_code] UNIQUE ([loan_code]),
        CONSTRAINT [FK_loans_reservation_id] FOREIGN KEY ([reservation_id])
          REFERENCES [circulation].[reservations] ([id]) ON DELETE SET NULL
      );
    `);

    // 3. Tạo bảng [circulation].[loan_details]
    await queryRunner.query(`
      CREATE TABLE [circulation].[loan_details] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [loan_id] BIGINT NOT NULL,
        [book_id] BIGINT NOT NULL,
        [book_copy_id] BIGINT NOT NULL,
        [due_date] DATETIME2(0) NOT NULL,
        [return_date] DATETIME2(0) NULL,
        [renewal_count] INT NOT NULL CONSTRAINT [DF_loan_details_renewal_count] DEFAULT 0,
        [return_condition] VARCHAR(30) NULL,
        [status] VARCHAR(20) NOT NULL CONSTRAINT [DF_loan_details_status] DEFAULT 'BORROWED',
        [notes] NVARCHAR(500) NULL,
        [created_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_loan_details_created_at] DEFAULT SYSDATETIME(),
        [updated_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_loan_details_updated_at] DEFAULT SYSDATETIME(),
        CONSTRAINT [PK_loan_details] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_loan_details_loan_id] FOREIGN KEY ([loan_id])
          REFERENCES [circulation].[loans] ([id]) ON DELETE CASCADE
      );
    `);

    // 4. Tạo bảng [circulation].[renewal_requests]
    await queryRunner.query(`
      CREATE TABLE [circulation].[renewal_requests] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [loan_detail_id] BIGINT NOT NULL,
        [reader_id] INT NOT NULL,
        [previous_due_date] DATETIME2(0) NOT NULL,
        [requested_due_date] DATETIME2(0) NULL,
        [approved_due_date] DATETIME2(0) NULL,
        [reason] NVARCHAR(500) NULL,
        [status] VARCHAR(20) NOT NULL CONSTRAINT [DF_renewal_requests_status] DEFAULT 'PENDING',
        [processed_by] INT NULL,
        [processed_at] DATETIME2(0) NULL,
        [reject_reason] NVARCHAR(500) NULL,
        [created_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_renewal_requests_created_at] DEFAULT SYSDATETIME(),
        [updated_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_renewal_requests_updated_at] DEFAULT SYSDATETIME(),
        CONSTRAINT [PK_renewal_requests] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [FK_renewal_requests_loan_detail_id] FOREIGN KEY ([loan_detail_id])
          REFERENCES [circulation].[loan_details] ([id]) ON DELETE CASCADE
      );
    `);

    // 5. Tạo bảng [circulation].[violations]
    // Lưu ý: SQL Server không cho phép 2 đường dẫn CASCADE cùng trỏ về 1 bảng nên dùng ON DELETE NO ACTION
    await queryRunner.query(`
      CREATE TABLE [circulation].[violations] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [violation_code] VARCHAR(30) NOT NULL,
        [reader_id] INT NOT NULL,
        [loan_id] BIGINT NULL,
        [loan_detail_id] BIGINT NULL,
        [violation_type] VARCHAR(30) NOT NULL,
        [overdue_days] INT NOT NULL CONSTRAINT [DF_violations_overdue_days] DEFAULT 0,
        [description] NVARCHAR(500) NOT NULL,
        [status] VARCHAR(20) NOT NULL CONSTRAINT [DF_violations_status] DEFAULT 'OPEN',
        [recorded_by] INT NULL,
        [recorded_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_violations_recorded_at] DEFAULT SYSDATETIME(),
        [created_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_violations_created_at] DEFAULT SYSDATETIME(),
        [updated_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_violations_updated_at] DEFAULT SYSDATETIME(),
        CONSTRAINT [PK_violations] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_violations_violation_code] UNIQUE ([violation_code]),
        CONSTRAINT [FK_violations_loan_id] FOREIGN KEY ([loan_id])
          REFERENCES [circulation].[loans] ([id]) ON DELETE NO ACTION,
        CONSTRAINT [FK_violations_loan_detail_id] FOREIGN KEY ([loan_detail_id])
          REFERENCES [circulation].[loan_details] ([id]) ON DELETE NO ACTION
      );
    `);

    // 6. Tạo bảng [circulation].[fines]
    await queryRunner.query(`
      CREATE TABLE [circulation].[fines] (
        [id] BIGINT IDENTITY(1,1) NOT NULL,
        [fine_code] VARCHAR(30) NOT NULL,
        [violation_id] BIGINT NOT NULL,
        [reader_id] INT NOT NULL,
        [amount] DECIMAL(12, 2) NOT NULL,
        [paid_amount] DECIMAL(12, 2) NOT NULL CONSTRAINT [DF_fines_paid_amount] DEFAULT 0,
        [status] VARCHAR(20) NOT NULL CONSTRAINT [DF_fines_status] DEFAULT 'UNPAID',
        [payment_method] VARCHAR(30) NULL,
        [paid_at] DATETIME2(0) NULL,
        [collected_by] INT NULL,
        [notes] NVARCHAR(500) NULL,
        [created_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_fines_created_at] DEFAULT SYSDATETIME(),
        [updated_at] DATETIME2(0) NOT NULL CONSTRAINT [DF_fines_updated_at] DEFAULT SYSDATETIME(),
        CONSTRAINT [PK_fines] PRIMARY KEY CLUSTERED ([id] ASC),
        CONSTRAINT [UQ_fines_fine_code] UNIQUE ([fine_code]),
        CONSTRAINT [UQ_fines_violation_id] UNIQUE ([violation_id]),
        CONSTRAINT [FK_fines_violation_id] FOREIGN KEY ([violation_id])
          REFERENCES [circulation].[violations] ([id]) ON DELETE CASCADE
      );
    `);

    // 7. Tạo các Index tối ưu truy vấn và Filtered Unique Index chống trùng nghiệp vụ
    await queryRunner.query(`
      CREATE INDEX [IX_reservations_book_id_status_reserved_at]
        ON [circulation].[reservations] ([book_id], [status], [reserved_at]);

      CREATE UNIQUE INDEX [UX_reservations_active_reader_book]
        ON [circulation].[reservations] ([reader_id], [book_id])
        WHERE [status] IN ('PENDING', 'READY_FOR_PICKUP');

      CREATE INDEX [IX_loans_reader_id_status]
        ON [circulation].[loans] ([reader_id], [status]);

      CREATE INDEX [IX_loan_details_loan_id]
        ON [circulation].[loan_details] ([loan_id]);

      CREATE INDEX [IX_loan_details_due_date_status]
        ON [circulation].[loan_details] ([due_date], [status]);

      CREATE UNIQUE INDEX [UX_loan_details_active_book_copy]
        ON [circulation].[loan_details] ([book_copy_id])
        WHERE [status] IN ('BORROWED', 'OVERDUE');

      CREATE INDEX [IX_renewal_requests_loan_detail_id]
        ON [circulation].[renewal_requests] ([loan_detail_id]);

      CREATE INDEX [IX_violations_reader_id_status]
        ON [circulation].[violations] ([reader_id], [status]);

      CREATE INDEX [IX_fines_reader_id_status]
        ON [circulation].[fines] ([reader_id], [status]);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Xóa theo thứ tự ngược lại của quan hệ khóa ngoại
    await queryRunner.query(`DROP TABLE IF EXISTS [circulation].[fines];`);
    await queryRunner.query(`DROP TABLE IF EXISTS [circulation].[violations];`);
    await queryRunner.query(`DROP TABLE IF EXISTS [circulation].[renewal_requests];`);
    await queryRunner.query(`DROP TABLE IF EXISTS [circulation].[loan_details];`);
    await queryRunner.query(`DROP TABLE IF EXISTS [circulation].[loans];`);
    await queryRunner.query(`DROP TABLE IF EXISTS [circulation].[reservations];`);
  }
}