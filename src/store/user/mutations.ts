import { MutationTree } from 'vuex';
import { UserStateInterface, NetworkInfo } from './types';

const mutation: MutationTree<UserStateInterface> = {
  setIsConnected(state: UserStateInterface, payload: boolean) {
    state.isConnected = payload;
  },
  setAccount(state: UserStateInterface, payload?: string) {
    state.account = payload;
  },
  setError(state: UserStateInterface, payload?: Error) {
    state.error = payload;
  },
  setNetworkInfo(state: UserStateInterface, payload?: NetworkInfo) {
    state.networkInfo = payload;
  },
};

export default mutation;
