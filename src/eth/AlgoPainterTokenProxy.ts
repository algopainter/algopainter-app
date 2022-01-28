import Web3 from 'web3';
import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';
import AlgoPainterToken from './AlgoPainterToken.json';
import { NetworkInfo } from 'src/store/user/types';
import getAlgoPainterContractByNetworkId from './Config';
import BigNumber from 'bignumber.js';

declare global {
  interface Window {
    web3: Web3;
  }
}

export default class AlgoPainterTokenProxy {
  declare algoPainter: {
    methods: {
      balanceOf(address: string): ContractSendMethod;
      ownerOf(index: number): ContractSendMethod;
      allowance(owner: string, spender: string): ContractSendMethod;
      approve(spender: string, amount: number | string): ContractSendMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getAlgoPainterContractByNetworkId(networkInfo.id);
    this.algoPainter = new window.web3.eth.Contract(
      AlgoPainterToken as AbiItem[],
      contractAddress,
    );
  }

  async balanceOf(address: string) {
    return this.algoPainter.methods.balanceOf(address).call();
  }

  async ownerOf(index: number): Promise<boolean> {
    const response: unknown = await this.algoPainter.methods.ownerOf(index).call();

    return response as boolean;
  }

  async allowance(owner: string, spender: string): Promise<boolean> {
    const response: unknown = await this.algoPainter.methods.allowance(
      owner,
      spender,
    ).call();

    const bn = new BigNumber(Number(response));

    return bn.gt(0);
  }

  approve(
    spender: string,
    amount: number | string,
    from: string,
  ) {
    return this.algoPainter.methods.approve(
      spender,
      amount,
    ).send({ from });
  }
}
