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
  expirationDt: string | undefined;
  data: [];
  pages: number;
  perPage: number;
  length: number;
}

export interface IAxiosIPFSPost {
  config: any;
  data: {
    ipfsHash: string;
    error?: string;
  };
  headers: any;
  request: any;
  status: number;
  statusText: string;
}
