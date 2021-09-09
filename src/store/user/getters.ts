import { GetterTree } from 'vuex';
import { StateInterface } from '..';
import { UserStateInterface, NetworkInfo } from './types';

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
  networkInfo(state: UserStateInterface): NetworkInfo|undefined {
    return state.networkInfo;
  },
  GET_PROFILE(state: UserStateInterface): []|undefined {
    return state.profile;
  },
  GET_USER_ACCOUNT(state: UserStateInterface): string|undefined {
    return state.userAccount;
  },
  GET_USER_PROFILE(state: UserStateInterface): []|undefined {
    return state.userProfile;
  },
  GET_USER_LIKES(state: UserStateInterface): []|undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state.userLikes;
  },
};

export default getters;
