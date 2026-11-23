import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({standalone:true,imports:[RouterLink],template:`<section style="padding:40px"><h1>Không có quyền truy cập</h1><p>Tài khoản của bạn không được cấp quyền sử dụng chức năng này.</p><a routerLink="/">Quay về trang chủ</a></section>`})
export class KhongCoQuyen {}
