import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from '../../../common/enums/circulation.enum.js';
import { Loan } from '../../loans/entities/loan.entity.js';

@Entity({ schema: 'circulation', name: 'reservations' })
@Index('IX_reservations_book_id_status_reserved_at', [
  'bookId',
  'status',
  'reservedAt',
])
export class Reservation {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'reservation_code', type: 'varchar', length: 30, unique: true })
  reservationCode: string;

  // Tham chiếu logic tới Reader Service (không tạo FK vật lý)
  @Column({ name: 'reader_id', type: 'int' })
  readerId: number;

  // Tham chiếu logic tới Catalog Service (không tạo FK vật lý)
  @Column({ name: 'book_id', type: 'bigint' })
  bookId: string;

  // Gán bản sao sách cụ thể khi chuyển sang READY_FOR_PICKUP
  @Column({ name: 'book_copy_id', type: 'bigint', nullable: true })
  bookCopyId: string | null;

  @Column({ name: 'reserved_at', type: 'datetime2', precision: 0 })
  reservedAt: Date;

  @Column({ name: 'expires_at', type: 'datetime2', precision: 0, nullable: true })
  expiresAt: Date | null;

  @Column({
    name: 'fulfilled_at',
    type: 'datetime2',
    precision: 0,
    nullable: true,
  })
  fulfilledAt: Date | null;

  @Column({
    name: 'cancelled_at',
    type: 'datetime2',
    precision: 0,
    nullable: true,
  })
  cancelledAt: Date | null;

  @Column({
    type: 'varchar',
    length: 25,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2', precision: 0 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2', precision: 0 })
  updatedAt: Date;

  // Quan hệ 1 - 0..1 với Loan khi độc giả đến nhận sách
  @OneToOne(() => Loan, (loan) => loan.reservation)
  loan?: Loan;
}