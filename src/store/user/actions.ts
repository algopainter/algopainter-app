import { ActionTree, Commit } from 'vuex';
import { StateInterface } from '..';
import { UserStateInterface, IWeb3Provider } from './types';
import Web3 from 'web3';
import { api } from 'src/boot/axios';
// import { provider as Provider } from 'web3-core';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { getWalletConnectConfig } from 'src/eth/Config';

enum WalletEnum {
  METAMASK = 'metamask',
}

type Web3ProviderConstructor = {
  new (provider: IWeb3Provider): Web3;
};

declare global {
  interface Window {
    ethereum: IWeb3Provider;
    Web3: Web3ProviderConstructor;
    web3: Web3;
  }
}

const connectionFlows = {
  metamask: async(): Promise<IWeb3Provider> => {
    return new Promise((resolve, reject) => {
      if (window.ethereum) {
        resolve(window.ethereum);
      } else {
        reject('Could not find ethereum object');
        window.open('https://metamask.io/download');
      }
    });
  },

  walletConnect: async(): Promise<IWeb3Provider> => {
    const provider: IWeb3Provider = new WalletConnectProvider(getWalletConnectConfig()) as unknown as IWeb3Provider;

    await provider.enable();

    return provider;
  },
};

const clear = (commit: Commit, error?: Error) => {
  commit('setIsConnected', false);
  commit('setAccount', null);
  commit('setError', error);
  commit('setNetworkInfo', null);
};

const actions: ActionTree<UserStateInterface, StateInterface> = {
  async connectToWallet({ commit, dispatch }, wallet: WalletEnum) {
    localStorage.wallet = wallet;
    const providerFlow = connectionFlows[wallet];

    if (!providerFlow) {
      console.log(`Could not find the requested service: ${wallet}`);
    }

    const provider = await providerFlow();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provider.on('accountsChanged', (_accounts: Array<string>) => {
      void dispatch('updateConnectedUser', provider);
    });

    provider.on('chainChanged', () => {
      void dispatch('updateConnectedUser', provider);
    });

    provider.on('disconnect', () => {
      clear(commit);
    });

    window.web3 = new Web3(provider as never);

    try {
      await dispatch('updateConnectedUser', provider);
    } catch (error) {
      clear(commit, error);
    }
  },

  async updateConnectedUser({ commit }, provider: IWeb3Provider) {
    let accounts: string[];

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      accounts = await provider.request({
        method: 'eth_requestAccounts',
      }) as string[];
    } catch {
      accounts = await window.web3.eth.getAccounts();
    }

    const networkInfo = {
      id: await window.web3.eth.net.getId(),
      type: await window.web3.eth.net.getNetworkType(),
    };

    commit('setIsConnected', Boolean(accounts[0]));
    commit('setAccount', accounts[0]);
    commit('setNetworkInfo', networkInfo);
  },

  async getProfile(type, value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const account = value.account as string;
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await api.get(`users/${account}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const profile = res.data as [];
      this.commit('user/SET_PROFILE', profile);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e.response.data.type) {
        this.commit('user/SET_PROFILE', 'empty');
      } else {
        console.log('error message - getProfile', e);
      }
    }
  },

  async getUserProfile(type, value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const account = value.account as string;
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await api.get(`users/${account}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const user = res.data as [];
      this.commit('user/SET_USER_PROFILE', user);
    } catch (e) {
      this.commit('user/SET_USER_PROFILE', undefined);
      console.log('error message - getUserProfile');
    }
  },

  async getAccountBasedOnCustomUrl(type, value) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const customUrl = value.customUrl as string;
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await api.get(`users/${customUrl}/account`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userAccount = res.data.account as [];
      this.commit('user/SET_USER_ACCOUNT', userAccount);
    } catch (e) {
      console.log('error message - getAccountBasedOnCustomUrl');
    }
  },
  async getUserLikes(type, value: Record<string, unknown>) {
    const account = value.account as string;
    const page = value.page as number;
    const perPage = value.perPage as string;
    const collectionName = value.collectionName as string;
    const currentCollection = (collectionName === undefined || collectionName.toLowerCase() === 'all collections') ? '' : collectionName;
    try {
      const res = await api.get(`likes/${account}?page=${page}&perPage=${perPage}&collectionName=${currentCollection}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const userLikes = res.data as [];
      this.commit('user/SET_USER_LIKES', userLikes);
    } catch (e) {
      console.log('error message - getUserLikes');
    }
  },
  openConnectYourWalletModal() {
    this.commit('user/SET_OPEN_CONNECT_YOUR_WALLET_MODAL');
  },
};

export default actions;
