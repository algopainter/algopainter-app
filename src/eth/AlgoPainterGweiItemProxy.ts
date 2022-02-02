import { AbiItem } from 'web3-utils';
import { ContractMethod } from './Web3Impl';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterGweiItem from './AlgoPainterGweiItem.json';
import { getGweiItemContractByNetworkId } from './Config';
import { INewMintGwei } from 'src/models/INewPaintingGwei';
import AlgoPainterTokenProxy from './AlgoPainterTokenProxy';
// import { PromiEvent } from 'web3-core';
// import { Contract } from 'web3-eth-contract';

export default class AlgoPainterGweiItemProxy {
  declare smartContract: {
    methods: {
      getCurrentAmount(
        algoPainterId: number,
        supply: number,
      ): ContractMethod;
      totalSupply(): ContractMethod;
      getAmountToBurn(): ContractMethod;
      hashData(
        inspiration: number,
        text: string,
        useRandom: boolean,
        probability: number,
      ): ContractMethod;
      getTokenByHash(
        hash: string,
      ): ContractMethod;
      mint(
        inspiration: number,
        text: string,
        useRandom: boolean,
        probability: number,
        place: number,
        expectedAmount: string,
        tokenURI: string,
      ): ContractMethod;
    };
  };

  contractAddress!: string;
  algop: AlgoPainterTokenProxy;

  constructor(networkInfo: NetworkInfo) {
    this.contractAddress = getGweiItemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterGweiItem as AbiItem[],
      this.contractAddress,
    );

    this.algop = new AlgoPainterTokenProxy(networkInfo);
  }

  async getCurrentAmount(supply: number): Promise<number> {
    return await this.smartContract.methods.getCurrentAmount(0, supply).call<number>();
  }

  async totalSupply(): Promise<number> {
    return await this.smartContract.methods.totalSupply().call<number>();
  }

  async getAmountToBurn(): Promise<number> {
    return Number(window.web3.utils.fromWei(await this.smartContract.methods.getAmountToBurn().call<string>(), 'ether'));
  }

  async hashData(
    inspiration: number,
    text: string,
    useRandom: boolean,
    probability: number,
  ): Promise<string> {
    return await this.smartContract.methods.hashData(
      inspiration,
      text,
      useRandom,
      probability,
    ).call<string>();
  }

  async getTokenByHash(
    hash: string,
  ): Promise<string> {
    return await this.smartContract.methods.getTokenByHash(
      hash,
    ).call<string>();
  }

  etherToWei(etherAmount: number) {
    return window.web3.utils.toWei(etherAmount.toString());
  }

  fromWei(amount: string) {
    return window.web3.utils.fromWei(amount);
  }

  async checkIfAvailable(inspiration: number, text: string, useRandom: boolean, probability: number) {
    const hash = await this.smartContract.methods
      .hashData(inspiration, text, useRandom, probability)
      .call<string>();

    const tokenId = await this.smartContract.methods.getTokenByHash(hash).call<string>();

    return tokenId.toString() === '0';
  }

  async checkAllowance(amount: string, from: string) {
    const allowance = await this.algop.allowance(
      from,
      this.contractAddress,
      parseFloat(amount)
    );

    if (!allowance) {
      return new Promise((resolve, reject) => {
        this.algop.approve(this.contractAddress, amount, from)
          .on('error', reject)
          .on('transactionHash', resolve)
          .catch(reject);
      });
    }

    return new Promise((resolve) => {
      resolve(true);
    });
  }

  async mint(
    newMint: INewMintGwei,
    from: string
  ) {
    if (
      !(await this.checkIfAvailable(
        newMint.inspiration,
        newMint.text,
        newMint.useRandom,
        newMint.probability
      ))
    ) {
      throw Object.assign(
        new Error('PAINTING_ALREADY_REGISTERED'),
        { code: 'PAINTING_ALREADY_REGISTERED' }
      );
    };

    return this.smartContract.methods.mint(
      newMint.inspiration,
      newMint.text,
      newMint.useRandom,
      newMint.probability,
      newMint.place,
      newMint.amount,
      newMint.tokenURI)
      .send({ from });
  }

  async mintCall(
    newMint: INewMintGwei,
  ): Promise<string> {
    const resp = await this.smartContract.methods.mint(
      newMint.inspiration,
      newMint.text,
      newMint.useRandom,
      newMint.probability,
      newMint.place,
      newMint.amount,
      newMint.tokenURI,
    ).call<string>()

    return resp;
  }
}
