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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getProvider = (wallet: WalletEnum): Ethereumish => {
  return window.ethereum;
};

const getAccountData = async(provider: Ethereumish): Promise<Array<string>> =>
  provider.request({ method: 'eth_requestAccounts' });

const commitUserAccountStore = (accounts: string[], commit: Commit) => {
  commit('setIsConnected', true);
  commit('setAccount', accounts[0]);
};

const clearUserAccountStore = (commit: Commit, error?: Error) => {
  commit('setIsConnected', false);
  commit('setAccount', null);
  commit('setError', error);
};

const actions: ActionTree<UserStateInterface, StateInterface> = {
  async connectToWallet({ commit }, wallet: WalletEnum) {
    const provider = getProvider(wallet);

    if (!provider) {
      console.log('No wallet provider was found');
      return;
    }

    provider.on('accountsChanged', (accounts: Array<string>) => {
      commitUserAccountStore(accounts, commit);
    });

    // networkChanged is DEPRECATED
    provider.on('chainChanged', () => {
      window.location.reload();
    });

    provider.on('disconnect', (error: ProviderRpcError) => {
      clearUserAccountStore(commit, error);
    });

    // window.web3 = new Web3(provider as Provider);

    try {
      const accounts: string[] = await getAccountData(provider);
      commitUserAccountStore(accounts, commit);
    } catch (error) {
      clearUserAccountStore(commit, error);
    }
  },
};

export default actions;
