import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../athu';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).layToken();
  if (!token) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};
