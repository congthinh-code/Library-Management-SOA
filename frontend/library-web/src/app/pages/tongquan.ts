import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../core/athu';

@Component({
 standalone:true, imports:[CommonModule,RouterLink],
 template: `
 <section class="page">
  <small>BẢNG ĐIỀU KHIỂN</small><h1>{{tieuDe}}</h1>
  <p>Xin chào {{auth.layNguoiDung()?.username}}. Chọn chức năng trong phạm vi quyền được cấp.</p>
  <div class="cards" *ngIf="auth.coVaiTro('ADMIN','STAFF')">
   <a routerLink="/tai-khoan" *ngIf="auth.coVaiTro('ADMIN','STAFF')"><b>01</b><h3>Quản lý tài khoản</h3><p>Xem danh sách tài khoản. Chỉ ADMIN được tạo, sửa và phân quyền.</p></a>
   <a routerLink="/doc-gia"><b>02</b><h3>Quản lý độc giả</h3><p>Tra cứu và cập nhật hồ sơ độc giả, trạng thái thẻ.</p></a>
  </div>
  <div class="cards" *ngIf="auth.coVaiTro('READER')">
   <a routerLink="/ho-so"><b>01</b><h3>Hồ sơ độc giả</h3><p>Xem thông tin và trạng thái thẻ của tài khoản đang đăng nhập.</p></a>
  </div>
 </section>`,
 styles:[`.page{padding:32px;color:#263445}small{color:#0F9D9A;font-weight:700}h1{color:#17365D;margin:8px 0}p{color:#718096}.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:18px;margin-top:28px}.cards a{background:#fff;border:1px solid #e5eaf0;border-radius:14px;padding:24px;text-decoration:none;color:#334155}.cards b{color:#0F9D9A}.cards h3{color:#17365D}.cards p{line-height:1.6}`]
})
export class TongQuan {
 constructor(public auth: AuthService){}
 get tieuDe(){return this.auth.coVaiTro('ADMIN')?'Tổng quan quản trị':this.auth.coVaiTro('STAFF')?'Tổng quan nhân viên':'Khu vực độc giả';}
}
