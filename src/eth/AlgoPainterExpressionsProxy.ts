import { AbiItem } from 'web3-utils';
import { ContractMethod } from './Web3Impl';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterExpressions from './AlgoPainterExpressions.json';
import { getExpressionItemContractByNetworkId } from './Config';
// import { PromiEvent } from 'web3-core';
// import { Contract } from 'web3-eth-contract';

export default class AlgoPainterExpressionsProxy {
  declare smartContract: {
    methods: {
      getCurrentAmount(
        algoPainterId: number,
        supply: number,
      ): ContractMethod;
      totalSupply(): ContractMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getExpressionItemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterExpressions as AbiItem[],
      contractAddress,
    );
  }

  async getCurrentAmount(supply: number) : Promise<number> {
    return await this.smartContract.methods.getCurrentAmount(1, supply).call<number>();
  }

  async totalSupply() : Promise<number> {
    return await this.smartContract.methods.totalSupply().call<number>();
  }
}
