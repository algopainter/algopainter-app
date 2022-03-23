import { UserStateInterface } from './types';

function state(): UserStateInterface {
  return {
    isConnected: false,
    account: undefined,
    error: undefined,
    networkInfo: undefined,
    profile: [],
    userAccount: undefined,
    userProfile: undefined,
    userLikes: undefined,
    openConnectYourWalletModal: false,
    isBidBackTabOpen: false,
    isPirsTabOpen: false
  };
}

export default state;
