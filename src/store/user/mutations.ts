import { MutationTree } from 'vuex';
import { UserStateInterface, NetworkInfo } from './types';

const mutation: MutationTree<UserStateInterface> = {
  setIsConnected(state: UserStateInterface, payload: boolean) {
    console.log('setIsConnected', payload);
    state.isConnected = payload;
  },
  setAccount(state: UserStateInterface, payload?: string) {
    console.log('setAccount', payload);
    state.account = payload;
  },
  setError(state: UserStateInterface, payload?: Error) {
    console.log('setError', payload);
    state.error = payload;
  },
  setNetworkInfo(state: UserStateInterface, payload?: NetworkInfo) {
    console.log('setNetworkInfo', payload);
    state.networkInfo = payload;
  },
  SET_PROFILE(state: UserStateInterface, payload: []) {
    state.profile = payload;
  },
  SET_USER_PROFILE(state: UserStateInterface, payload: []) {
    state.userProfile = payload;
  },
};

export default mutation;
