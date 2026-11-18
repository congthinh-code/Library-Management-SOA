import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../athu';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.daDangNhap() ? true : router.createUrlTree(['/login']);
};
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const roles = (route.data?.['roles'] as string[]) ?? [];
  return auth.daDangNhap() && auth.coVaiTro(...roles)
    ? true
    : router.createUrlTree([auth.daDangNhap() ? '/khong-co-quyen' : '/login']);
};
export const daDangNhapGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.daDangNhap() ? router.createUrlTree(['/']) : true;
};
