import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterBidBackPirs from './AlgoPainterBidBackPirs.json';
import { getBidBackPirsContractByNetworkId } from './Config';

export default class AlgoPainterBidBackPirsProxy {
  declare smartContract: {
    methods: {
      getBidbackPercentage(
        auctionId: number,
      ): ContractSendMethod;
      getInvestorPirsPercentage(
        contractAddress: string,
        tokenId: number
      ): ContractSendMethod;
      getCreatorPirsPercentage(
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

  async getBidbackPercentage(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getBidbackPercentage(
      auctionId,
    ).call();

    return response as number;
  }

  async getInvestorPirsPercentage(
    contractAddress: string,
    tokenId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getInvestorPirsPercentage(
      contractAddress,
      tokenId,
    ).call();

    return response as number;
  }

  async getCreatorPirsPercentage(
    contractAddress: string,
  ) {
    const response: unknown = await this.smartContract.methods.getCreatorPirsPercentage(
      contractAddress,
    ).call();

    return response as number;
  }
}
