import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  Subject,
  Subscription,
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
} from 'rxjs';
import { BookService } from '../../../core/services/book.service';
import { CategoryService } from '../../../core/services/category.service';
import {
  BookItem,
  CategoryItem,
  extractCatalogError,
} from '../../../core/models/catalog.model';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastBanner } from '../../../shared/components/toast-banner/toast-banner';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ConfirmDialog,
    ToastBanner,
  ],
  templateUrl: './book-list.html',
  styleUrls: ['../catalog-ui.css', './book-list.css'],
})
export class BookList implements OnInit, OnDestroy {
  books = signal<BookItem[]>([]);
  categories = signal<CategoryItem[]>([]);
  suggestions = signal<BookItem[]>([]);
  showSuggestions = signal(false);
  suggestLoading = signal(false);

  loading = signal(false);
  error = signal('');
  toastMsg = signal('');
  toastType = signal<'success' | 'error'>('success');
  bookToDelete = signal<BookItem | null>(null);

  page = signal(1);
  limit = 10;
  total = signal(0);
  totalPages = signal(1);

  search = '';
  selectedCategoryId = '';

  private readonly searchInput$ = new Subject<string>();
  private suggestSub?: Subscription;

  constructor(
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    const toast = (history.state as { toast?: string } | null)?.toast;
    if (toast) {
      this.toastType.set('success');
      this.toastMsg.set(toast);
      history.replaceState({}, '');
    }
    this.taiDanhMuc();
    this.taiSach();
    this.khoiTaoGoiY();
  }

  ngOnDestroy(): void {
    this.suggestSub?.unsubscribe();
  }

  private khoiTaoGoiY(): void {
    this.suggestSub = this.searchInput$
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        switchMap((keyword) => {
          if (!keyword) {
            return of([] as BookItem[]);
          }
          this.suggestLoading.set(true);
          return this.bookService
            .findAll(1, 6, keyword, this.selectedCategoryId)
            .pipe(
              map((res) => res.data ?? []),
              catchError(() => of([] as BookItem[])),
            );
        }),
      )
      .subscribe((items) => {
        this.suggestLoading.set(false);
        this.suggestions.set(items);
        this.showSuggestions.set(this.search.trim().length > 0);
      });
  }

  onSearchInput(value: string): void {
    const trimmed = value.trim();
    if (!trimmed) {
      this.suggestions.set([]);
      this.showSuggestions.set(false);
      this.suggestLoading.set(false);
    }
    this.searchInput$.next(trimmed);
  }

  onSearchFocus(): void {
    if (this.search.trim() && this.suggestions().length > 0) {
      this.showSuggestions.set(true);
    }
  }

  anGoiY(): void {
    this.showSuggestions.set(false);
  }

  chonGoiY(book: BookItem): void {
    this.search = book.title;
    this.showSuggestions.set(false);
    this.page.set(1);
    this.taiSach();
  }

  taiDanhMuc(): void {
    this.categoryService.findAll(1, 100, undefined, 'name', 'asc').subscribe({
      next: (res) => this.categories.set(res.data ?? []),
      error: () => {
        // Không chặn tải danh sách sách
      },
    });
  }

  taiSach(): void {
    this.loading.set(true);
    this.error.set('');

    this.bookService
      .findAll(this.page(), this.limit, this.search, this.selectedCategoryId)
      .subscribe({
        next: (res) => {
          this.books.set(res.data ?? []);
          this.total.set(res.meta?.total ?? 0);
          this.totalPages.set(Math.max(1, res.meta?.totalPages ?? 1));
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractCatalogError(err, 'Không tải được danh sách đầu sách.'));
          this.loading.set(false);
        },
      });
  }

  timKiem(): void {
    this.showSuggestions.set(false);
    this.page.set(1);
    this.taiSach();
  }

  lamMoi(): void {
    this.search = '';
    this.selectedCategoryId = '';
    this.suggestions.set([]);
    this.showSuggestions.set(false);
    this.searchInput$.next('');
    this.page.set(1);
    this.taiSach();
  }

  doiTrang(nextPage: number): void {
    if (nextPage < 1 || nextPage > this.totalPages()) return;
    this.page.set(nextPage);
    this.taiSach();
  }

  xacNhanXoa(): void {
    const target = this.bookToDelete();
    if (!target) return;
    this.bookToDelete.set(null);

    this.bookService.remove(target.id).subscribe({
      next: () => {
        this.toastType.set('success');
        this.toastMsg.set('Đã xóa đầu sách thành công.');
        if (this.books().length === 1 && this.page() > 1) {
          this.page.set(this.page() - 1);
        }
        this.taiSach();
      },
      error: (err) => {
        const msg = extractCatalogError(err, 'Không thể xóa đầu sách.');
        this.toastType.set('error');
        this.toastMsg.set(msg);
      },
    });
  }
}
