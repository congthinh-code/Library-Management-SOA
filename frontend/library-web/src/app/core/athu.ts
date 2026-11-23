
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AUTH_API_URL } from './cauhinh';
import { TaiKhoan, NguoiDung } from './models';

interface DangNhapResponse {
  data: { accessToken: string; tokenType: string; user: NguoiDung };
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'library_access_token';
  private readonly userKey = 'library_current_user';

  constructor(private http: HttpClient) {}

  dangNhap(username: string, password: string): Observable<DangNhapResponse> {
    return this.http.post<DangNhapResponse>(
      `${AUTH_API_URL}/auth/login`,
      { username, password }
    ).pipe(
      tap(res => {
        const token = res?.data?.accessToken;
        const user = res?.data?.user;

        if (!token || !user) {
          throw new Error('Phản hồi đăng nhập không đúng định dạng Backend.');
        }

        localStorage.setItem(this.tokenKey, token);
        localStorage.setItem(this.userKey, JSON.stringify(user));
      })
    );
  }

  layToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  layNguoiDung(): NguoiDung | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as NguoiDung;
    } catch {
      return null;
    }
  }

  coVaiTro(...roles: string[]): boolean {
    const current = this.layNguoiDung()?.roles ?? [];
    return roles.some(role => current.includes(role));
  }

  daDangNhap(): boolean {
    return !!this.layToken();
  }

  layThongTinHienTai() {
    return this.http.get<any>(`${AUTH_API_URL}/auth/me`);
  }

  dangXuat(): Observable<any> {
    return this.http.post(`${AUTH_API_URL}/auth/logout`, {}).pipe(
      tap(() => this.xoaPhien())
    );
  }

  xoaPhien(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  danhSachTaiKhoan(page = 1, limit = 20, search = '') {
    return this.http.get<any>(`${AUTH_API_URL}/auth/users`, {
      params: { page: String(page), limit: String(limit), search }
    });
  }

  taoTaiKhoan(data: { username: string; email: string; password: string }) {
    return this.http.post<TaiKhoan>(`${AUTH_API_URL}/auth/users`, data);
  }

  suaTaiKhoan(id: string, data: {
    username?: string;
    email?: string;
    password?: string;
    isActive?: boolean;
  }) {
    return this.http.patch<TaiKhoan>(
      `${AUTH_API_URL}/auth/users/${id}`,
      data
    );
  }

  layVaiTro() {
    return this.http.get<any>(`${AUTH_API_URL}/auth/roles`);
  }

  ganVaiTro(id: string, roles: string[]) {
    return this.http.post(
      `${AUTH_API_URL}/auth/users/${id}/roles`,
      { roles }
    );
  }
}
