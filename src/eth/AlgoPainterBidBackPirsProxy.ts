import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterBidBackPirs from './AlgoPainterBidBackPirs.json';
import { getBidBackPirsContractByNetworkId } from './Config';

export default class AlgoPainterBidBackPirsProxy {
  declare smartContract: {
    methods: {
      getBidbackRate(
        auctionId: number,
      ): ContractSendMethod;
      getInvestorPirsRate(
        auctionId: number,
      ): ContractSendMethod;
      getCreatorPirsRate(
        contractAddress: string,
      ): ContractSendMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getBidBackPirsContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterBidBackPirs as AbiItem[],
      contractAddress,
    );
  }

  async getBidbackRate(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getBidbackRate(
      auctionId,
    ).call();

    return response as number;
  }

  async getInvestorPirsRate(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getInvestorPirsRate(
      auctionId,
    ).call();

    return response as number;
  }

  async getCreatorPirsRate(
    contractAddress: string,
  ) {
    const response: unknown = await this.smartContract.methods.getCreatorPirsRate(
      contractAddress,
    ).call();

    return response as number;
  }
}
