
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

@Entity({ name: 'books', schema: 'catalog' })
export class Book {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'book_id' })
  book_id: string;

  @Column({ type: 'nvarchar', length: 20, nullable: true })
  isbn: string | null;

  @Column({ type: 'nvarchar', length: 255 })
  title: string;

  @Column({ type: 'nvarchar', length: 'MAX', nullable: true })
  description: string | null;

  @Column({ type: 'nvarchar', length: 150, nullable: true })
  publisher: string | null;

  @Column({ type: 'int', nullable: true })
  published_year: number | null;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'category_id' })
  category: Category;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updated_at: Date;
}
