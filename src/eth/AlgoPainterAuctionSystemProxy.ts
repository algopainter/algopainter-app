import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import AlgoPainterAuctionSystem from './AlgoPainterAuctionSystem.json';

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
        minimumAmount: number,
        endTime: number,
        tokenPriceAddress: string,
        bidBackFee: number,
      ): ContractSendMethod;
    };
  };

  constructor(contractAddress: string) {
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

  async createAuction(
    tokenType: number,
    contractAddress: string,
    tokenId: number,
    minimumAmount: number,
    endTime: number,
    tokenPriceAddress: string,
    bidBackFee: number,
    from: string,
  ): Promise<unknown> {
    const response: unknown = await this.smartContract.methods.createAuction(
      tokenType,
      contractAddress,
      tokenId,
      minimumAmount,
      endTime,
      tokenPriceAddress,
      bidBackFee,
    ).send({ from });

    return response;
  }
}
