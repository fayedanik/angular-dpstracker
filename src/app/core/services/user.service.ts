import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal, signal } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IUserListResponse } from '../../features/user-list/user-list.component';
import { IQueryResponse } from '../../shared/interfaces/business-response.interface';
import { ICreateUserPayload } from '../../shared/interfaces/create-user-payload.interface';
import { IGetUsersQuery } from '../../shared/interfaces/get-user-query.interface';
import { User } from '../domain-models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _http = inject(HttpClient);
  private readonly _user = signal<User | null>(null);

  constructor() {}

  createUser(payload: ICreateUserPayload) {
    const URL = this._baseUrl + '/SecurityCommand/CreateUser';
    return this._http.post(URL, payload);
  }

  activateUser(userId: string) {
    const URL = this._baseUrl + '/SecurityCommand/ActivateUser';
    return this._http.post(URL, { userId: userId });
  }

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

  getAllUsers(payload: Signal<IGetUsersQuery>) {
    const URL = this._baseUrl + '/SecurityQuery/GetUsers';
    return httpResource<IQueryResponse<IUserListResponse>>(() => ({
      url: URL,
      method: 'GET',
      credentials: 'include',
      params: {
        searchText: payload().searchText ? payload().searchText() ?? '' : '',
        pageIndex: payload().pageIndex,
        pageLimit: payload().pageLimit,
      },
    }));
  }

  resetUser() {
    this._user.set(null);
  }

  get User() {
    return this._user.asReadonly();
  }
}
