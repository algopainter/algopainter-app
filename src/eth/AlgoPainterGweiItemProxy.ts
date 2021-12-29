import { AbiItem } from 'web3-utils';
import { ContractMethod } from './Web3Impl';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterGweiItem from './AlgoPainterGweiItem.json';
import { getGweiItemContractByNetworkId } from './Config';
import { INewMintGwei } from 'src/models/INewPaintingGwei';
import { TransactionConfig } from 'web3-eth';
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
        place : number,
        expectedAmount: number | string,
        tokenURI: string,
      ): ContractMethod;
    };
  };

  contractAddress!: string;

  constructor(networkInfo: NetworkInfo) {
    this.contractAddress = getGweiItemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterGweiItem as AbiItem[],
      this.contractAddress,
    );
  }

  async getCurrentAmount(supply: number) : Promise<number> {
    return await this.smartContract.methods.getCurrentAmount(0, supply).call<number>();
  }

  async totalSupply() : Promise<number> {
    return await this.smartContract.methods.totalSupply().call<number>();
  }

  async getAmountToBurn() : Promise<number> {
    return Number(window.web3.utils.fromWei(await this.smartContract.methods.getAmountToBurn().call<string>(), 'ether'));
  }

  async hashData(
    inspiration: number,
    text: string,
    useRandom: boolean,
    probability: number,
  ) : Promise<string> {
    return await this.smartContract.methods.hashData(
      inspiration,
      text,
      useRandom,
      probability,
    ).call<string>();
  }

  async getTokenByHash(
    hash: string,
  ) : Promise<string> {
    return await this.smartContract.methods.getTokenByHash(
      hash,
    ).call<string>();
  }

  etherToWei(etherAmount: number) {
    return window.web3.utils.toWei(etherAmount.toString());
  }

  async checkIfAvailable(inspiration: number, text: string, useRandom: boolean, probability: number) {
    const hash = await this.smartContract.methods
      .hashData(inspiration, text, useRandom, probability)
      .call<string>();

    const tokenId = await this.smartContract.methods.getTokenByHash(hash).call<string>();

    return tokenId.toString() === '0';
  }

  async mint(
    newMint: INewMintGwei,
    from: string,
    cb: any,
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
    }

    const nonce = window.web3.utils.toHex(
      await window.web3.eth.getTransactionCount(from)
    );
    const to = this.contractAddress;

    const amount = this.etherToWei(newMint.amount);

    const txObject: TransactionConfig = {
      from,
      nonce: Number(nonce),
      value: 0,
      to,
      data: this.smartContract.methods
        .mint(
          newMint.inspiration,
          newMint.text,
          newMint.useRandom,
          newMint.probability,
          newMint.place,
          amount,
          newMint.tokenURI,
        )
        .encodeABI()
    };

    return new Promise((resolve, reject) => {
      window.web3.eth
        .sendTransaction(txObject)
        .on('transactionHash', resolve)
        .on('confirmation', function(confirmationNumber, receipt) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          cb(null, {
            receipt,
            confirmationNumber
          });
        })
        .on('error', reject)
        .catch(console.error);
    });
  }
}
