import { IBaseQuery } from './base-query.interface';

export interface IGetTransactionQueryPayload extends IBaseQuery {
  type: string;
}
