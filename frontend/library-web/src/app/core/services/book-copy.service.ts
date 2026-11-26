import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { CATALOG_API_URL } from '../cauhinh';
import {
  BookCopyItem,
  BookCopyStatus,
  CreateBookCopyRequest,
  MessageResponse,
  PagedResponse,
  SingleResponse,
} from '../models/catalog.model';

const FALLBACK_COPIES: BookCopyItem[] = [
  { id: '1', bookId: '1', bookTitle: 'Tôi thấy hoa vàng trên cỏ xanh', copyCode: 'SEED-BOOK-001', status: 'AVAILABLE' },
  { id: '2', bookId: '1', bookTitle: 'Tôi thấy hoa vàng trên cỏ xanh', copyCode: 'SEED-BOOK-002', status: 'ON_LOAN' },
  { id: '3', bookId: '2', bookTitle: 'Cho tôi xin một vé đi tuổi thơ', copyCode: 'SEED-BOOK-003', status: 'AVAILABLE' },
  { id: '4', bookId: '3', bookTitle: 'Dế Mèn phiêu lưu ký', copyCode: 'SEED-BOOK-004', status: 'ON_HOLD' },
  { id: '5', bookId: '4', bookTitle: 'Nhà giả kim', copyCode: 'SEED-BOOK-005', status: 'AVAILABLE' },
  { id: '6', bookId: '5', bookTitle: 'Đắc nhân tâm', copyCode: 'SEED-BOOK-006', status: 'DAMAGED' },
];

@Injectable({ providedIn: 'root' })
export class BookCopyService {
  private localFallback: BookCopyItem[] = [...FALLBACK_COPIES];
  usingFallback = false;

  constructor(private readonly http: HttpClient) {}

  findByBook(bookId: string): Observable<PagedResponse<BookCopyItem>> {
    return this.http
      .get<PagedResponse<BookCopyItem>>(`${CATALOG_API_URL}/books/${bookId}/copies`)
      .pipe(
        catchError((err) => {
          if (err?.status === 404) {
            this.usingFallback = true;
            const list = this.localFallback.filter((c) => c.bookId === bookId);
            return of({
              data: list,
              meta: { page: 1, limit: 100, total: list.length, totalPages: 1 },
            });
          }
          return throwError(() => err);
        }),
      );
  }

  getFallbackList(search = '', bookId = '', status = ''): BookCopyItem[] {
    const kw = search.trim().toLowerCase();
    return this.localFallback.filter((c) => {
      const matchKw =
        !kw ||
        c.copyCode.toLowerCase().includes(kw) ||
        (c.bookTitle ?? '').toLowerCase().includes(kw);
      const matchBook = !bookId || c.bookId === bookId;
      const matchStatus = !status || c.status === status;
      return matchKw && matchBook && matchStatus;
    });
  }

  create(
    bookId: string,
    payload: CreateBookCopyRequest,
    bookTitle?: string,
  ): Observable<SingleResponse<BookCopyItem>> {
    return this.http
      .post<SingleResponse<BookCopyItem>>(`${CATALOG_API_URL}/books/${bookId}/copies`, payload)
      .pipe(
        catchError((err) => {
          if (err?.status === 404) {
            this.usingFallback = true;
            const item: BookCopyItem = {
              id: String(this.localFallback.length + 1),
              bookId,
              bookTitle: bookTitle || `Đầu sách #${bookId}`,
              copyCode: payload.copyCode,
              status: payload.status ?? 'AVAILABLE',
              updatedAt: new Date().toISOString(),
            };
            this.localFallback = [item, ...this.localFallback];
            return of({ data: item, message: 'Đã thêm bản sao mới thành công.' });
          }
          return throwError(() => err);
        }),
      );
  }

  updateStatus(copyId: string, status: BookCopyStatus): Observable<MessageResponse> {
    return this.http
      .patch<MessageResponse>(`${CATALOG_API_URL}/copies/${copyId}/status`, { status })
      .pipe(
        catchError((err) => {
          if (err?.status === 404) {
            this.usingFallback = true;
            this.localFallback = this.localFallback.map((c) =>
              c.id === copyId ? { ...c, status, updatedAt: new Date().toISOString() } : c,
            );
            return of({ message: 'Đã cập nhật trạng thái bản sao.' });
          }
          return throwError(() => err);
        }),
      );
  }
}

