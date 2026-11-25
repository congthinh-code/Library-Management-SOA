import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  FineStatus,
  PaymentMethod,
} from '../../../common/enums/circulation.enum.js';
import { Violation } from './violation.entity.js';

@Entity({ schema: 'circulation', name: 'fines' })
@Index('IX_fines_reader_id_status', ['readerId', 'status'])
export class Fine {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'fine_code', type: 'varchar', length: 30, unique: true })
  fineCode: string;

  // Quan hệ 1 - 1 với Violation (unique đảm bảo 1 vi phạm chỉ có 1 khoản phạt)
  @Column({ name: 'violation_id', type: 'bigint', unique: true })
  violationId: string;

  // Tham chiếu logic tới Reader Service
  @Column({ name: 'reader_id', type: 'int' })
  readerId: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: string;

  @Column({
    name: 'paid_amount',
    type: 'decimal',
    precision: 12,
    scale: 2,
    default: 0,
  })
  paidAmount: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: FineStatus.UNPAID,
  })
  status: FineStatus;

  @Column({
    name: 'payment_method',
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  paymentMethod: PaymentMethod | null;

  @Column({ name: 'paid_at', type: 'datetime2', precision: 0, nullable: true })
  paidAt: Date | null;

  // Tham chiếu logic tới Auth Service (thủ thư thu tiền)
  @Column({ name: 'collected_by', type: 'int', nullable: true })
  collectedBy: number | null;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2', precision: 0 })
  updatedAt: Date;

  @OneToOne(() => Violation, (violation) => violation.fine, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'violation_id' })
  violation: Violation;
}