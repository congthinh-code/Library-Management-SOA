import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/athu';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  template: `
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">LIBRARY <span>MANAGEMENT</span></div>
      <div class="role">{{ tenVaiTro }}</div>
      <nav>
        <a routerLink="/admin" routerLinkActive="active" *ngIf="auth.coVaiTro('ADMIN')">Tổng quan</a>
        <a routerLink="/staff" routerLinkActive="active" *ngIf="auth.coVaiTro('STAFF')">Tổng quan</a>
        <a routerLink="/reader" routerLinkActive="active" *ngIf="auth.coVaiTro('READER')">Trang độc giả</a>
        <a routerLink="/tai-khoan" routerLinkActive="active" *ngIf="auth.coVaiTro('ADMIN','STAFF')">Quản lý tài khoản</a>
        <a routerLink="/doc-gia" routerLinkActive="active" *ngIf="auth.coVaiTro('ADMIN','STAFF')">Quản lý độc giả</a>
        <a routerLink="/ho-so" routerLinkActive="active" *ngIf="auth.coVaiTro('READER')">Hồ sơ của tôi</a>
      </nav>
      <button class="logout" (click)="thoat()">Đăng xuất</button>
    </aside>
    <main class="content">
      <header class="top"><div><small>LIBRARY MANAGEMENT</small><strong>{{ tenNguoiDung }}</strong></div></header>
      <router-outlet />
    </main>
  </div>`,
  styles: [`
  .layout{min-height:100vh;display:flex;background:#F5F7FA;color:#263445;font-family:Inter,Arial,sans-serif}
  .sidebar{width:250px;flex:0 0 250px;background:#17365D;color:white;padding:26px 18px;display:flex;flex-direction:column;min-height:100vh}
  .brand{font-size:17px;font-weight:800;letter-spacing:.4px}.brand span{display:block;color:#75d0c9;font-size:12px;margin-top:3px}
  .role{margin:30px 10px 12px;color:#b8c8dc;font-size:11px;font-weight:700;text-transform:uppercase}
  nav{display:grid;gap:7px}nav a{padding:12px 13px;color:#e4edf7;text-decoration:none;border-radius:8px;font-size:14px}nav a:hover,nav a.active{background:#ffffff20;color:#fff}
  .logout{margin-top:auto;border:1px solid #ffffff55;background:transparent;color:white;border-radius:8px;padding:11px;cursor:pointer}
  .content{min-width:0;flex:1}.top{height:72px;background:white;border-bottom:1px solid #e5eaf0;display:flex;align-items:center;justify-content:space-between;padding:0 30px}
  .top div{display:flex;gap:18px;align-items:center}.top small{color:#0F9D9A;font-weight:700}.top strong{color:#17365D}
  @media(max-width:720px){.sidebar{width:190px;flex-basis:190px;padding:18px 12px}.top{padding:0 16px}}
  @media(max-width:520px){.layout{display:block}.sidebar{width:100%;min-height:auto}.logout{margin-top:15px}.top{height:60px}}
  `]
})
export class Khung {
  constructor(public auth: AuthService, private router: Router) {}
  get tenNguoiDung(){ return this.auth.layNguoiDung()?.username ?? 'Người dùng'; }
  get tenVaiTro(){ return (this.auth.layNguoiDung()?.roles ?? []).join(' · '); }
  thoat(){
    this.auth.dangXuat().subscribe({next:()=>this.router.navigateByUrl('/login'), error:()=>{this.auth.xoaPhien();this.router.navigateByUrl('/login');}});
  }
}
