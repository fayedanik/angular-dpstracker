import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
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

  addDps(payload: IAddDpsPayload) {
    const URL = this._baseUrl + '/DpsCommand/CreateDps';
    return this._http.post<ICommandResponse<boolean>>(URL, payload, {
      withCredentials: true,
    });
  }
}
