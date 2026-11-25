import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum ReaderType {
  STUDENT = 'STUDENT',
  LECTURER = 'LECTURER',
}

export enum CardStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  EXPIRED = 'EXPIRED',
}

@Entity({ schema: 'reader', name: 'readers' })
export class Reader {
  @PrimaryGeneratedColumn({ name: 'reader_id', type: 'int' })
  readerId: number;

  @Column({ name: 'reader_code', type: 'varchar', length: 30, unique: true })
  readerCode: string;

  @Column({ name: 'full_name', type: 'nvarchar', length: 150 })
  fullName: string;

  @Column({ name: 'email', type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @Column({ name: 'phone', type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ name: 'reader_type', type: 'varchar', length: 20 })
  readerType: ReaderType;

  @Column({ name: 'card_status', type: 'varchar', length: 20, default: CardStatus.ACTIVE })
  cardStatus: CardStatus;

  // Logical reference to Auth Service; no cross-service foreign key.
  @Column({ name: 'user_id', type: 'int', nullable: true })
  userId: number | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updatedAt: Date;
}
