
import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';
import { BookList } from './features/books/book-list/book-list';
import { BookForm } from './features/books/book-form/book-form';
import { BookDetailView } from './features/books/book-detail/book-detail';
import { CategoryList } from './features/categories/category-list/category-list';
import { AuthorList } from './features/authors/author-list/author-list';
import { BookCopyList } from './features/books/book-copy-list/book-copy-list';

import { TongQuan } from './pages/tongquan';
import { TaiKhoanPage } from './pages/taikhoan';
import { DocGia } from './pages/docgia';
import { Khung } from './pages/khung';
import { HoSoCaNhan } from './pages/hosocanhan';
import { KhongCoQuyen } from './pages/khongcoquyen';

import {
  authGuard,
  daDangNhapGuard,
  roleGuard
} from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [daDangNhapGuard]
  },
  // Tạm mở Catalog dùng chung layout Khung (ngoài authGuard) để kiểm thử trước khi nối Auth Service.
  // TODO: Khi Auth hoàn thiện, chuyển các children này vào block Khung có authGuard và gắn roleGuard(['ADMIN', 'STAFF']).
  {
    path: 'books',
    component: Khung,
    children: [
      { path: '', component: BookList },
      { path: 'new', component: BookForm },
      { path: ':id', component: BookDetailView },
      { path: ':id/edit', component: BookForm }
    ]
  },
  {
    path: 'categories',
    component: Khung,
    children: [{ path: '', component: CategoryList }]
  },
  {
    path: 'authors',
    component: Khung,
    children: [{ path: '', component: AuthorList }]
  },
  {
    path: 'book-copies',
    component: Khung,
    children: [{ path: '', component: BookCopyList }]
  },
  {
    path: '',
    component: Khung,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },

      { path: 'home', component: TongQuan },

      {
        path: 'admin',
        component: TongQuan,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'staff',
        component: TongQuan,
        canActivate: [roleGuard],
        data: { roles: ['STAFF'] }
      },
      {
        path: 'reader',
        component: TongQuan,
        canActivate: [roleGuard],
        data: { roles: ['READER'] }
      },
      {
        path: 'tai-khoan',
        component: TaiKhoanPage,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'STAFF'] }
      },
      {
        path: 'doc-gia',
        component: DocGia,
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'STAFF'] }
      },
      {
        path: 'ho-so',
        component: HoSoCaNhan,
        canActivate: [roleGuard],
        data: { roles: ['READER'] }
      },
      {
        path: 'khong-co-quyen',
        component: KhongCoQuyen
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
