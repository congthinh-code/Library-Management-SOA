export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PagedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface AuthorItem {
  id: string;
  name: string;
  biography: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAuthorRequest {
  name: string;
  biography?: string;
}

export type BookCopyStatus =
  | 'AVAILABLE'
  | 'ON_LOAN'
  | 'ON_HOLD'
  | 'DAMAGED'
  | 'LOST';

export interface BookCopyItem {
  id: string;
  bookId: string;
  bookTitle?: string;
  copyCode: string;
  status: BookCopyStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookCopyRequest {
  copyCode: string;
  status?: BookCopyStatus;
}

export interface BookCategoryRef {
  id: string;
  name: string;
}

export interface BookItem {
  id: string;
  title: string;
  isbn: string | null;
  description: string | null;
  publisher: string | null;
  publishedYear: number | null;
  category: BookCategoryRef | null;
}

export interface BookDetail extends BookItem {
  authorIds: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateBookRequest {
  title: string;
  isbn?: string;
  description?: string;
  publisher?: string;
  publishedYear?: number;
  categoryId: string;
  authorIds?: string[];
}

export type UpdateBookRequest = Partial<CreateBookRequest>;

/**
 * Trích xuất thông báo lỗi dễ đọc từ response của Catalog Service.
 */
export function extractCatalogError(err: unknown, fallback: string): string {
  const errorObj = (err as { error?: { message?: string | string[] } })?.error;
  const msg = errorObj?.message;
  if (Array.isArray(msg) && msg.length > 0) {
    return msg.join('; ');
  }
  if (typeof msg === 'string' && msg.trim()) {
    return msg;
  }
  return fallback;
}
