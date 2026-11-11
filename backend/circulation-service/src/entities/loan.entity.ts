import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { LoanDetail } from './loan-detail.entity';

export enum LoanStatus {
  BORROWED = 'BORROWED',
  RETURNED = 'RETURNED',
  OVERDUE = 'OVERDUE',
}

@Entity('loans')
export class Loan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uniqueidentifier' })
  readerId: string;

  @Column({ type: 'datetime2' })
  borrowDate: Date;

  @Column({ type: 'datetime2' })
  dueDate: Date;

  @Column({ type: 'datetime2', nullable: true })
  actualReturnDate: Date;

  @Column({ type: 'varchar', length: 20, default: LoanStatus.BORROWED })
  status: LoanStatus;

  @OneToMany(() => LoanDetail, (detail) => detail.loan, { cascade: true })
  details: LoanDetail[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}