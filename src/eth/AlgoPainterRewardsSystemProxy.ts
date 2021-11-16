import { AbiItem } from 'web3-utils';
import { ContractSendMethod } from 'web3-eth-contract';

import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterRewardsSystem from './AlgoPainterRewardsSystem.json';
import { getRewardsSystemContractByNetworkId } from './Config';
export default class AlgoPainterRewardsSystemProxy {
  declare smartContract: {
    methods: {
      getTotalBidbackStakes(
        auctionId: number,
      ): ContractSendMethod;
      getTotalPirsStakes(
        auctionId: number,
      ): ContractSendMethod;
      getBidbackUsers(
        auctionId: number,
      ): ContractSendMethod;
      getBidbackPercentages(
        auctionId: number,
      ): ContractSendMethod;
      stakeBidback(
        auctionId: number,
        amount: number
      ): ContractSendMethod;
      unstakeBidback(
        auctionId: number,
        amount: number
      ): ContractSendMethod;
      stakePirs(
        auctionId: number,
        amount: number
      ): ContractSendMethod;
      unstakePirs(
        auctionId: number,
        amount: number
      ): ContractSendMethod;
      withdrawBidback(
        auctionId: number,
        amount: number
      ): ContractSendMethod;
      withdrawPirs(
        auctionId: number,
        amount: number
      ): ContractSendMethod;
      claimBidback(
        auctionId: number
      ): ContractSendMethod;
      claimPirs(
        auctionId: number
      ): ContractSendMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getRewardsSystemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
      AlgoPainterRewardsSystem as AbiItem[],
      contractAddress,
    );
  }

  async getTotalBidBackStakes(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getTotalBidbackStakes(
      auctionId,
    ).call();

    return response as number;
  }

  async getTotalPirsStakes(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getTotalPirsStakes(
      auctionId,
    ).call();

    return response as number;
  }

  async getBidbackUsers(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getBidbackUsers(
      auctionId,
    ).call();

    return response as number;
  }

  async getBidbackPercentages(
    auctionId: number,
  ) {
    const response: unknown = await this.smartContract.methods.getBidbackPercentages(
      auctionId,
    ).call();

    return response as [];
  }

  stakeBidback(
    auctionId: number,
    amount: number,
    from: string,
  ) {
    return this.smartContract.methods.stakeBidback(
      auctionId,
      amount,
    ).send({ from });
  }

  unstakeBidback(
    auctionId: number,
    amount: number,
    from: string,
  ) {
    return this.smartContract.methods.unstakeBidback(
      auctionId,
      amount,
    ).send({ from });
  }

  stakePirs(
    auctionId: number,
    amount: number,
    from: string,
  ) {
    return this.smartContract.methods.stakePirs(
      auctionId,
      amount,
    ).send({ from });
  }

  unstakePirs(
    auctionId: number,
    amount: number,
    from: string,
  ) {
    return this.smartContract.methods.unstakePirs(
      auctionId,
      amount,
    ).send({ from });
  }

  withdrawBidback(
    auctionId: number,
    amount: number,
    from: string,
  ) {
    return this.smartContract.methods.withdrawBidback(
      auctionId,
      amount,
    ).send({ from });
  }

  withdrawPirs(
    auctionId: number,
    amount: number,
    from: string,
  ) {
    return this.smartContract.methods.withdrawPirs(
      auctionId,
      amount,
    ).send({ from });
  }

  claimBidBack(
    auctionId: number,
    from: string,
  ) {
    return this.smartContract.methods.claimBidback(
      auctionId,
    ).send({ from });
  }

  claimPirs(
    auctionId: number,
    from: string,
  ) {
    return this.smartContract.methods.claimPirs(
      auctionId,
    ).send({ from });
  }
}
