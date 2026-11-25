import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { CategoryService } from '../../../core/services/category.service';
import { AuthorService } from '../../../core/services/author.service';
import {
  AuthorItem,
  CategoryItem,
  CreateBookRequest,
  extractCatalogError,
} from '../../../core/models/catalog.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrls: ['../catalog-ui.css', './book-form.css'],
})
export class BookForm implements OnInit {
  categories = signal<CategoryItem[]>([]);
  authors = signal<AuthorItem[]>([]);
  selectedAuthorIds = signal<string[]>([]);
  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  bookId = '';
  extraAuthorIds = '';

  form: {
    title: string;
    categoryId: string;
    isbn: string;
    publisher: string;
    publishedYear: number | null;
    description: string;
  } = {
    title: '',
    categoryId: '',
    isbn: '',
    publisher: '',
    publishedYear: null,
    description: '',
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookService: BookService,
    private readonly categoryService: CategoryService,
    readonly authorService: AuthorService,
  ) {}

  ngOnInit(): void {
    this.categoryService.findAll(1, 100, undefined, 'name', 'asc').subscribe({
      next: (res) => this.categories.set(res.data ?? []),
      error: (err) => this.error.set(extractCatalogError(err, 'Không tải được danh mục.')),
    });

    this.authorService.findAll(1, 100).subscribe({
      next: (res) => {
        // Chỉ hiển thị chip tác giả khi lấy được dữ liệu thật từ Backend (tránh gửi ID mẫu không có trong SQL Server)
        this.authors.set(this.authorService.usingFallback ? [] : (res.data ?? []));
      },
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.bookId = id;
      this.taiChiTiet(id);
    }
  }

  toggleAuthor(id: string): void {
    const current = this.selectedAuthorIds();
    this.selectedAuthorIds.set(
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  private taiChiTiet(id: string): void {
    this.loading.set(true);
    this.bookService.findOne(id).subscribe({
      next: (res) => {
        const b = res.data;
        this.form = {
          title: b.title ?? '',
          categoryId: b.category?.id ?? '',
          isbn: b.isbn ?? '',
          publisher: b.publisher ?? '',
          publishedYear: b.publishedYear ?? null,
          description: b.description ?? '',
        };
        this.selectedAuthorIds.set(b.authorIds ?? []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractCatalogError(err, 'Không tải được thông tin sách.'));
        this.loading.set(false);
      },
    });
  }

  luu(): void {
    this.error.set('');
    const title = this.form.title.trim();
    if (!title) {
      this.error.set('Tên sách không được để trống.');
      return;
    }
    if (!this.form.categoryId) {
      this.error.set('Vui lòng chọn danh mục.');
      return;
    }

    const extra = this.parseExtraAuthorIds();
    if (extra === null) return;

    const mergedAuthors = [...new Set([...this.selectedAuthorIds(), ...extra])];

    const payload: CreateBookRequest = {
      title,
      categoryId: this.form.categoryId,
    };

    if (this.form.isbn.trim()) payload.isbn = this.form.isbn.trim();
    if (this.form.publisher.trim()) payload.publisher = this.form.publisher.trim();
    if (this.form.description.trim()) payload.description = this.form.description.trim();
    if (
      this.form.publishedYear !== null &&
      this.form.publishedYear !== undefined &&
      String(this.form.publishedYear) !== ''
    ) {
      payload.publishedYear = Number(this.form.publishedYear);
    }
    if (mergedAuthors.length > 0 || this.isEdit()) {
      payload.authorIds = mergedAuthors;
    }

    this.saving.set(true);
    const req$ = this.isEdit()
      ? this.bookService.update(this.bookId, payload)
      : this.bookService.create(payload);

    req$.subscribe({
      next: () => {
        this.saving.set(false);
        const toast = this.isEdit()
          ? 'Đã cập nhật thông tin sách thành công.'
          : 'Đã thêm đầu sách mới thành công.';
        void this.router.navigate(
          ['/books', ...(this.isEdit() ? [this.bookId] : [])],
          { state: { toast } },
        );
      },
      error: (err) => {
        this.error.set(extractCatalogError(err, 'Không thể lưu thông tin sách.'));
        this.saving.set(false);
      },
    });
  }

  private parseExtraAuthorIds(): string[] | null {
    const raw = this.extraAuthorIds.trim();
    if (!raw) return [];
    const ids = raw.split(',').map((s) => s.trim()).filter(Boolean);
    const bad = ids.find((id) => !/^[1-9]\d*$/.test(id));
    if (bad) {
      this.error.set(`Mã tác giả "${bad}" không hợp lệ (chỉ nhập số nguyên dương).`);
      return null;
    }
    return ids;
  }
}

