
import { Routes } from '@angular/router';

import { LoginComponent } from './features/auth/login/login.component';

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
