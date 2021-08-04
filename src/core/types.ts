export interface IError {
  message: string;
  stack?: string;
}

export interface IApiResponse<T> {
  data: T;
  success: boolean;
  message: string;
  type: string;
}
