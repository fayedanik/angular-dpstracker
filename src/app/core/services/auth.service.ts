import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ISigninPayload } from '../../features/auth/login/interfaces/auth-payload.interface';
import { ITokenResponse } from '../../features/auth/login/interfaces/auth-response.interface';
import { ICommandResponse } from '../../shared/interfaces/command-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _http = inject(HttpClient);
  private readonly _accessToken = signal<string | undefined>(undefined);
  readonly isLoggedIn = computed(() => !!this._accessToken());
  constructor() {}
  login(payload: ISigninPayload): Observable<ICommandResponse<ITokenResponse>> {
    const URL = this._baseUrl + '/IdentityCommand/Login';
    return this._http
      .post<ICommandResponse<ITokenResponse>>(URL, payload, {
        withCredentials: true,
      })
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

  refresh(): Observable<ICommandResponse<ITokenResponse>> {
    const URL = this._baseUrl + '/IdentityCommand/RefreshToken';
    return this._http
      .post<ICommandResponse<ITokenResponse>>(URL, null, {
        withCredentials: true,
      })
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

  getAccessToken() {
    return this._accessToken();
  }
}
