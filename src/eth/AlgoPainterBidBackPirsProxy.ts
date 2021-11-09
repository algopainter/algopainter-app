import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterBidBackPirs from './AlgoPainterBidBackPirs.json';
import { getBidBackPirsContractByNetworkId } from './Config';

export default class AlgoPainterBidBackPirsProxy {
  declare smartContract: {
    methods: {
      getBidbackRate(auctionId: number): ContractSendMethod;
      getInvestorPirsRate(auctionId: number): ContractSendMethod;
      getCreatorPirsRate(auctionId: number): ContractSendMethod;
      setBidbackRate(
        auctionId: number,
        bidBackRate: number
      ): ContractSendMethod;
      setInvestorPirsRate(
        tokenAddress: string,
        tokenId: number,
        investorPirsRate: number
      ): ContractSendMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getBidBackPirsContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterBidBackPirs as AbiItem[],
      contractAddress
    );
  }

  async getBidBackRate(auctionId: number) {
    const response: unknown = await this.smartContract.methods
      .getBidbackRate(auctionId)
      .call();

    return response as number;
  }

  async getInvestorPirsRate(auctionId: number) {
    const response: unknown = await this.smartContract.methods
      .getInvestorPirsRate(auctionId)
      .call();

    return response as number;
  }

  async getCreatorPirsRate(auctionId: number) {
    const response: unknown = await this.smartContract.methods
      .getCreatorPirsRate(auctionId)
      .call();

    return response as number;
  }

  setBidBackRate(auctionId: number, bidBackRate: number, from: string) {
    return this.smartContract.methods
      .setBidbackRate(auctionId, bidBackRate)
      .send({ from });
  }

  setInvestorPirsRate(
    tokenAddress: string,
    tokenId: number,
    investorPirsRate: number,
    from: string
  ) {
    return this.smartContract.methods
      .setInvestorPirsRate(tokenAddress, tokenId, investorPirsRate)
      .send({ from });
  }
}
