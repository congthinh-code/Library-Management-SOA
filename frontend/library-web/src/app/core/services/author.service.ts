import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, throwError } from 'rxjs';
import { CATALOG_API_URL } from '../cauhinh';
import {
  AuthorItem,
  CreateAuthorRequest,
  PagedResponse,
  SingleResponse,
} from '../models/catalog.model';

const FALLBACK_AUTHORS: AuthorItem[] = [
  { id: '1', name: 'Nguyễn Nhật Ánh', biography: 'Nhà văn Việt Nam nổi tiếng với các tác phẩm viết về tuổi thơ.' },
  { id: '2', name: 'Tô Hoài', biography: 'Nhà văn Việt Nam, tác giả Dế Mèn phiêu lưu ký.' },
  { id: '3', name: 'Paulo Coelho', biography: 'Nhà văn người Brazil, tác giả Nhà giả kim.' },
  { id: '4', name: 'Dale Carnegie', biography: 'Tác giả sách phát triển bản thân người Mỹ.' },
  { id: '5', name: 'Robert C. Martin', biography: 'Kỹ sư phần mềm, tác giả Clean Code.' },
  { id: '6', name: 'Yuval Noah Harari', biography: 'Sử gia người Israel, tác giả Sapiens.' },
];

@Injectable({ providedIn: 'root' })
export class AuthorService {
  private readonly baseUrl = `${CATALOG_API_URL}/authors`;
  private localFallback: AuthorItem[] = [...FALLBACK_AUTHORS];
  usingFallback = false;

  constructor(private readonly http: HttpClient) {}

  findAll(
    page = 1,
    limit = 20,
    search?: string,
  ): Observable<PagedResponse<AuthorItem>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PagedResponse<AuthorItem>>(this.baseUrl, { params }).pipe(
      catchError((err) => {
        // Nếu backend chưa bật AuthorsModule (404), dùng dữ liệu mẫu từ seed để xem trước UI
        if (err?.status === 404) {
          this.usingFallback = true;
          const kw = search?.trim().toLowerCase() ?? '';
          const filtered = kw
            ? this.localFallback.filter((a) => a.name.toLowerCase().includes(kw))
            : this.localFallback;
          const start = (page - 1) * limit;
          return of({
            data: filtered.slice(start, start + limit),
            meta: {
              page,
              limit,
              total: filtered.length,
              totalPages: Math.max(1, Math.ceil(filtered.length / limit)),
            },
          });
        }
        return throwError(() => err);
      }),
    );
  }

  create(payload: CreateAuthorRequest): Observable<SingleResponse<AuthorItem>> {
    return this.http.post<SingleResponse<AuthorItem>>(this.baseUrl, payload).pipe(
      catchError((err) => {
        if (err?.status === 404) {
          this.usingFallback = true;
          const item: AuthorItem = {
            id: String(this.localFallback.length + 1),
            name: payload.name,
            biography: payload.biography ?? null,
            createdAt: new Date().toISOString(),
          };
          this.localFallback = [item, ...this.localFallback];
          return of({ data: item, message: 'Đã thêm tác giả mới thành công.' });
        }
        return throwError(() => err);
      }),
    );
  }
}

