import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'system_settings' })
export class SystemSetting {
  @PrimaryGeneratedColumn({ name: 'setting_id', type: 'int' })
  settingId: number;

  @Column({ name: 'setting_key', type: 'nvarchar', length: 100, unique: true })
  settingKey: string;

  @Column({ name: 'setting_value', type: 'nvarchar', length: 'max', nullable: true })
  settingValue: string | null;

  @Column({ name: 'description', type: 'nvarchar', length: 255, nullable: true })
  description: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime2' })
  updatedAt: Date;
}
