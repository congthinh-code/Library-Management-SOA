
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Book } from '../../books/entities/book.entity';

@Entity({ name: 'book_copies', schema: 'catalog' })
export class BookCopy {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'copy_id' })
  copy_id: string;

  @Column({ type: 'nvarchar', length: 50, unique: true })
  copy_code: string;

  @Column({ type: 'nvarchar', length: 30, default: 'AVAILABLE' })
  status: string;

  @ManyToOne(() => Book, { nullable: false })
  @JoinColumn({ name: 'book_id', referencedColumnName: 'book_id' })
  book: Book;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updated_at: Date;
}
