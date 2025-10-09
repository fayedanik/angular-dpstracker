export interface ICommandResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}

export interface IQueryResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
