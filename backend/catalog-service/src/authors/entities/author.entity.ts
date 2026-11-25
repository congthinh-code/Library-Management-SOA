
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'authors', schema: 'catalog' })
export class Author {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'author_id' })
  author_id: string;

  @Column({ type: 'nvarchar', length: 150 })
  name: string;

@Column({ type: 'nvarchar', length: 'MAX', nullable: true })
biography: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updated_at: Date;
}
