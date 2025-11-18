import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  ICommandResponse,
  IQueryResponse,
} from '../../shared/interfaces/business-response.interface';
import { IGetTransactionQueryPayload } from '../../shared/interfaces/get-transaction-query.payload.interface';
import { IMakePaymentPayload } from '../../shared/interfaces/make-payment-payload.interface';
import { ITransaction } from '../../shared/interfaces/transaction.interface';
import { ITransferMoneyPayload } from '../../shared/interfaces/transfer-money-payload.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _http = inject(HttpClient);

  getTransactions(payload: Signal<IGetTransactionQueryPayload>) {
    const URL = this._baseUrl + '/TransactionQuery/GetTransactions';
    return httpResource<IQueryResponse<ITransaction[]>>(() => ({
      url: URL,
      params: {
        type: payload().type ?? '',
        pageIndex: payload().pageIndex,
        pageLimit: payload().pageLimit,
      },
      method: 'GET',
      credentials: 'include',
    }));
  }

  transferMoney(payload: ITransferMoneyPayload) {
    const URL = this._baseUrl + '/TransactionCommand/TransferMoney';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }

  makePayment(payload: IMakePaymentPayload) {
    const URL = this._baseUrl + '/TransactionCommand/MakePayment';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }

  updateStatus(transactionId: string) {
    const URL = this._baseUrl + '/TransactionCommand/UpdateStatus';
    return this._http.post<ICommandResponse<boolean>>(
      URL,
      { transactionId: transactionId },
      {
        withCredentials: true,
      }
    );
  }
}
