import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterAuctionSystem from './AlgoPainterAuctionSystem.json';
import { getAuctionSystemContractByNetworkId } from './Config';

export enum EndAuctionStatus {
  EndAuctionAwaitingInput,
  EndAuctionError,
  EndAuctionAwaitingConfirmation,
  AuctionEnded,
}

export enum DeletingAuctionStatus {
  DeleteAuctionAwaitingInput,
  DeleteAuctionAwaitingConfirmation,
  DeleteAuctionError,
  AuctionDeleted,
}

export enum RemoveBidStatus {
  RemoveBidAwaitingInput,
  RemoveBidAwaitingConfirmation,
  RemoveBidError,
  RemoveBid,
}

export enum TokenType {
  ERC721 = 0,
  ERC1155 = 1,
}

export default class AlgoPainterAuctionSystemProxy {
  declare smartContract: {
    methods: {
      getAllowedTokens(): ContractSendMethod;
      getBidFeeRate(): ContractSendMethod;
      createAuction(
        // tokenType: TokenType,
        contractAddress: string,
        tokenId: number,
        minimumAmount: string,
        endTime: number,
        tokenPriceAddress: string,
        bidbackRate: number,
        creatorRate: number,
        pirsRate: number
      ): ContractSendMethod;
      bid(auctionId: number, amount: string): ContractSendMethod;
      cancelAuction(auctionId: number): ContractSendMethod;
      endAuction(auctionId: number): ContractSendMethod;
      withdraw(auctionId: number): ContractSendMethod;
      getAuctionAmountInfo(
        auctionId: number,
        amount: string
      ): ContractSendMethod;
      auctionFeeRate(): ContractSendMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getAuctionSystemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterAuctionSystem as AbiItem[],
      contractAddress,
    );
  }

  async auctionFeeRate() {
    const response: unknown = await this.smartContract.methods.auctionFeeRate().call();

    return response as number;
  }

  async getAllowedTokens(): Promise<string[]> {
    const response: unknown = await this.smartContract.methods
      .getAllowedTokens().call();

    return response as string[];
  }

  async getBidFeeRate(): Promise<number> {
    const response: unknown = await this.smartContract.methods
      .getBidFeeRate().call();

    return response as number;
  }

  createAuction(
    contractAddress: string,
    tokenId: number,
    minimumAmount: string,
    endTime: number,
    tokenPriceAddress: string,
    bidbackRate: number,
    creatorRate: number,
    pirsRate: number,
    from: string,
  ) {
    return this.smartContract.methods.createAuction(
      contractAddress,
      tokenId,
      minimumAmount,
      endTime,
      tokenPriceAddress,
      bidbackRate,
      creatorRate,
      pirsRate
    ).send({ from });
  }

  async createAuctionCall(
    contractAddress: string,
    tokenId: number,
    minimumAmount: string,
    endTime: number,
    tokenPriceAddress: string,
    bidbackRate: number,
    creatorRate: number,
    pirsRate: number,
    from: string
  ) {
    const response: unknown = await this.smartContract.methods.createAuction(
      contractAddress,
      tokenId,
      minimumAmount,
      endTime,
      tokenPriceAddress,
      bidbackRate,
      creatorRate,
      pirsRate
    ).call({ from });

    return response as number;
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

  withdraw(auctionId: number, from: string) {
    return this.smartContract.methods.withdraw(
      auctionId,
    ).send({ from });
  }

  async getAuctionAmountInfo(auctionId: number, amount: string) {
    const response = (await this.smartContract.methods.getAuctionAmountInfo(
      auctionId,
      amount,
    ).call()) as Record<string, string>;

    return parseFloat(response.netAmount);
  }
}
