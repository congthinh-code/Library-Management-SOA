
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReaderService } from '../core/docgia';
import { DocGiaData } from '../core/models';

@Component({
 standalone: true,
 imports: [CommonModule, FormsModule],
 template: `
 <div class="page">

  <header class="page-header">
   <div>
    <div class="breadcrumb">QUẢN TRỊ <span>/</span> ĐỘC GIẢ</div>
    <h1>Quản lý độc giả</h1>
    <p>Quản lý hồ sơ và trạng thái thẻ độc giả trong hệ thống.</p>
   </div>
   <button class="btn-primary" (click)="moTao()">＋ Thêm độc giả</button>
  </header>

  <section class="panel">

   <div class="panel-header">
    <div>
     <h2>Danh sách độc giả</h2>
     <p>Thông tin hồ sơ và tình trạng thẻ độc giả</p>
    </div>
    <div class="count">{{ds.length}} độc giả</div>
   </div>

   <div class="tools">
    <div class="search-box">
     <span class="search-icon">⌕</span>
     <input
      [(ngModel)]="search"
      placeholder="Tìm mã độc giả hoặc họ tên..."
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
       <th>MÃ ĐỘC GIẢ</th>
       <th>HỌ VÀ TÊN</th>
       <th>EMAIL</th>
       <th>ĐỐI TƯỢNG</th>
       <th>TRẠNG THÁI THẺ</th>
       <th class="action-col">THAO TÁC</th>
      </tr>
     </thead>

     <tbody>
      <tr *ngFor="let d of ds">
       <td class="id-cell">{{d.readerCode}}</td>

       <td>
        <div class="user-cell">
         <div class="avatar">{{d.fullName.charAt(0).toUpperCase()}}</div>
         <span class="username">{{d.fullName}}</span>
        </div>
       </td>

       <td class="email-cell">{{d.email || '—'}}</td>

       <td>
        <span class="type">
         {{d.readerType === 'STUDENT' ? 'Sinh viên' : 'Giảng viên'}}
        </span>
       </td>

       <td>
        <span class="status"
         [class.off]="d.cardStatus !== 'ACTIVE'"
         [class.expired]="d.cardStatus === 'EXPIRED'">
         <span class="status-dot"></span>
         {{trangThai(d.cardStatus)}}
        </span>
       </td>

       <td class="action-col">
        <button class="btn-edit" (click)="chon(d)">Sửa</button>
       </td>
      </tr>

      <tr *ngIf="!ds.length">
       <td colspan="6" class="empty">
        <div class="empty-icon">♧</div>
        <strong>Chưa có dữ liệu độc giả</strong>
        <p>Thử tải lại danh sách hoặc thay đổi từ khóa tìm kiếm.</p>
       </td>
      </tr>
     </tbody>
    </table>
   </div>

   <div class="panel-footer">
    Hiển thị <strong>{{ds.length}}</strong> độc giả
   </div>
  </section>

  <div class="shade" *ngIf="hien">
   <form class="modal" (ngSubmit)="luu()">

    <div class="modal-header">
     <div>
      <div class="modal-label">QUẢN LÝ HỆ THỐNG</div>
      <h2>{{dangSua ? 'Cập nhật độc giả' : 'Thêm độc giả mới'}}</h2>
      <p>{{dangSua ? 'Chỉnh sửa thông tin hồ sơ độc giả.' : 'Nhập thông tin để tạo hồ sơ độc giả.'}}</p>
     </div>
     <button type="button" class="btn-close" (click)="hien=false">×</button>
    </div>

    <div class="form-group">
     <label>Mã độc giả</label>
     <input name="readerCode" [(ngModel)]="form.readerCode"
      placeholder="Nhập mã độc giả" required>
    </div>

    <div class="form-group">
     <label>Họ và tên</label>
     <input name="fullName" [(ngModel)]="form.fullName"
      placeholder="Nhập họ và tên" required>
    </div>

    <div class="form-group">
     <label>Email</label>
     <input name="email" [(ngModel)]="form.email"
      type="email" placeholder="example@email.com">
    </div>

    <div class="form-group">
     <label>Số điện thoại</label>
     <input name="phone" [(ngModel)]="form.phone"
      placeholder="Nhập số điện thoại">
    </div>

    <div class="form-group">
     <label>Đối tượng</label>
     <select name="readerType" [(ngModel)]="form.readerType">
      <option value="STUDENT">Sinh viên</option>
      <option value="LECTURER">Giảng viên</option>
     </select>
    </div>

    <div class="form-group">
     <label>Trạng thái thẻ</label>
     <select name="cardStatus" [(ngModel)]="form.cardStatus">
      <option value="ACTIVE">Hoạt động</option>
      <option value="SUSPENDED">Tạm khóa</option>
      <option value="EXPIRED">Hết hạn</option>
     </select>
    </div>

    <div class="form-group">
     <label>User ID (nếu liên kết tài khoản)</label>
     <input name="userId" [(ngModel)]="form.userId" type="number"
      placeholder="Nhập User ID">
    </div>

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
  background: white;
 }

 .search-box:focus-within {
  border-color: #0f9d9a;
  box-shadow: 0 0 0 3px #0f9d9a15;
 }

 .search-icon {
  color: #8492a6;
  font-size: 23px;
 }

 input, select {
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
  font-weight: 650;
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

 .type {
  display: inline-block;
  background: #edf3f9;
  color: #34516f;
  padding: 6px 10px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 650;
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
  background: #fff4e5;
  color: #a05b00;
 }

 .status.off .status-dot {
  background: #d28b24;
 }

 .status.expired {
  background: #fff0ef;
  color: #c0392b;
 }

 .status.expired .status-dot {
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
  max-height: 90vh;
  overflow-y: auto;
  display: grid;
  gap: 14px;
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

 .form-group input,
 .form-group select {
  width: 100%;
  padding: 12px;
  border: 1px solid #dce5ed;
  border-radius: 8px;
  background: white;
 }

 .form-group input:focus,
 .form-group select:focus {
  border-color: #0f9d9a;
  box-shadow: 0 0 0 3px #0f9d9a15;
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
export class DocGia implements OnInit {
 ds: DocGiaData[] = [];
 search = '';
 loi = '';
 hien = false;
 dangSua = false;
 id = 0;

 form: any = {
  readerCode: '',
  fullName: '',
  email: '',
  phone: '',
  readerType: 'STUDENT',
  cardStatus: 'ACTIVE',
  userId: null
 };

 constructor(
  private reader: ReaderService,
  private cdr: ChangeDetectorRef
 ) {}

 ngOnInit() {
  this.tai();
 }

 tai() {
  this.loi = '';

  this.reader.danhSach(this.search).subscribe({
   next: (r: any) => {
    this.ds = Array.isArray(r?.data) ? r.data : [];
    this.cdr.detectChanges();
   },
   error: (e) => {
    this.loi = e?.error?.message || 'Không tải được độc giả';
    this.cdr.detectChanges();
   }
  });
 }

 trangThai(status: string): string {
  switch (status) {
   case 'ACTIVE': return 'Hoạt động';
   case 'SUSPENDED': return 'Tạm khóa';
   case 'EXPIRED': return 'Hết hạn';
   default: return status;
  }
 }

 lamMoi() {
  this.search = '';
  this.tai();
 }

 moTao() {
  this.dangSua = false;
  this.id = 0;
  this.loi = '';

  this.form = {
   readerCode: '',
   fullName: '',
   email: '',
   phone: '',
   readerType: 'STUDENT',
   cardStatus: 'ACTIVE',
   userId: null
  };

  this.hien = true;
 }

 chon(d: DocGiaData) {
  this.dangSua = true;
  this.id = d.readerId;
  this.loi = '';
  this.form = { ...d };
  this.hien = true;
 }

 luu() {
  this.loi = '';

  const data = {
   ...this.form,
   userId: this.form.userId ? Number(this.form.userId) : null
  };

  const req = this.dangSua
   ? this.reader.capNhat(this.id, data)
   : this.reader.tao(data);

  req.subscribe({
   next: () => {
    this.hien = false;
    this.tai();
   },
   error: (e) => {
    this.loi = e?.error?.message || 'Không lưu được độc giả';
   }
  });
 }
}
