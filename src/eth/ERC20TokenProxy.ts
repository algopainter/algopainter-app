import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import ERC20Token from './ERC20Token.json';

export default class ERC20TokenProxy {
  declare erc20TokenContract: {
    methods: {
      balanceOf(address: string): ContractSendMethod;
      ownerOf(index: number): ContractSendMethod;
      allowance(owner: string, spender: string): ContractSendMethod;
      approve(spender: string, amount: number | string): ContractSendMethod;
    };
  };

  constructor(contractAddress: string) {
    this.erc20TokenContract = new window.web3.eth.Contract(
      ERC20Token as AbiItem[],
      contractAddress,
    );
  }

  async balanceOf(address: string) {
    return this.erc20TokenContract.methods.balanceOf(address).call();
  }

  async ownerOf(index: number): Promise<boolean> {
    const response: unknown = await this.erc20TokenContract.methods.ownerOf(index).call();

    return response as boolean;
  }

  async allowance(owner: string, spender: string): Promise<number> {
    const response: unknown = await this.erc20TokenContract.methods.allowance(
      owner,
      spender,
    ).call();

    return Number(response);
  }

  approve(
    spender: string,
    amount: number | string,
    from: string,
  ) {
    return this.erc20TokenContract.methods.approve(
      spender,
      amount,
    ).send({ from });
  }
}
