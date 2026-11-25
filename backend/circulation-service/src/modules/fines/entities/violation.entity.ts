import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ViolationStatus,
  ViolationType,
} from '../../../common/enums/circulation.enum.js';
import { Loan } from '../../loans/entities/loan.entity.js';
import { LoanDetail } from '../../loans/entities/loan-detail.entity.js';
import { Fine } from './fine.entity.js';

@Entity({ schema: 'circulation', name: 'violations' })
@Index('IX_violations_reader_id_status', ['readerId', 'status'])
export class Violation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'violation_code', type: 'varchar', length: 30, unique: true })
  violationCode: string;

  // Tham chiếu logic tới Reader Service
  @Column({ name: 'reader_id', type: 'int' })
  readerId: number;

  @Column({ name: 'loan_id', type: 'bigint', nullable: true })
  loanId: string | null;

  @Column({ name: 'loan_detail_id', type: 'bigint', nullable: true })
  loanDetailId: string | null;

  @Column({ name: 'violation_type', type: 'varchar', length: 30 })
  violationType: ViolationType;

  @Column({ name: 'overdue_days', type: 'int', default: 0 })
  overdueDays: number;

  @Column({ type: 'nvarchar', length: 500 })
  description: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: ViolationStatus.OPEN,
  })
  status: ViolationStatus;

  // Tham chiếu logic tới Auth Service
  @Column({ name: 'recorded_by', type: 'int', nullable: true })
  recordedBy: number | null;

  @Column({
    name: 'recorded_at',
    type: 'datetime2',
    precision: 0,
    default: () => 'SYSDATETIME()',
  })
  recordedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2', precision: 0 })
  updatedAt: Date;

  @ManyToOne(() => Loan, (loan) => loan.violations, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'loan_id' })
  loan?: Loan | null;

  @ManyToOne(() => LoanDetail, (detail) => detail.violations, {
    nullable: true,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'loan_detail_id' })
  loanDetail?: LoanDetail | null;

  @OneToOne(() => Fine, (fine) => fine.violation)
  fine?: Fine;
}