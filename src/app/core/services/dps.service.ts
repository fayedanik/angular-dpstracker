import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IAddDpsMoneyPayload } from '../../shared/interfaces/add-dps-money-payload.interface';
import { IAddDpsPayload } from '../../shared/interfaces/add-dps-payload.interface';
import {
  ICommandResponse,
  IQueryResponse,
} from '../../shared/interfaces/business-response.interface';
import { IDps } from '../../shared/interfaces/dps.interface';

@Injectable({
  providedIn: 'root',
})
export class DpsService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _http = inject(HttpClient);

  getDpsList() {
    const URL = this._baseUrl + '/DpsQuery/GetDps';
    return httpResource<IQueryResponse<IDps[]>>(() => ({
      url: URL,
      method: 'GET',
      credentials: 'include',
    }));
  }

  getDpsById(dpsId: string | null) {
    if (!dpsId) return null;
    const params: Record<string, any> = {
      dpsId: dpsId ?? '',
    };
    const URL = this._baseUrl + '/DpsQuery/GetDpsById';
    return httpResource<IQueryResponse<IDps>>(() => ({
      url: URL,
      params: params,
      method: 'GET',
      credentials: 'include',
    }));
  }

  addDps(payload: IAddDpsPayload) {
    const URL = this._baseUrl + '/DpsCommand/CreateDps';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }

  updateDps(payload: IAddDpsMoneyPayload) {
    const URL = this._baseUrl + '/DpsCommand/UpdateDps';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }

  deleteDps(payload: { id: string }) {
    const URL = this._baseUrl + '/DpsCommand/DeleteDps';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }
}
