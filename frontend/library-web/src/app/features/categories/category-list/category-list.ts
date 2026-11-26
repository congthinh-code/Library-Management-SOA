import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import {
  CategoryItem,
  CreateCategoryRequest,
  extractCatalogError,
} from '../../../core/models/catalog.model';
import { ToastBanner } from '../../../shared/components/toast-banner/toast-banner';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastBanner],
  templateUrl: './category-list.html',
  styleUrls: ['../../books/catalog-ui.css', './category-list.css'],
})
export class CategoryList implements OnInit {
  categories = signal<CategoryItem[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  modalError = signal('');
  toastMsg = signal('');
  toastType = signal<'success' | 'error'>('success');

  page = signal(1);
  limit = 10;
  total = signal(0);
  totalPages = signal(1);

  search = '';
  sortOption = 'name:asc';
  hienModal = false;

  form = { name: '', description: '' };

  constructor(private readonly categoryService: CategoryService) {}

  ngOnInit(): void {
    this.tai();
  }

  moModal(): void {
    this.form = { name: '', description: '' };
    this.modalError.set('');
    this.hienModal = true;
  }

  tai(): void {
    this.loading.set(true);
    this.error.set('');
    const [sortBy, sortOrder] = this.sortOption.split(':') as [
      'name' | 'createdAt',
      'asc' | 'desc',
    ];

    this.categoryService
      .findAll(this.page(), this.limit, this.search, sortBy, sortOrder)
      .subscribe({
        next: (res) => {
          this.categories.set(res.data ?? []);
          this.total.set(res.meta?.total ?? 0);
          this.totalPages.set(Math.max(1, res.meta?.totalPages ?? 1));
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractCatalogError(err, 'Không tải được danh sách danh mục.'));
          this.loading.set(false);
        },
      });
  }

  timKiem(): void {
    this.page.set(1);
    this.tai();
  }

  lamMoi(): void {
    this.search = '';
    this.sortOption = 'name:asc';
    this.page.set(1);
    this.tai();
  }

  doiTrang(nextPage: number): void {
    if (nextPage < 1 || nextPage > this.totalPages()) return;
    this.page.set(nextPage);
    this.tai();
  }

  tao(): void {
    this.modalError.set('');
    const name = this.form.name.trim();
    if (!name) {
      this.modalError.set('Tên danh mục không được để trống.');
      return;
    }

    const payload: CreateCategoryRequest = { name };
    if (this.form.description.trim()) {
      payload.description = this.form.description.trim();
    }

    this.saving.set(true);
    this.categoryService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.hienModal = false;
        this.toastType.set('success');
        this.toastMsg.set('Đã thêm danh mục mới thành công.');
        this.page.set(1);
        this.tai();
      },
      error: (err) => {
        this.modalError.set(extractCatalogError(err, 'Không thể tạo danh mục.'));
        this.saving.set(false);
      },
    });
  }
}

