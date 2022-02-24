/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { NetworkInfo } from 'src/store/user/types';
import { ContractMethod } from './Web3Impl';
import { AbiItem, toWei, fromWei, padLeft, asciiToHex } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import AlgoPainterArtistCollectionABI from './AlgoPainterArtistCollection.json';
import AlgoPainterArtistCollectionItemABI from './AlgoPainterArtistCollectionItem.json';
import { getArtistCollectionAddress, getArtistCollectionItemAddress } from './Config';

export enum PriceType {
  Fixed = 0,
  Variable = 1
}

/*
#PRICE
[
  from: 1,
  to: 100,
  amount: 1000,
],
[
  from: 101,
  to: 200,
  amount: 2000,
]
solidity => [ 1, 100, 1000, 101, 200, 2000 ]
*/

export default class AlgoPainterArtistCollection {
  declare instance: {
    methods: {
      collectionPrice(): ContractMethod;
      getAllowedTokens(): ContractMethod;
      getCountCollections(): ContractMethod;
      createCollection(
        walletAddress: string,
        timeRange: string[], // [ StartDT, EndDT ] - Unix Epoch timestamp
        name: string, // Max 32 chars
        creatorPercentage: string, // 0 to 3000
        startingPrice: string, // NFT sell price
        tokenPrice: string, // token address BUSD ALGOP
        priceType: PriceType,
        paramsCount: string, // 7
        prices: string[], // [ 1, 100, 1000, 101, 200, 2000 ]
        nfts: string // 1000
      ): ContractSendMethod;
    };
  };

  declare instanceItem: {
    methods: {
      getCollectionTokens(collectionId: string): ContractMethod;
      getRemainingTokens(collectionId: string): ContractMethod;
      getMintValue(collectionId: string): ContractMethod;
      mint(
        name: string, // NFT name
        collectionId: string,
        params: string[], // [ keccak256(param1), keccak256(param2), keccak256(param3), keccak256([...]) ]
        tokenURI: string, // IPFS
        expectedValue: string // expected value if wrong will revert
      ): ContractMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    this.instance = new window.web3.eth.Contract(
      AlgoPainterArtistCollectionABI as AbiItem[],
      getArtistCollectionAddress(networkInfo.id),
    );

    this.instanceItem = new window.web3.eth.Contract(
      AlgoPainterArtistCollectionItemABI as AbiItem[],
      getArtistCollectionItemAddress(networkInfo.id),
    );
  }

  async getCollectionPrice() : Promise<string> {
    const result = await this.instance.methods.collectionPrice().call<any>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return fromWei(result.toString());
  }

  async getCollectionAllowedTokens(): Promise<string[]> {
    return this.instance.methods.getAllowedTokens().call<string[]>();
  }

  async getCountCollections(): Promise<string> {
    const result = await this.instance.methods.getAllowedTokens().call<any>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return result.toString();
  }

  createCollection(
    walletAddress: string,
    timeRange: number[],
    name: string,
    creatorPercentage: number,
    startingPrice: number, // 1000
    tokenPrice: string,
    priceType: PriceType,
    paramsCount: number,
    prices: string[],
    nfts: number,
    collectionPrice: string,
    from: string,
  ) {
    return this.instance.methods.createCollection(
      walletAddress,
      timeRange.map(a => a.toString()),
      padLeft(asciiToHex(name), 64),
      creatorPercentage.toString(),
      toWei(startingPrice.toString(), 'ether'),
      tokenPrice,
      priceType,
      paramsCount.toString(),
      prices,
      nfts.toString(),
    ).send({ from, value: collectionPrice });
  }

  async createCollectionCall(
    walletAddress: string,
    timeRange: number[],
    name: string,
    creatorPercentage: number,
    startingPrice: number,
    tokenPrice: string,
    priceType: PriceType,
    paramsCount: number,
    prices: string[],
    nfts: number,
    from: string
  ) {
    return this.instance.methods.createCollection(
      walletAddress,
      timeRange.map(a => a.toString()),
      padLeft(asciiToHex(name), 64),
      creatorPercentage.toString(),
      toWei(startingPrice.toString(), 'ether'),
      tokenPrice,
      priceType,
      paramsCount.toString(),
      prices,
      nfts.toString()
    ).call({ from });
  }

  async getCollectionTokens(collectionId: string): Promise<string[]> {
    console.log('getCollectionTokens', collectionId);
    const result = await this.instanceItem.methods.getCollectionTokens(collectionId).call<any[]>();
    console.log('result', result);
    return result.map(a => a.toString());
  }

  async getRemainingTokens(collectionId: string): Promise<string> {
    const result = await this.instanceItem.methods.getRemainingTokens(collectionId).call<any>();
    return result.toString();
  }

  async getMintValue(collectionId: string): Promise<string> {
    const result = await this.instanceItem.methods.getMintValue(collectionId).call<any>();
    return fromWei(result.toString()); //1000000000000 => 100
  }

  async mint(
    name: string,
    collectionId: string,
    params: string[],
    tokenURI: string,
    expectedValue: string,
    from: string,
  ) {
    return this.instanceItem.methods.mint(
      name,
      collectionId,
      params,
      tokenURI,
      expectedValue
    ).send({ from });
  }

  async mintCall(
    name: string,
    collectionId: string,
    params: string[],
    tokenURI: string,
    expectedValue: string,
    from: string,
  ) {
    return this.instanceItem.methods.mint(
      name,
      collectionId,
      params,
      tokenURI,
      expectedValue
    ).call({ from });
  }
}

export enum ArtistCollectionStatus {
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  ArtistCollectionAwaitingInput,
  ArtistCollectionAwaitingConfirmation,
  ArtistCollectionError,
  ArtistCollectionCreated,
}
