import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CATALOG_API_URL } from '../cauhinh';
import {
  CategoryItem,
  CreateCategoryRequest,
  PagedResponse,
  SingleResponse,
} from '../models/catalog.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly baseUrl = `${CATALOG_API_URL}/categories`;

  constructor(private readonly http: HttpClient) {}

  findAll(
    page = 1,
    limit = 20,
    search?: string,
    sortBy: 'name' | 'createdAt' = 'name',
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Observable<PagedResponse<CategoryItem>> {
    let params = new HttpParams()
      .set('page', String(page))
      .set('limit', String(limit))
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<PagedResponse<CategoryItem>>(this.baseUrl, { params });
  }

  create(payload: CreateCategoryRequest): Observable<SingleResponse<CategoryItem>> {
    return this.http.post<SingleResponse<CategoryItem>>(this.baseUrl, payload);
  }
}

