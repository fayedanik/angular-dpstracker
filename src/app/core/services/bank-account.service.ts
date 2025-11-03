import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IAddUpdateBankAccountPayload } from '../../shared/interfaces/add-bank-account-payload.interface';
import { IBankAccount } from '../../shared/interfaces/bank-account.interface';
import { IBankInfo } from '../../shared/interfaces/bank-list-response.interface';
import {
  ICommandResponse,
  IQueryResponse,
} from '../../shared/interfaces/business-response.interface';

@Injectable({
  providedIn: 'root',
})
export class BankAccountService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _http = inject(HttpClient);

  getBankList() {
    const URL = this._baseUrl + '/AdminCommand/ParseBankList';
    return httpResource<IBankInfo[]>(() => ({
      url: URL,
      method: 'GET',
      credentials: 'include',
    }));
  }

  getAccounts() {
    const URL = this._baseUrl + '/BankAccountQuery/GetAccounts';
    return httpResource<IQueryResponse<IBankAccount[]>>(() => ({
      url: URL,
      method: 'GET',
      withCredentials: true,
    }));
  }

  addBankAccount(
    payload: IAddUpdateBankAccountPayload
  ): Observable<ICommandResponse<boolean>> {
    const URL = this._baseUrl + '/BankAccountCommand/AddAccount';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }

  updateBankAccount(payload: IAddUpdateBankAccountPayload) {
    const URL = this._baseUrl + '/BankAccountCommand/UpdateAccount';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }

  deleteBankAccount(payload: { id: string }) {
    const URL = this._baseUrl + '/BankAccountCommand/DeleteAccount';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }
}
