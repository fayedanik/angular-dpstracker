import { httpResource } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IBankListResponse } from '../../shared/interfaces/bank-list-response.interface';

@Injectable({
  providedIn: 'root',
})
export class BankService {
  private readonly _baseUrl = environment.apiBaseUrl;
  //private readonly _bankList = signal<IBankListResponse[]>([]);

  getBankList() {
    const URL = this._baseUrl + '/AdminCommand/ParseBankList';
    return httpResource<IBankListResponse[]>(() => ({
      url: URL,
      method: 'GET',
      credentials: 'include',
    }));
  }
}
