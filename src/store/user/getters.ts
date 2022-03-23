import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { UserStateInterface, NetworkInfo } from './types';

const getters: GetterTree<UserStateInterface, StateInterface> = {
  account(state: UserStateInterface): string | undefined {
    return state.account;
  },
  isConnected(state: UserStateInterface): boolean {
    return state.isConnected;
  },
  error(state: UserStateInterface): Error | undefined {
    return state.error;
  },
  networkInfo(state: UserStateInterface): NetworkInfo | undefined {
    return state.networkInfo;
  },
  GET_PROFILE(state: UserStateInterface): [] | undefined {
    return state.profile;
  },
  GET_USER_ACCOUNT(state: UserStateInterface): string | undefined {
    return state.userAccount;
  },
  GET_USER_PROFILE(state: UserStateInterface): [] | undefined {
    return state.userProfile;
  },
  GET_USER_LIKES(state: UserStateInterface): [] | undefined {
    return state.userLikes;
  },
  GET_OPEN_CONNECT_YOUR_WALLET_MODAL(state: UserStateInterface): boolean {
    return state.openConnectYourWalletModal;
  },
  GET_IS_BIDBACK_TAB_OPEN(state: UserStateInterface): boolean {
    return state.isBidBackTabOpen;
  },
  GET_IS_PIRS_TAB_OPEN(state: UserStateInterface): boolean {
    return state.isPirsTabOpen;
  },
};

export default getters;
