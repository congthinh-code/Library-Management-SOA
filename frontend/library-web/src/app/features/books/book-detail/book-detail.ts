import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookService } from '../../../core/services/book.service';
import { AuthorService } from '../../../core/services/author.service';
import { BookCopyService } from '../../../core/services/book-copy.service';
import {
  AuthorItem,
  BookCopyItem,
  BookCopyStatus,
  BookDetail,
  extractCatalogError,
} from '../../../core/models/catalog.model';
import { StatusBadge } from '../../../shared/components/status-badge/status-badge';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastBanner } from '../../../shared/components/toast-banner/toast-banner';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    StatusBadge,
    ConfirmDialog,
    ToastBanner,
  ],
  templateUrl: './book-detail.html',
  styleUrls: ['../catalog-ui.css', './book-detail.css'],
})
export class BookDetailView implements OnInit {
  book = signal<BookDetail | null>(null);
  authors = signal<AuthorItem[]>([]);
  copies = signal<BookCopyItem[]>([]);
  loading = signal(true);
  error = signal('');
  confirmDelete = signal(false);
  toastMsg = signal('');
  toastType = signal<'success' | 'error'>('success');

  newCopyCode = '';
  newCopyStatus: BookCopyStatus = 'AVAILABLE';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly bookService: BookService,
    private readonly authorService: AuthorService,
    readonly copyService: BookCopyService,
  ) {}

  ngOnInit(): void {
    const toast = (history.state as { toast?: string } | null)?.toast;
    if (toast) {
      this.toastType.set('success');
      this.toastMsg.set(toast);
      history.replaceState({}, '');
    }

    this.authorService.findAll(1, 100).subscribe({
      next: (res) => this.authors.set(res.data ?? []),
    });

    const id = this.route.snapshot.paramMap.get('id') ?? '';
    if (!id) {
      this.error.set('Không tìm thấy mã đầu sách.');
      this.loading.set(false);
      return;
    }

    this.bookService.findOne(id).subscribe({
      next: (res) => {
        this.book.set(res.data);
        this.loading.set(false);
        this.taiBanSao(id);
      },
      error: (err) => {
        this.error.set(extractCatalogError(err, 'Không tải được chi tiết sách.'));
        this.loading.set(false);
      },
    });
  }

  taiBanSao(bookId: string): void {
    this.copyService.findByBook(bookId).subscribe({
      next: (res) => this.copies.set(res.data ?? []),
    });
  }

  tenTacGia(ids: string[]): string {
    if (!ids || ids.length === 0) return 'Chưa gắn tác giả';
    const map = new Map(this.authors().map((a) => [a.id, a.name]));
    return ids.map((id) => map.get(id) ?? `Tác giả #${id}`).join(', ');
  }

  themBanSao(): void {
    const b = this.book();
    const code = this.newCopyCode.trim();
    if (!b || !code) return;

    this.copyService
      .create(b.id, { copyCode: code, status: this.newCopyStatus }, b.title)
      .subscribe({
        next: () => {
          this.newCopyCode = '';
          this.toastType.set('success');
          this.toastMsg.set('Đã thêm bản sao mới thành công.');
          this.taiBanSao(b.id);
        },
        error: (err) => {
          this.toastType.set('error');
          this.toastMsg.set(extractCatalogError(err, 'Không thể thêm bản sao.'));
        },
      });
  }

  doiTrangThaiBanSao(copy: BookCopyItem, status: BookCopyStatus): void {
    const b = this.book();
    if (!b) return;
    this.copyService.updateStatus(copy.id, status).subscribe({
      next: () => {
        this.toastType.set('success');
        this.toastMsg.set('Đã cập nhật trạng thái bản sao.');
        this.taiBanSao(b.id);
      },
      error: (err) => {
        this.toastType.set('error');
        this.toastMsg.set(extractCatalogError(err, 'Không thể cập nhật trạng thái.'));
      },
    });
  }

  xoaSach(): void {
    const b = this.book();
    this.confirmDelete.set(false);
    if (!b) return;

    this.bookService.remove(b.id).subscribe({
      next: () => void this.router.navigate(['/books']),
      error: (err) => {
        this.toastType.set('error');
        this.toastMsg.set(extractCatalogError(err, 'Không thể xóa đầu sách.'));
      },
    });
  }
}

