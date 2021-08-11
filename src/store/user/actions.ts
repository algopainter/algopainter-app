import { ActionTree, Commit } from 'vuex';
import { StateInterface } from '..';
import { UserStateInterface, IWeb3Provider } from './types';
import Web3 from 'web3';
import { api } from 'src/boot/axios';
// import { provider as Provider } from 'web3-core';
// import WalletConnectProvider from '@walletconnect/web3-provider';

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
      }
    });
  },
};

const clear = (commit: Commit, error?: Error) => {
  commit('setIsConnected', false);
  commit('setAccount', null);
  commit('setError', error);
  commit('setNetworkInfo', null);
};

const actions: ActionTree<UserStateInterface, StateInterface> = {
  async connectToWallet({ commit }, wallet: WalletEnum) {
    const providerFlow = connectionFlows[wallet];

    if (!providerFlow) {
      console.log(`Could not find the requested service: ${wallet}`);
    }

    const provider = await providerFlow();

    const commitUserData = async(commit: Commit) => {
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      const networkInfo = {
        id: await web3.eth.net.getId(),
        type: await web3.eth.net.getNetworkType(),
      };
      commit('setIsConnected', true);
      commit('setAccount', accounts[0]);
      commit('setNetworkInfo', networkInfo);
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    provider.on('accountsChanged', (_accounts: Array<string>) => {
      void commitUserData(commit);
    });

    provider.on('chainChanged', () => {
      // window.location.reload();
      void commitUserData(commit);
    });

    provider.on('disconnect', () => {
      clear(commit);
    });

    const web3 = new window.Web3(provider);
    window.web3 = web3; // replaces deprecated web3 object for a stable one from cdn

    try {
      void commitUserData(commit);
    } catch (error) {
      clear(commit, error);
    }
  },
  async getProfile(type) {
    try {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const res = await api.get(`users/${this.state.user.account}`);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const profile = res.data as [];
      this.commit('user/SET_PROFILE', profile);
    } catch (e) {
      console.log('error message');
    } finally {
      console.log('success message');
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
      console.log('error message');
    } finally {
      console.log('success message');
    }
  },
};

export default actions;
