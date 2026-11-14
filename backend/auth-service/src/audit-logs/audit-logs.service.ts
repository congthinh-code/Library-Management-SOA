import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(@InjectRepository(AuditLog) private readonly repository: Repository<AuditLog>) {}

  async write(userId: string | null, action: string, resource: string | null, requestId?: string, details?: unknown) {
    try {
      await this.repository.save(this.repository.create({
        userId, action, resource, requestId: requestId ?? null,
        details: details ? JSON.stringify(details) : null,
      }));
    } catch {
      // Audit failures must not expose credentials or break the primary request.
    }
  }

  async list(page = 1, limit = 20) {
    const [data, total] = await this.repository.findAndCount({
      order: { createdAt: 'DESC' }, skip: (page - 1) * limit, take: limit,
    });
    return { data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
}
