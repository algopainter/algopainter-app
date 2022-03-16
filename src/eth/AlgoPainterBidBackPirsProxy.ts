import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterBidBackPirs from './AlgoPainterBidBackPirs.json';
import { getBidBackPirsContractByNetworkId } from './Config';
import { ContractMethod } from './Web3Impl';

export default class AlgoPainterBidBackPirsProxy {
  declare smartContract: {
    methods: {
      getBidbackRate(
        auctionId: number
      ): ContractSendMethod;
      getPIRSRate(
        auctionId: number
      ): ContractSendMethod;
      hasPIRSRateSetPerImage(
        tokenAddress: string,
        imageId: number
      ): ContractSendMethod;
      getPIRSRatePerImage(
        tokenAddress: string,
        imageId: number
      ): ContractMethod;
      getCreatorRate(
        tokenAddress: string,
        imageId: string
      ): ContractMethod;
      getCreatorRoyaltiesRate(
        auctionId: number
      ): ContractSendMethod;
      getCreatorRoyaltiesByTokenAddress(
        tokenAddress: string,
      ): ContractSendMethod;
      setBidbackRate(
        auctionId: number,
        bidBackRate: number
      ): ContractSendMethod;
      setPIRSRate(
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
      contractAddress,
    );
  }

  async getBidBackRate(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getBidbackRate(
      auctionId,
    ).call();

    return response as number;
  }

  async getCreatorRoyaltiesByTokenAddress(
    tokenAddress: string,
  ) {
    const response = (await this.smartContract.methods.getCreatorRoyaltiesByTokenAddress(
      tokenAddress,
    ).call()) as number;

    return response;
  }

  async getPIRSRate(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getPIRSRate(
      auctionId,
    ).call();

    return response as number;
  }

  async getPIRSRatePerImage(
    tokenAddress: string,
    imageId: number
  ) {
    return await this.smartContract.methods.getPIRSRatePerImage(
      tokenAddress,
      imageId
    ).call<number>();
  }

  async hasPIRSRateSetPerImage(
    tokenAddress: string,
    imageId: number,
  ) {
    const response: unknown = await this.smartContract.methods.hasPIRSRateSetPerImage(
      tokenAddress,
      imageId,
    ).call();
    return response as boolean;
  }

  async getCreatorRoyaltiesRate(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getCreatorRoyaltiesRate(
      auctionId,
    ).call();

    return response as number;
  }

  async getCreatorRate(
    address: string,
    token: string
  ) : Promise<number> {
    return await this.smartContract.methods.getCreatorRate(
      address,
      token
    ).call<number>();
  }

  setBidBackRate(
    auctionId: number,
    bidbackRate: number,
    from: string,
  ) {
    return this.smartContract.methods.setBidbackRate(
      auctionId,
      bidbackRate,
    ).send({ from });
  }

  setPIRSRate(
    tokenAddress: string,
    tokenId: number,
    investorPirsRate: number,
    from: string,
  ) {
    return this.smartContract.methods.setPIRSRate(
      tokenAddress,
      tokenId,
      investorPirsRate,
    ).send({ from });
  }
}
