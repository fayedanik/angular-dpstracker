import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUserListResponse } from '../../features/user-list/user-list.component';
import { IQueryResponse } from '../../shared/interfaces/business-response.interface';
import { User } from '../domain-models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _http = inject(HttpClient);
  private readonly _user = signal<User | null>(null);

  constructor() {}

  getUser(): Observable<IQueryResponse<User>> {
    const URL = this._baseUrl + '/SecurityQuery/GetUser';
    return this._http
      .get<IQueryResponse<User>>(URL, {
        withCredentials: true,
      })
      .pipe(
        map((res) => {
          this._user.set(res?.data);
          return res;
        }),
        catchError((err) => {
          return of<IQueryResponse<User>>({
            success: false,
            message: err?.error?.message as string,
            data: null,
          });
        })
      );
  }

  getAllUsers() {
    const URL = this._baseUrl + '/SecurityQuery/GetUsers';
    return httpResource<IQueryResponse<IUserListResponse>>(() => ({
      url: URL,
      method: 'GET',
      credentials: 'include',
    }));
  }

  resetUser() {
    this._user.set(null);
  }

  get User() {
    return this._user.asReadonly();
  }
}
