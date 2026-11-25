import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'users' })
@Index('UQ_auth_users_username', ['username'], { unique: true })
export class User {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'bigint' })
  userId: string;

  @Column({ name: 'username', type: 'nvarchar', length: 50 })
  username: string;

  @Column({ name: 'email', type: 'nvarchar', length: 150, nullable: true })
  email: string | null;

  @Column({ name: 'password_hash', type: 'nvarchar', length: 255, select: false })
  passwordHash: string;

  @Column({ name: 'is_active', type: 'bit', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'datetime2' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updatedAt: Date;
}
