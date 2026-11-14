import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Like, Repository } from 'typeorm';
import { Role } from '../roles/role.entity';
import { UserRole } from './user-role.entity';
import { User } from './user.entity';
import { CreateUserDto } from './create-user.dto';
import { UpdateUserDto } from './update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Role) private readonly roles: Repository<Role>,
    @InjectRepository(UserRole) private readonly userRoles: Repository<UserRole>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.users.findOne({ where: { userId: id } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.users.createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.username = :username', { username })
      .getOne();
  }

  async getRoleNames(userId: string): Promise<string[]> {
    const rows = await this.userRoles.find({ where: { userId }, relations: { role: true } });
    return rows.map((row) => row.role.roleName);
  }

  async list(page = 1, limit = 20, search?: string) {
    const where = search ? [{ username: Like(`%${search}%`) }, { email: Like(`%${search}%`) }] : {};
    const [items, total] = await this.users.findAndCount({
      where,
      select: { userId: true, username: true, email: true, isActive: true, createdAt: true, updatedAt: true },
      order: { userId: 'DESC' }, skip: (page - 1) * limit, take: limit,
    });
    return { data: items, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async create(dto: CreateUserDto) {
    if (await this.users.findOne({ where: { username: dto.username } })) {
      throw new ConflictException('Username already exists');
    }
    const user = this.users.create({
      username: dto.username,
      email: dto.email ?? null,
      passwordHash: await bcrypt.hash(dto.password, 12),
      isActive: dto.isActive ?? true,
    });
    const saved = await this.users.save(user);
    if (dto.roles?.length) await this.assignRoles(saved.userId, dto.roles);
    return this.findPublicById(saved.userId);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.users.findOne({ where: { userId: id } });
    if (!user) throw new NotFoundException('User not found');
    if (dto.username && dto.username !== user.username) {
      const duplicate = await this.users.findOne({ where: { username: dto.username } });
      if (duplicate) throw new ConflictException('Username already exists');
      user.username = dto.username;
    }
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.isActive !== undefined) user.isActive = dto.isActive;
    if (dto.password) user.passwordHash = await bcrypt.hash(dto.password, 12);
    await this.users.save(user);
    return this.findPublicById(id);
  }

  async findPublicById(id: string) {
    const user = await this.users.findOne({ where: { userId: id }, select: { userId: true, username: true, email: true, isActive: true, createdAt: true, updatedAt: true } });
    if (!user) throw new NotFoundException('User not found');
    return { ...user, roles: await this.getRoleNames(id) };
  }

  async assignRoles(userId: string, roleNames: string[]) {
    const user = await this.users.findOne({ where: { userId } });
    if (!user) throw new NotFoundException('User not found');
    const normalized = [...new Set(roleNames.map((name) => name.toUpperCase()))];
    const roles = await this.roles.findBy(normalized.map((roleName) => ({ roleName })));
    if (roles.length !== normalized.length) throw new NotFoundException('One or more roles do not exist');
    await this.userRoles.delete({ userId });
    if (roles.length) await this.userRoles.save(roles.map((role) => this.userRoles.create({ userId, roleId: role.roleId })));
    return this.findPublicById(userId);
  }
}
