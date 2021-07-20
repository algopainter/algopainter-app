import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';
import AlgoPainterToken from './AlgoPainterToken.json';
import { NetworkInfo } from 'src/store/user/types';
import getAlgoPainterContractByNetworkId from './Config';

declare global {
  interface Window {
    web3: Web3;
  }
}

export default class AlgoPainterTokenProxy {
  declare algoPainter: {
    methods: {
      balanceOf(address: string): ContractSendMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getAlgoPainterContractByNetworkId(networkInfo.id);
    this.algoPainter = new window.web3.eth.Contract(
      AlgoPainterToken as AbiItem[],
      contractAddress,
    );
  }

  async balanceOf(address: string) {
    return this.algoPainter.methods.balanceOf(address).call();
  }
}
