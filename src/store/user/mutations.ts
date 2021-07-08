import { MutationTree } from 'vuex';
import { UserStateInterface } from './types';

const mutation: MutationTree<UserStateInterface> = {
  setIsConnected(state: UserStateInterface, payload: boolean) {
    state.isConnected = payload;
  },
  setAccount(state: UserStateInterface, payload: string) {
    state.account = payload;
  },
  setError(state: UserStateInterface, payload: Error) {
    state.error = payload;
  },
};

export default mutation;
