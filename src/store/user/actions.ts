import { ActionTree, Commit } from 'vuex';
import { StateInterface } from '..';
import { UserStateInterface, Ethereumish, ProviderRpcError } from './types';
import Web3 from 'web3';
// import { provider as Provider } from 'web3-core';

enum WalletEnum {
  METAMASK,
  WALLET_CONNECT,
}

declare global {
  interface Window {
    ethereum: Ethereumish;
    web3: Web3;
  }
}

const actions: ActionTree<UserStateInterface, StateInterface> = {

};

export default actions;
