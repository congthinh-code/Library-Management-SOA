import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly roles: Repository<Role>) {}
  list() { return this.roles.find({ order: { roleId: 'ASC' } }); }
}
