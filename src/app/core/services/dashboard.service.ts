import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IQueryResponse } from '../../shared/interfaces/business-response.interface';
import { IDashboardStatsResponse } from '../../shared/interfaces/dashboard-stats-response.interface';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly _baseUrl = environment.apiBaseUrl;
  private readonly _http = inject(HttpClient);

  getDashboardStats() {
    const URL = this._baseUrl + '/DashboardQuery/GetStats';
    return httpResource<IQueryResponse<IDashboardStatsResponse>>(() => ({
      url: URL,
      method: 'GET',
      withCredentials: true,
    }));
  }
}
