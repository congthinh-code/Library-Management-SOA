
import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../core/athu';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  submitted = false;
  message = '';
  isLoading = false;

  loginForm;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    this.submitted = true;
    this.message = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const username = this.loginForm.value.username ?? '';
    const password = this.loginForm.value.password ?? '';

    this.isLoading = true;

    this.authService.dangNhap(username, password).subscribe({
      next: (res) => {
        this.isLoading = false;

        const roles = res.data.user.roles ?? [];

        if (roles.includes('ADMIN')) {
          void this.router.navigate(['/admin']);
        } else if (roles.includes('STAFF')) {
          void this.router.navigate(['/staff']);
        } else if (roles.includes('READER')) {
          void this.router.navigate(['/reader']);
        } else {
          void this.router.navigate(['/khong-co-quyen']);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;

        if (error.status === 401) {
          this.message = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
        } else if (error.status === 0) {
          this.message = 'Không thể kết nối đến máy chủ. Vui lòng thử lại.';
        } else if (error.status === 403) {
          this.message = 'Bạn không có quyền thực hiện thao tác này.';
        } else {
          this.message =
            error.error?.message ?? 'Đã xảy ra lỗi. Vui lòng thử lại.';
        }
      }
    });
  }
}
