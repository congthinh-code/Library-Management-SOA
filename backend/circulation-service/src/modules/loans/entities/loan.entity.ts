import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { LoanStatus } from '../../../common/enums/circulation.enum.js';
import { Reservation } from '../../reservations/entities/reservation.entity.js';
import { Violation } from '../../fines/entities/violation.entity.js';
import { LoanDetail } from './loan-detail.entity.js';

@Entity({ schema: 'circulation', name: 'loans' })
@Index('IX_loans_reader_id_status', ['readerId', 'status'])
export class Loan {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'loan_code', type: 'varchar', length: 30, unique: true })
  loanCode: string;

  // Tham chiếu logic tới Reader Service (không tạo FK vật lý)
  @Column({ name: 'reader_id', type: 'int' })
  readerId: number;

  // FK nội bộ tới Reservation nếu phiếu mượn xuất phát từ đặt trước
  @Column({ name: 'reservation_id', type: 'bigint', nullable: true })
  reservationId: string | null;

  // Tham chiếu logic tới Auth Service (thủ thư lập phiếu)
  @Column({ name: 'staff_id', type: 'int', nullable: true })
  staffId: number | null;

  @Column({ name: 'borrow_date', type: 'datetime2', precision: 0 })
  borrowDate: Date;

  @Column({ name: 'due_date', type: 'datetime2', precision: 0 })
  dueDate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: LoanStatus.BORROWED,
  })
  status: LoanStatus;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2', precision: 0 })
  updatedAt: Date;

  @OneToOne(() => Reservation, (reservation) => reservation.loan, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation?: Reservation | null;

  @OneToMany(() => LoanDetail, (detail) => detail.loan, { cascade: true })
  details: LoanDetail[];

  @OneToMany(() => Violation, (violation) => violation.loan)
  violations?: Violation[];
}