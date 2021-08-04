import { api } from 'src/boot/axios';
import Result from 'src/core/Result';
import { IError } from 'src/core/types';
import { IProfile } from 'src/models/IProfile';
import BaseController from '../BaseController';

export default class UserController extends BaseController {
  async getUserProfile(account: string) {
    try {
      const response = await api.get(`users/${account}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      return Result.ok(response.data as IProfile);
    } catch (error) {
      return Result.fail<string>((error as IError).message);
    }
  }
}
