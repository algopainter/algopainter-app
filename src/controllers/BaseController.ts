import { AxiosInstance } from 'axios';
import { api } from '../boot/axios';
import Web3Helper from 'src/helpers/web3Helper';

export default class BaseController {
  api: AxiosInstance;
  web3Helper: Web3Helper;

  constructor() {
    this.api = api;
    this.web3Helper = new Web3Helper();
  }

  async get(path: string) {
    return await this.api.get(path);
  }

  async post(
    path: string,
    body: Record<string, unknown> = {},
    options: Record<string, unknown> = {}
  ) {
    return await this.api.post(path, body, options);
  }

  async delete(
    path: string,
    body: Record<string, unknown> = {}
  ) {
    return await this.api.delete(path, body);
  }
}
