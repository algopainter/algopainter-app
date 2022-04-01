import Web3 from 'web3';
import { IWeb3Provider } from 'src/store/user/types';

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

export default class Web3Helper {
  getHashMessage(message: string) {
    return window.web3.eth.accounts.hashMessage(message);
  }

  async signMessageWithAddress(message: string, address: string) {
    try {
      return await window.web3.eth.sign(message, address);
    } catch (error) {
      return error as Error;
    }
  }

  async hashMessageAndAskForSignature(message: Record<string, unknown>, address: string) {
    const requestHash = this.getHashMessage(
      JSON.stringify(message),
    );

    return await this.signMessageWithAddress(
      requestHash,
      address,
    );
  }

  fromWei(value: string) : string {
    return window.web3.utils.fromWei(value);
  }
}
