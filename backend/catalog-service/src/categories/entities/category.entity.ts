
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories', schema: 'catalog' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'category_id' })
  category_id: string;

  @Column({ type: 'nvarchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'nvarchar', length: 500, nullable: true })
  description: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updated_at: Date;
}
