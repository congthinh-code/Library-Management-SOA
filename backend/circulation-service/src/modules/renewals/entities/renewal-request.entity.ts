import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RenewalRequestStatus } from '../../../common/enums/circulation.enum.js';
import { LoanDetail } from '../../loans/entities/loan-detail.entity.js';

@Entity({ schema: 'circulation', name: 'renewal_requests' })
@Index('IX_renewal_requests_loan_detail_id', ['loanDetailId'])
export class RenewalRequest {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'loan_detail_id', type: 'bigint' })
  loanDetailId: string;

  // Tham chiếu logic tới Reader Service
  @Column({ name: 'reader_id', type: 'int' })
  readerId: number;

  @Column({ name: 'previous_due_date', type: 'datetime2', precision: 0 })
  previousDueDate: Date;

  @Column({
    name: 'requested_due_date',
    type: 'datetime2',
    precision: 0,
    nullable: true,
  })
  requestedDueDate: Date | null;

  @Column({
    name: 'approved_due_date',
    type: 'datetime2',
    precision: 0,
    nullable: true,
  })
  approvedDueDate: Date | null;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  reason: string | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: RenewalRequestStatus.PENDING,
  })
  status: RenewalRequestStatus;

  // Tham chiếu logic tới Auth Service (thủ thư duyệt/từ chối)
  @Column({ name: 'processed_by', type: 'int', nullable: true })
  processedBy: number | null;

  @Column({
    name: 'processed_at',
    type: 'datetime2',
    precision: 0,
    nullable: true,
  })
  processedAt: Date | null;

  @Column({
    name: 'reject_reason',
    type: 'nvarchar',
    length: 500,
    nullable: true,
  })
  rejectReason: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2', precision: 0 })
  updatedAt: Date;

  @ManyToOne(() => LoanDetail, (detail) => detail.renewalRequests, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'loan_detail_id' })
  loanDetail: LoanDetail;
}