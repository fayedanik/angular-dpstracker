import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { environment } from '../../../environments/environment';
import { ISigninPayload } from '../../features/auth/login/interfaces/auth-payload.interface';
import { ITokenResponse } from '../../features/auth/login/interfaces/auth-response.interface';
import { ICommandResponse } from '../../shared/interfaces/business-response.interface';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _userService = inject(UserService);
  private readonly _http = inject(HttpClient);
  private readonly _accessToken = signal<string | null>(null);
  private readonly _localStorageService = inject(LocalStorageService);
  readonly isLoggedIn = computed(() => !!this._accessToken());
  private readonly _refreshTokenKey = 'refresh_token';
  constructor() {}
  login(payload: ISigninPayload): Observable<ICommandResponse<ITokenResponse>> {
    const URL = this._baseUrl + '/IdentityCommand/Login';
    return this._http
      .post<ICommandResponse<ITokenResponse>>(URL, payload, {
        withCredentials: true,
      })
      .pipe(
        tap((res) => {
          if (res?.data?.access_token) {
            this._localStorageService.set(
              this._refreshTokenKey,
              res.data.refresh_token
            );
            this._accessToken.set(res.data.access_token);
          }
        }),
        switchMap((res) => {
          if (!res?.data?.access_token) return of(res);
          return forkJoin({
            user: this._userService.getUser(),
            apps: this._userService.getApps(),
          }).pipe(map(() => res));
        }),
        catchError((err) => {
          return of<ICommandResponse<ITokenResponse>>({
            success: false,
            message: err?.error?.message as string,
            data: null,
          });
        })
      );
  }

  refresh(): Observable<ICommandResponse<ITokenResponse>> {
    const URL = this._baseUrl + '/IdentityCommand/Refresh';
    return this._http
      .post<ICommandResponse<ITokenResponse>>(
        URL,
        {
          refresh_token: this._localStorageService.get(this._refreshTokenKey),
        },
        {
          withCredentials: true,
        }
      )
      .pipe(
        map((res) => {
          if (res?.data?.access_token) {
            this._accessToken.set(res.data.access_token);
          }
          return res;
        }),
        catchError((err) => {
          return of<ICommandResponse<ITokenResponse>>({
            success: false,
            message: err?.error?.message as string,
            data: null,
          });
        })
      );
  }

  logout(): Observable<ICommandResponse<boolean>> {
    const URL = this._baseUrl + '/IdentityCommand/Logout';
    return this._http
      .post<ICommandResponse<boolean>>(URL, null, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          if (res) {
            this._accessToken.set(null);
            this._localStorageService.remove(this._refreshTokenKey);
            this._userService.resetUser();
          }
          return res;
        }),
        catchError((err) => {
          return of<ICommandResponse<boolean>>({
            success: false,
            message: err?.error?.message as string,
            data: null,
          });
        })
      );
  }

  getAccessToken() {
    return this._accessToken();
  }
}
