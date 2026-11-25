import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export interface BookCopyInfo {
  id: string | number;
  bookId: string | number;
  barcode?: string;
  status: string;
}

@Injectable()
export class CatalogClientService {
  private readonly logger = new Logger(CatalogClientService.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = this.configService.get<string>(
      'CATALOG_SERVICE_URL',
      'http://localhost:3002/api/v1',
    );
  }

  async getAndValidateCopy(
    bookCopyId: string,
    authHeader?: string,
  ): Promise<BookCopyInfo> {
    try {
      const headers: Record<string, string> = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      const response = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}/copies/${bookCopyId}`, {
          headers,
          timeout: 5000,
        }),
      );

      const copy: BookCopyInfo = response.data?.data ?? response.data;

      if (!copy || !copy.id) {
        throw new NotFoundException(
          `Không tìm thấy bản sao sách với ID = ${bookCopyId}.`,
        );
      }

      if (!copy.bookId) {
        throw new BadGatewayException(
          `Dữ liệu bản sao sách (ID: ${bookCopyId}) từ Catalog Service thiếu bookId.`,
        );
      }

      const currentStatus = (copy.status || '').toUpperCase();
      if (currentStatus !== 'AVAILABLE') {
        throw new ConflictException(
          `Bản sao sách (ID: ${bookCopyId}) hiện có trạng thái [${currentStatus}], không thể cho mượn.`,
        );
      }

      return copy;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadGatewayException
      ) {
        throw error;
      }

      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        throw new NotFoundException(
          `Không tìm thấy bản sao sách với ID = ${bookCopyId}.`,
        );
      }

      this.logger.error(
        `Lỗi kết nối Catalog Service khi kiểm tra bookCopyId=${bookCopyId}: ${axiosError.message}`,
      );
      throw new BadGatewayException(
        'Không thể kiểm tra thông tin bản sao sách từ Catalog Service.',
      );
    }
  }

  async updateCopyStatus(
    bookCopyId: string,
    status: 'BORROWED' | 'AVAILABLE',
    authHeader?: string,
  ): Promise<void> {
    try {
      const headers: Record<string, string> = {};
      if (authHeader) {
        headers['Authorization'] = authHeader;
      }

      await firstValueFrom(
        this.httpService.patch(
          `${this.baseUrl}/copies/${bookCopyId}/status`,
          { status },
          { headers, timeout: 5000 },
        ),
      );
    } catch (error) {
      const axiosError = error as AxiosError;
      this.logger.error(
        `Lỗi cập nhật trạng thái bản sao bookCopyId=${bookCopyId} -> ${status}: ${axiosError.message}`,
      );
      throw new BadGatewayException(
        `Không thể cập nhật trạng thái bản sao sách (ID: ${bookCopyId}) trên Catalog Service.`,
      );
    }
  }
}