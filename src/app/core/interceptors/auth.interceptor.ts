import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';

let refreshTokenSubject = new BehaviorSubject<string | null>(null);
let isRefreshing = false;

const addTokenToHeader = (req: HttpRequest<unknown>, token: string) => {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  let token = authService.getAccessToken();

  const handler401Request = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
  ) => {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshTokenSubject.next(null);
      return authService.refresh().pipe(
        switchMap((res) => {
          isRefreshing = false;
          if (!res?.data?.access_token) return next(req);
          refreshTokenSubject.next(res.data?.access_token);
          return next(addTokenToHeader(req, res.data?.access_token));
        }),
        catchError((err) => {
          isRefreshing = false;
          authService.logout();
          router.navigate(['login']);
          return throwError(() => err);
        })
      );
    } else {
      return refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => next(addTokenToHeader(req, token!)))
      );
    }
  };

  if (req.url.includes('/IdentityCommand/RefreshToken')) {
    return next(req);
  }

  if (token && authService.isLoggedIn()) {
    const authReq = addTokenToHeader(req, token);
    return next(authReq).pipe(
      catchError((err) => {
        if (
          err instanceof HttpErrorResponse &&
          err.status == HttpStatusCode.Unauthorized
        ) {
          return handler401Request(req, next);
        }
        return throwError(() => err);
      })
    );
  }
  return next(req);
};
