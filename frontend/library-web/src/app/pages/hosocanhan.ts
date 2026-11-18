import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReaderService } from '../core/docgia';

@Component({
 standalone:true,imports:[CommonModule],
 template:`<section class="page"><small>ĐỘC GIẢ / HỒ SƠ CỦA TÔI</small><h1>Hồ sơ độc giả</h1>
 <p *ngIf="dangTai">Đang tải hồ sơ...</p><p class="error" *ngIf="loi">{{loi}}</p>
 <article class="card" *ngIf="hoSo"><div class="grid">
 <div><label>Mã độc giả</label><b>{{hoSo.readerCode}}</b></div>
 <div><label>Họ và tên</label><b>{{hoSo.fullName}}</b></div>
 <div><label>Email</label><b>{{hoSo.email||'—'}}</b></div>
 <div><label>Số điện thoại</label><b>{{hoSo.phone||'—'}}</b></div>
 <div><label>Loại độc giả</label><b>{{hoSo.readerType==='STUDENT'?'Sinh viên':'Giảng viên'}}</b></div>
 <div><label>Trạng thái thẻ</label><b>{{trangThai}}</b></div></div></article></section>`,
 styles:[`.page{padding:32px}small{color:#0F9D9A;font-weight:700}h1{color:#17365D}.card{background:#fff;border:1px solid #e5eaf0;border-radius:14px;padding:24px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:22px}label{display:block;color:#718096;font-size:13px;margin-bottom:7px}.error{color:#b91c1c}`]
})
export class HoSoCaNhan implements OnInit {
 hoSo:any=null;loi='';dangTai=true;
 constructor(private reader:ReaderService){}
 ngOnInit(){this.reader.docGiaHienTai().subscribe({next:r=>{this.hoSo=r?.data??r;this.dangTai=false;},error:e=>{this.loi=e?.error?.message||'Không tải được hồ sơ độc giả';this.dangTai=false;}});}
 get trangThai(){return this.hoSo?.cardStatus==='ACTIVE'?'Hoạt động':this.hoSo?.cardStatus==='SUSPENDED'?'Tạm khóa':'Hết hạn';}
}
