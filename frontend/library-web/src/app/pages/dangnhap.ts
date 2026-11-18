import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/athu';

@Component({
  standalone: true, imports: [FormsModule, CommonModule],
  template: `
  <main class="login-wrap">
    <form class="login-card" (ngSubmit)="gui()">
      <div class="logo">LIBRARY <span>MANAGEMENT</span></div>
      <p class="muted">Hệ thống quản lý thư viện</p>
      <h1>Đăng nhập</h1>
      <label>Tên đăng nhập</label>
      <input name="username" [(ngModel)]="username" required placeholder="Nhập tên đăng nhập">
      <label>Mật khẩu</label>
      <input name="password" [(ngModel)]="password" type="password" required placeholder="Nhập mật khẩu">
      <p class="error" *ngIf="loi">{{loi}}</p>
      <button [disabled]="dangGui">{{dangGui ? 'Đang đăng nhập...' : 'Đăng nhập'}}</button>
    </form>
  </main>`,
  styles: [`
  .login-wrap{min-height:100vh;display:grid;place-items:center;background:#f5f7fa;padding:24px}
  .login-card{width:min(420px,100%);background:white;padding:38px;border-radius:18px;box-shadow:0 12px 40px #17365d18;display:grid;gap:13px}
  .logo{font-weight:800;color:#17365d;letter-spacing:1px}.logo span{color:#0f9d9a}
  h1{margin:12px 0 4px;color:#17365d}.muted{color:#718096;margin:0}
  label{font-weight:600;font-size:14px;color:#334155}
  input{padding:12px 13px;border:1px solid #d8e0e9;border-radius:9px;font:inherit}
  button{margin-top:8px;padding:13px;border:0;border-radius:9px;background:#17365d;color:white;font-weight:700;cursor:pointer}
  button:disabled{opacity:.6}.error{color:#c0392b;margin:0}
  `]
})
export class DangNhap {
  username = ''; password = ''; loi = ''; dangGui = false;
  constructor(private auth: AuthService, private router: Router) {}
  gui() {
    this.loi = ''; this.dangGui = true;
    this.auth.dangNhap(this.username, this.password).subscribe({
      next: (res) => {
        this.dangGui = false;
        const roles: string[] = res?.data?.user?.roles ?? [];
        if (roles.includes('ADMIN')) this.router.navigateByUrl('/admin');
        else if (roles.includes('STAFF')) this.router.navigateByUrl('/staff');
        else if (roles.includes('READER')) this.router.navigateByUrl('/reader');
        else this.loi = 'Tài khoản chưa được gán vai trò hợp lệ.';
      },
      error: (e) => { this.dangGui = false; this.loi = e?.error?.message || 'Đăng nhập không thành công'; }
    });
  }
}
