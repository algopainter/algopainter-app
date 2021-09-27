import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterAuctionSystem from './AlgoPainterAuctionSystem.json';
import { getAuctionSystemContractByNetworkId } from './Config';

export enum TokenType {
  ERC721 = 0,
  ERC1155 = 1,
}

export default class AlgoPainterAuctionSystemProxy {
  declare smartContract: {
    methods: {
      getAllowedTokens(): ContractSendMethod;
      createAuction(
        tokenType: TokenType,
        contractAddress: string,
        tokenId: number,
        minimumAmount: string,
        endTime: number,
        tokenPriceAddress: string,
        bidBackFee: number,
      ): ContractSendMethod;
      bid(auctionId: number, amount: string): ContractSendMethod;
      cancelAuction(auctionId: number): ContractSendMethod;
      endAuction(auctionId: number): ContractSendMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getAuctionSystemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterAuctionSystem as AbiItem[],
      contractAddress,
    );
  }

  async getAllowedTokens(): Promise<string[]> {
    const response: unknown = await this.smartContract.methods
      .getAllowedTokens().call();

    return response as string[];
  }

  createAuction(
    tokenType: number,
    contractAddress: string,
    tokenId: number,
    minimumAmount: string,
    endTime: number,
    tokenPriceAddress: string,
    bidBackFee: number,
    from: string,
  ) {
    return this.smartContract.methods.createAuction(
      tokenType,
      contractAddress,
      tokenId,
      minimumAmount,
      endTime,
      tokenPriceAddress,
      bidBackFee,
    ).send({ from });
  }

  bid(auctionId: number, amount: string, from: string) {
    return this.smartContract.methods.bid(
      auctionId,
      amount,
    ).send({ from });
  }

  cancelAuction(auctionId: number, from: string) {
    return this.smartContract.methods.cancelAuction(
      auctionId,
    ).send({ from });
  }

  endAuction(auctionId: number, from: string) {
    return this.smartContract.methods.endAuction(
      auctionId,
    ).send({ from });
  }
}
