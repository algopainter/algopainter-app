import { AxiosInstance } from 'axios';
import { api } from '../boot/axios';

export default class BaseController {
  api: AxiosInstance;

  constructor() {
    this.api = api;
  }

  async get(path: string) {
    return await this.api.get(path);
  }
}
