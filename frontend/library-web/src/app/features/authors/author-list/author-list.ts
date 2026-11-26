import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthorService } from '../../../core/services/author.service';
import {
  AuthorItem,
  CreateAuthorRequest,
  extractCatalogError,
} from '../../../core/models/catalog.model';
import { ToastBanner } from '../../../shared/components/toast-banner/toast-banner';

@Component({
  selector: 'app-author-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastBanner],
  templateUrl: './author-list.html',
  styleUrls: ['../../books/catalog-ui.css', './author-list.css'],
})
export class AuthorList implements OnInit {
  authors = signal<AuthorItem[]>([]);
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
  hienModal = false;
  form = { name: '', biography: '' };

  constructor(readonly authorService: AuthorService) {}

  ngOnInit(): void {
    this.tai();
  }

  moModal(): void {
    this.form = { name: '', biography: '' };
    this.modalError.set('');
    this.hienModal = true;
  }

  tai(): void {
    this.loading.set(true);
    this.error.set('');
    this.authorService.findAll(this.page(), this.limit, this.search).subscribe({
      next: (res) => {
        this.authors.set(res.data ?? []);
        this.total.set(res.meta?.total ?? 0);
        this.totalPages.set(Math.max(1, res.meta?.totalPages ?? 1));
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractCatalogError(err, 'Không tải được danh sách tác giả.'));
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
      this.modalError.set('Tên tác giả không được để trống.');
      return;
    }

    const payload: CreateAuthorRequest = { name };
    if (this.form.biography.trim()) {
      payload.biography = this.form.biography.trim();
    }

    this.saving.set(true);
    this.authorService.create(payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.hienModal = false;
        this.toastType.set('success');
        this.toastMsg.set('Đã thêm tác giả mới thành công.');
        this.page.set(1);
        this.tai();
      },
      error: (err) => {
        this.modalError.set(extractCatalogError(err, 'Không thể thêm tác giả.'));
        this.saving.set(false);
      },
    });
  }
}

