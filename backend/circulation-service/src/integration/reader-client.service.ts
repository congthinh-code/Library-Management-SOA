import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

export interface ReaderProfile {
  id: number;
  readerCode?: string;
  fullName: string;
  email?: string;
  phone?: string;
  readerType?: string;
  cardStatus: string;
}

@Injectable()
export class ReaderClientService {
  private readonly logger = new Logger(ReaderClientService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = (
      this.configService.get<string>('READER_SERVICE_URL') ||
      'http://reader-service:3003/api/v1'
    ).replace(/\/+$/, '');
  }

  async getReaderById(
    readerId: number,
    authHeader?: string,
  ): Promise<ReaderProfile> {
    const url = `${this.baseUrl}/readers/${readerId}`;
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          timeout: 5000,
          headers: authHeader ? { Authorization: authHeader } : undefined,
        }),
      );
      const raw = response.data?.data ?? response.data;
      const resolvedId = raw?.readerId ?? raw?.id ?? raw?.reader_id;

      if (!raw || resolvedId === undefined || resolvedId === null) {
        throw new NotFoundException(
          `Không tìm thấy độc giả với ID = ${readerId}.`,
        );
      }

      return {
        id: Number(resolvedId),
        readerCode: raw.readerCode ?? raw.reader_code,
        fullName: raw.fullName ?? raw.full_name ?? '',
        email: raw.email,
        phone: raw.phone,
        readerType: raw.readerType ?? raw.reader_type,
        cardStatus: raw.cardStatus ?? raw.card_status ?? 'UNKNOWN',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      const axiosErr = error as AxiosError;
      if (axiosErr.response?.status === 404) {
        throw new NotFoundException(
          `Không tìm thấy độc giả với ID = ${readerId}.`,
        );
      }
      this.logger.error(
        `Lỗi kết nối tới Reader Service (${url}): ${axiosErr.message}`,
      );
      throw new ServiceUnavailableException(
        'Dịch vụ Quản lý Độc giả (Reader Service) hiện không khả dụng.',
      );
    }
  }

  async validateReaderForBorrowing(
    readerId: number,
    authHeader?: string,
  ): Promise<ReaderProfile> {
    const reader = await this.getReaderById(readerId, authHeader);

    if (reader.cardStatus !== 'ACTIVE') {
      throw new BadRequestException(
        `Thẻ độc giả (ID = ${readerId}) đang ở trạng thái "${reader.cardStatus}", không đủ điều kiện mượn sách.`,
      );
    }

    return reader;
  }
}