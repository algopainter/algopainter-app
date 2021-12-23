import { AbiItem } from 'web3-utils';
import { ContractMethod } from './Web3Impl';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterGwei from './AlgoPainterGwei.json';
import { getGweiItemContractByNetworkId } from './Config';
// import { PromiEvent } from 'web3-core';
// import { Contract } from 'web3-eth-contract';

export default class AlgoPainterGweiProxy {
  declare smartContract: {
    methods: {
      getCurrentAmount(
        algoPainterId: number,
        supply: number,
      ): ContractMethod;
      totalSupply(): ContractMethod;
      getAmountToBurn(): ContractMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getGweiItemContractByNetworkId(networkInfo.id);
    
    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterGwei as AbiItem[],
      contractAddress,
    );
  }

  async getCurrentAmount(supply: number) : Promise<number> {
    return await this.smartContract.methods.getCurrentAmount(0, supply).call<number>();
  }

  async totalSupply() : Promise<number> {
    return await this.smartContract.methods.totalSupply().call<number>();
  }

  async getAmountToBurn() : Promise<number> {
    return await this.smartContract.methods.getAmountToBurn().call<number>();
  }
}
