import { AbiItem } from 'web3-utils';
import { ContractMethod } from './Web3Impl';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterExpressions from './AlgoPainterExpressionsItem.json';
import { getExpressionItemContractByNetworkId } from './Config';
import { PromiEvent } from 'web3-core';
import { Contract } from 'web3-eth-contract';

export default class AlgoPainterExpressionsItemProxy {
  declare smartContract: {
    methods: {
      getCurrentAmount(
        algoPainterId: number,
        supply: number,
      ): ContractMethod;
      totalSupply(): ContractMethod;
      getServiceFee(): ContractMethod;
      mint(
        parameters: number[],
        expectedAmount: string,
        tokenURI: string,
      ): ContractMethod;
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

  async getServiceFee() : Promise<number> {
    return await this.smartContract.methods.getServiceFee().call<number>();
  }

  async callMint(
    parameters: number[],
    expectedAmount: string,
    tokenURI: string,
    from: string,
  ) : Promise<Contract> {
    return await this.smartContract.methods.mint(
      parameters,
      expectedAmount,
      tokenURI,
    ).call({ from: from, value: expectedAmount } as unknown as { from: string, value: number });
  }

  mint(
    parameters: number[],
    expectedAmount: string,
    tokenURI: string,
    from: string,
  ) : PromiEvent<Contract> {
    return this.smartContract.methods.mint(
      parameters,
      expectedAmount,
      tokenURI,
    ).send({ from: from, value: expectedAmount });
  }
}
