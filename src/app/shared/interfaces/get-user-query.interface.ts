import { Signal } from '@angular/core';
import { IBaseQuery } from './base-query.interface';

export interface IGetUsersQuery extends IBaseQuery {
  searchText: Signal<string | null>;
}
