import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'audit_logs' })
@Index('IX_auth_audit_logs_created_at', ['createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn({ name: 'log_id', type: 'bigint' })
  logId: string;

  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId: string | null;

  @Column({ name: 'action', type: 'nvarchar', length: 100 })
  action: string;

  @Column({ name: 'resource', type: 'nvarchar', length: 150, nullable: true })
  resource: string | null;

  @Column({ name: 'request_id', type: 'nvarchar', length: 100, nullable: true })
  requestId: string | null;

  @Column({ name: 'details', type: 'nvarchar', length: 'max', nullable: true })
  details: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  createdAt: Date;
}
