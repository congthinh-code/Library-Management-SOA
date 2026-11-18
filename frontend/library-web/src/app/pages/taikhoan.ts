
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/athu';
import { TaiKhoan } from '../core/models';

@Component({
 standalone: true,
 imports: [CommonModule, FormsModule],
 template: `
 <div class="page">

  <header class="page-header">
   <div>
    <div class="breadcrumb">QUẢN TRỊ <span>/</span> TÀI KHOẢN</div>
    <h1>Quản lý tài khoản</h1>
    <p>Quản lý thông tin và quyền truy cập tài khoản hệ thống.</p>
   </div>
   <button class="btn-primary" (click)="moTao()">
    <span>＋</span> Thêm tài khoản
   </button>
  </header>

  <section class="panel">

   <div class="panel-header">
    <div>
     <h2>Danh sách tài khoản</h2>
     <p>Thông tin các tài khoản đang có trong hệ thống</p>
    </div>
    <div class="count">
     {{ds.length}} tài khoản
    </div>
   </div>

   <div class="tools">
    <div class="search-box">
     <span class="search-icon">⌕</span>
     <input
      [(ngModel)]="search"
      placeholder="Tìm theo tên đăng nhập hoặc email..."
      (keyup.enter)="tai()"
     >
    </div>
    <button class="btn-search" (click)="tai()">Tìm kiếm</button>
    <button class="btn-refresh" (click)="lamMoi()">Làm mới</button>
   </div>

   <p class="msg" *ngIf="loi">{{loi}}</p>

   <div class="table-wrap">
    <table>
     <thead>
      <tr>
       <th>ID</th>
       <th>TÀI KHOẢN</th>
       <th>EMAIL</th>
       <th>TRẠNG THÁI</th>
       <th class="action-col">THAO TÁC</th>
      </tr>
     </thead>

     <tbody>
      <tr *ngFor="let u of ds">
       <td class="id-cell">#{{u.userId}}</td>
       <td>
        <div class="user-cell">
         <div class="avatar">{{u.username.charAt(0).toUpperCase()}}</div>
         <span class="username">{{u.username}}</span>
        </div>
       </td>
       <td class="email-cell">{{u.email || 'Chưa cập nhật'}}</td>
       <td>
        <span class="status" [class.off]="!u.isActive">
         <span class="status-dot"></span>
         {{u.isActive ? 'Hoạt động' : 'Đã khóa'}}
        </span>
       </td>
       <td class="action-col">
        <button class="btn-edit" (click)="chon(u)">Sửa</button>
       </td>
      </tr>

      <tr *ngIf="!ds.length">
       <td colspan="5" class="empty">
        <div class="empty-icon">♧</div>
        <strong>Chưa có dữ liệu tài khoản</strong>
        <p>Thử tải lại danh sách hoặc thay đổi từ khóa tìm kiếm.</p>
       </td>
      </tr>
     </tbody>
    </table>
   </div>

   <div class="panel-footer">
    Hiển thị <strong>{{ds.length}}</strong> tài khoản
   </div>
  </section>

  <div class="shade" *ngIf="hien">
   <form class="modal" (ngSubmit)="luu()">

    <div class="modal-header">
     <div>
      <div class="modal-label">QUẢN LÝ HỆ THỐNG</div>
      <h2>{{dangSua ? 'Cập nhật tài khoản' : 'Thêm tài khoản mới'}}</h2>
      <p>{{dangSua ? 'Chỉnh sửa thông tin tài khoản.' : 'Nhập thông tin để tạo tài khoản mới.'}}</p>
     </div>
     <button type="button" class="btn-close" (click)="hien=false">×</button>
    </div>

    <div class="form-group">
     <label>Tên đăng nhập</label>
     <input name="username" [(ngModel)]="form.username"
      placeholder="Nhập tên đăng nhập" required minlength="3">
    </div>

    <div class="form-group">
     <label>Email</label>
     <input name="email" [(ngModel)]="form.email"
      type="email" placeholder="example@email.com" required>
    </div>

    <div class="form-group" *ngIf="!dangSua">
     <label>Mật khẩu</label>
     <input name="password" [(ngModel)]="form.password"
      type="password" placeholder="Nhập mật khẩu" required minlength="8">
    </div>

    <label *ngIf="dangSua" class="check">
     <input type="checkbox" name="isActive" [(ngModel)]="form.isActive">
     <span>Tài khoản đang hoạt động</span>
    </label>

    <p class="msg" *ngIf="loi">{{loi}}</p>

    <div class="modal-footer">
     <button type="button" class="btn-cancel" (click)="hien=false">Hủy</button>
     <button type="submit" class="btn-primary">Lưu thông tin</button>
    </div>

   </form>
  </div>

 </div>
 `,

 styles: [`
 * { box-sizing: border-box; }

 .page {
  padding: 34px;
  max-width: 1350px;
  margin: auto;
  color: #334155;
 }

 .page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
 }

 .breadcrumb {
  color: #0f9d9a;
  font-size: 12px;
  font-weight: 750;
  letter-spacing: .7px;
 }

 .breadcrumb span {
  color: #94a3b8;
  padding: 0 5px;
 }

 h1 {
  color: #17365d;
  font-size: 30px;
  font-weight: 750;
  margin: 9px 0;
 }

 .page-header p,
 .panel-header p {
  color: #8492a6;
  margin: 0;
  font-size: 14px;
 }

 button {
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  transition: .2s ease;
 }

 .btn-primary {
  background: #17365d;
  color: white;
  border: none;
  border-radius: 9px;
  padding: 12px 19px;
  box-shadow: 0 3px 8px #17365d20;
 }

 .btn-primary:hover {
  background: #234c78;
  transform: translateY(-1px);
 }

 .btn-primary span {
  font-size: 18px;
  margin-right: 5px;
 }

 .panel {
  background: white;
  border: 1px solid #e7edf3;
  border-radius: 15px;
  padding: 24px;
  box-shadow: 0 4px 18px #17365d08;
 }

 .panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
 }

 .panel-header h2 {
  color: #17365d;
  font-size: 18px;
  margin: 0 0 6px;
 }

 .count {
  background: #eaf4f7;
  color: #167e83;
  padding: 7px 13px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
 }

 .tools {
  display: flex;
  gap: 10px;
  margin-bottom: 22px;
  flex-wrap: wrap;
 }

 .search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #dce5ed;
  border-radius: 9px;
  padding: 0 12px;
  max-width: 420px;
  width: 100%;
  background: #fff;
 }

 .search-box:focus-within {
  border-color: #0f9d9a;
  box-shadow: 0 0 0 3px #0f9d9a15;
 }

 .search-icon {
  color: #8492a6;
  font-size: 23px;
 }

 input {
  font: inherit;
  outline: none;
 }

 .search-box input {
  border: none;
  padding: 12px 0;
  width: 100%;
  min-width: 0;
 }

 .btn-search {
  background: #17365d;
  color: white;
  border: none;
  border-radius: 9px;
  padding: 11px 20px;
 }

 .btn-search:hover {
  background: #234c78;
 }

 .btn-refresh {
  background: #eef3f8;
  color: #34516f;
  border: none;
  border-radius: 9px;
  padding: 11px 17px;
 }

 .btn-refresh:hover {
  background: #e1eaf2;
 }

 .table-wrap {
  overflow-x: auto;
 }

 table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
 }

 th {
  background: #f7f9fc;
  color: #718096;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .5px;
  padding: 15px;
  border-bottom: 1px solid #e9eef4;
 }

 td {
  padding: 15px;
  border-bottom: 1px solid #edf1f5;
  white-space: nowrap;
  font-size: 14px;
 }

 tbody tr:hover {
  background: #f8fbfd;
 }

 .id-cell {
  color: #8492a6;
  font-weight: 600;
 }

 .user-cell {
  display: flex;
  align-items: center;
  gap: 11px;
 }

 .avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #e8f3f5;
  color: #0f8589;
  font-weight: 750;
 }

 .username {
  color: #243c57;
  font-weight: 650;
 }

 .email-cell {
  color: #718096;
 }

 .status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #e8f6ef;
  color: #168052;
  border-radius: 20px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 650;
 }

 .status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #20a36a;
 }

 .status.off {
  background: #fff0ef;
  color: #c0392b;
 }

 .status.off .status-dot {
  background: #d94c43;
 }

 .action-col {
  text-align: center;
 }

 .btn-edit {
  background: #edf3f9;
  color: #17365d;
  border: none;
  border-radius: 7px;
  padding: 7px 15px;
  font-size: 12px;
 }

 .btn-edit:hover {
  background: #dce9f4;
 }

 .empty {
  text-align: center;
  padding: 45px 15px;
  color: #718096;
 }

 .empty-icon {
  font-size: 30px;
  color: #a5b5c5;
  margin-bottom: 10px;
 }

 .empty strong {
  color: #53677e;
  display: block;
 }

 .empty p {
  font-size: 13px;
  margin: 7px 0 0;
 }

 .panel-footer {
  border-top: 1px solid #edf1f5;
  padding-top: 15px;
  margin-top: 5px;
  font-size: 13px;
  color: #8492a6;
 }

 .panel-footer strong {
  color: #17365d;
 }

 .shade {
  position: fixed;
  inset: 0;
  background: #10243b80;
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 1000;
 }

 .modal {
  background: white;
  border-radius: 16px;
  padding: 26px;
  width: min(460px, 100%);
  display: grid;
  gap: 17px;
  box-shadow: 0 20px 60px #10243b30;
 }

 .modal-header {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 3px;
 }

 .modal-label {
  color: #0f9d9a;
  font-size: 10px;
  font-weight: 750;
  letter-spacing: .7px;
 }

 .modal h2 {
  color: #17365d;
  margin: 7px 0;
  font-size: 21px;
 }

 .modal-header p {
  color: #8492a6;
  font-size: 13px;
  margin: 0;
 }

 .btn-close {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  font-size: 22px;
 }

 .form-group {
  display: grid;
  gap: 8px;
 }

 .form-group label {
  color: #334155;
  font-size: 13px;
  font-weight: 650;
 }

 .form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dce5ed;
  border-radius: 8px;
 }

 .form-group input:focus {
  border-color: #0f9d9a;
  box-shadow: 0 0 0 3px #0f9d9a15;
 }

 .check {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  color: #334155;
 }

 .check input {
  accent-color: #0f9d9a;
 }

 .modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid #edf1f5;
 }

 .btn-cancel {
  background: #edf2f7;
  color: #475569;
  border: none;
  border-radius: 8px;
  padding: 11px 17px;
 }

 .msg {
  color: #c0392b;
  font-size: 13px;
  margin: 0;
 }

 @media (max-width: 650px) {
  .page {
   padding: 18px;
  }

  .page-header {
   align-items: flex-start;
   flex-direction: column;
  }

  h1 {
   font-size: 24px;
  }

  .panel {
   padding: 15px;
  }

  .panel-header {
   align-items: flex-start;
   flex-direction: column;
   gap: 10px;
  }

  .search-box {
   max-width: 100%;
  }
 }
 `]
})
export class TaiKhoanPage implements OnInit {
 ds: TaiKhoan[] = [];
 search = '';
 loi = '';
 hien = false;
 dangSua = false;
 id = '';

