export interface IAxios {
  config: Record<string, unknown>;
  data: [];
  headers: Record<string, unknown>;
  request: Record<string, unknown>;
  status: number;
  statusText: string;
}

export interface IAxiosPaginated {
  count: number;
  currPage: number;
  data: [];
  pages: number;
  perPage: number;
}