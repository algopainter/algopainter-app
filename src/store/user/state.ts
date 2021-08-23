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
  };
}

export default state;
