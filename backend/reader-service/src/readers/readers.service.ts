import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { CreateReaderDto } from './create-reader.dto';
import { QueryReaderDto } from './query-reader.dto';
import { CardStatus, Reader } from './reader.entity';
import { UpdateReaderDto } from './update-reader.dto';

@Injectable()
export class ReadersService {
  constructor(@InjectRepository(Reader) private readonly repo: Repository<Reader>) {}

  async create(dto: CreateReaderDto): Promise<Reader> {
    const exists = await this.repo.findOne({ where: { readerCode: dto.readerCode } });
    if (exists) throw new ConflictException('Reader code already exists');
    return this.repo.save(this.repo.create({
      ...dto,
      email: dto.email ?? null,
      phone: dto.phone ?? null,
      userId: dto.userId ?? null,
      cardStatus: CardStatus.ACTIVE,
    }));
  }

  async findAll(query: QueryReaderDto) {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 100);
    const base: FindOptionsWhere<Reader> = {};
    if (query.cardStatus) base.cardStatus = query.cardStatus;
    const search = query.search?.trim();
    const where: FindOptionsWhere<Reader>[] = search
      ? [
          { ...base, readerCode: Like(`%${search}%`) },
          { ...base, fullName: Like(`%${search}%`) },
          { ...base, email: Like(`%${search}%`) },
        ]
      : [base];
    const [data, total] = await this.repo.findAndCount({
      where, order: { readerId: 'DESC' }, skip: (page - 1) * limit, take: limit,
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: number): Promise<Reader> {
    const reader = await this.repo.findOne({ where: { readerId: id } });
    if (!reader) throw new NotFoundException('Reader not found');
    return reader;
  }

  async findByUserId(userId: number): Promise<Reader> {
    const reader = await this.repo.findOne({ where: { userId } });
    if (!reader) throw new NotFoundException('Reader profile not found');
    return reader;
  }

  async update(id: number, dto: UpdateReaderDto): Promise<Reader> {
    const reader = await this.findOne(id);
    if (dto.readerCode && dto.readerCode !== reader.readerCode) {
      const exists = await this.repo.findOne({ where: { readerCode: dto.readerCode } });
      if (exists) throw new ConflictException('Reader code already exists');
    }
    Object.assign(reader, dto);
    return this.repo.save(reader);
  }

  async updateCardStatus(id: number, status: CardStatus): Promise<Reader> {
    const reader = await this.findOne(id);
    reader.cardStatus = status;
    return this.repo.save(reader);
  }
}
