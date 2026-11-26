import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { BookCopyService } from '../../../core/services/book-copy.service';
import {
  BookCopyItem,
  BookCopyStatus,
  BookItem,
  extractCatalogError,
} from '../../../core/models/catalog.model';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { ToastBanner } from '../../../shared/components/toast-banner/toast-banner';

@Component({
  selector: 'app-book-copy-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, StatusBadge, ToastBanner],
  templateUrl: './book-copy-list.html',
  styleUrls: ['../catalog-ui.css', './book-copy-list.css'],
})
export class BookCopyList implements OnInit {
  books = signal<BookItem[]>([]);
  copies = signal<BookCopyItem[]>([]);
  loading = signal(false);
  saving = signal(false);
  error = signal('');
  modalError = signal('');
  toastMsg = signal('');
  toastType = signal<'success' | 'error'>('success');

  search = '';
  selectedBookId = '';
  selectedStatus = '';
  hienModal = false;

  form: { bookId: string; copyCode: string; status: BookCopyStatus } = {
    bookId: '',
    copyCode: '',
    status: 'AVAILABLE',
  };

  constructor(
    private readonly bookService: BookService,
    readonly copyService: BookCopyService,
  ) {}

  ngOnInit(): void {
    this.bookService.findAll(1, 100).subscribe({
      next: (res) => {
        this.books.set(res.data ?? []);
        this.tai();
      },
      error: () => this.tai(),
    });
  }

  moModal(): void {
    this.form = { bookId: this.selectedBookId || '', copyCode: '', status: 'AVAILABLE' };
    this.modalError.set('');
    this.hienModal = true;
  }

  tai(): void {
    this.error.set('');
    if (this.selectedBookId) {
      this.loading.set(true);
      this.copyService.findByBook(this.selectedBookId).subscribe({
        next: (res) => {
          const kw = this.search.trim().toLowerCase();
          const list = (res.data ?? []).filter((c) => {
            const matchKw = !kw || c.copyCode.toLowerCase().includes(kw);
            const matchSt = !this.selectedStatus || c.status === this.selectedStatus;
            return matchKw && matchSt;
          });
          this.copies.set(list);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(extractCatalogError(err, 'Không tải được bản sao sách.'));
          this.loading.set(false);
        },
      });
      return;
    }

    const firstBookId = this.books()[0]?.id ?? '1';
    this.loading.set(true);
    this.copyService.findByBook(firstBookId).subscribe({
      next: () => {
        this.copies.set(
          this.copyService.getFallbackList(this.search, '', this.selectedStatus),
        );
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(extractCatalogError(err, 'Không tải được danh sách bản sao.'));
        this.loading.set(false);
      },
    });
  }

  lamMoi(): void {
    this.search = '';
    this.selectedBookId = '';
    this.selectedStatus = '';
    this.tai();
  }

  tenSach(copy: BookCopyItem): string {
    if (copy.bookTitle) return copy.bookTitle;
    return this.books().find((b) => b.id === copy.bookId)?.title ?? `Đầu sách #${copy.bookId}`;
  }

  tao(): void {
    this.modalError.set('');
    const code = this.form.copyCode.trim();
    if (!this.form.bookId) {
      this.modalError.set('Vui lòng chọn đầu sách.');
      return;
    }
    if (!code) {
      this.modalError.set('Mã bản sao không được để trống.');
      return;
    }

    const title = this.books().find((b) => b.id === this.form.bookId)?.title;
    this.saving.set(true);
    this.copyService
      .create(this.form.bookId, { copyCode: code, status: this.form.status }, title)
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.hienModal = false;
          this.toastType.set('success');
          this.toastMsg.set('Đã thêm bản sao mới thành công.');
          this.tai();
        },
        error: (err) => {
          this.modalError.set(extractCatalogError(err, 'Không thể thêm bản sao.'));
          this.saving.set(false);
        },
      });
  }

  doiTrangThai(copy: BookCopyItem, status: BookCopyStatus): void {
    this.copyService.updateStatus(copy.id, status).subscribe({
      next: () => {
        this.toastType.set('success');
        this.toastMsg.set('Đã cập nhật trạng thái bản sao.');
        this.tai();
      },
      error: (err) => {
        this.toastType.set('error');
        this.toastMsg.set(extractCatalogError(err, 'Không thể cập nhật trạng thái.'));
      },
    });
  }
}