 form: any = {
  username: '',
  email: '',
  password: '',
  isActive: true
 };

 constructor(
  private auth: AuthService,
  private cdr: ChangeDetectorRef
 ) {}

 ngOnInit() {
  this.tai();
 }

 tai() {
  this.loi = '';

  this.auth.danhSachTaiKhoan(1, 100, this.search).subscribe({
   next: (r: any) => {
    this.ds = Array.isArray(r?.data) ? r.data : [];
    this.cdr.detectChanges();
   },
   error: (e) => {
    this.loi = e?.error?.message || 'Không tải được tài khoản';
    this.cdr.detectChanges();
   }
  });
 }

 lamMoi() {
  this.search = '';
  this.tai();
 }

 moTao() {
  this.dangSua = false;
  this.id = '';
  this.loi = '';
  this.form = {
   username: '',
   email: '',
   password: '',
   isActive: true
  };
  this.hien = true;
 }

 chon(u: TaiKhoan) {
  this.dangSua = true;
  this.id = u.userId;
  this.loi = '';
  this.form = {
   username: u.username,
   email: u.email || '',
   isActive: u.isActive
  };
  this.hien = true;
 }

 luu() {
  this.loi = '';

  const req = this.dangSua
   ? this.auth.suaTaiKhoan(this.id, this.form)
   : this.auth.taoTaiKhoan(this.form);

  req.subscribe({
   next: () => {
    this.hien = false;
    this.tai();
   },
   error: (e) => {
    this.loi = e?.error?.message || 'Không lưu được tài khoản';
   }
  });
 }
}
