import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'auth', name: 'roles' })
@Index('UQ_auth_roles_role_name', ['roleName'], { unique: true })
export class Role {
  @PrimaryGeneratedColumn({ name: 'role_id', type: 'int' })
  roleId: number;

  @Column({ name: 'role_name', type: 'nvarchar', length: 30 })
  roleName: string;

  @Column({ name: 'description', type: 'nvarchar', length: 255, nullable: true })
  description: string | null;
}
