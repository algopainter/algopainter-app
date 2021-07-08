import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { UserStateInterface } from './types';

const getters: GetterTree<UserStateInterface, StateInterface> = {
  account(state: UserStateInterface): string|undefined {
    return state.account;
  },
  isConnected(state: UserStateInterface): boolean {
    return state.isConnected;
  },
  error(state: UserStateInterface): Error|undefined {
    return state.error;
  },
};

export default getters;
