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
  SET_PROFILE(state: UserStateInterface, payload: []) {
    state.profile = payload;
  },
  SET_USER_ACCOUNT(state: UserStateInterface, payload: string) {
    state.userAccount = payload;
  },
  SET_USER_PROFILE(state: UserStateInterface, payload: []) {
    state.userProfile = payload;
  },
  SET_OPEN_CONNECT_YOUR_WALLET_MODAL(state: UserStateInterface) {
    state.openConnectYourWalletModal = !state.openConnectYourWalletModal;
  },
  SET_USER_LIKES(state: UserStateInterface, payload: []) {
    state.userLikes = payload;
  },
  SET_IS_BIDBACK_TAB_OPEN(state: UserStateInterface, payload: boolean) {
    state.isBidBackTabOpen = payload;
  },
  SET_IS_PIRS_TAB_OPEN(state: UserStateInterface, payload: boolean) {
    state.isPirsTabOpen = payload;
  },
};

export default mutation;
