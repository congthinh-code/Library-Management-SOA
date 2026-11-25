import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  LoanDetailStatus,
  ReturnCondition,
} from '../../../common/enums/circulation.enum.js';
import { RenewalRequest } from '../../renewals/entities/renewal-request.entity.js';
import { Violation } from '../../fines/entities/violation.entity.js';
import { Loan } from './loan.entity.js';

@Entity({ schema: 'circulation', name: 'loan_details' })
@Index('IX_loan_details_loan_id', ['loanId'])
@Index('IX_loan_details_due_date_status', ['dueDate', 'status'])
export class LoanDetail {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'loan_id', type: 'bigint' })
  loanId: string;

  // Tham chiếu logic tới Catalog Service (đầu sách)
  @Column({ name: 'book_id', type: 'bigint' })
  bookId: string;

  // Tham chiếu logic tới Catalog Service (bản sao cuốn sách cụ thể)
  @Column({ name: 'book_copy_id', type: 'bigint' })
  bookCopyId: string;

  @Column({ name: 'due_date', type: 'datetime2', precision: 0 })
  dueDate: Date;

  @Column({
    name: 'return_date',
    type: 'datetime2',
    precision: 0,
    nullable: true,
  })
  returnDate: Date | null;

  @Column({ name: 'renewal_count', type: 'int', default: 0 })
  renewalCount: number;

  @Column({
    name: 'return_condition',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  returnCondition: ReturnCondition | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: LoanDetailStatus.BORROWED,
  })
  status: LoanDetailStatus;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2', precision: 0 })
  updatedAt: Date;

  @ManyToOne(() => Loan, (loan) => loan.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loan_id' })
  loan: Loan;

  @OneToMany(() => RenewalRequest, (renewal) => renewal.loanDetail)
  renewalRequests?: RenewalRequest[];

  @OneToMany(() => Violation, (violation) => violation.loanDetail)
  violations?: Violation[];
}