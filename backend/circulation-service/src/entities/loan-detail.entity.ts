import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Loan } from './loan.entity';

@Entity('loan_details')
export class LoanDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uniqueidentifier', nullable: true })
  loanId: string;

  @Column({ type: 'uniqueidentifier' })
  bookCopyId: string;

  @Column({ type: 'nvarchar', length: 255, nullable: true })
  note: string;

  @ManyToOne(() => Loan, (loan) => loan.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'loanId' })
  loan: Loan;
}