import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import AlgoPainterItem from './AlgoPainterItem.json';

export default class AlgoPainterItemProxy {
  declare algoPainter: {
    methods: {
      ownerOf(index: number): ContractSendMethod;
      isApprovedForAll(owner: string, operator: string): ContractSendMethod;
      setApprovalForAll(address: string, approved: boolean): ContractSendMethod;
    };
  };

  constructor(contractAddress: string) {
    this.algoPainter = new window.web3.eth.Contract(
      AlgoPainterItem as AbiItem[],
      contractAddress,
    );
  }

  
  async ownerOf(tokenID: number): Promise<string> {
    const response: unknown = await this.algoPainter.methods
      .ownerOf(tokenID).call();

    return response as string;
  }

  async isApprovedForAll(owner: string, operator: string): Promise<boolean> {
    const response: unknown = await this.algoPainter.methods
      .isApprovedForAll(owner, operator).call();

    return response as boolean;
  }

  setApprovalForAll(
    address: string,
    approved: boolean,
    from: string,
  ) {
    return this.algoPainter.methods
      .setApprovalForAll(address, approved)
      .send({ from });
  }
}
