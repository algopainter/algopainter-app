import { AbiItem } from 'web3-utils';
import { ContractMethod } from './Web3Impl';
import { NetworkInfo } from 'src/store/user/types';
import AlgoPainterPersonalItem from './AlgoPainterPersonalItem.json';
import { getPersonalItemContractByNetworkId } from './Config';
import { PromiEvent } from 'web3-core';
import { Contract } from 'web3-eth-contract';

export default class AlgoPainterPersonalItemProxy {
  declare smartContract: {
    methods: {
      mint(
        name: string,
        imageHash: string,
        creatorPercentage: number,
        tokenURI: string,
      ): ContractMethod;
      mintCost(): ContractMethod;
      mintCostToken(): ContractMethod;
      mintToken(): ContractMethod;
      getTokenHashForAuction(
        tokenId: number,
      ): ContractMethod;
    };
  };

  constructor(networkInfo: NetworkInfo) {
    const contractAddress = getPersonalItemContractByNetworkId(networkInfo.id);

    this.smartContract = new window.web3.eth.Contract(
        AlgoPainterPersonalItem as AbiItem[],
        contractAddress,
    );
  }

  mint(name: string, imageHash: string, creatorPercentage: number, tokenURI: string, account: string, cost: string) : PromiEvent<Contract> {
    return this.smartContract.methods.mint(
      name,
      imageHash,
      creatorPercentage,
      tokenURI,
    ).send({ value: cost, from: account });
  }

  async getMintPrice() : Promise<{ cost: string, costToken: string, token: string }> {
    const cost = await this.smartContract.methods.mintCost().call<string>();
    const costToken = await this.smartContract.methods.mintCostToken().call<string>();
    const token = await this.smartContract.methods.mintCostToken().call<string>();
    return {
      cost,
      costToken,
      token
    };
  }

  async getTokenHashForAuction(tokenId: number) {
    return await this.smartContract.methods.getTokenHashForAuction(
      tokenId
    ).call()
  }
}

export enum PainterPersonalItemStatus {
  None,
  CheckingAllowance,
  IncreateAllowanceAwaitingInput,
  IncreateAllowanceAwaitingConfirmation,
  IncreateAllowanceError,
  IncreateAllowanceCompleted,
  PersonalItemAwaitingInput,
  PersonalItemAwaitingConfirmation,
  PersonalItemError,
  PersonalItemCreated,
}
