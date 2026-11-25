import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CATALOG_API_URL } from '../cauhinh';
import {
  BookDetail,
  BookItem,
  CreateBookRequest,
  MessageResponse,
  PagedResponse,
  SingleResponse,
  UpdateBookRequest,
} from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly baseUrl = `${CATALOG_API_URL}/books`;

  constructor(private readonly http: HttpClient) {}

  findAll(
    page = 1,
    limit = 10,
    search?: string,
    categoryId?: string,
  ): Observable<PagedResponse<BookItem>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit));

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }
    if (categoryId?.trim()) {
      params = params.set('categoryId', categoryId.trim());
    }

    return this.http.get<PagedResponse<BookItem>>(this.baseUrl, { params });
  }

  findOne(id: string): Observable<SingleResponse<BookDetail>> {
    return this.http.get<SingleResponse<BookDetail>>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateBookRequest): Observable<SingleResponse<unknown>> {
    return this.http.post<SingleResponse<unknown>>(this.baseUrl, payload);
  }

  update(id: string, payload: UpdateBookRequest): Observable<MessageResponse> {
    return this.http.patch<MessageResponse>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: string): Observable<MessageResponse> {
    return this.http.delete<MessageResponse>(`${this.baseUrl}/${id}`);
  }
}

